
import "../style/Linhas.css"
import { useEffect, useRef, useState } from "react";
import Albumline from "../imag/album-line.svg";
import useEnterAnimation from "../../../hooks/linhas/useLineAnimation.js";

function Linhas({sectionRef}){
    


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


    return (
        <div className="album-lines-layer">
            <img
                ref={leftLineRef}
                src={Albumline}
                className="album-line album-line-left"
                alt=""
            />
    
            <img
                ref={rightLineRef}
                src={Albumline}
                className="album-line album-line-right"
                alt=""
            />
        </div>
        );
}

export default Linhas