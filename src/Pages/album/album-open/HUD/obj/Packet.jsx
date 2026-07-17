import "../style/Packet.css";
import { createPortal } from "react-dom";

import PacketImg from "../imag/packet.svg";

function Packet({ onClick, packetsCount = 0 }) {
  return createPortal(
    <button
      className="Packet_container"
      onClick={onClick}
      type="button"
    >
      <span className="Packet_count">{packetsCount}</span>

      <img src={PacketImg} alt="Pacotinho" />
    </button>,
    document.body
  );
}

export default Packet;