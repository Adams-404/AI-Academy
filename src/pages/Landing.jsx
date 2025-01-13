import { Link } from 'react-router-dom'
import { FaRocket, FaGraduationCap, FaUsers } from 'react-icons/fa'
import './Landing.css'

const Landing = () => {
  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="nav-logo">
          <img src="/src/assets/gsu-gdg-logo.svg" alt="GDG GSU" />
        </div>
        <div className="nav-links">
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/signup" className="nav-button">Get Started</Link>
        </div>
      </nav>

      <main className="landing-main">
        <section className="hero-section">
          <div className="hero-content">
            <h1>Welcome to GDG AI Academy</h1>
            <p className="hero-subtitle">
              Learn AI and Machine Learning from industry experts and join a 
              community of passionate developers
            </p>
            <div className="hero-actions">
              <Link to="/signup" className="cta-button">Start Learning</Link>
              <Link to="/courses" className="secondary-button">View Courses</Link>
            </div>
          </div>
        </section>

        <section className="features-section">
          <h2>Why Choose GDG AI Academy?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <FaRocket className="feature-icon" />
              <h3>Practical Learning</h3>
              <p>Hands-on projects and real-world applications</p>
            </div>
            <div className="feature-card">
              <FaGraduationCap className="feature-icon" />
              <h3>Expert Guidance</h3>
              <p>Learn from experienced AI practitioners</p>
            </div>
            <div className="feature-card">
              <FaUsers className="feature-icon" />
              <h3>Community</h3>
              <p>Join a network of AI enthusiasts</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Landing 