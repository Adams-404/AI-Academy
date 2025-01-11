const ProgressGraph = ({ progress }) => (
  <svg width="100%" height="120" viewBox="0 0 400 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Grid Lines */}
    <g className="grid-lines">
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={i}
          x1="0"
          y1={30 + i * 20}
          x2="400"
          y2={30 + i * 20}
          stroke="#E8F0FE"
          strokeWidth="1"
        />
      ))}
    </g>

    {/* Progress Path */}
    <path
      d="M0 100 Q100 80 200 60 T400 20"
      stroke="#4285F4"
      strokeWidth="3"
      fill="none"
      className="progress-path"
    />

    {/* Progress Fill */}
    <path
      d="M0 120 L0 100 Q100 80 200 60 T400 20 L400 120 Z"
      fill="url(#progressGradient)"
      fillOpacity="0.1"
      className="progress-fill"
    />

    {/* Progress Points */}
    <g className="progress-points">
      {[0, 25, 50, 75, 100].map((point, i) => (
        <circle
          key={i}
          cx={point * 4}
          cy={100 - point * 0.8}
          r="6"
          fill={point <= progress ? "#4285F4" : "#E8F0FE"}
          stroke="#FFFFFF"
          strokeWidth="2"
          className="progress-point"
        />
      ))}
    </g>

    {/* Gradient Definition */}
    <defs>
      <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#4285F4" />
        <stop offset="100%" stopColor="#4285F4" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
)

export default ProgressGraph 