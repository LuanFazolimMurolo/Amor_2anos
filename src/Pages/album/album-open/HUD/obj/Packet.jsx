import "../style/Packet.css";
import PacketImg from "../imag/packet.svg";

function Packet({ onClick, packetsCount = 0 }) {
  return (
    <button
      className="Packet_container"
      onClick={onClick}
      type="button"
    >
      <h1>{packetsCount}</h1>
      <img src={PacketImg} alt="Pacotinho" />
    </button>
  );
}

export default Packet;