import express from "express";
import cors from "cors";
import packets_engine from "./packets/calc_packets.js";
import {
  getIloveyousData,
  getTodayIloveyou,
  getPackets
} from "./push_supabase.js";

const app = express();
const PORT = 3001;

app.use(cors({
  origin: "http://localhost:5173",
}));

app.use(express.json());

//PEGAR todos os dados do BD (Banco de Dados)
app.get("/api/iloveyous", async (req, res) => {
  //Se der certo
  try {
    //data igual ao getIloveyousData
    const data = await getIloveyousData();

    res.json(data);

  } 
  //Se não
  catch (error) {
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



app.get("/api/packets", async (req,res) =>{
  try{
    const data = await getPackets()
    const data_packets = packets_engine(data.packets)
    res.json(data);

  }catch(error){
    console.error("Erro ao buscar palavra do dia:", error);

    res.status(500).json({
      error: "Erro ao buscar palavra do dia.",
      details: error.message,
    });
  }
})


app.post("/api/packets", async (req,res) =>{
  try{
    const data = await getPackets()

    res.json(data);

  }catch(error){
    console.error("Erro ao buscar palavra do dia:", error);

    res.status(500).json({
      error: "Erro ao buscar palavra do dia.",
      details: error.message,
    });
  }
})

app.listen(PORT, () => {
  console.log(`Back-end rodando em http://localhost:${PORT}`);
});