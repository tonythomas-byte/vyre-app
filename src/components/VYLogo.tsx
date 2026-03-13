export default function VYLogo() {
  return (
    <svg
      width="400"
      height="400"
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-[400px] h-[400px]"
    >
      {/* V shape */}
      <path
        d="M 80 80 L 180 320 L 220 320 L 140 140"
        fill="black"
        stroke="black"
        strokeWidth="2"
      />
      
      {/* Y shape - left stroke */}
      <path
        d="M 200 80 L 240 180 L 240 320"
        fill="none"
        stroke="black"
        strokeWidth="40"
        strokeLinecap="square"
      />
      
      {/* Y shape - right stroke */}
      <path
        d="M 320 80 L 240 180"
        fill="none"
        stroke="black"
        strokeWidth="40"
        strokeLinecap="square"
      />
    </svg>
  )
}
