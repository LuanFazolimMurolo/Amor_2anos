import "./Sticker.css";

import { supabase } from "../../../../../lib/supabaseClient.js";
function getProportionData(proportion) {
  const defaultProportion = "1:1";
  const value = proportion || defaultProportion;

  const [num1, num2] = String(value)
    .split(":")
    .map(Number);

  if (!num1 || !num2) {
    return {
      aspectRatio: "1 / 1",
      orientation: "square",
      width: "clamp(120px, 13vw, 220px)",
    };
  }

  const isLandscape = num1 > num2;
  const isPortrait = num1 < num2;

  let orientation = "square";
  let width = "clamp(120px, 13vw, 220px)";

  if (isLandscape) {
    orientation = "landscape";
    width = "clamp(180px, 22vw, 360px)";
  }

  if (isPortrait) {
    orientation = "portrait";
    width = "clamp(110px, 12vw, 200px)";
  }

  return {
    aspectRatio: `${num1} / ${num2}`,
    orientation,
    width,
  };
}

function formatDateBR(dateString) {
  if (!dateString) return "";

  const [year, month, day] = dateString.split("-");

  return `${day}/${month}/${year}`;
}


function Sticker({ sticker, desbloqueada }) {
  const proportionData = getProportionData(sticker.proportion);
  const stickerStyle = {
    left: `${sticker.x}%`,
    top: `${sticker.y}%`,
    width: proportionData.width,
    aspectRatio: proportionData.aspectRatio,
    transform: `translate(-50%, -50%) rotate(${sticker.rotate ?? 0}deg)`,
  };

  const publicUrl = sticker.image_path
  ? supabase.storage
      .from("album-cards")
      .getPublicUrl(sticker.image_path).data.publicUrl
  : null;

  const imageUrl = publicUrl
    ? `${publicUrl}?v=${sticker.id}-${Date.now()}`
    : null;
    console.log({
    id: sticker.id,
    path: sticker.image_path,
    url: imageUrl,
  });


  return (
    <article
      className={`album-sticker ${desbloqueada ? "unlocked" : "locked"}`}
      style={stickerStyle}
    >
      <div className="sticker-date">
        {desbloqueada ? formatDateBR(sticker.date) : "??/??/????"}
      </div>

      
      <div className="sticker-image">
        {desbloqueada && imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            onError={() => console.log("Erro ao carregar imagem:", imageUrl)}
          />
        ) : (
          <div className="sticker-placeholder">?</div>
        )}
      </div>

      <div className="sticker-text">
        {desbloqueada ? sticker.text : "Figurinha bloqueada"}
      </div>
    </article>
  );
}

export default Sticker;