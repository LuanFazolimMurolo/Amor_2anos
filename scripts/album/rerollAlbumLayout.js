import path from "path";
import readline from "readline/promises";
import { stdin as input, stdout as output } from "process";

import { supabaseAdmin } from "../../server/config/supabaseAdmin.js";

import { albumLayoutTemplates } from "./albumLayoutTemplates.js";

import {
  listPageFolders,
  readJsonFile,
  fileExists,
  parseImageFileName,
  buildCardKey,
  chooseTemplate,
  generateFinalPosition,
} from "./albumSeedUtils.js";

// ======================================================
// LENDO TODAS AS PÁGINAS DO album_seed
//
// -Procura todas as pastas dentro de album_seed
// -Lê o page.json de cada pasta
// -Retorna uma lista de páginas válidas
// ======================================================
async function loadSeedPages() {
  const pageFolders = await listPageFolders();

  const pages = [];

  for (const folder of pageFolders) {
    const pageJsonPath = path.join(folder.folderPath, "page.json");

    const existsPageJson = await fileExists(pageJsonPath);

    if (!existsPageJson) {
      continue;
    }

    const pageJson = await readJsonFile(pageJsonPath);

    if (!pageJson.page || !Array.isArray(pageJson.cards)) {
      console.log(`Ignorando page.json inválido: ${pageJsonPath}`);
      continue;
    }

    pages.push({
      folderName: folder.folderName,
      folderPath: folder.folderPath,
      pageJsonPath,
      page: pageJson.page,
      cards: pageJson.cards,
    });
  }

  pages.sort((pageA, pageB) => {
    return (pageA.page.order_index ?? 999) - (pageB.page.order_index ?? 999);
  });

  return pages;
}

// ======================================================
// MOSTRANDO MENU DE PÁGINAS
//
// -Mostra todas as páginas encontradas
// -Usuário pode digitar:
//  all = reorganizar todas
//  número = reorganizar uma página
//  page_id = reorganizar uma página pelo id
// ======================================================
async function askPagesToReroll(pages) {
  const rl = readline.createInterface({
    input,
    output,
  });

  console.log("");
  console.log("======================================================");
  console.log("PÁGINAS ENCONTRADAS");
  console.log("======================================================");

  pages.forEach((item, index) => {
    console.log(
      `${index + 1}. ${item.page.page_id} | ${item.page.month_name} | order ${item.page.order_index}`
    );
  });

  console.log("");
  console.log("Digite:");
  console.log("- número da página para reorganizar só ela");
  console.log("- all para reorganizar todas");
  console.log("- page_id para reorganizar pelo id");
  console.log("");

  const answer = await rl.question("Qual página deseja reorganizar? ");

  rl.close();

  const normalizedAnswer = answer.trim();

  if (
    normalizedAnswer.toLowerCase() === "all" ||
    normalizedAnswer.toLowerCase() === "todos" ||
    normalizedAnswer.toLowerCase() === "todas"
  ) {
    return pages;
  }

  const selectedNumber = Number(normalizedAnswer);

  if (!Number.isNaN(selectedNumber)) {
    const selectedPage = pages[selectedNumber - 1];

    if (!selectedPage) {
      throw new Error("Número de página inválido.");
    }

    return [selectedPage];
  }

  const selectedByPageId = pages.find((item) => {
    return item.page.page_id === normalizedAnswer;
  });

  if (!selectedByPageId) {
    throw new Error(`Nenhuma página encontrada com: ${normalizedAnswer}`);
  }

  return [selectedByPageId];
}

// ======================================================
// GERANDO NOVAS POSIÇÕES PARA UMA PÁGINA
//
// -Lê os cards do page.json
// -Usa o layout da página
// -Aplica jitter
// -Atualiza só x, y e rotate no banco
//
// Importante:
// -Não mexe em caption
// -Não mexe em image_path
// -Não sobe imagem
// -Não cria carta nova
// ======================================================
async function rerollPageLayout(seedPage) {
  const page = seedPage.page;
  const cards = seedPage.cards;

  if (cards.length === 0) {
    console.log(`Página sem cards: ${page.page_id}`);
    return;
  }

  const safeArea = page.safe_area || {
    min_x: 12,
    max_x: 88,
    min_y: 18,
    max_y: 82,
  };

  const jitter = page.jitter || {
    x: 6,
    y: 5,
    rotate: 8,
  };

  const layout = page.layout || "month";

  const baseTemplate = chooseTemplate({
    templates: albumLayoutTemplates,
    layout,
    cardsCount: cards.length,
  });

  const usedPositions = [];

  console.log("");
  console.log("======================================================");
  console.log(`REORGANIZANDO PÁGINA: ${page.page_id}`);
  console.log(`Título: ${page.month_name}`);
  console.log(`Quantidade de cards: ${cards.length}`);
  console.log("======================================================");

  for (let index = 0; index < cards.length; index++) {
    const cardConfig = cards[index];

    if (!cardConfig.file) {
      console.log(`Card ignorado sem file no índice ${index}`);
      continue;
    }

    const parsedFile = parseImageFileName(cardConfig.file);

    const cardKey = buildCardKey({
      pageId: page.page_id,
      cardDate: parsedFile.cardDate,
      imageSlug: parsedFile.imageSlug,
    });

    const basePosition = baseTemplate[index];

    const finalPosition = generateFinalPosition({
      manualPosition: cardConfig.position,
      basePosition,
      jitter,
      safeArea,
      usedPositions,
      minimumDistance: page.min_distance || 20,
    });

    usedPositions.push(finalPosition);

    const { data, error } = await supabaseAdmin
      .from("album_cards")
      .update({
        x: finalPosition.x,
        y: finalPosition.y,
        rotate: finalPosition.rotate,
      })
      .eq("card_key", cardKey)
      .select("id, card_key, x, y, rotate");

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      console.log(`AVISO: carta não encontrada no banco: ${cardKey}`);
      console.log("Talvez você precise rodar npm run seed:album primeiro.");
      continue;
    }

    console.log(
      `OK: ${cardKey} → x ${finalPosition.x}, y ${finalPosition.y}, rotate ${finalPosition.rotate}`
    );
  }
}

// ======================================================
// FUNÇÃO PRINCIPAL
// ======================================================
async function main() {
  try {
    const pages = await loadSeedPages();

    if (pages.length === 0) {
      console.log("Nenhuma página encontrada em album_seed.");
      return;
    }

    const selectedPages = await askPagesToReroll(pages);

    console.log("");
    console.log("Páginas selecionadas:");
    selectedPages.forEach((item) => {
      console.log(`- ${item.page.page_id}`);
    });

    for (const page of selectedPages) {
      await rerollPageLayout(page);
    }

    console.log("");
    console.log("======================================================");
    console.log("REROLL FINALIZADO COM SUCESSO");
    console.log("======================================================");
  } catch (error) {
    console.error("");
    console.error("ERRO AO REORGANIZAR LAYOUT:");
    console.error(error);
    process.exit(1);
  }
}

main();