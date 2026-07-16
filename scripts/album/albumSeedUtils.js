import fs from "fs/promises";
import path from "path";

// ======================================================
// PASTA PRINCIPAL DA SEED
//
// -process.cwd() aponta para a raiz do projeto
// -album_seed fica na raiz
// ======================================================
export const ALBUM_SEED_DIR = path.resolve(process.cwd(), "album_seed");

// ======================================================
// LENDO JSON
//
// -Recebe o caminho de um arquivo JSON
// -Lê o arquivo
// -Converte para objeto JavaScript
// ======================================================
export async function readJsonFile(filePath) {
  const content = await fs.readFile(filePath, "utf-8");

  return JSON.parse(content);
}

// ======================================================
// VERIFICANDO SE ARQUIVO EXISTE
// ======================================================
export async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// ======================================================
// LISTANDO PASTAS DE PÁGINAS
//
// -Lê album_seed/
// -Retorna apenas pastas
// ======================================================
export async function listPageFolders() {
  const items = await fs.readdir(ALBUM_SEED_DIR, {
    withFileTypes: true,
  });

  return items
    .filter((item) => item.isDirectory())
    .map((item) => {
      return {
        folderName: item.name,
        folderPath: path.join(ALBUM_SEED_DIR, item.name),
      };
    });
}

// ======================================================
// PEGANDO MIME TYPE DA IMAGEM
//
// -Ajuda o Supabase Storage a entender o tipo do arquivo
// ======================================================
export function getMimeType(fileName) {
  const extension = path.extname(fileName).toLowerCase();

  const mimeTypes = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
  };

  return mimeTypes[extension] || "application/octet-stream";
}

// ======================================================
// PARSEANDO NOME DA IMAGEM
//
// Padrão esperado:
// 2025-07-18__2x3__foto1.png
//
// Retorna:
// cardDate: 2025-07-18
// proportion: 2:3
// imageSlug: foto1
// ======================================================
export function parseImageFileName(fileName) {
  const extension = path.extname(fileName);
  const fileNameWithoutExtension = path.basename(fileName, extension);

  const parts = fileNameWithoutExtension.split("__");

  if (parts.length < 3) {
    throw new Error(
      `Nome de imagem inválido: ${fileName}. Use o padrão 2025-07-18__2x3__foto1.png`
    );
  }

  const [cardDate, rawProportion, ...slugParts] = parts;

  const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(cardDate);

  if (!isValidDate) {
    throw new Error(
      `Data inválida no arquivo ${fileName}. Use o padrão YYYY-MM-DD.`
    );
  }

  const proportion = rawProportion.replace("x", ":");

  const isValidProportion = /^\d+:\d+$/.test(proportion);

  if (!isValidProportion) {
    throw new Error(
      `Proporção inválida no arquivo ${fileName}. Use algo como 2x3, 3x2 ou 1x1.`
    );
  }

  const imageSlug = slugParts.join("__");

  return {
    cardDate,
    proportion,
    imageSlug,
    extension,
  };
}

// ======================================================
// CRIANDO CARD KEY
//
// -Essa chave identifica a figurinha de forma fixa
// -Serve para a seed não duplicar cartas
// ======================================================
export function buildCardKey({ pageId, cardDate, imageSlug }) {
  return `${pageId}__${cardDate}__${imageSlug}`;
}

// ======================================================
// NÚMERO ALEATÓRIO ENTRE MIN E MAX
// ======================================================
export function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

// ======================================================
// LIMITANDO VALOR ENTRE MIN E MAX
//
// Exemplo:
// clamp(95, 10, 88) retorna 88
// ======================================================
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// ======================================================
// ARREDONDANDO NÚMERO
//
// -Evita salvar números gigantes tipo 22.384928391
// ======================================================
export function roundNumber(value) {
  return Math.round(value * 100) / 100;
}

// ======================================================
// GERANDO TEMPLATE PADRÃO CASO NÃO EXISTA
//
// -Serve para páginas com muita figurinha
// -Não é tão bonito quanto templates manuais
// -Mas evita a seed quebrar
// ======================================================
export function generateFallbackTemplate(cardsCount) {
  const positions = [];

  const columns = Math.ceil(Math.sqrt(cardsCount));
  const rows = Math.ceil(cardsCount / columns);

  const minX = 18;
  const maxX = 82;
  const minY = 24;
  const maxY = 78;

  const stepX = columns === 1 ? 0 : (maxX - minX) / (columns - 1);
  const stepY = rows === 1 ? 0 : (maxY - minY) / (rows - 1);

  for (let index = 0; index < cardsCount; index++) {
    const column = index % columns;
    const row = Math.floor(index / columns);

    positions.push({
      x: columns === 1 ? 50 : minX + column * stepX,
      y: rows === 1 ? 50 : minY + row * stepY,
      rotate: randomBetween(-8, 8),
    });
  }

  return positions;
}

// ======================================================
// ESCOLHENDO UM TEMPLATE ALEATÓRIO
//
// -Usa layout da página: month, bonus etc.
// -Usa quantidade de cards da página
// ======================================================
export function chooseTemplate({ templates, layout, cardsCount }) {
  const layoutGroup = templates[layout] || templates.month;

  const templatesForCount = layoutGroup?.[cardsCount];

  if (!templatesForCount || templatesForCount.length === 0) {
    return generateFallbackTemplate(cardsCount);
  }

  const randomIndex = Math.floor(Math.random() * templatesForCount.length);

  return templatesForCount[randomIndex];
}

// ======================================================
// CALCULANDO DISTÂNCIA ENTRE DUAS POSIÇÕES
//
// -Usado para tentar evitar figurinhas muito grudadas
// ======================================================
export function getDistance(positionA, positionB) {
  const diffX = positionA.x - positionB.x;
  const diffY = positionA.y - positionB.y;

  return Math.sqrt(diffX * diffX + diffY * diffY);
}

// ======================================================
// APLICANDO JITTER NA POSIÇÃO
//
// -Pega uma posição base
// -Soma uma variação aleatória
// -Respeita a área segura da página
// ======================================================
export function applyJitterToPosition({
  basePosition,
  jitter,
  safeArea,
}) {
  const finalX = clamp(
    basePosition.x + randomBetween(-jitter.x, jitter.x),
    safeArea.min_x,
    safeArea.max_x
  );

  const finalY = clamp(
    basePosition.y + randomBetween(-jitter.y, jitter.y),
    safeArea.min_y,
    safeArea.max_y
  );

  const finalRotate =
    basePosition.rotate + randomBetween(-jitter.rotate, jitter.rotate);

  return {
    x: roundNumber(finalX),
    y: roundNumber(finalY),
    rotate: roundNumber(finalRotate),
  };
}

// ======================================================
// GERANDO POSIÇÃO FINAL
//
// Regra:
// -Se tiver position manual no page.json, usa ela
// -Se não tiver, usa template + jitter
// -Tenta evitar que uma figurinha fique muito grudada na outra
// ======================================================
export function generateFinalPosition({
  manualPosition,
  basePosition,
  jitter,
  safeArea,
  usedPositions,
    minimumDistance = 18,
}) {
  if (manualPosition) {
    return {
      x: manualPosition.x,
      y: manualPosition.y,
      rotate: manualPosition.rotate ?? 0,
    };
  }

  let lastCandidate = null;

  for (let attempt = 0; attempt < 20; attempt++) {
    const candidate = applyJitterToPosition({
      basePosition,
      jitter,
      safeArea,
    });

    lastCandidate = candidate;

    const isFarEnough = usedPositions.every((usedPosition) => {
      return getDistance(candidate, usedPosition) >= minimumDistance;
    });

    if (isFarEnough) {
      return candidate;
    }
  }

  return lastCandidate;
}