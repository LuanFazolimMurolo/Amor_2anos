import { supabase } from "../../../../../lib/supabaseClient.js";
import { useState, useEffect } from "react";
// ======================================================
// FORMATANDO DATA PARA PT-BR
//
// -Recebe uma data no formato YYYY-MM-DD
// -Retorna no formato DD/MM/YYYY
// -Não usa new Date para evitar erro de fuso horário
// ======================================================
function formatDateBR(dateString) {
  if (!dateString) {
    return "";
  }

  const [year, month, day] = dateString.split("-");

  return `${day}/${month}/${year}`;
}

// ======================================================
// PEGANDO URL PÚBLICA DA IMAGEM NO SUPABASE STORAGE
//
// -Recebe o caminho salvo no banco
// -Exemplo: julho/foto1.png
// -Transforma em URL pública do bucket album-cards
// ======================================================
function getStickerImageUrl(imagePath) {
  if (!imagePath) {
    return null;
  }

  const publicUrl = supabase.storage
    .from("album-cards")
    .getPublicUrl(imagePath).data.publicUrl;

  return publicUrl || null;
}

// ======================================================
// CONTEÚDO VISUAL DA FIGURINHA
//
// Regra:
//
// -Se desbloqueada for true:
//  mostra data, imagem e texto reais
//
// -Se desbloqueada for false:
//  esconde tudo e mostra apenas interrogações
// ======================================================
function StickerContent({ sticker, desbloqueada }) {
  const [imageError, setImageError] = useState(false);

  const imageUrl = getStickerImageUrl(sticker?.image_path);

  useEffect(() => {
    setImageError(false);
  }, [sticker?.image_path]);

  const isUnlocked = desbloqueada === true;
  console.log("DEBUG STICKER CONTENT:", {
    id: sticker?.id,
    text: sticker?.text,
    desbloqueada,
    isUnlocked,
  });
  const canShowImage = isUnlocked && imageUrl && !imageError;

  return (
    <>
      <div className="sticker-date">
        {isUnlocked ? formatDateBR(sticker?.date) : "??/??/????"}
      </div>

      <div className="sticker-image">
        {canShowImage ? (
          <img
            src={imageUrl}
            alt=""
            onError={() => {
              console.log("Erro ao carregar imagem:", imageUrl);
              setImageError(true);
            }}
          />
        ) : (
          <div className="sticker-placeholder">?</div>
        )}
      </div>

      <div className="sticker-text">
        {isUnlocked ? sticker?.text : "?"}
      </div>
    </>
  );
}

export default StickerContent;