import Packet_img from "../../imag/packet.svg";

export default function PacketAnimation({
  photos,
  packetRef,
  packetBodyRef,
  packetFlapRef,
  tearLineRef,
  lightRef,
  lightCoreRef,
  photosRef,
}) {
  return (
    <div className="packet_scene">
      <div className="packet_photos_area">
        {photos.map((image, index) => (
          <div
            key={index}
            className="packet_photo"
            ref={(el) => {
              photosRef.current[index] = el;
            }}
          >
            {image ? (
              <img src={image} alt={`Figurinha ${index + 1}`} />
            ) : (
              <div className="packet_photo_placeholder">
                IMG {index + 1}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="packet_wrapper" ref={packetRef}>
        <div className="packet_light" ref={lightRef}>
          <div className="packet_light_core" ref={lightCoreRef}></div>
        </div>

        <div className="packet_body" ref={packetBodyRef}>
          <img src={Packet_img} alt="Pacotinho fechado" />
        </div>

        <div className="packet_flap" ref={packetFlapRef}>
          <img src={Packet_img} alt="" />
        </div>

        <div className="packet_tear_line" ref={tearLineRef}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
}