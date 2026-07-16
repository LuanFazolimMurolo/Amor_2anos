import { useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";

import "../style/Back.css";

function Back({
  coverRef,
  galleryRef,
    albumOpen,
  setAlbumOpen,
  setOpenPacket,
  openPacket,
}) {
  const btn_back = useRef(null);

  useEffect(() => {
    if (!btn_back.current) {
      return;
    }

    if (openPacket) {
      btn_back.current.style.color = "#ffffff";
    } else {
      btn_back.current.style.color = "#000000";
    }
  }, [openPacket]);

  function voltarParaCapa() {
    if (openPacket) {
      setOpenPacket(false);
      return;
    }

    setAlbumOpen(false);

    gsap.to(coverRef.current, {
      x: "0vw",
      scale: 1,
      duration: 1.1,
      ease: "power4.inOut",
    });

    gsap.to(galleryRef.current, {
      x: "100vw",
      duration: 1.1,
      ease: "power4.inOut",
    });

    if (galleryRef.current) {
      galleryRef.current.scrollTop = 0;
    }
  }
if (!albumOpen) {
  return null;
}
  return createPortal(
    <button
      className="album-back-button"
      onClick={voltarParaCapa}
      ref={btn_back}
      type="button"
    >
      voltar
    </button>,
    document.body
  );
}

export default Back;