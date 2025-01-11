const EventsIllustration = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="events-illustration">
    {/* Calendar Background */}
    <rect x="20" y="20" width="80" height="80" rx="8" fill="#E8F0FE" />
    <rect x="20" y="20" width="80" height="20" rx="8" fill="#4285F4" />
    
    {/* Calendar Days */}
    <g className="calendar-days">
      {[0, 1, 2].map((row) => (
        [0, 1, 2].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={35 + col * 25}
            y={50 + row * 20}
            width="15"
            height="15"
            rx="2"
            fill={row === 1 && col === 1 ? "#34A853" : "#DADCE0"}
            className="calendar-day"
          />
        ))
      ))}
    </g>
  </svg>
)

export default EventsIllustration 