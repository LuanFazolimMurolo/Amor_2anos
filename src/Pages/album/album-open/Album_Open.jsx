import "./Album_Open.css";

import { useEffect, useState } from "react";

import HUD from "./HUD/Hud.jsx";
import Pages from "./Pages/Pages.jsx";

import { getAlbumData } from "./Pages/data/push_supabase.js";

// ======================================================
// SINCRONIZANDO OS PACKETS COM O BACK-END
//
// -Essa rota cria os packets que estiverem faltando
// -Depois retorna a lista atualizada do banco
// ======================================================
async function syncPacketsApi() {
  const response = await fetch("/api/packets/sync", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao sincronizar packets.");
  }

  return response.json();
}

// ======================================================
// ABRINDO UM PACKET
//
// -Essa rota marca 1 packet como aberto
// -No seu sistema:
//  used true  = pacote fechado
//  used false = pacote aberto
// ======================================================
async function openPacketApi() {
  const response = await fetch("/api/packets/open", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json().catch(() => {
    return null;
  });

  console.log("RESPONSE OPEN PACKET ---", response);
  console.log("DATA OPEN PACKET ---", data);

  if (!response.ok) {
    throw new Error(data?.details || data?.error || "Erro ao abrir packet.");
  }

  return data;
}

function Album_Open({ coverRef, galleryRef, setAlbumOpen ,albumOpen}) {
  const [packets, setPackets] = useState([]);
  const [albumReloadKey, setAlbumReloadKey] = useState(0);
  // ======================================================
  // GUARDANDO AS CARTAS DO ÁLBUM
  //
  // -Essas cartas são usadas para mostrar o formato bonito
  //  dentro da animação do pacote
  //
  // Observação:
  // -Depois, quando o back-end retornar as cartas sorteadas,
  //  você pode usar as cartas vindas do back-end direto
  // ======================================================
  const [albumCards, setAlbumCards] = useState([]);

  // ======================================================
  // CARREGANDO PACKETS E CARTAS DO ÁLBUM
  //
  // -Carrega os packets para o HUD saber quantos existem
  // -Carrega as cartas para o OpenPacket conseguir exibir
  //  figurinhas reais em vez de IMG 1, IMG 2...
  // ======================================================
  useEffect(() => {
    async function loadInitialData() {
      try {
        const packetsData = await syncPacketsApi();

        console.log("PACKETS VINDOS DO BACK-END ---", packetsData.packets);

        setPackets(packetsData.packets || []);

        const { cards } = await getAlbumData();

        console.log("CARTAS DO ÁLBUM PARA O PACOTE ---", cards);

        setAlbumCards(cards || []);
      } catch (error) {
        console.error("Erro ao carregar dados iniciais do álbum:", error);
      }
    }

    loadInitialData();
  }, []);
function getRandomCards(cards = [], amount = 4) {
  const validCards = cards.filter((card) => {
    return card.image_path;
  });

  const shuffledCards = [...validCards].sort(() => {
    return Math.random() - 0.5;
  });

  return shuffledCards.slice(0, amount);
}
  // ======================================================
  // ABRINDO UM PACOTE
  //
  // Fluxo:
  // -OpenPacket chama essa função antes da animação
  // -Essa função chama o back-end
  // -O back-end altera o packet para used false
  // -Atualiza os packets no front
  // -Retorna as cartas que devem aparecer na animação
  //
  // Importante:
  // -Por enquanto, se o back-end ainda não retorna cards,
  //  usamos as 4 primeiras cartas do álbum só para testar visualmente
  // ======================================================
async function handlePacketOpened() {
  try {
    const openedData = await openPacketApi();

    setPackets(openedData.packets || []);

    const cardsFromBackend = Array.isArray(openedData.cards)
      ? openedData.cards
      : [];

    console.log("CARTAS VINDAS DO BACK-END ---", cardsFromBackend);

    if (cardsFromBackend.length > 0) {
      setAlbumReloadKey((prev) => prev + 1);
    }

    return {
      remainingPackets: openedData.remainingPackets || 0,
      cards: cardsFromBackend,
    };
  } catch (error) {
    console.error("Erro ao abrir packet:", error);

    return {
      remainingPackets: 0,
      cards: [],
    };
  }
}
  return (
    <div className="album-gallery-container" ref={galleryRef}>
      <HUD
        coverRef={coverRef}
        galleryRef={galleryRef}
        albumOpen={albumOpen}
        setAlbumOpen={setAlbumOpen}
        packets={packets}
        onPacketOpened={handlePacketOpened}
      />

      <Pages
        reloadKey={albumReloadKey}
        galleryRef={galleryRef}
        albumOpen={albumOpen}
      />    
      </div>
  );
}

export default Album_Open;