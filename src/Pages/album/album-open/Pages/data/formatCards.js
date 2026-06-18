export function formatCardsToPages(cards = []) {
  const pagesMap = new Map();

  cards.forEach((card) => {
    if (!pagesMap.has(card.page_id)) {
      pagesMap.set(card.page_id, {
        id: card.page_id,
        type: card.page_type,
        month: card.month_name,
        age: card.relationship_age,
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
      proportion:card.proportion
    });
  });

  return Array.from(pagesMap.values());
}