import './Time.css'
import useLineAnimation from "../hooks/linhas/useLineAnimation";
import SvgLinhas from "../hooks/linhas/SvgLinhas";
import Fireworks from "../hooks/Fireworks.jsx";

import { useRef, useEffect, useState, memo } from "react";

import { iloveyousDay }  from './js/iloveyous.jsx';

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import florAnimada from "./flor_animada.gif";
import JSONiloveyous from "./json/iloveyous.json"

import { getDateAndCountdown } from "./js/calc-time.js";

gsap.registerPlugin(ScrollTrigger);



// ILOVEYOUS
const leftLoveElems = JSONiloveyous.left.map((text, index) => (
  <p key={`l-${index}`}>{text}</p>
));
const rightLoveElems = JSONiloveyous.right.map((text, index) => (
  <p key={`r-${index}`}>{text}</p>
));
const Iloveyous = memo(function Iloveyous() {
  return (
    <>
      <div className="iloveyous left">{leftLoveElems}</div>
      <div className="iloveyous right">{rightLoveElems}</div>
    </>
  );
});

function App() {

  const sectionRef = useRef(null);

  const topLineRef = useRef(null);
  const bottomLineRef = useRef(null);

  const [timeData, setTimeData] = useState(getDateAndCountdown());

  // MISSING TIME
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeData(getDateAndCountdown());
      iloveyousDay;
    }, 1000);
    
      console.log(iloveyousDay())
      console.log(JSONiloveyous.iloveyouDay)


    return () => clearInterval(interval);
  }, []);

  

  // FLOR A

  function Flor_animacao() {

    return (

      <img
        src={florAnimada}
        alt="Flor animada"
        className="flor-animacao"
      />
    );
  }

  // ano
  function Idade() {
    return (
      <div className={`anos ${timeData.niverday ? "aniversario" : ""}`}>
              <p>NOSSO ANIVERSÁRIO!!</p>
              <h1>{timeData.age.ageString}</h1>
              <p>ANOS</p>

      </div>
    );
  }


  // textos e informações
  function Textos_informacoes() {
    return (
      <div className={`textos_informacoes ${timeData.niverday ? "aniversario" : ""}`}>
        <div className="data-hoje">
            <h3>{timeData.currentDate.fullDate} - {timeData.currentDate.weekDay}</h3>
        </div>

         <div className="tempo-faltando">
            <h1>{timeData.countdown.daysUntil}d</h1>
            <h1>{timeData.countdown.hoursUntil}h</h1> 
            <h1>{timeData.countdown.minutesUntil}m</h1> 
            <h1>{timeData.countdown.secondsUntil}s</h1>
        </div>

         <div className="iloveyou-random">
            <h3>Eu Te Amo</h3>

        </div>
      
      </div>
    )
  }



  // animaçao entrada linhas
  useLineAnimation(
    sectionRef,
    [topLineRef, bottomLineRef]
  );



 




  return (  


    <div className="time-container" ref={sectionRef}>
       <Fireworks active={timeData.niverday} />
      <Flor_animacao />
      <Idade />
     
      <Iloveyous />

      <Textos_informacoes />

    </div>
  )
}

export default App