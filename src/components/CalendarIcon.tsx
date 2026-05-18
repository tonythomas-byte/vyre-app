interface CalendarIconProps {
  /** Short or full day name, e.g. "Sunday" */
  day: string
  /** Full date string, e.g. "February 8, 2026" */
  date: string
  /** Icon size in px (width; height scales proportionally, default 115) */
  size?: number
  /** Font size for the date text inside the divider gap (default 9) */
  fontSize?: number
}

/**
 * Dynamic SVG calendar icon using the exact brand shape.
 * Date text sits in the divider gap between y=37 and y=55 (midpoint y=46).
 */
export default function CalendarIcon({ day, date, size = 115, fontSize = 9 }: CalendarIconProps) {
  const parsed = new Date(date)
  const isValid = !isNaN(parsed.getTime())

  const formattedDate = isValid
    ? parsed.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : `${day}, ${date}`

  const height = Math.round(size * (106 / 115))

  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 115 106"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={formattedDate}
    >
      {/* Calendar shape */}
      <path
        d="M0 90.1C0 99.11 7.475 106 17.25 106H97.75C107.525 106 115 99.11 115 90.1V55.3212H57.5H0V90.1ZM97.75 10.6H86.25V5.3C86.25 2.12 83.95 0 80.5 0C77.05 0 74.75 2.12 74.75 5.3V10.6H40.25V5.3C40.25 2.12 37.95 0 34.5 0C31.05 0 28.75 2.12 28.75 5.3V10.6H17.25C7.475 10.6 0 17.49 0 26.5V37.1H115V26.5C115 17.49 107.525 10.6 97.75 10.6Z"
        fill="rgba(255,255,255,0.35)"
      />

      {/* Date text in the divider gap between top section (y=37) and bottom section (y=55) */}
      <text
        x="57.5"
        y="46"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="Afacad, Arial, sans-serif"
        fontSize={fontSize}
        fill="white"
        fontWeight="bold"
      >
        {formattedDate}
      </text>
    </svg>
  )
}
