const CardPatterns = () => (
  <svg width="0" height="0">
    <defs>
      {/* Grid Pattern */}
      <pattern id="grid-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1"/>
      </pattern>

      {/* Dots Pattern */}
      <pattern id="dots-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1" fill="currentColor" opacity="0.1"/>
      </pattern>

      {/* Circuit Pattern */}
      <pattern id="circuit-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 20 L 30 20 M 20 40 L 20 30" stroke="currentColor" strokeWidth="0.5" opacity="0.1"/>
        <circle cx="20" cy="20" r="1" fill="currentColor" opacity="0.1"/>
      </pattern>

      {/* Wave Pattern */}
      <pattern id="wave-pattern" x="0" y="0" width="100" height="20" patternUnits="userSpaceOnUse">
        <path d="M 0 10 Q 25 0, 50 10 T 100 10" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1"/>
      </pattern>
    </defs>
  </svg>
)

export default CardPatterns 