import "./Hud.css";

import Back from "./obj/Back";
import Packet from "./obj/Packet";
import OpenPacket from "./obj/open_packet/open_packet.jsx";

import { useState, useEffect, useMemo } from "react";

function HUD({
  coverRef,
  galleryRef,
  albumOpen,
  setAlbumOpen,
  packets = [],
  onPacketOpened,
}) {
  const [openPacket, setOpenPacket] = useState(false);

  // ======================================================
  // CHAVE PARA RESETAR O COMPONENTE OPENPACKET
  //
  // -Quando ainda tiver pacotes, essa key aumenta
  // -Isso força o React a recriar o OpenPacket do zero
  // -Assim a animação pode rodar novamente
  // ======================================================
  const [packetOpenKey, setPacketOpenKey] = useState(0);

  // ======================================================
  // QUANTOS PACKETS RESTAM APÓS ABRIR UM PACOTE
  //
  // -Esse valor vem do Album_Open
  // -O Album_Open consulta o back-end e retorna a quantidade real
  // ======================================================
  const [remainingPacketsAfterOpen, setRemainingPacketsAfterOpen] =
    useState(null);

  // ======================================================
  // VERIFICANDO SE UM PACKET ESTÁ DISPONÍVEL
  //
  // -Packet disponível é packet com used false
  // -Essa função aceita boolean false e string "false"
  // -Isso evita erro caso o Supabase/back-end mande "false" como texto
  // ======================================================
  function packetEstaDisponivel(packet) {
    if (!packet) {
      return false;
    }

    if (packet.used === false) {
      return true;
    }

    if (packet.used === "false") {
      return true;
    }

    if (packet.used === 0) {
      return true;
    }

    if (packet.used === "0") {
      return true;
    }

    return false;
  }

  // ======================================================
// CALCULANDO QUANTOS PACKETS ESTÃO DISPONÍVEIS
//
// -Usa a lista vinda do banco
// -No seu sistema, used true significa:
//  pacote fechado / pacote ainda disponível
//
// -used false significa:
//  pacote já aberto / pacote já usado
// ======================================================
const packetsDisponiveis = useMemo(() => {
  console.log("PACKETS RECEBIDOS NO HUD:", packets);
  console.table(packets);

  if (!Array.isArray(packets)) {
    console.error("Packets não é um array válido.");
    return 0;
  }

  const packetsFechados = packets.filter((packet) => {
    return packet.used === true;
  });

  console.log("PACKETS FECHADOS / DISPONÍVEIS:", packetsFechados);
  console.log("QUANTIDADE DISPONÍVEL:", packetsFechados.length);

  return packetsFechados.length;
}, [packets]);
  // ======================================================
  // ABRINDO A TELA DO PACOTE
  //
  // -Só abre se existir pacote disponível
  // ======================================================
  function abrirPacote() {
    if (packetsDisponiveis <= 0) {
      console.log("Nenhum pacote disponível para abrir.");
      return;
    }

    console.log("Clicou no pacote");

    setRemainingPacketsAfterOpen(null);
    setOpenPacket(true);
  }

  // ======================================================
    // QUANDO O PACOTE VAI SER ABERTO
    //
    // -Chama a função do Album_Open
    // -O Album_Open fala com o back-end
    // -Recebe quantos packets restam
    // -Recebe as cartas que vão aparecer na animação
    // ======================================================
    async function pacoteFoiAberto() {
      if (!onPacketOpened) {
        return [];
      }

      const result = await onPacketOpened();

      const restam = result?.remainingPackets || 0;
      const cards = result?.cards || [];

      setRemainingPacketsAfterOpen(restam);

      return cards;
    }

  // ======================================================
  // CLIQUE DEPOIS QUE AS CARTAS APARECERAM
  //
  // Se ainda tiver pacote:
  // -Continua na tela de pacotes
  // -Reseta o OpenPacket
  //
  // Se não tiver pacote:
  // -Fecha a tela de pacotes
  // -Volta para o álbum
  // ======================================================
  function finalizarTelaDoPacote() {
    if (remainingPacketsAfterOpen > 0) {
      setPacketOpenKey((prev) => {
        return prev + 1;
      });

      setRemainingPacketsAfterOpen(null);

      return;
    }

    setOpenPacket(false);
  }

  // ======================================================
  // BLOQUEANDO SCROLL ENQUANTO O PACOTE ESTÁ ABERTO
  //
  // -Impede que o scroll mude de página por trás
  // ======================================================
  useEffect(() => {
    if (!openPacket) {
      return;
    }

    const mainContainer = document.querySelector(".container");
    const galleryContainer = galleryRef?.current;

    const previousMainOverflow = mainContainer?.style.overflowY;
    const previousGalleryOverflow = galleryContainer?.style.overflowY;

    if (mainContainer) {
      mainContainer.style.overflowY = "hidden";
    }

    if (galleryContainer) {
      galleryContainer.style.overflowY = "hidden";
    }

    function preventScroll(event) {
      event.preventDefault();
    }

    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });

    return () => {
      if (mainContainer) {
        mainContainer.style.overflowY = previousMainOverflow;
      }

      if (galleryContainer) {
        galleryContainer.style.overflowY = previousGalleryOverflow;
      }

      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
    };
  }, [openPacket, galleryRef]);

  console.log(
    `!${openPacket} && ${packetsDisponiveis} > 0`,
    !openPacket && packetsDisponiveis > 0
  );
  if (!albumOpen) {
  return null;
}
  return (
    <div className="hud-container">
      <Back
        coverRef={coverRef}
        galleryRef={galleryRef}
        albumOpen={albumOpen}
        setAlbumOpen={setAlbumOpen}
        setOpenPacket={setOpenPacket}
        openPacket={openPacket}
      />
      {/* ======================================================
          PACOTINHO PEQUENO

          -Aparece quando não está abrindo pacote
          -Só aparece se ainda tiver pacote disponível
      ====================================================== */}
      {!openPacket && packetsDisponiveis > 0 ? (
        <Packet
          onClick={abrirPacote}
          packetsCount={packetsDisponiveis}
        />
      ) : null}

      {/* ======================================================
          TELA DE ABRIR PACOTE

          -key força reset da animação quando for abrir outro pacote
          -onOpened chama o back-end pelo Album_Open
          -onFinishClick decide se abre outro ou fecha tudo
      ====================================================== */}
    {openPacket ? (
    <OpenPacket
      key={packetOpenKey}
      onOpenPacketRequest={pacoteFoiAberto}
      onFinishClick={finalizarTelaDoPacote}
    />
  ) : null}

   
    </div>
  );
}

export default HUD;