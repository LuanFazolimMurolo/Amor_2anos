import "./Hud.css";

import Back from "./obj/Back";
import Packet from "./obj/Packet";
import OpenPacket from "./obj/open_packet/open_packet.jsx";

import { useState } from "react";

function HUD({ coverRef, galleryRef, setAlbumOpen, packets}) {
  const [openPacket, setOpenPacket] = useState(false);

  function abrirPacote() {
    console.log("Clicou no pacote");
    setOpenPacket(true);
  }

  return (
    <div className="hud-container">
      {!openPacket ? <Packet onClick={abrirPacote} packets={packets}/> : null}
      {openPacket && <OpenPacket />}
      <Back
        coverRef={coverRef}
        galleryRef={galleryRef}
        setAlbumOpen={setAlbumOpen}
        setOpenPacket={setOpenPacket}
        openPacket={openPacket}
      />
       
       
      
    </div>
  );
}

export default HUD;