import "./open_packet.css"
import Packet_img from "../../imag/packet.svg";


export default function Open_packet(){
    console.log("click")
    return(
       <button className="Open_packet_container" >
            <img src={Packet_img} />
          </button>
    )
}
