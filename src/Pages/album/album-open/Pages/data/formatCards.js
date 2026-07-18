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

  pages.sort((pageA, pageB) => {
    return pageA.orderIndex - pageB.orderIndex;
  });

  // ======================================================
  // CRIANDO ÍNDICE VISUAL SÓ PARA PÁGINAS DE MÊS
  //
  // -Páginas especiais não entram na alternância
  // -Exemplo:
  //  lendarias = especial, não conta
  //  julho     = mês 1 claro
  //  agosto    = mês 2 escuro
  //  setembro  = mês 3 claro
  // ======================================================

  let monthColorIndex = 0;

  const pagesWithMonthIndex = pages.map((page) => {
    if (page.type === "month") {
      monthColorIndex += 1;

      return {
        ...page,
        monthColorIndex,
      };
    }

    return page;
  });

  return pagesWithMonthIndex;
}