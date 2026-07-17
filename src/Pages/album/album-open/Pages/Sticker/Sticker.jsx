import "./Sticker.css";
import StickerContent from "./StickerContent.jsx";

function getProportionData(proportion) {
  const defaultProportion = "1:1";
  const value = proportion || defaultProportion;

  const [num1, num2] = String(value).split(":").map(Number);

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
    width = "clamp(420px, 22vw, 360px)";
  }

  if (isPortrait) {
    orientation = "portrait";
    width = "clamp(250px, 12vw, 200px)";
  }

  return {
    aspectRatio: `${num1} / ${num2}`,
    orientation,
    width,
  };
}

function Sticker({ sticker, desbloqueada }) {
  const proportionData = getProportionData(sticker.proportion);

  const stickerStyle = {
    left: `${sticker.x}%`,
    top: `${sticker.y}%`,
    width: sticker.width || proportionData.width,
    aspectRatio: proportionData.aspectRatio,
    transform: `translate(-50%, -50%) rotate(${sticker.rotate ?? 0}deg)`,
  };

  return (
    <article
      className={`album-sticker ${desbloqueada ? "unlocked" : "locked"}`}
      style={stickerStyle}
    >
      <StickerContent
        sticker={sticker}
        desbloqueada={desbloqueada}
      />
    </article>
  );
}

export default Sticker;