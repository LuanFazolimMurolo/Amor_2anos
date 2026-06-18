import JSONiloveyous from "../json/iloveyous.json"

export function iloveyousDay(){
    function randomBetween(min, max) {
      return Math.random() * (max - min) + min;
    }


    const listaCompleta = [
  ...JSONiloveyous.left,
  ...JSONiloveyous.right
    ];

    function SortedFrase(){
        return listaCompleta[randomBetween(0,listaCompleta.length-1)]
    }
    let Jday = JSONiloveyous.iloveyouDay.EndDay
    let Jfrase = JSONiloveyous.iloveyouDay.fraseDay

    const now = new Date();
    const nowfullDate = now.toLocaleDateString("pt-BR")

    if (Jday == ""){
        Jday = nowfullDate
        Jfrase = SortedFrase()
    }

    return {Jday}

}