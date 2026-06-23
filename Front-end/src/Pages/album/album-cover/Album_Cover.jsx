import Textos from "./obj/Textos.jsx";
import Area_Animation from "./obj/Area_Animation.jsx";
import Linhas from "./obj/Linhas.jsx";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

import "./Album_Cover.css"
function Album_Cover({
  
  coverRef,
  coverContentRef,
  areaRef,
  albumOpen,
  setAlbumOpen,
  galleryRef,
  sectionRef
                  }) {

                    useEffect(() => {
                        if (!areaRef.current || !coverContentRef.current) return;

                        const area = areaRef.current;
                        const content = coverContentRef.current;

                        function abrirPreview() {
                          if (albumOpen) return;

                          gsap.to(content, {
                            x: "-4vw",
                            scale: 0.96,
                            duration: 1.1,
                            ease: "power3.out",
                          });
                        }

                        function fecharPreview() {
                          if (albumOpen) return;

                          gsap.to(content, {
                            x: "0vw",
                            scale: 1,
                            duration: 1,
                            ease: "power3.out",
                          });
                        }

                        area.addEventListener("mouseenter", abrirPreview);
                        area.addEventListener("mouseleave", fecharPreview);

                        return () => {
                          area.removeEventListener("mouseenter", abrirPreview);
                          area.removeEventListener("mouseleave", fecharPreview);
                        };
                      }, [albumOpen]);
                      return (
                        <div className="album-cover-screen" ref={coverRef}>
                          <div className="album-cover-content" ref={coverContentRef}>
                            <Textos />
                          </div>

                          <Area_Animation
                            coverRef={coverRef}
                            areaRef={areaRef}
                            albumOpen={albumOpen}
                            setAlbumOpen={setAlbumOpen}
                            galleryRef={galleryRef}
                          />
                          <Linhas sectionRef={sectionRef}/>

                        </div>
                      );
                    }

export default Album_Cover;