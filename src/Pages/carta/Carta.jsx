import "./Carta.css";

import Linhas from "./obj/Linhas.jsx";
import { useEffect, useRef, useState } from "react";
import cartaTexto from "./carta.txt?raw";
import PergaminhoBase from "./obj/Pergaminho-base.jsx";

function App() {
  const sectionRef = useRef(null);
  const cartaScrollRef = useRef(null);

  const [cartaVisivel, setCartaVisivel] = useState(false);
  const [linhasKey, setLinhasKey] = useState(0);

  const wasVisibleRef = useRef(false);
  const cartaParagrafos = cartaTexto
    .trim()
    .split(/\n\s*\n/);
  // ======================================================
  // ENCAIXE FORÇADO DA CARTA NO TOPO
  //
  // -Quando a Carta entra na tela, força o scroll-snap
  //  a parar exatamente no início dela
  //
  // -Também volta o texto da carta para o começo
  // ======================================================
  useEffect(() => {
    const section = sectionRef.current;
    const cartaScroll = cartaScrollRef.current;

    if (!section || !cartaScroll) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible =
          entry.isIntersecting && entry.intersectionRatio >= 0.55;

        setCartaVisivel(isVisible);

        if (isVisible && !wasVisibleRef.current) {
          setLinhasKey((prev) => prev + 1);

          cartaScroll.scrollTo({
            top: 0,
            behavior: "auto",
          });

          requestAnimationFrame(() => {
            section.scrollIntoView({
              block: "start",
              inline: "nearest",
              behavior: "auto",
            });
          });
        }

        wasVisibleRef.current = isVisible;
      },
      {
        threshold: [0, 0.55],
      }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section className="page-carta-container" ref={sectionRef}>
      {cartaVisivel ? (
        <Linhas
          key={linhasKey}
          sectionRef={sectionRef}
          variant="carta"
        />
      ) : null}

      <div className="carta-scroll-area" ref={cartaScrollRef}>
        <section className="carta-pergaminho">
          <PergaminhoBase position="top" />

         <article className="carta-folha">
            {cartaParagrafos.map((paragrafo, index) => {
              return (
                <p key={index}>
                  {paragrafo}
                </p>
              );
            })}
          </article>

          <PergaminhoBase position="bottom" />
        </section>
      </div>
    </section>
  );
}

export default App;