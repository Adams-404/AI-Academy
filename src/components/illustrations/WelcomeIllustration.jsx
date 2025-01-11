const WelcomeIllustration = () => (
  <div className="welcome-illustrations">
    {/* Main Center Illustration */}
    <svg className="main-illustration" width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="150" cy="150" r="140" fill="#E8F0FE" className="pulse" />
      <g className="network-nodes">
        <circle cx="150" cy="150" r="60" fill="#4285F4" fillOpacity="0.2" className="rotate"/>
        <circle cx="150" cy="150" r="10" fill="#4285F4" className="node main-node" />
        {/* Orbiting Nodes */}
        <g className="orbiting-nodes">
          <circle cx="150" cy="70" r="8" fill="#EA4335" className="node orbit-1" />
          <circle cx="230" cy="150" r="8" fill="#FBBC04" className="node orbit-2" />
          <circle cx="150" cy="230" r="8" fill="#34A853" className="node orbit-3" />
          <circle cx="70" cy="150" r="8" fill="#4285F4" className="node orbit-4" />
        </g>
      </g>
    </svg>

    {/* Top Right Floating Elements */}
    <svg className="top-right-elements" width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g className="floating-group-1">
        <rect x="20" y="20" width="30" height="30" rx="8" fill="#EA4335" className="float-1" />
        <circle cx="70" cy="40" r="15" fill="#4285F4" className="float-2" />
        <path d="M100 30l15-15 15 15-15 15z" fill="#34A853" className="float-3" />
      </g>
    </svg>

    {/* Bottom Left Code Elements */}
    <svg className="bottom-left-elements" width="200" height="120" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g className="code-elements">
        <rect x="10" y="10" width="180" height="100" rx="8" fill="#F8F9FA" className="hover-shadow" />
        <rect x="20" y="20" width="100" height="6" rx="3" fill="#DADCE0" className="code-line" />
        <rect x="20" y="40" width="140" height="6" rx="3" fill="#DADCE0" className="code-line" />
        <rect x="20" y="60" width="80" height="6" rx="3" fill="#DADCE0" className="code-line" />
      </g>
    </svg>

    {/* Top Left AI Elements */}
    <svg className="top-left-elements" width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g className="ai-elements">
        <circle cx="60" cy="60" r="50" fill="#E8F0FE" className="pulse" />
        <path d="M40 60c0-11 9-20 20-20s20 9 20 20-9 20-20 20-20-9-20-20z" fill="#4285F4" fillOpacity="0.4" className="rotate" />
        <circle cx="60" cy="60" r="10" fill="#4285F4" className="node" />
      </g>
    </svg>

    {/* Bottom Right Data Flow */}
    <svg className="bottom-right-elements" width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g className="data-flow-elements">
        <path d="M20 75h110" stroke="#DADCE0" strokeWidth="2" className="data-path" />
        <circle cx="40" cy="75" r="4" fill="#4285F4" className="data-particle-1" />
        <circle cx="75" cy="75" r="4" fill="#EA4335" className="data-particle-2" />
        <circle cx="110" cy="75" r="4" fill="#34A853" className="data-particle-3" />
      </g>
    </svg>
  </div>
)

export default WelcomeIllustration 