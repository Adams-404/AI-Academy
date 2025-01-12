const GdgGsuLogo = () => (
  <svg width="200" height="80" viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* GDG Logo */}
    <g transform="translate(20, 15) scale(0.4)">
      {/* Blue Circle */}
      <circle cx="100" cy="50" r="45" fill="#4285F4" fillOpacity="0.2"/>
      <path d="M100 20c16.6 0 30 13.4 30 30s-13.4 30-30 30-30-13.4-30-30 13.4-30 30-30" 
        stroke="#4285F4" strokeWidth="4"/>
      
      {/* Colored Sections */}
      <path d="M85 35l30 30M115 35l-30 30" stroke="#EA4335" strokeWidth="4"/>
      <path d="M85 65l30-30M115 65l-30-30" stroke="#FBBC04" strokeWidth="4"/>
      <circle cx="100" cy="50" r="8" fill="#34A853"/>
    </g>

    {/* GSU Text */}
    <text x="110" y="45" fontFamily="Google Sans" fontSize="24" fontWeight="500" fill="#202124">
      GDG GSU
    </text>
    <text x="110" y="65" fontFamily="Google Sans" fontSize="14" fill="#5F6368">
      Gombe State University
    </text>
  </svg>
)

export default GdgGsuLogo 