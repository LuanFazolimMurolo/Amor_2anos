import "../style/Pergaminho-base.css";

export default function PergaminhoBase({ position = "top" }) {
  return (
    <div className={`pergaminho-base pergaminho-base-${position}`}>
      <div className="pergaminho-base-arc"></div>

      <div className="pergaminho-base-rolo"></div>
    </div>
  );
}