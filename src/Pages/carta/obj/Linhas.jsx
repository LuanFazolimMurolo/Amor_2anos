import "../style/Linhas.css";

import { useRef } from "react";

import Albumline from "../imag/album-line.svg";
import useEnterAnimation from "../../hooks/linhas/useLineAnimation.js";

function Linhas({ sectionRef, variant = "normal" }) {
  const leftLineRef = useRef(null);
  const rightLineRef = useRef(null);

  useEnterAnimation(
    sectionRef,
    [leftLineRef, rightLineRef],
    {
      direction: "left-to-right",
      duration: 3,
      ease: "power3.out",
    }
  );

  const layerClass =
    variant === "carta"
      ? "carta-lines-layer"
      : "album-lines-layer";

  const lineClass =
    variant === "carta"
      ? "carta-line"
      : "album-line";

  return (
    <div className={layerClass}>
      <img
        ref={leftLineRef}
        src={Albumline}
        className={`${lineClass} ${lineClass}-left`}
        alt=""
      />

      <img
        ref={rightLineRef}
        src={Albumline}
        className={`${lineClass} ${lineClass}-right`}
        alt=""
      />
    </div>
  );
}

export default Linhas;