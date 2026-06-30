import "./open_packet.css";

import { useRef } from "react";
import gsap from "gsap";

import PacketAnimation from "./packet_animation.jsx";

export default function Open_packet({ packetImages = [], onOpened }) {
  const alreadyOpenedRef = useRef(false);

  const packetRef = useRef(null);
  const packetBodyRef = useRef(null);
  const packetFlapRef = useRef(null);
  const tearLineRef = useRef(null);
  const lightRef = useRef(null);
  const lightCoreRef = useRef(null);
  const photosRef = useRef([]);

  const photos = [
    packetImages[0],
    packetImages[1],
    packetImages[2],
    packetImages[3],
  ];

  function open_packets() {
    if (alreadyOpenedRef.current) return;

    alreadyOpenedRef.current = true;

    const tl = gsap.timeline({
      defaults: {
        ease: "power3.out",
      },
      onComplete: () => {
        if (onOpened) {
          onOpened();
        }
      },
    });

    // Pequeno zoom inicial no pacote
    tl.to(packetRef.current, {
      scale: 1.08,
      duration: 0.25,
    });

    // Tremida antes do rasgo
    tl.to(packetRef.current, {
      rotation: -2,
      duration: 0.08,
      repeat: 5,
      yoyo: true,
      ease: "power1.inOut",
    });

    // Linha do rasgo aparecendo
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

    // Luz começa a sair de dentro do rasgo
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

    // Núcleo da luz fica mais forte
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

    // Abre a aba superior do pacote
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

    // Corpo do pacote abaixa um pouco
    tl.to(
      packetBodyRef.current,
      {
        y: 35,
        scale: 0.96,
        duration: 0.45,
      },
      "-=0.5"
    );

    // A luz explode um pouco mais
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

    // Figurinhas aparecem saindo do centro
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

    // Figurinhas se espalhando pela tela
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

    // Queda leve, como se as figurinhas pousassem
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

    // Pacote volta para escala normal
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

  return (
    <button
      className="Open_packet_container"
      onClick={open_packets}
      type="button"
    >
      <PacketAnimation
        photos={photos}
        packetRef={packetRef}
        packetBodyRef={packetBodyRef}
        packetFlapRef={packetFlapRef}
        tearLineRef={tearLineRef}
        lightRef={lightRef}
        lightCoreRef={lightCoreRef}
        photosRef={photosRef}
      />
    </button>
  );
}