import { supabase } from "../../../../../lib/supabaseClient.js";

// ======================================================
// MONTA A URL PÚBLICA DA IMAGEM DA FIGURINHA
//
// -Recebe o image_path salvo no banco
// -Converte esse caminho em URL pública do bucket
// -Retorna null se não existir imagem
// ======================================================
export function getStickerImageUrl(imagePath) {
  if (!imagePath) {
    return null;
  }

  const publicUrl = supabase.storage
    .from("album-cards")
    .getPublicUrl(imagePath).data.publicUrl;

  if (!publicUrl) {
    return null;
  }

  return publicUrl;
}