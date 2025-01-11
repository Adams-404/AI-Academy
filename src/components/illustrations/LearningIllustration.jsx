const LearningIllustration = () => (
  <svg width="500" height="400" viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Background */}
    <path className="bg-shape" 
      d="M50 100c0-27.6 22.4-50 50-50h300c27.6 0 50 22.4 50 50v200c0 27.6-22.4 50-50 50H100c-27.6 0-50-22.4-50-50V100z" 
      fill="#F8F9FA"
    />

    {/* Code Window */}
    <g className="code-window">
      <rect x="100" y="120" width="300" height="200" rx="8" fill="white" stroke="#DADCE0" strokeWidth="2"/>
      <rect x="100" y="120" width="300" height="40" rx="8" fill="#4285F4" />
      
      {/* Window Controls */}
      <circle cx="120" cy="140" r="4" fill="#EA4335"/>
      <circle cx="135" cy="140" r="4" fill="#FBBC04"/>
      <circle cx="150" cy="140" r="4" fill="#34A853"/>

      {/* Code Lines */}
      <g className="code-lines">
        <rect x="120" y="180" width="120" height="6" rx="3" fill="#DADCE0" className="code-line"/>
        <rect x="120" y="200" width="200" height="6" rx="3" fill="#DADCE0" className="code-line"/>
        <rect x="120" y="220" width="160" height="6" rx="3" fill="#DADCE0" className="code-line"/>
        <rect x="120" y="240" width="180" height="6" rx="3" fill="#DADCE0" className="code-line"/>
      </g>
    </g>

    {/* AI Brain */}
    <g className="ai-brain" transform="translate(350, 80)">
      <circle cx="0" cy="0" r="40" fill="#4285F4" fillOpacity="0.2"/>
      <path d="M-20 0c0-11 9-20 20-20s20 9 20 20-9 20-20 20-20-9-20-20z" 
        fill="#4285F4" fillOpacity="0.4"/>
      <path d="M-10 0c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10-10-4.5-10-10z" 
        fill="#4285F4"/>
    </g>

    {/* Floating Elements */}
    <g className="floating-elements">
      <path d="M80 300l20-20 20 20-20 20z" fill="#EA4335" className="float-1"/>
      <circle cx="400" cy="280" r="15" fill="#34A853" className="float-2"/>
      <rect x="420" y="180" width="25" height="25" rx="5" fill="#FBBC04" className="float-3"/>
    </g>
  </svg>
)

export default LearningIllustration 