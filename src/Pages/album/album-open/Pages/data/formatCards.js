export function formatCardsToPages(cards = []) {
  const pagesMap = new Map();

  cards.forEach((card) => {
    if (!pagesMap.has(card.page_id)) {
      pagesMap.set(card.page_id, {
        id: card.page_id,
        type: card.page_type,
        month: card.month_name,
        age: card.relationship_age,

        // ======================================================
        // DADOS DA PÁGINA
        //
        // -orderIndex define a ordem oficial da página
        // -theme define a cor/tema da página
        // -layout pode ser usado depois para estilos diferentes
        // ======================================================
        orderIndex: card.order_index ?? 999,
        theme: card.theme || "auto",
        layout: card.layout || "month",

        stickers: [],
      });
    }

    pagesMap.get(card.page_id).stickers.push({
      id: card.id,
      x: card.x,
      y: card.y,
      width: card.width,
      rotate: card.rotate,
      image_path: card.image_path,
      date: card.card_date,
      text: card.caption,
      proportion: card.proportion,
    });
  });

  const pages = Array.from(pagesMap.values());

  // ======================================================
  // ORDENANDO AS PÁGINAS
  //
  // -Julho orderIndex 1
  // -Agosto orderIndex 2
  // -Setembro orderIndex 3
  // ======================================================
  pages.sort((pageA, pageB) => {
    return pageA.orderIndex - pageB.orderIndex;
  });

  return pages;
}