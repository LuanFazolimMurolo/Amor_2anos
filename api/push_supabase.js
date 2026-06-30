import { supabaseAdmin } from "../server/config/supabaseAdmin.js";


// PEGANDO TODOS OS VALORES DO BD
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



// ORGANIZANDO A DATA DE HOJE
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


  // -Retorna a data no formato ano-mês-dia
  return `${year}-${month}-${day}`;
}


// SORTEANDO UM ITEM ALEATÓRIO
function sortRandomItem(items) {
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
}


export async function getTodayIloveyou() {
    const todayDate = getTodayDateBR();

    // VERIFICANDO SE JÁ EXISTE UMA PALAVRA ESCOLHIDA PARA HOJE
      // -Puxa a palavra que está marcada como today true
      // -Confere se a selected_date é igual à data de hoje
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

      // -Se já existir uma palavra escolhida hoje, retorna ela sem sortear outra
    if (currentTodayWord) {
      return {
        word: currentTodayWord,
        alreadySelectedToday: true,
      };
    }
  

    // LIMPANDO A PALAVRA DO DIA ANTERIOR
      // -Todas as palavras que ainda estiverem com today true voltam para false
    const { error: clearTodayError } = await supabaseAdmin
      .from("iloveyous")
      .update({ today: false })
      .eq("today", true);

    if (clearTodayError) {
      throw clearTodayError;
    }


    // BUSCANDO PALAVRAS QUE AINDA NÃO FORAM USADAS
      // -Seleciona todas as palavras que estão com used false
    let { data: availableWords, error: availableWordsError } = await supabaseAdmin
      .from("iloveyous")
      .select("*")
      .eq("used", false);

    if (availableWordsError) {
      throw availableWordsError;
    }
    

    // RESETANDO O CICLO CASO TODAS JÁ TENHAM SIDO USADAS
      // -Se não existir nenhuma palavra disponível, todas voltam para used false
      // -Também limpa today e selected_date para começar um novo ciclo
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


      // BUSCANDO AS PALAVRAS NOVAMENTE APÓS O RESET
        // -Depois de resetar, busca de novo todas as palavras disponíveis
      const { data: resetWords, error: resetWordsError } = await supabaseAdmin
        .from("iloveyous")
        .select("*")
        .eq("used", false);

      if (resetWordsError) {
        throw resetWordsError;
      }

      availableWords = resetWords;
    }


    // SORTEANDO A NOVA PALAVRA DO DIA
      // -Escolhe aleatoriamente uma palavra da lista de palavras disponíveis
    const selectedWord = sortRandomItem(availableWords);


    // ATUALIZANDO A PALAVRA SORTEADA NO BD
      // -Marca a palavra como usada
      // -Marca a palavra como a palavra de hoje
      // -Salva a data em que ela foi escolhida
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


    // RETORNANDO A PALAVRA ESCOLHIDA
      // -Retorna a nova palavra do dia
      // -Informa que ela acabou de ser selecionada hoje
    return {
      word: updatedWord,
      alreadySelectedToday: false,
    };
}


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

export async function postPackets() {
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