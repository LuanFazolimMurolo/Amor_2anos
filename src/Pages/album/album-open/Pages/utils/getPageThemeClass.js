// ======================================================
// PEGANDO CLASSE DE TEMA DA PÁGINA
//
// Regra:
//
// -Se for página de mês e theme for "auto":
//  alterna usando monthColorIndex
//
// -Se for página especial:
//  usa o theme manual
//
// Exemplos:
// -theme auto + mês 1 = theme-yellow-light
// -theme auto + mês 2 = theme-yellow-dark
// -theme legendary    = theme-legendary
// -theme forma        = theme-forma
// ======================================================

export function getPageThemeClass(page) {
  const theme = page?.theme || "auto";
  const pageType = page?.type || page?.page_type || "month";

  if (theme !== "auto") {
    return `theme-${theme.replaceAll("_", "-")}`;
  }

  if (pageType === "month") {
    const monthColorIndex = Number(page?.monthColorIndex || 1);

    if (monthColorIndex % 2 === 0) {
      return "theme-yellow-dark";
    }

    return "theme-yellow-light";
  }

  return "theme-yellow-light";
}