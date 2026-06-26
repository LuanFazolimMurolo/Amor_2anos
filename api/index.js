import express from "express";
import cors from "cors";

import {
  getIloveyousData,
  getTodayIloveyou,
} from "./push_supabase.js";

const app = express();
const PORT = 3001;

app.use(cors({
  origin: "http://localhost:5173",
}));

app.use(express.json());

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

app.listen(PORT, () => {
  console.log(`Back-end rodando em http://localhost:${PORT}`);
});