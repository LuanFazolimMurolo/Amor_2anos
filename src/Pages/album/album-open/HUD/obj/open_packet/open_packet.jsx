import "./open_packet.css";
import { createPortal } from "react-dom";
import { useRef, useState } from "react";
import gsap from "gsap";

import PacketAnimation from "./packet_animation.jsx";

export default function Open_packet({
  onOpenPacketRequest,
  onFinishClick,
}) {
  const alreadyOpenedRef = useRef(false);

  const packetRef = useRef(null);
  const packetBodyRef = useRef(null);
  const packetFlapRef = useRef(null);
  const tearLineRef = useRef(null);
  const lightRef = useRef(null);
  const lightCoreRef = useRef(null);
  const photosRef = useRef([]);

  const [animationFinished, setAnimationFinished] = useState(false);
  const [loadingPacket, setLoadingPacket] = useState(false);

  // ======================================================
  // CARTAS QUE VÃO APARECER NA ANIMAÇÃO
  //
  // -Começa vazio
  // -Quando clica para abrir, busca as cartas no Album_Open
  // -Depois passa para o PacketAnimation
  // ======================================================
  const [packetCards, setPacketCards] = useState([]);

  // ======================================================
  // ANIMAÇÃO DO PACOTE
  //
  // -Só roda depois que as cartas já foram carregadas
  // ======================================================
  function open_packets() {
    if (alreadyOpenedRef.current) {
      return;
    }

    alreadyOpenedRef.current = true;

    const tl = gsap.timeline({
      defaults: {
        ease: "power3.out",
      },
      onComplete: () => {
        setAnimationFinished(true);
      },
    });

    tl.to(packetRef.current, {
      scale: 1.08,
      duration: 0.25,
    });

    tl.to(packetRef.current, {
      rotation: -2,
      duration: 0.08,
      repeat: 5,
      yoyo: true,
      ease: "power1.inOut",
    });

    tl.to(
      tearLineRef.current,
      {
        width: "78%",
        opacity: 1,
        duration: 0.45,
        ease: "power2.inOut",
      },
      "-=0.1"
    );

    tl.to(
      lightRef.current,
      {
        opacity: 1,
        scale: 1,
        duration: 0.35,
        ease: "power2.out",
      },
      "-=0.25"
    );

    tl.to(
      lightCoreRef.current,
      {
        opacity: 1,
        scale: 1.3,
        duration: 0.35,
        ease: "power2.out",
      },
      "<"
    );

    tl.to(
      packetFlapRef.current,
      {
        rotateX: -125,
        y: -42,
        opacity: 0.92,
        duration: 0.75,
        transformOrigin: "50% 100%",
        ease: "back.out(1.5)",
      },
      "-=0.1"
    );

    tl.to(
      packetBodyRef.current,
      {
        y: 35,
        scale: 0.96,
        duration: 0.45,
      },
      "-=0.5"
    );

    tl.to(
      lightRef.current,
      {
        scale: 1.8,
        opacity: 0.9,
        duration: 0.55,
        ease: "power2.out",
      },
      "-=0.45"
    );

    tl.to(
      photosRef.current,
      {
        opacity: 1,
        scale: 1,
        y: 0,
        stagger: 0.08,
        duration: 0.35,
        ease: "back.out(1.8)",
      },
      "-=0.4"
    );

    tl.to(
      photosRef.current[0],
      {
        x: "-38vw",
        y: "-28vh",
        rotation: -17,
        duration: 0.85,
        ease: "power3.out",
      },
      "-=0.15"
    );

    tl.to(
      photosRef.current[1],
      {
        x: "-12vw",
        y: "-36vh",
        rotation: 9,
        duration: 0.85,
        ease: "power3.out",
      },
      "<"
    );

    tl.to(
      photosRef.current[2],
      {
        x: "16vw",
        y: "-32vh",
        rotation: -8,
        duration: 0.85,
        ease: "power3.out",
      },
      "<"
    );

    tl.to(
      photosRef.current[3],
      {
        x: "38vw",
        y: "-24vh",
        rotation: 15,
        duration: 0.85,
        ease: "power3.out",
      },
      "<"
    );

    tl.to(
      photosRef.current,
      {
        y: "+=35",
        duration: 0.45,
        stagger: 0.06,
        ease: "bounce.out",
      },
      "-=0.2"
    );

    tl.to(
      packetRef.current,
      {
        scale: 1,
        rotation: 0,
        duration: 0.3,
      },
      "-=0.4"
    );
  }

  // ======================================================
  // CLIQUE NA TELA DO PACOTE
  //
  // Primeiro clique:
  // -Chama o back-end
  // -Recebe as cartas
  // -Atualiza packetCards
  // -Roda a animação
  //
  // Segundo clique depois da animação:
  // -Chama o HUD para decidir se abre outro pacote ou fecha tudo
  // ======================================================
  async function handleClick() {
    if (loadingPacket) {
      return;
    }

    if (!alreadyOpenedRef.current) {
      setLoadingPacket(true);

      const cards = await onOpenPacketRequest?.();

      if (!cards || cards.length === 0) {
        console.log("Nenhuma carta nova disponível para mostrar.");

        setLoadingPacket(false);

        return;
      }

      setPacketCards(cards);

      setLoadingPacket(false);

      requestAnimationFrame(() => {
        open_packets();
      });

      return;
    }

    if (animationFinished) {
      onFinishClick?.();
    }
  }

  return createPortal(
    <button
      className="Open_packet_container"
      onClick={handleClick}
      type="button"
    >
      <PacketAnimation
        photos={packetCards}
        packetRef={packetRef}
        packetBodyRef={packetBodyRef}
        packetFlapRef={packetFlapRef}
        tearLineRef={tearLineRef}
        lightRef={lightRef}
        lightCoreRef={lightCoreRef}
        photosRef={photosRef}
      />
    </button>,
    document.body
  );
}