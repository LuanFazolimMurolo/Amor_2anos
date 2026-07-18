import Packet_img from "../../imag/packet.svg";

import { formatCardsToPages } from "../../../Pages/data/formatCards.js";
import StickerContent from "../../../Pages/Sticker/StickerContent.jsx";
import { getPageThemeClass } from "../../../Pages/utils/getPageThemeClass.js";

// ======================================================
// TRANSFORMANDO CARDS EM STICKERS
//
// -No pacote, não precisamos agrupar por página
// -Cada card já vem do banco com theme e order_index
// -Esses dados dizem de qual página a carta veio
// ======================================================
function formatCardsToStickers(cards = []) {
  if (!Array.isArray(cards)) {
    return [];
  }

  const validCards = cards.filter(Boolean);

  if (validCards.length === 0) {
    return [];
  }

  return validCards.map((card) => {
    return {
      id: card.id,
      x: card.x,
      y: card.y,
      width: card.width,
      rotate: card.rotate,

      image_path: card.image_path,

      date: card.date || card.card_date,
      text: card.text || card.caption,
      proportion: card.proportion,

      theme: card.theme || "auto",
      orderIndex: card.orderIndex || card.order_index || 1,
    };
  });
}


// ======================================================
// PEGANDO PROPORÇÃO DA CARTA NO PACOTE
//
// -2:3 fica vertical
// -3:2 fica horizontal
// -1:1 fica quadrado
// ======================================================
function getPacketCardProportion(proportion) {
  const value = proportion || "2:3";

  const [num1, num2] = String(value)
    .split(":")
    .map(Number);

  if (!num1 || !num2) {
    return {
      aspectRatio: "2 / 3",
      width: "clamp(170px, 18vw, 280px)",
      orientation: "portrait",
    };
  }

  const isLandscape = num1 > num2;
  const isPortrait = num1 < num2;

  if (isLandscape) {
    return {
      aspectRatio: `${num1} / ${num2}`,
      width: "clamp(230px, 26vw, 390px)",
      orientation: "landscape",
    };
  }

  if (isPortrait) {
    return {
      aspectRatio: `${num1} / ${num2}`,
      width: "clamp(170px, 18vw, 280px)",
      orientation: "portrait",
    };
  }

  return {
    aspectRatio: `${num1} / ${num2}`,
    width: "clamp(190px, 20vw, 310px)",
    orientation: "square",
  };
}
export default function PacketAnimation({
  photos = [],
  packetRef,
  packetBodyRef,
  packetFlapRef,
  tearLineRef,
  lightRef,
  lightCoreRef,
  photosRef,
}) {
  // ======================================================
  // FORMATANDO AS CARTAS QUE VÃO SAIR DO PACOTE
  //
  // -Recebe as cartas do OpenPacket
  // -Converte para stickers
  // -Usa apenas as 4 primeiras
  // ======================================================
  const stickers = formatCardsToStickers(photos);

  const stickersToShow = [
    stickers[0] || null,
    stickers[1] || null,
    stickers[2] || null,
    stickers[3] || null,
  ];

  return (
    <div className="packet_scene">
      <div className="packet_photos_area">
       {stickersToShow.map((sticker, index) => {
        const themeClass = sticker
          ? getPageThemeClass({
              theme: sticker.theme || "auto",
              orderIndex: sticker.orderIndex || 1,
            })
          : "";

        const proportionData = sticker
          ? getPacketCardProportion(sticker.proportion)
          : null;

        return (
          <div
            key={sticker?.id ?? index}
            className={`packet_photo ${proportionData?.orientation || ""}`}
            style={
              proportionData
                ? {
                    "--packet-card-width": proportionData.width,
                    "--packet-card-aspect": proportionData.aspectRatio,
                  }
                : undefined
            }
            ref={(el) => {
              photosRef.current[index] = el;
            }}
          >
            {sticker ? (
              <article className={`packet_sticker_card ${themeClass}`}>
                <StickerContent
                  sticker={sticker}
                  desbloqueada={true}
                />
              </article>
            ) : (
              <div className="packet_photo_placeholder">
                IMG {index + 1}
              </div>
            )}
          </div>
        );
      })}
      </div>

      <div className="packet_wrapper" ref={packetRef}>
        <div className="packet_light" ref={lightRef}>
          <div className="packet_light_core" ref={lightCoreRef}></div>
        </div>

        <div className="packet_body" ref={packetBodyRef}>
          <img src={Packet_img} alt="Pacotinho fechado" />
        </div>

        <div className="packet_flap" ref={packetFlapRef}>
          <img src={Packet_img} alt="" />
        </div>

        <div className="packet_tear_line" ref={tearLineRef}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
}