import { supabaseAdmin } from "../server/config/supabaseAdmin.js";

// ======================================================
// PEGANDO TODOS OS VALORES DA TABELA iloveyous
// ======================================================
export async function getIloveyousData() {
  const { data: words, error } = await supabaseAdmin
    .from("iloveyous")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    throw error;
  }

  return {
    words,
  };
}

// ======================================================
// PEGANDO A DATA DE HOJE NO HORÁRIO DO BRASIL
// Retorna no formato do Supabase: YYYY-MM-DD
// Exemplo: 2026-06-30
// ======================================================
function getTodayDateBR() {
  const parts = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const day = parts.find((part) => part.type === "day").value;
  const month = parts.find((part) => part.type === "month").value;
  const year = parts.find((part) => part.type === "year").value;

  return `${year}-${month}-${day}`;
}

// ======================================================
// SORTEANDO UM ITEM ALEATÓRIO
// ======================================================
function sortRandomItem(items) {
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
}

// ======================================================
// PEGANDO / SORTEANDO A PALAVRA DO DIA
// ======================================================
export async function getTodayIloveyou() {
  const todayDate = getTodayDateBR();

  // Verifica se já existe uma palavra escolhida para hoje
  const { data: currentTodayWord, error: currentTodayError } =
    await supabaseAdmin
      .from("iloveyous")
      .select("*")
      .eq("today", true)
      .eq("selected_date", todayDate)
      .maybeSingle();

  if (currentTodayError) {
    throw currentTodayError;
  }

  // Se já existir palavra de hoje, retorna ela
  if (currentTodayWord) {
    return {
      word: currentTodayWord,
      alreadySelectedToday: true,
    };
  }

  // Limpa palavras antigas marcadas como today
  const { error: clearTodayError } = await supabaseAdmin
    .from("iloveyous")
    .update({ today: false })
    .eq("today", true);

  if (clearTodayError) {
    throw clearTodayError;
  }

  // Busca palavras ainda não usadas
  let { data: availableWords, error: availableWordsError } = await supabaseAdmin
    .from("iloveyous")
    .select("*")
    .eq("used", false);

  if (availableWordsError) {
    throw availableWordsError;
  }

  // Se todas já foram usadas, reseta o ciclo
  if (!availableWords || availableWords.length === 0) {
    const { error: resetError } = await supabaseAdmin
      .from("iloveyous")
      .update({
        used: false,
        today: false,
        selected_date: null,
      })
      .gt("id", 0);

    if (resetError) {
      throw resetError;
    }

    const { data: resetWords, error: resetWordsError } = await supabaseAdmin
      .from("iloveyous")
      .select("*")
      .eq("used", false);

    if (resetWordsError) {
      throw resetWordsError;
    }

    availableWords = resetWords;
  }

  // Sorteia uma palavra
  const selectedWord = sortRandomItem(availableWords);

  // Atualiza a palavra sorteada no banco
  const { data: updatedWord, error: updateError } = await supabaseAdmin
    .from("iloveyous")
    .update({
      used: true,
      today: true,
      selected_date: todayDate,
    })
    .eq("id", selectedWord.id)
    .select("*")
    .single();

  if (updateError) {
    throw updateError;
  }

  return {
    word: updatedWord,
    alreadySelectedToday: false,
  };
}

// ======================================================
// PEGANDO TODOS OS PACKETS DO BANCO
// ======================================================
export async function getPackets() {
  const { data: packets, error } = await supabaseAdmin
    .from("packets")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    throw error;
  }

  return {
    packets,
  };
}

// ======================================================
// CONVERTE DD-MM-YYYY PARA YYYY-MM-DD
// Exemplo:
// 18-05-2026 vira 2026-05-18
// ======================================================
function formatToSupabaseDate(date) {
  const [day, month, year] = date.split("-");
  return `${year}-${month}-${day}`;
}

// ======================================================
// ADICIONA PACKETS QUE ESTÃO FALTANDO
// Recebe datas em DD-MM-YYYY
// Salva no Supabase em YYYY-MM-DD
// ======================================================
export async function postPackets(datesToAdd) {
  if (!Array.isArray(datesToAdd) || datesToAdd.length === 0) {
    return {
      packets: [],
      message: "Nenhum packet novo para adicionar.",
    };
  }

  const rowsToInsert = datesToAdd.map((date) => {
    return {
      used: true,
      created_at: formatToSupabaseDate(date),
    };
  });

  const { data, error } = await supabaseAdmin
    .from("packets")
    .upsert(rowsToInsert, {
      onConflict: "created_at",
      ignoreDuplicates: true,
    })
    .select();

  if (error) {
    throw error;
  }

  return {
    packets: data,
    message: "Packets adicionados com sucesso.",
  };
}

// ======================================================
// DELETA PACKETS QUE NÃO DEVERIAM MAIS EXISTIR
// Recebe datas em DD-MM-YYYY
// Deleta no Supabase usando YYYY-MM-DD
// ======================================================
export async function deletePacketsByDates(datesToDelete) {
  if (!Array.isArray(datesToDelete) || datesToDelete.length === 0) {
    return {
      deleted: [],
      message: "Nenhum packet para deletar.",
    };
  }

  const datesFormatted = datesToDelete.map((date) => {
    return formatToSupabaseDate(date);
  });

  const { data, error } = await supabaseAdmin
    .from("packets")
    .delete()
    .in("created_at", datesFormatted)
    .select();

  if (error) {
    throw error;
  }

  return {
    deleted: data,
    message: "Packets deletados com sucesso.",
  };
}