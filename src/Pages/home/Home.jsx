import "./Home.css";

import backgroundImg from "./imag/background.png";
import coupleImg from "./imag/couple.png";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Home() {
  const bgRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.to(bgRef.current, {
      y: 250,
      ease: "none",

      scrollTrigger: {
        trigger: bgRef.current,
        scroller: ".container",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }, []);

  return (
    <section className="home">
      {/* Fundo com parallax */}
      <div className="parallax-bg" ref={bgRef}>
        <img src={backgroundImg} className="home-bg" alt="" />
      </div>

      {/* Texto principal */}
      <div className="home-title">
        <div className="title-left">EU TE</div>
        <div className="title-right">AMO</div>
      </div>

      {/* Casal recortado */}
      <img src={coupleImg} alt="" className="home-couple" />
    </section>
  );
}