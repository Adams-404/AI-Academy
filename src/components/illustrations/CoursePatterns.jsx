const CoursePatterns = () => {
  return (
    <div className="course-patterns">
      {/* Large decorative circles with more elements */}
      <svg className="pattern-circles" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
        <circle cx="80" cy="80" r="24" fill="#4285f4" fillOpacity="0.2" />
        <circle cx="160" cy="160" r="32" fill="#ea4335" fillOpacity="0.2" />
        <circle cx="240" cy="80" r="28" fill="#fbbc04" fillOpacity="0.2" />
        <circle cx="320" cy="240" r="36" fill="#34a853" fillOpacity="0.2" />
        <circle cx="400" cy="120" r="30" fill="#4285f4" fillOpacity="0.2" />
        <circle cx="480" cy="200" r="40" fill="#ea4335" fillOpacity="0.2" />
        
        {/* Enhanced connecting lines */}
        <path 
          d="M80 80 L160 160 L240 80 L320 240 L400 120 L480 200" 
          stroke="#4285f4" 
          strokeWidth="3"
          strokeOpacity="0.15"
          fill="none"
        />
        
        {/* Additional decorative elements */}
        <circle cx="80" cy="80" r="40" stroke="#4285f4" strokeWidth="2" strokeOpacity="0.1" fill="none" />
        <circle cx="320" cy="240" r="60" stroke="#34a853" strokeWidth="2" strokeOpacity="0.1" fill="none" />
        <circle cx="480" cy="200" r="50" stroke="#ea4335" strokeWidth="2" strokeOpacity="0.1" fill="none" />
      </svg>

      {/* Enhanced dots grid */}
      <svg className="pattern-dots" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
        <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="2" fill="#34a853" fillOpacity="0.25" />
          <circle cx="10" cy="10" r="1.5" fill="#4285f4" fillOpacity="0.2" />
          <circle cx="18" cy="18" r="1.5" fill="#ea4335" fillOpacity="0.2" />
        </pattern>
        <rect x="0" y="0" width="300" height="300" fill="url(#dots)" />
      </svg>

      {/* Enhanced wavy lines */}
      <svg className="pattern-waves" viewBox="0 0 800 200" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M 0 50 C 200 20, 400 80, 800 50"
          stroke="#4285f4"
          strokeWidth="2"
          strokeOpacity="0.15"
          fill="none"
        />
        <path
          d="M 0 100 C 200 140, 400 60, 800 100"
          stroke="#ea4335"
          strokeWidth="2"
          strokeOpacity="0.15"
          fill="none"
        />
        <path
          d="M 0 150 C 200 180, 400 120, 800 150"
          stroke="#fbbc04"
          strokeWidth="2"
          strokeOpacity="0.15"
          fill="none"
        />
      </svg>

      {/* Additional geometric shapes */}
      <svg className="pattern-shapes" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
        <rect x="40" y="40" width="60" height="60" fill="#4285f4" fillOpacity="0.15" transform="rotate(15)" />
        <rect x="240" y="240" width="80" height="80" fill="#fbbc04" fillOpacity="0.15" transform="rotate(45)" />
        <polygon points="320,40 360,100 280,100" fill="#ea4335" fillOpacity="0.15" />
        <circle cx="200" cy="200" r="100" stroke="#34a853" strokeWidth="2" strokeOpacity="0.15" fill="none" />
      </svg>
    </div>
  )
}

export default CoursePatterns 