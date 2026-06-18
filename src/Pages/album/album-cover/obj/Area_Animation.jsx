import "../style/Area_Animation.css"
import { gsap } from "gsap";



function Area_Animation({coverRef,areaRef, albumOpen, setAlbumOpen,galleryRef}){

    function abrirAlbum() {
        setAlbumOpen(true);

        gsap.to(coverRef.current, {
          x: "-100vw",
          scale: 1,
          duration: 1.1,
          ease: "power4.inOut",
        });

        gsap.fromTo(
          galleryRef.current,
          { 
            x: "100vw",
          },
          {
            x: "0vw",
            duration: 1.1,
            ease: "power4.inOut",
          }
        );
    } 
    return(
        <button
          ref={areaRef}
          className="area_animacao"
          onClick={abrirAlbum}
          aria-label="Abrir álbum"
        />
    )
}

export default Area_Animation