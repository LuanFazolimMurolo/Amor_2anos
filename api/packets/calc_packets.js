// ======================================================
// DATA BASE DOS PACKETS
// Formato: DD-MM-YYYY
//
// Aqui você muda a data inicial dos pacotinhos.
// Exemplo:
// 18-05-2026
// ======================================================
const DATE_BASE = "18-01-2026";

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
// GERA TODAS AS DATAS QUE DEVERIAM EXISTIR
//
// Exemplo:
// DATE_BASE = 18-05-2026
//
// Se hoje for 30-06-2026, retorna:
// [
//   "18-05-2026",
//   "18-06-2026"
// ]
//
// Se hoje for 17-06-2026, retorna:
// [
//   "18-05-2026"
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

      datesList.push(`${dayFormatted}-${monthFormatted}-${currentYear}`);
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

  // Segurança caso algum dia venha timestamp:
  // 2026-05-18T00:00:00.000Z
  const cleanDate = date.split("T")[0];

  const [year, month, day] = cleanDate.split("-");

  return `${day}-${month}-${year}`;
}

// ======================================================
// CALCULA O QUE PRECISA ADICIONAR E DELETAR
//
// datesExpected = datas que deveriam existir
// datesExisting = datas que já existem no banco
//
// Retorna:
// dates_to_add: datas que faltam no banco
// dates_to_delete: datas que existem no banco, mas não deveriam existir
// ======================================================
function calc_sync(datesExpected, datesExisting) {
  const dates_to_add = [];
  const dates_to_delete = [];

  // Verifica quais datas deveriam existir, mas ainda não existem
  datesExpected.forEach((date) => {
    if (!datesExisting.includes(date)) {
      dates_to_add.push(date);
    }
  });

  // Verifica quais datas existem, mas não deveriam existir
  datesExisting.forEach((date) => {
    if (!datesExpected.includes(date)) {
      dates_to_delete.push(date);
    }
  });

  return {
    dates_to_add,
    dates_to_delete,
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
// Útil para mandar para o front e liberar páginas/pacotinhos.
// ======================================================
export function packets_used(data) {
  const ids_used = [];

  data.forEach((item) => {
    const { id, used } = item;

    if (used) {
      ids_used.push(id);
    }
  });

  console.log("IDS USADOS:", ids_used);

  return ids_used;
}