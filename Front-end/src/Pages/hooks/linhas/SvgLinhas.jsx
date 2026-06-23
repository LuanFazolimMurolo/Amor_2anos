export default function SvgLinhas({ pathRef }) {
  return (
    <svg viewBox="0 0 400 200">
    <path
      ref={pathRef}
      d="
        M0 190
        C60 120, 120 100, 180 110
        C240 125, 290 125, 340 80
        C370 55, 390 25, 400 0
      "
      fill="none"
      stroke="#d8b28a"
      strokeWidth="8"
      strokeLinecap="round"
    />
  </svg>
  );
}