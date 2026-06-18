
import Albumseta from "../imag/album-seta.svg";
import "../style/Textos.css"
function Textos(){

     function Seta() {
        return (
        <img
            src={Albumseta}
            className="album-seta"
            alt=""
        />
        );
    }
    
    return(
        <div className="container-text">
            <p>acessar</p>

            <div className="container-horiz">
            <h1>ALBUM DO AMOR</h1>
            <Seta />
            </div>
        </div>
    )
}

export default Textos