import { supabaseAdmin } from "../server/config/supabaseAdmin.js";

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

function sortRandomItem(items) {
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
}

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

export async function getTodayIloveyou() {
  const todayDate = getTodayDateBR();

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

  if (currentTodayWord) {
    return {
      word: currentTodayWord,
      alreadySelectedToday: true,
    };
  }

  const { error: clearTodayError } = await supabaseAdmin
    .from("iloveyous")
    .update({ today: false })
    .eq("today", true);

  if (clearTodayError) {
    throw clearTodayError;
  }

  let { data: availableWords, error: availableWordsError } = await supabaseAdmin
    .from("iloveyous")
    .select("*")
    .eq("used", false);

  if (availableWordsError) {
    throw availableWordsError;
  }

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

  const selectedWord = sortRandomItem(availableWords);

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