import "./Sticker.css";
import StickerContent from "./StickerContent.jsx";

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
      width: "var(--album-sticker-width-square)",
    };
  }

  const isLandscape = num1 > num2;
  const isPortrait = num1 < num2;

  if (isLandscape) {
    return {
      aspectRatio: `${num1} / ${num2}`,
      orientation: "landscape",
      width: "var(--album-sticker-width-landscape)",
    };
  }

  if (isPortrait) {
    return {
      aspectRatio: `${num1} / ${num2}`,
      orientation: "portrait",
      width: "var(--album-sticker-width-portrait)",
    };
  }

  return {
    aspectRatio: `${num1} / ${num2}`,
    orientation: "square",
    width: "var(--album-sticker-width-square)",
  };
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