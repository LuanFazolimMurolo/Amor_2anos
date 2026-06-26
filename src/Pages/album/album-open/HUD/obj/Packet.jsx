import "../style/Packet.css";

import Packet_img from "../imag/packet.svg";

function Packet({ onClick }) {
  return (
    <button className="Packet_container" onClick={onClick}>
      <h1>10</h1>
      <img src={Packet_img} alt="Pacotinho" />
    </button>
  );
}

export default Packet;