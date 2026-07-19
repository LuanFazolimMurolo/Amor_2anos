import { supabaseAdmin } from "../server/config/supabaseAdmin.js";
import { randomInt } from "crypto";
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

  // ======================================================
  // LIMPANDO PALAVRAS ANTIGAS MARCADAS COMO TODAY
  // -Remove today de palavras que não são da data de hoje
  // ======================================================
  const { error: clearOldTodayError } = await supabaseAdmin
    .from("iloveyous")
    .update({ today: false })
    .eq("today", true)
    .neq("selected_date", todayDate);

  if (clearOldTodayError) {
    throw clearOldTodayError;
  }

  // ======================================================
  // VERIFICANDO SE JÁ EXISTE PALAVRA ESCOLHIDA PARA HOJE
  // -Busca palavras com today true e selected_date igual a hoje
  // ======================================================
  const { data: todayWords, error: todayWordsError } = await supabaseAdmin
    .from("iloveyous")
    .select("*")
    .eq("today", true)
    .eq("selected_date", todayDate)
    .order("id", { ascending: true });

  if (todayWordsError) {
    throw todayWordsError;
  }

  // ======================================================
  // SE JÁ EXISTIR UMA PALAVRA DE HOJE
  // -Retorna a primeira palavra encontrada
  // ======================================================
  if (todayWords && todayWords.length > 0) {
    return {
      word: todayWords[0],
      alreadySelectedToday: true,
    };
  }

  // ======================================================
  // LIMPANDO QUALQUER TODAY RESTANTE
  // -Garante que nenhuma palavra antiga fique marcada como today
  // ======================================================
  const { error: clearTodayError } = await supabaseAdmin
    .from("iloveyous")
    .update({ today: false })
    .eq("today", true);

  if (clearTodayError) {
    throw clearTodayError;
  }

  // ======================================================
  // BUSCANDO PALAVRAS QUE AINDA NÃO FORAM USADAS
  // -Seleciona todas as palavras com used false
  // ======================================================
  let { data: availableWords, error: availableWordsError } = await supabaseAdmin
    .from("iloveyous")
    .select("*")
    .eq("used", false);

  if (availableWordsError) {
    throw availableWordsError;
  }

  // ======================================================
  // RESETANDO O CICLO CASO TODAS JÁ TENHAM SIDO USADAS
  // -Se todas estiverem used true, reseta todas para used false
  // ======================================================
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

  // ======================================================
  // SORTEANDO UMA NOVA PALAVRA DO DIA
  // -Escolhe uma palavra aleatória entre as disponíveis
  // ======================================================
  const selectedWord = sortRandomItem(availableWords);

  // ======================================================
  // ATUALIZANDO A PALAVRA SORTEADA NO BANCO
  // -Marca used como true
  // -Marca today como true
  // -Salva a data de hoje em selected_date
  // ======================================================
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

  // ======================================================
  // RETORNANDO A PALAVRA SORTEADA
  // -Informa que uma nova palavra foi escolhida agora
  // ======================================================
  return {
    word: updatedWord,
    alreadySelectedToday: false,
  };
}
// ======================================================
// PEGANDO TODOS OS PACKETS DO BANCO
//
// -Busca todos os packets da tabela packets
// -Usa apenas as colunas existentes:
//  id, used e created_at
// -Ordena pelo id para manter uma ordem simples
// ======================================================
export async function getPackets() {
  const { data: packets, error } = await supabaseAdmin
    .from("packets")
    .select("id, used, created_at")
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
//
// Exemplo:
// -18-05-2026 vira 2026-05-18
//
// Observação:
// -Mesmo a coluna se chamando created_at,
//  aqui ela está sendo usada como a data do packet
// ======================================================
function formatToSupabaseDate(date) {
  const [day, month, year] = date.split("-");
  return `${year}-${month}-${day}`;
}

// ======================================================
// ADICIONA PACKETS QUE ESTÃO FALTANDO
//
// Recebe:
// -Lista de datas em DD-MM-YYYY
//
// Faz:
// -Converte para YYYY-MM-DD
// -Insere na tabela packets
// -Packet novo sempre entra com used false
//
// Importante:
// -used false significa que o pacote ainda pode ser aberto
// ======================================================
// ======================================================
// ADICIONA PACKETS QUE ESTÃO FALTANDO
//
// Recebe:
// -Lista de datas em DD-MM-YYYY
//
// Faz:
// -Converte para YYYY-MM-DD
// -Insere na tabela packets
//
// IMPORTANTE:
// -No seu sistema, used true significa que o pacote está fechado
// -Então pacote novo precisa nascer com used true
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

  // ======================================================
  // IMPORTANTE:
  //
  // Aqui precisa ser INSERT, não UPSERT.
  //
  // Motivo:
  // -No dia 18/07 podem existir 5 packets com a mesma data
  // -Se usar upsert com onConflict created_at, ele ignora duplicados
  // ======================================================
  const { data, error } = await supabaseAdmin
    .from("packets")
    .insert(rowsToInsert)
    .select("id, used, created_at");

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
//
// Recebe:
// -Lista de datas em DD-MM-YYYY
//
// Faz:
// -Converte as datas para YYYY-MM-DD
// -Deleta packets pela coluna created_at
//
// Observação:
// -Isso é usado apenas na sincronização
// -Abrir packet NÃO deleta nada
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
    .select("id, used, created_at");

  if (error) {
    throw error;
  }

  return {
    deleted: data,
    message: "Packets deletados com sucesso.",
  };
}

// ======================================================
// CONTANDO PACKETS DISPONÍVEIS
//
// -No seu sistema, used true significa:
//  pacote fechado / pacote ainda disponível
//
// -Então essa função conta quantos packets ainda estão
//  com used true
// ======================================================
export async function countAvailablePackets() {
  const { data: packets, error } = await supabaseAdmin
    .from("packets")
    .select("id")
    .eq("used", true);

  if (error) {
    throw error;
  }

  return packets?.length || 0;
}

// ======================================================
// ABRINDO O PRÓXIMO PACKET DISPONÍVEL
//
// Fluxo:
// 1. Busca o primeiro packet com used true.
// 2. used true significa pacote fechado.
// 3. Se não existir pacote fechado, retorna sem erro.
// 4. Se existir, muda used para false.
// 5. used false significa pacote já aberto.
// 6. Conta quantos pacotes ainda restam.
// 7. Retorna o packet aberto e a quantidade restante.
//
// Importante:
// -Usa somente id, used e created_at.
// -Não usa available_at.
// -Não usa opened_at.
// -Não usa modified_at.
// -Não deleta nada.
// ======================================================
export async function openNextPacket() {
  // ======================================================
  // BUSCANDO O PRIMEIRO PACKET FECHADO
  //
  // -Procura packet com used true
  // -Ordena pelo id para abrir sempre o mais antigo primeiro
  // -maybeSingle evita erro caso não encontre nenhum packet
  // ======================================================
  const { data: selectedPacket, error: selectPacketError } =
    await supabaseAdmin
      .from("packets")
      .select("id, used, created_at")
      .eq("used", true)
      .order("id", { ascending: true })
      .limit(1)
      .maybeSingle();

  if (selectPacketError) {
    throw selectPacketError;
  }

  // ======================================================
  // CASO NÃO EXISTA PACKET DISPONÍVEL
  //
  // -Não retorna erro 500
  // -Apenas avisa o front que não tem packet para abrir
  // ======================================================
  if (!selectedPacket) {
    return {
      openedPacket: null,
      remainingPackets: 0,
      message: "Nenhum packet disponível para abrir.",
    };
  }

  // ======================================================
  // MARCANDO O PACKET COMO ABERTO
  //
  // -Pega o packet encontrado acima
  // -Altera used de true para false
  // -eq("used", true) evita abrir de novo um pacote já aberto
  //
  // Observação:
  // -Aqui eu não uso .single()
  // -Assim evitamos erro 500 caso o update não retorne linha
  // ======================================================
  const { data: updatedPackets, error: updatePacketError } =
    await supabaseAdmin
      .from("packets")
      .update({
        used: false,
      })
      .eq("id", selectedPacket.id)
      .eq("used", true)
      .select("id, used, created_at");

  if (updatePacketError) {
    throw updatePacketError;
  }

  const openedPacket = updatedPackets?.[0] || null;

  // ======================================================
  // CASO O UPDATE NÃO TENHA ALTERADO NENHUMA LINHA
  //
  // -Isso evita quebrar o back-end
  // -Pode acontecer se o packet já foi alterado antes
  // ======================================================
  if (!openedPacket) {
    const remainingPackets = await countAvailablePackets();

    return {
      openedPacket: null,
      remainingPackets,
      message: "Nenhum packet foi alterado.",
    };
  }

  // ======================================================
  // CONTANDO QUANTOS PACKETS AINDA RESTAM
  //
  // -Depois de abrir 1 packet, conta os que continuam used true
  // ======================================================
  const remainingPackets = await countAvailablePackets();

  // ======================================================
  // RETORNANDO RESULTADO PARA A ROTA
  // ======================================================
  return {
    openedPacket,
    remainingPackets,
    message: "Packet aberto com sucesso.",
  };
}

// ======================================================
// SORTEANDO ITENS DE UM ARRAY COM CRYPTO
//
// -Usa Fisher-Yates
// -Usa crypto.randomInt para evitar sorteio previsível
// -Retorna apenas a quantidade pedida
// ======================================================
function drawRandomItems(items = [], amount = 4) {
  const shuffledItems = [...items];

  for (let index = shuffledItems.length - 1; index > 0; index--) {
    const randomIndex = randomInt(0, index + 1);

    const temp = shuffledItems[index];
    shuffledItems[index] = shuffledItems[randomIndex];
    shuffledItems[randomIndex] = temp;
  }

  return shuffledItems.slice(0, amount);
}
// ======================================================
// ABRINDO PACKET E SORTEANDO CARTAS
//
// Regra principal:
//
// -Só sorteia cartas que NÃO existem em album_my_cards
// -Não repete carta
// -Sorteia até 4 cartas
// -Se tiver menos de 4 cartas disponíveis, sorteia as que restarem
//
// Regra dos packets:
//
// -used true  = pacote fechado/disponível
// -used false = pacote aberto/usado
// ======================================================
export async function openNextPacketAndDrawCards() {
  // ======================================================
  // 1. BUSCANDO 1 PACKET DISPONÍVEL
  // ======================================================
  const { data: selectedPacket, error: selectPacketError } =
    await supabaseAdmin
      .from("packets")
      .select("id, used, created_at")
      .eq("used", true)
      .order("id", { ascending: true })
      .limit(1)
      .maybeSingle();

  if (selectPacketError) {
    throw selectPacketError;
  }

  if (!selectedPacket) {
    return {
      openedPacket: null,
      cards: [],
      remainingPackets: 0,
      message: "Nenhum packet disponível para abrir.",
    };
  }

  // ======================================================
  // 2. BUSCANDO TODAS AS CARTAS CADASTRADAS
  //
  // -Essas são as cartas possíveis de sair no pacote
  // ======================================================
  const { data: allCards, error: allCardsError } = await supabaseAdmin
    .from("album_cards")
    .select("*")
    .order("order_index", { ascending: true })
    .order("id", { ascending: true });

  if (allCardsError) {
    throw allCardsError;
  }

  // ======================================================
  // 3. BUSCANDO AS CARTAS QUE VOCÊ JÁ TEM
  //
  // -album_my_cards guarda as cartas já desbloqueadas
  // ======================================================
  const { data: myCards, error: myCardsError } = await supabaseAdmin
    .from("album_my_cards")
    .select("card_id");

  if (myCardsError) {
    throw myCardsError;
  }

  const ownedCardIds = new Set(
    (myCards || []).map((item) => {
      return item.card_id;
    })
  );

  // ======================================================
  // 4. FILTRANDO APENAS CARTAS QUE VOCÊ AINDA NÃO TEM
  // ======================================================
  const availableCards = (allCards || []).filter((card) => {
    return !ownedCardIds.has(card.id);
  });

  if (availableCards.length === 0) {
    const remainingPackets = await countAvailablePackets();

    return {
      openedPacket: null,
      cards: [],
      remainingPackets,
      message: "Não existem cartas novas disponíveis para sortear.",
    };
  }

  // ======================================================
  // 5. SORTEANDO ATÉ 4 CARTAS
  //
  // Exemplo:
  // -Se tiver 20 cartas disponíveis, sorteia 4
  // -Se tiver 2 cartas disponíveis, sorteia 2
  // ======================================================
  const cardsToDrawAmount = Math.min(4, availableCards.length);

  const drawnCards = drawRandomItems(
    availableCards,
    cardsToDrawAmount
  );
  console.log("CARTAS DISPONÍVEIS PARA SORTEIO:", availableCards.map((card) => card.id));
  console.log("CARTAS SORTEADAS:", drawnCards.map((card) => card.id));

  // ======================================================
  // 6. SALVANDO AS CARTAS SORTEADAS EM album_my_cards
  //
  // -Usa upsert com onConflict em card_id
  // -Evita carta duplicada caso clique duas vezes rápido
  // ======================================================
  const rowsToInsert = drawnCards.map((card) => {
    return {
      card_id: card.id,
    };
  });

  const { error: insertMyCardsError } = await supabaseAdmin
    .from("album_my_cards")
    .upsert(rowsToInsert, {
      onConflict: "card_id",
      ignoreDuplicates: true,
    });

  if (insertMyCardsError) {
    throw insertMyCardsError;
  }

  // ======================================================
  // 7. MARCANDO O PACKET COMO ABERTO
  //
  // -Depois que as cartas foram salvas
  // -Muda used true para false
  // ======================================================
  const { data: updatedPackets, error: updatePacketError } =
    await supabaseAdmin
      .from("packets")
      .update({
        used: false,
      })
      .eq("id", selectedPacket.id)
      .eq("used", true)
      .select("id, used, created_at");

  if (updatePacketError) {
    throw updatePacketError;
  }

  const openedPacket = updatedPackets?.[0] || null;

  const remainingPackets = await countAvailablePackets();

  // ======================================================
  // 8. RETORNANDO AS CARTAS PARA O FRONT
  //
  // -O front vai receber cards: [...]
  // -Essas cartas aparecem na animação do pacote
  // ======================================================
  return {
    openedPacket,
    cards: drawnCards,
    remainingPackets,
    message: "Packet aberto e cartas sorteadas com sucesso.",
  };
}