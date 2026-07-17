import "./open_packet.css";

import { createPortal } from "react-dom";
import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";

import PacketAnimation from "./packet_animation.jsx";

export default function Open_packet({
  onOpenPacketRequest,
  onFinishClick,
}) {
  const alreadyOpenedRef = useRef(false);
  const isAnimatingRef = useRef(false);

  const packetRef = useRef(null);
  const packetBodyRef = useRef(null);
  const packetFlapRef = useRef(null);
  const tearLineRef = useRef(null);
  const lightRef = useRef(null);
  const lightCoreRef = useRef(null);
  const photosRef = useRef([]);

  const [animationFinished, setAnimationFinished] = useState(false);
  const [loadingPacket, setLoadingPacket] = useState(false);

  const [packetCards, setPacketCards] = useState([]);

  // ======================================================
  // CONTROLE PARA RODAR A ANIMAÇÃO
  //
  // -Primeiro o React renderiza as cartas
  // -Depois esse estado libera a animação
  // -Evita o bug das cartas invisíveis
  // ======================================================
  const [shouldRunAnimation, setShouldRunAnimation] = useState(false);

  // ======================================================
  // RODANDO A ANIMAÇÃO APÓS O DOM ATUALIZAR
  //
  // -useLayoutEffect roda depois do React montar os elementos
  // -Dois requestAnimationFrame dão tempo do navegador pintar o DOM
  // ======================================================
  useLayoutEffect(() => {
    if (!shouldRunAnimation) {
      return;
    }

    if (packetCards.length === 0) {
      return;
    }

    const frame1 = requestAnimationFrame(() => {
      const frame2 = requestAnimationFrame(() => {
        open_packets();
      });

      return () => {
        cancelAnimationFrame(frame2);
      };
    });

    return () => {
      cancelAnimationFrame(frame1);
    };
  }, [shouldRunAnimation, packetCards]);

  // ======================================================
  // ANIMAÇÃO DO PACOTE
  //
  // -Não usa alreadyOpenedRef aqui
  // -Quem controla clique é o handleClick
  // -Aqui a função só anima
  // ======================================================
  function open_packets() {
    if (isAnimatingRef.current) {
      return;
    }

    const packet = packetRef.current;
    const packetBody = packetBodyRef.current;
    const packetFlap = packetFlapRef.current;
    const tearLine = tearLineRef.current;
    const light = lightRef.current;
    const lightCore = lightCoreRef.current;

    const photos = photosRef.current.filter(Boolean);

    if (
      !packet ||
      !packetBody ||
      !packetFlap ||
      !tearLine ||
      !light ||
      !lightCore ||
      photos.length === 0
    ) {
      console.log("Refs incompletos para animar o pacote:", {
        packet,
        packetBody,
        packetFlap,
        tearLine,
        light,
        lightCore,
        photos,
      });

      setShouldRunAnimation(false);
      return;
    }

    isAnimatingRef.current = true;

    // ======================================================
    // MATANDO ANIMAÇÕES ANTIGAS
    //
    // -Evita estado antigo do GSAP
    // -Evita carta ficar presa com opacity 0
    // ======================================================
    gsap.killTweensOf([
      packet,
      packetBody,
      packetFlap,
      tearLine,
      light,
      lightCore,
      ...photos,
    ]);

    // ======================================================
    // RESET OBRIGATÓRIO
    //
    // -Esse reset é o que impede as cartas invisíveis
    // -Toda abertura começa do mesmo estado
    // ======================================================
    gsap.set(packet, {
      scale: 1,
      rotation: 0,
    });

    gsap.set(packetBody, {
      y: 0,
      scale: 1,
    });

    gsap.set(packetFlap, {
      rotateX: 0,
      y: 0,
      opacity: 1,
      transformOrigin: "50% 100%",
    });

    gsap.set(tearLine, {
      width: "0%",
      opacity: 0,
    });

    gsap.set(light, {
      opacity: 0,
      scale: 0.2,
    });

    gsap.set(lightCore, {
      opacity: 0,
      scale: 0.4,
    });

    gsap.set(photos, {
      opacity: 0,
      scale: 0.15,
      x: 0,
      y: 0,
      rotation: 0,
    });

    const tl = gsap.timeline({
      defaults: {
        ease: "power3.out",
      },
      onComplete: () => {
        isAnimatingRef.current = false;
        setAnimationFinished(true);
        setShouldRunAnimation(false);
      },
    });

    tl.to(packet, {
      scale: 1.08,
      duration: 0.25,
    });

    tl.to(packet, {
      rotation: -2,
      duration: 0.08,
      repeat: 5,
      yoyo: true,
      ease: "power1.inOut",
    });

    tl.to(
      tearLine,
      {
        width: "78%",
        opacity: 1,
        duration: 0.45,
        ease: "power2.inOut",
      },
      "-=0.1"
    );

    tl.to(
      light,
      {
        opacity: 1,
        scale: 1,
        duration: 0.35,
        ease: "power2.out",
      },
      "-=0.25"
    );

    tl.to(
      lightCore,
      {
        opacity: 1,
        scale: 1.3,
        duration: 0.35,
        ease: "power2.out",
      },
      "<"
    );

    tl.to(
      packetFlap,
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
      packetBody,
      {
        y: 35,
        scale: 0.96,
        duration: 0.45,
      },
      "-=0.5"
    );

    tl.to(
      light,
      {
        scale: 1.8,
        opacity: 0.9,
        duration: 0.55,
        ease: "power2.out",
      },
      "-=0.45"
    );

    tl.to(
      photos,
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

    if (photos[0]) {
      tl.to(
        photos[0],
        {
          x: "-38vw",
          y: "-28vh",
          rotation: -17,
          duration: 0.85,
          ease: "power3.out",
        },
        "-=0.15"
      );
    }

    if (photos[1]) {
      tl.to(
        photos[1],
        {
          x: "-12vw",
          y: "-36vh",
          rotation: 9,
          duration: 0.85,
          ease: "power3.out",
        },
        "<"
      );
    }

    if (photos[2]) {
      tl.to(
        photos[2],
        {
          x: "16vw",
          y: "-32vh",
          rotation: -8,
          duration: 0.85,
          ease: "power3.out",
        },
        "<"
      );
    }

    if (photos[3]) {
      tl.to(
        photos[3],
        {
          x: "38vw",
          y: "-24vh",
          rotation: 15,
          duration: 0.85,
          ease: "power3.out",
        },
        "<"
      );
    }

    tl.to(
      photos,
      {
        y: "+=35",
        duration: 0.45,
        stagger: 0.06,
        ease: "bounce.out",
      },
      "-=0.2"
    );

    tl.to(
      packet,
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
  // -Renderiza as cartas
  // -Depois libera a animação
  //
  // Segundo clique:
  // -Finaliza tela do pacote
  // ======================================================
  async function handleClick() {
    if (loadingPacket || isAnimatingRef.current) {
      return;
    }

    if (!alreadyOpenedRef.current) {
      try {
        alreadyOpenedRef.current = true;

        setLoadingPacket(true);
        setAnimationFinished(false);
        setShouldRunAnimation(false);

        photosRef.current = [];

        const cards = await onOpenPacketRequest?.();

        if (!cards || cards.length === 0) {
          console.log("Nenhuma carta nova disponível para mostrar.");

          alreadyOpenedRef.current = false;
          setLoadingPacket(false);

          return;
        }

        setPacketCards(cards);
        setLoadingPacket(false);

        // Não chama open_packets direto aqui.
        // O useLayoutEffect vai chamar quando o DOM estiver pronto.
        setShouldRunAnimation(true);
      } catch (error) {
        console.error("Erro ao abrir pacote:", error);

        alreadyOpenedRef.current = false;
        setLoadingPacket(false);
        setShouldRunAnimation(false);
      }

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