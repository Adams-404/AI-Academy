const WelcomeIllustration = () => (
  <div className="welcome-illustrations">
    {/* Main Center Illustration */}
    <svg className="main-illustration" width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="basiraGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#2563eb', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#1d4ed8', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <circle cx="150" cy="150" r="140" fill="var(--background-secondary)" />
      <g className="network-nodes">
        <circle cx="150" cy="150" r="60" fill="url(#basiraGradient)" fillOpacity="0.2" />
        <circle cx="150" cy="150" r="10" fill="url(#basiraGradient)" className="node main-node" />
        {/* Orbiting Nodes */}
        <g>
          <circle cx="150" cy="70" r="8" fill="url(#basiraGradient)" className="node" />
          <circle cx="230" cy="150" r="8" fill="url(#basiraGradient)" className="node" />
          <circle cx="150" cy="230" r="8" fill="url(#basiraGradient)" className="node" />
          <circle cx="70" cy="150" r="8" fill="url(#basiraGradient)" className="node" />
        </g>
      </g>
    </svg>

    {/* Top Right Floating Elements */}
    <svg className="top-right-elements" width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="basiraGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#2563eb', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#1d4ed8', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <g>
        <rect x="20" y="20" width="30" height="30" rx="8" fill="url(#basiraGradient2)" />
        <circle cx="70" cy="40" r="15" fill="url(#basiraGradient2)" fillOpacity="0.8" />
        <path d="M100 30l15-15 15 15-15 15z" fill="url(#basiraGradient2)" fillOpacity="0.6" />
      </g>
    </svg>

    {/* Bottom Left Code Elements */}
    <svg className="bottom-left-elements" width="200" height="120" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g className="code-elements">
        <rect x="10" y="10" width="180" height="100" rx="8" fill="var(--background-secondary)" />
        <rect x="20" y="20" width="100" height="6" rx="3" fill="url(#basiraGradient)" fillOpacity="0.3" />
        <rect x="20" y="40" width="140" height="6" rx="3" fill="url(#basiraGradient)" fillOpacity="0.3" />
        <rect x="20" y="60" width="80" height="6" rx="3" fill="url(#basiraGradient)" fillOpacity="0.3" />
      </g>
    </svg>

    {/* Top Left AI Elements */}
    <svg className="top-left-elements" width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="basiraGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#2563eb', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#1d4ed8', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <g className="ai-elements">
        <circle cx="60" cy="60" r="50" fill="var(--background-secondary)" />
        <path d="M40 60c0-11 9-20 20-20s20 9 20 20-9 20-20 20-20-9-20-20z" fill="url(#basiraGradient3)" fillOpacity="0.4" />
        <circle cx="60" cy="60" r="10" fill="url(#basiraGradient3)" className="node" />
      </g>
    </svg>

    {/* Bottom Right Data Flow */}
    <svg className="bottom-right-elements" width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g className="data-flow-elements">
        <path d="M20 75h110" stroke="url(#basiraGradient)" strokeWidth="2" strokeOpacity="0.3" />
      </g>
    </svg>
  </div>
)

export default WelcomeIllustration 