import "../style/Back.css"
import { gsap } from "gsap";

function Back({coverRef, galleryRef,setAlbumOpen}){
     function voltarParaCapa() {
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
    return(
     <button className="album-back-button" onClick={voltarParaCapa}>
            voltar
    </button>
    )
}

export default Back