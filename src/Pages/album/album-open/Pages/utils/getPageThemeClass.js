// ======================================================
// PEGANDO CLASSE DE TEMA DA PÁGINA
//
// Regra:
//
// -Se theme for "auto":
//  orderIndex ímpar = amarelo claro
//  orderIndex par = amarelo escuro
//
// -Se theme for manual:
//  "bonus_black" vira "theme-bonus-black"
// ======================================================
export function getPageThemeClass(page) {
  const theme = page?.theme || "auto";
  const orderIndex = Number(page?.orderIndex || 1);

  if (theme !== "auto") {
    return `theme-${theme.replaceAll("_", "-")}`;
  }

  if (orderIndex % 2 === 0) {
    return "theme-yellow-dark";
  }

  return "theme-yellow-light";
}