const LearningPathIllustration = () => (
  <div className="learning-path-illustrations">
    {/* Main Path SVG */}
    <svg className="path-illustration" width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background Circle */}
      <circle cx="150" cy="150" r="140" fill="#F8F9FA" />
      
      {/* Learning Path */}
      <path
        className="progress-path"
        d="M60,150 C60,100 120,100 150,150 C180,200 240,200 240,150"
        stroke="#4285F4"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Progress Points */}
      <g className="progress-points">
        <circle cx="60" cy="150" r="12" fill="#EA4335" className="progress-point start-point" />
        <circle cx="150" cy="150" r="12" fill="#FBBC04" className="progress-point middle-point" />
        <circle cx="240" cy="150" r="12" fill="#34A853" className="progress-point end-point" />
      </g>

      {/* AI Elements */}
      <g className="ai-elements">
        <rect x="85" y="100" width="30" height="30" rx="8" fill="#4285F4" fillOpacity="0.2" className="hover-lift" />
        <rect x="185" y="100" width="30" height="30" rx="8" fill="#34A853" fillOpacity="0.2" className="hover-lift" />
        <rect x="135" y="180" width="30" height="30" rx="8" fill="#FBBC04" fillOpacity="0.2" className="hover-lift" />
      </g>
    </svg>

    {/* Floating Elements */}
    <svg className="floating-elements" width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g className="code-particles">
        <circle cx="20" cy="20" r="6" fill="#EA4335" className="float-1" />
        <circle cx="80" cy="80" r="6" fill="#34A853" className="float-2" />
        <rect x="80" y="20" width="12" height="12" rx="4" fill="#4285F4" className="float-3" />
        <rect x="20" y="80" width="12" height="12" rx="4" fill="#FBBC04" className="float-4" />
      </g>
    </svg>

    {/* Connection Lines */}
    <svg className="connection-lines" width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g className="grid-lines">
        <line x1="0" y1="75" x2="300" y2="75" stroke="#DADCE0" strokeWidth="1" />
        <line x1="0" y1="150" x2="300" y2="150" stroke="#DADCE0" strokeWidth="1" />
        <line x1="0" y1="225" x2="300" y2="225" stroke="#DADCE0" strokeWidth="1" />
      </g>
    </svg>
  </div>
)

export default LearningPathIllustration 