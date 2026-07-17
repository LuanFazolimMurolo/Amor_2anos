import fs from "fs/promises";
import path from "path";

import { supabaseAdmin } from "../../server/config/supabaseAdmin.js";

import { albumLayoutTemplates } from "./albumLayoutTemplates.js";

import {
  listPageFolders,
  readJsonFile,
  fileExists,
  getMimeType,
  parseImageFileName,
  buildCardKey,
  chooseTemplate,
  generateFinalPosition,
} from "./albumSeedUtils.js";

function getJwtRole(key) {
  try {
    const payload = JSON.parse(
      Buffer.from(key.split(".")[1], "base64url").toString("utf-8")
    );

    return payload.role;
  } catch {
    return "não consegui ler a role";
  }
}

console.log("ROLE DA CHAVE USADA NA SEED:", getJwtRole(process.env.SUPABASE_SERVICE_ROLE_KEY));
// ======================================================
// CONFIGURAÇÃO PRINCIPAL
// ======================================================
const BUCKET_NAME = "album-cards";

// ======================================================
// VALIDANDO CONFIGURAÇÃO DA PÁGINA
//
// -Garante que o page.json tem os campos principais
// ======================================================
function validatePageJson(pageJson, pageJsonPath) {
  if (!pageJson.page) {
    throw new Error(`Arquivo sem objeto "page": ${pageJsonPath}`);
  }

  if (!Array.isArray(pageJson.cards)) {
    throw new Error(`Arquivo sem array "cards": ${pageJsonPath}`);
  }

  const requiredPageFields = [
    "page_id",
    "page_type",
    "month_name",
    "order_index",
  ];

  requiredPageFields.forEach((field) => {
    if (pageJson.page[field] === undefined || pageJson.page[field] === null) {
      throw new Error(`Campo page.${field} ausente em: ${pageJsonPath}`);
    }
  });
}

// ======================================================
// SUBINDO IMAGEM PARA O SUPABASE STORAGE
//
// -Recebe arquivo local
// -Sobe para o bucket album-cards
// -Usa upsert true para substituir caso já exista
// ======================================================
async function uploadImageToStorage({
  localFilePath,
  storagePath,
  fileName,
}) {
  const fileBuffer = await fs.readFile(localFilePath);

  const contentType = getMimeType(fileName);

  const { error } = await supabaseAdmin.storage
    .from(BUCKET_NAME)
    .upload(storagePath, fileBuffer, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw error;
  }

  return storagePath;
}


// ======================================================
// BUSCANDO CARTAS JÁ EXISTENTES NO BANCO
//
// -Usa card_key como identificação fixa
// -Serve para a seed não recalcular posição de cartas antigas
// ======================================================
async function getExistingCardsMap() {
  const { data, error } = await supabaseAdmin
    .from("album_cards")
    .select("card_key, x, y, rotate");

  if (error) {
    throw error;
  }

  const existingCardsMap = new Map();

  (data || []).forEach((card) => {
    existingCardsMap.set(card.card_key, card);
  });

  return existingCardsMap;
}

// ======================================================
// PROCESSANDO UMA PASTA DE PÁGINA
//
// Exemplo:
// album_seed/julho_1.1/page.json
// ======================================================
async function processPageFolder({ folderName, folderPath }, existingCardsMap) {
  const pageJsonPath = path.join(folderPath, "page.json");

  const existsPageJson = await fileExists(pageJsonPath);

  if (!existsPageJson) {
    console.log(`Pulando pasta sem page.json: ${folderName}`);
    return [];
  }

  const pageJson = await readJsonFile(pageJsonPath);

  validatePageJson(pageJson, pageJsonPath);

  const page = pageJson.page;
  const cards = pageJson.cards;

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
  const rowsToUpsert = [];

  console.log("");
  console.log("======================================================");
  console.log(`Processando página: ${page.page_id}`);
  console.log(`Pasta: ${folderName}`);
  console.log(`Quantidade de cards: ${cards.length}`);
  console.log("======================================================");

  for (let index = 0; index < cards.length; index++) {
    const cardConfig = cards[index];

    if (!cardConfig.file) {
      throw new Error(
        `Card sem campo "file" em ${pageJsonPath}, índice ${index}`
      );
    }

    const localFilePath = path.join(folderPath, cardConfig.file);

    const existsImage = await fileExists(localFilePath);

    if (!existsImage) {
      throw new Error(
        `Imagem não encontrada: ${localFilePath}`
      );
    }

    const parsedFile = parseImageFileName(cardConfig.file);

    const cardKey = buildCardKey({
      pageId: page.page_id,
      cardDate: parsedFile.cardDate,
      imageSlug: parsedFile.imageSlug,
    });
    const existingCard = existingCardsMap.get(cardKey);

    const storagePath = `${page.page_id}/${cardConfig.file}`;

    await uploadImageToStorage({
      localFilePath,
      storagePath,
      fileName: cardConfig.file,
    });

    const basePosition = baseTemplate[index];

    let finalPosition;

    // ======================================================
    // SE A CARTA JÁ EXISTE, MANTÉM A POSIÇÃO DELA
    //
    // -Isso impede a seed de bagunçar páginas antigas
    // -Apenas cartas novas recebem posição nova
    // ======================================================
    if (
      existingCard &&
      existingCard.x !== null &&
      existingCard.y !== null &&
      existingCard.rotate !== null
    ) {
      finalPosition = {
        x: existingCard.x,
        y: existingCard.y,
        rotate: existingCard.rotate,
      };
    } else {
      finalPosition = generateFinalPosition({
        manualPosition: cardConfig.position,
        basePosition,
        jitter,
        safeArea,
        usedPositions,
        minimumDistance: page.min_distance || 20,
      });
    }

    usedPositions.push(finalPosition);

    const row = {
      card_key: cardKey,

      page_id: page.page_id,
      page_type: page.page_type,
      month_name: page.month_name,
      relationship_age: page.relationship_age || "",

      theme: page.theme || "auto",
      order_index: page.order_index,
      layout,

      x: finalPosition.x,
      y: finalPosition.y,
      rotate: finalPosition.rotate,

      image_path: storagePath,
      card_date: parsedFile.cardDate,
      caption: cardConfig.caption || "",
      proportion: parsedFile.proportion,
    };

    rowsToUpsert.push(row);

    console.log(`OK: ${cardConfig.file}`);
    console.log(`card_key: ${cardKey}`);
    console.log(`storage: ${storagePath}`);
  }

  return rowsToUpsert;
}

// ======================================================
// SALVANDO CARTAS NO BANCO
//
// -Usa upsert por card_key
// -Se não existir, cria
// -Se existir, atualiza
// ======================================================
async function saveCardsToDatabase(rows) {
  if (rows.length === 0) {
    console.log("Nenhuma carta para salvar.");
    return;
  }

  const { data, error } = await supabaseAdmin
    .from("album_cards")
    .upsert(rows, {
      onConflict: "card_key",
    })
    .select();

  if (error) {
    throw error;
  }

  console.log("");
  console.log("======================================================");
  console.log(`Seed finalizada. Cartas salvas/atualizadas: ${data.length}`);
  console.log("======================================================");
}

// ======================================================
// FUNÇÃO PRINCIPAL DA SEED
// ======================================================
async function main() {
  try {
    const pageFolders = await listPageFolders();

    if (pageFolders.length === 0) {
      console.log("Nenhuma pasta encontrada em album_seed.");
      return;
    }

    const existingCardsMap = await getExistingCardsMap();

    const allRows = [];

    for (const folder of pageFolders) {
      const rows = await processPageFolder(folder, existingCardsMap);

      allRows.push(...rows);
    }

    await saveCardsToDatabase(allRows);
  } catch (error) {
    console.error("");
    console.error("ERRO AO RODAR SEED DO ÁLBUM:");
    console.error(error);
    process.exit(1);
  }
}

main();