const ModuleIllustration = () => (
  <svg 
    width="100%" 
    height="100%" 
    viewBox="0 0 120 120" 
    preserveAspectRatio="xMidYMid meet" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className="module-illustration"
    style={{ maxWidth: '120px', maxHeight: '120px' }}
  >
    {/* Brain Circuit Background */}
    <circle cx="60" cy="60" r="50" fill="#E8F0FE" className="pulse" />
    <path
      d="M30 60a30 30 0 0160 0"
      stroke="#4285F4"
      strokeWidth="2"
      strokeDasharray="4 4"
      className="circuit-path"
    />
    
    {/* Nodes */}
    <circle cx="40" cy="50" r="6" fill="#EA4335" className="node" />
    <circle cx="60" cy="40" r="6" fill="#FBBC04" className="node" />
    <circle cx="80" cy="50" r="6" fill="#34A853" className="node" />
    <circle cx="60" cy="70" r="8" fill="#4285F4" className="main-node" />
    
    {/* Connection Lines */}
    <path d="M40 50L60 70M60 40L60 70M80 50L60 70" stroke="#DADCE0" strokeWidth="1.5" />
  </svg>
)

export default ModuleIllustration 