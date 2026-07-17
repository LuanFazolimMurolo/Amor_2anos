import { supabaseAdmin } from "../../server/config/supabaseAdmin.js";

const BUCKET_NAME = "album-cards";

// ======================================================
// LISTANDO TODOS OS ARQUIVOS DO BUCKET RECURSIVAMENTE
// ======================================================
async function listAllFiles(prefix = "") {
  const allFiles = [];

  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET_NAME)
    .list(prefix, {
      limit: 1000,
      offset: 0,
    });

  if (error) {
    throw error;
  }

  for (const item of data || []) {
    const fullPath = prefix ? `${prefix}/${item.name}` : item.name;

    // Arquivo real normalmente tem metadata.
    // Pasta normalmente não tem metadata.
    if (item.metadata) {
      allFiles.push(fullPath);
    } else {
      const nestedFiles = await listAllFiles(fullPath);
      allFiles.push(...nestedFiles);
    }
  }

  return allFiles;
}

// ======================================================
// DELETANDO STORAGE INTEIRO DO BUCKET
// ======================================================
async function main() {
  try {
    const files = await listAllFiles();

    console.log("Arquivos encontrados:", files.length);

    if (files.length === 0) {
      console.log("Bucket já está vazio.");
      return;
    }

    const chunkSize = 100;

    for (let index = 0; index < files.length; index += chunkSize) {
      const chunk = files.slice(index, index + chunkSize);

      const { error } = await supabaseAdmin.storage
        .from(BUCKET_NAME)
        .remove(chunk);

      if (error) {
        throw error;
      }

      console.log(`Removidos ${index + chunk.length}/${files.length}`);
    }

    console.log("Storage limpo com sucesso.");
  } catch (error) {
    console.error("Erro ao limpar Storage:");
    console.error(error);
    process.exit(1);
  }
}

main();