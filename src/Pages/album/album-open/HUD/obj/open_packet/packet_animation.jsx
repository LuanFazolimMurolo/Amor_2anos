import Packet_img from "../../imag/packet.svg";

import { formatCardsToPages } from "../../../Pages/data/formatCards.js";
import StickerContent from "../../../Pages/Sticker/StickerContent.jsx";

// ======================================================
// TRANSFORMANDO CARDS EM STICKERS
//
// -O formatCardsToPages retorna páginas
// -Cada página tem uma lista page.stickers
// -Para o pacote, precisamos só de uma lista simples de stickers
// ======================================================
function formatCardsToStickers(cards = []) {
  if (!Array.isArray(cards)) {
    return [];
  }

  const validCards = cards.filter(Boolean);

  if (validCards.length === 0) {
    return [];
  }

  // ======================================================
  // CASO VENHA CARD BRUTO DO BANCO
  //
  // -Card bruto tem page_id, page_type, month_name etc.
  // -Nesse caso, usa o formatCardsToPages
  // ======================================================
  const hasPageData = validCards.some((card) => {
    return card.page_id !== undefined;
  });

  if (hasPageData) {
    const formattedPages = formatCardsToPages(validCards);

    return formattedPages.flatMap((page) => {
      return page.stickers || [];
    });
  }

  // ======================================================
  // CASO JÁ VENHA STICKER FORMATADO
  //
  // -Mantém os dados principais
  // ======================================================
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
    };
  });
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
        {stickersToShow.map((sticker, index) => (
          <div
            key={sticker?.id ?? index}
            className="packet_photo"
            ref={(el) => {
              photosRef.current[index] = el;
            }}
          >
            {sticker ? (
              <article className="packet_sticker_card">
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
        ))}
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