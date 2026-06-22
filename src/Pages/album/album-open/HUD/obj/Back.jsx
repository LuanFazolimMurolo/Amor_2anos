import { useRef,useEffect } from "react";
import "../style/Back.css"
import { gsap } from "gsap";

function Back({coverRef, galleryRef,setAlbumOpen,setOpenPacket,openPacket}){
     const btn_back = useRef(null);
     useEffect(()=>{
        if(openPacket){
            btn_back.current.style.color ="#ffffff"
        }else{
            btn_back.current.style.color ="#000000"
        }

     },[openPacket])
     
     function voltarParaCapa() {
        if(openPacket){
            setOpenPacket(false);
            
        }else{
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
    }
    return(
     <button className="album-back-button" onClick={voltarParaCapa} ref={btn_back}>
            voltar
    </button>
    )
}

export default Back