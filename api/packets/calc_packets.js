// ======================================================
// DATA BASE DOS PACKETS
// Formato: DD-MM-YYYY
//
// Aqui você muda a data inicial dos pacotinhos.
// Exemplo:
// 18-07-2026
// ======================================================
const DATE_BASE = "18-07-2026";

// ======================================================
// PEGA A DATA DE HOJE NO HORÁRIO DO BRASIL
// Retorna os valores como número
// ======================================================
function getTodayBR() {
  const parts = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).formatToParts(new Date());

  const day = Number(parts.find((part) => part.type === "day").value);
  const month = Number(parts.find((part) => part.type === "month").value);
  const year = Number(parts.find((part) => part.type === "year").value);

  return {
    day,
    month,
    year,
  };
}

// ======================================================
// QUANTIDADE DE PACOTES POR DATA
//
// Regra:
//
// -Todo dia 18 ganha 1 pacote
// -Todo dia 18/07 ganha 5 pacotes
//
// Exemplo:
// 18-07-2026 = 5 pacotes
// 18-08-2026 = 1 pacote
// 18-09-2026 = 1 pacote
// ======================================================
function getPacketsAmountForDate(day, month) {
  const isJuly18 = day === 18 && month === 7;

  if (isJuly18) {
    return 8;
  }

  return 1;
}

// ======================================================
// GERA TODAS AS DATAS QUE DEVERIAM EXISTIR
//
// Importante:
//
// -Se uma data deveria ter 5 pacotes, ela aparece 5 vezes
//
// Exemplo:
// [
//   "18-07-2026",
//   "18-07-2026",
//   "18-07-2026",
//   "18-07-2026",
//   "18-07-2026",
//   "18-08-2026"
// ]
// ======================================================
function dates_all() {
  const { day: dayNow, month: monthNow, year: yearNow } = getTodayBR();

  const [baseDay, baseMonth, baseYear] = DATE_BASE.split("-").map(Number);

  const datesList = [];

  let currentMonth = baseMonth;
  let currentYear = baseYear;

  while (
    currentYear < yearNow ||
    (currentYear === yearNow && currentMonth <= monthNow)
  ) {
    const isPastMonth =
      currentYear < yearNow ||
      (currentYear === yearNow && currentMonth < monthNow);

    const isCurrentMonthAndDayReached =
      currentYear === yearNow &&
      currentMonth === monthNow &&
      dayNow >= baseDay;

    if (isPastMonth || isCurrentMonthAndDayReached) {
      const dayFormatted = String(baseDay).padStart(2, "0");
      const monthFormatted = String(currentMonth).padStart(2, "0");

      const formattedDate = `${dayFormatted}-${monthFormatted}-${currentYear}`;

      const packetsAmount = getPacketsAmountForDate(
        baseDay,
        currentMonth
      );

      for (let index = 0; index < packetsAmount; index++) {
        datesList.push(formattedDate);
      }
    }

    currentMonth++;

    if (currentMonth > 12) {
      currentMonth = 1;
      currentYear++;
    }
  }

  return datesList;
}

// ======================================================
// CONVERTE DATA DO SUPABASE PARA FORMATO BR
//
// Supabase:
// 2026-05-18
//
// Vira:
// 18-05-2026
// ======================================================
function formatDateToBR(date) {
  if (!date) {
    return null;
  }

  const cleanDate = date.split("T")[0];

  const [year, month, day] = cleanDate.split("-");

  return `${day}-${month}-${year}`;
}

// ======================================================
// CONTA QUANTAS VEZES CADA DATA APARECE
//
// Exemplo:
// [
//   "18-07-2026",
//   "18-07-2026",
//   "18-08-2026"
// ]
//
// Vira:
// {
//   "18-07-2026": 2,
//   "18-08-2026": 1
// }
// ======================================================
function countDates(dates = []) {
  const datesCount = {};

  dates.forEach((date) => {
    datesCount[date] = (datesCount[date] || 0) + 1;
  });

  return datesCount;
}

// ======================================================
// CALCULA O QUE PRECISA ADICIONAR E DELETAR
//
// Agora suporta datas repetidas.
//
// Exemplo:
// Esperado:
// 18-07-2026 aparece 5 vezes
//
// Existente:
// 18-07-2026 aparece 1 vez
//
// Resultado:
// dates_to_add = [
//   "18-07-2026",
//   "18-07-2026",
//   "18-07-2026",
//   "18-07-2026"
// ]
// ======================================================
function calc_sync(datesExpected, datesExisting) {
  const dates_to_add = [];
  const dates_to_delete = [];

  const expectedCount = countDates(datesExpected);
  const existingCount = countDates(datesExisting);

  // ======================================================
  // ADICIONAR DATAS QUE ESTÃO FALTANDO
  // ======================================================
  Object.keys(expectedCount).forEach((date) => {
    const expectedAmount = expectedCount[date] || 0;
    const existingAmount = existingCount[date] || 0;

    const missingAmount = expectedAmount - existingAmount;

    if (missingAmount > 0) {
      for (let index = 0; index < missingAmount; index++) {
        dates_to_add.push(date);
      }
    }
  });

  // ======================================================
  // DELETAR DATAS QUE NÃO DEVERIAM EXISTIR
  //
  // Importante:
  // -Aqui deletamos apenas datas completamente inválidas.
  // -Não tentamos deletar "excesso" da mesma data, porque seu sistema
  //  atual de delete provavelmente deleta pela data inteira.
  // ======================================================
  Object.keys(existingCount).forEach((date) => {
    const expectedAmount = expectedCount[date] || 0;

    if (expectedAmount === 0) {
      dates_to_delete.push(date);
    }
  });

  return {
    dates_to_add,
    dates_to_delete,
    expectedCount,
    existingCount,
  };
}

// ======================================================
// ENGINE PRINCIPAL DOS PACKETS
//
// Recebe os packets vindos do Supabase.
// Calcula:
// - todas as datas que deveriam existir;
// - todas as datas que já existem;
// - quais precisa adicionar;
// - quais precisa deletar.
// ======================================================
export function packets_engine(data) {
  const list_dates_all = dates_all();
  const list_dates_has = [];

  data.forEach((item) => {
    const { created_at } = item;

    const form_created_at = formatDateToBR(created_at);

    if (form_created_at) {
      list_dates_has.push(form_created_at);
    }
  });

  const syncResult = calc_sync(list_dates_all, list_dates_has);

  console.log("DATAS QUE DEVERIAM EXISTIR:", list_dates_all);
  console.log("DATAS QUE JÁ EXISTEM:", list_dates_has);
  console.log("CONTAGEM ESPERADA:", syncResult.expectedCount);
  console.log("CONTAGEM EXISTENTE:", syncResult.existingCount);
  console.log("DATAS PARA ADICIONAR:", syncResult.dates_to_add);
  console.log("DATAS PARA DELETAR:", syncResult.dates_to_delete);

  return {
    dates_all: list_dates_all,
    dates_has: list_dates_has,
    dates_to_add: syncResult.dates_to_add,
    dates_to_delete: syncResult.dates_to_delete,
  };
}

// ======================================================
// PEGA OS IDS DOS PACKETS QUE ESTÃO COM used = true
//
// No seu sistema:
//
// used true  = pacote fechado/disponível
// used false = pacote aberto/usado
// ======================================================
export function packets_used(data) {
  const ids_used = [];

  data.forEach((item) => {
    const { id, used } = item;

    if (used) {
      ids_used.push(id);
    }
  });

  console.log("IDS DISPONÍVEIS:", ids_used);

  return ids_used;
}