import express from "express";
import cors from "cors";

import { packets_engine, packets_used } from "./packets/calc_packets.js";
import {
  getIloveyousData,
  getTodayIloveyou,
  getPackets,
  postPackets,
  deletePacketsByDates,
  openNextPacket,
  countAvailablePackets,
  openNextPacketAndDrawCards,
} from "./push_supabase.js";

const app = express();
const PORT = 3001;

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

// ======================================================
// ROTA: PEGAR TODOS OS ILOVEYOUS
// Método: GET
// ======================================================
app.get("/api/iloveyous", async (req, res) => {
  try {
    const data = await getIloveyousData();

    res.json(data);
  } catch (error) {
    console.error("Erro ao buscar palavras:", error);

    res.status(500).json({
      error: "Erro ao buscar palavras.",
      details: error.message,
    });
  }
});

// ======================================================
// ROTA: PEGAR / SORTEAR PALAVRA DO DIA
// Método: GET
// ======================================================
app.get("/api/iloveyous/today", async (req, res) => {
  try {
    const data = await getTodayIloveyou();

    res.json(data);
  } catch (error) {
    console.error("Erro ao buscar palavra do dia:", error);

    res.status(500).json({
      error: "Erro ao buscar palavra do dia.",
      details: error.message,
    });
  }
});
// ======================================================
// ROTA: PEGAR PACKETS
//
// Método:
// -GET
//
// Faz:
// -Busca todos os packets
// -Não altera o banco
// -Retorna também quantos packets ainda estão disponíveis
// ======================================================
app.get("/api/packets", async (req, res) => {
  try {
    const data = await getPackets();

    const ids_used = packets_used(data.packets);

    const available_count = await countAvailablePackets();

    res.json({
      packets: data.packets,
      ids_used,
      available_count,
    });
  } catch (error) {
    console.error("Erro ao ver packets:", error);

    res.status(500).json({
      error: "Erro ao ver packets.",
      details: error.message,
    });
  }
});
async function syncPacketsController(req, res) {
  try {
    // Busca packets atuais
    const currentData = await getPackets();

    // Calcula o que precisa adicionar e deletar
    const syncResult = packets_engine(currentData.packets);

    // Deleta packets que não deveriam mais existir
    const deletedPackets = await deletePacketsByDates(
      syncResult.dates_to_delete
    );

    // Adiciona packets que estão faltando
    const addedPackets = await postPackets(syncResult.dates_to_add);

    // Busca o banco atualizado
    const updatedData = await getPackets();

    // Pega ids dos packets usados
    const ids_used = packets_used(updatedData.packets);

    res.json({
      message: "Sync dos packets finalizado.",
      sync: syncResult,
      added: addedPackets,
      deleted: deletedPackets,
      packets: updatedData.packets,
      ids_used,
    });
  } catch (error) {
    console.error("Erro ao sincronizar packets:", error);

    res.status(500).json({
      error: "Erro ao sincronizar packets.",
      details: error.message,
    });
  }
}

// ======================================================
// ROTA: SINCRONIZAR PACKETS
// Método: POST
//
// Essa é a rota correta para sincronizar:
// adiciona o que falta e deleta o que sobrou.
// ======================================================
app.post("/api/packets/sync", syncPacketsController);

// ======================================================
// ROTA ANTIGA: POST /api/packets
//
// Mantive essa rota para não quebrar seu front atual.
// Mas o ideal é futuramente usar:
// POST /api/packets/sync
// ======================================================
app.post("/api/packets", syncPacketsController);

// ======================================================
// ROTA: ABRIR PACKET E SORTEAR CARTAS
//
// Método:
// -POST
//
// Faz:
// -Busca 1 packet disponível
// -Sorteia até 4 cartas que ainda não estão em album_my_cards
// -Salva essas cartas em album_my_cards
// -Marca o packet como opened/usado
// -Retorna as cartas para o front
// ======================================================
app.post("/api/packets/open", async (req, res) => {
  try {
    const openedData = await openNextPacketAndDrawCards();

    const updatedData = await getPackets();

    const available_count = await countAvailablePackets();

    res.json({
      success: true,
      message: openedData.message,

      openedPacket: openedData.openedPacket,

      cards: openedData.cards,

      remainingPackets: openedData.remainingPackets,
      available_count,

      packets: updatedData.packets,
    });
  } catch (error) {
    console.error("Erro ao abrir packet:", error);

    res.status(500).json({
      success: false,
      error: "Erro ao abrir packet.",
      details: error.message,
      fullError: error,
    });
  }
});
// ======================================================
// INICIANDO SERVIDOR LOCALMENTE
//
// -No seu computador, continua rodando na porta 3001
// -Na Vercel, o Express vira uma função serverless
// ======================================================

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

// ======================================================
// EXPORTANDO APP PARA A VERCEL
// ======================================================

export default app;