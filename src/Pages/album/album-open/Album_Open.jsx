import "./Album_Open.css";

import { useEffect, useState } from "react";

import HUD from "./HUD/Hud.jsx";
import Pages from "./Pages/Pages.jsx";

async function getPackets() {
  const response = await fetch("/api/packets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar/adicionar packets.");
  }

  return response.json();
}

function Album_Open({ coverRef, galleryRef, setAlbumOpen }) {
  const [packets, setPackets] = useState([]);

  useEffect(() => {
    async function loadPackets() {
      try {
        const data = await getPackets();

        console.log("PACKETS ---", data.ids_used);

        setPackets(data.ids_used || []);
      } catch (error) {
        console.error("Erro no getPackets:", error);
      }
    }

    loadPackets();
  }, []);



  return (
    <div className="album-gallery-container" ref={galleryRef}>
      <HUD
        coverRef={coverRef}
        galleryRef={galleryRef}
        setAlbumOpen={setAlbumOpen}
        packets={packets} 
      />

      <Pages/>
    </div>
  );
}

export default Album_Open;