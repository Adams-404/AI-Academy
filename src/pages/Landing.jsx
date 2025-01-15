import { Link } from 'react-router-dom'
import { WelcomeIllustration } from '../components/illustrations'
import './Landing.css'
import WavyPattern from '../assets/wavy-pattern.svg?react'
import DotsPattern from '../assets/dots-pattern.svg?react'
import CirclePattern from '../assets/circle-pattern.svg?react'
import TypewriterFacts from '../components/TypewriterFacts'

const Landing = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <header className="landing-header">
        <div className="decorative-pattern top-right">
          <DotsPattern />
        </div>
        <nav className="landing-nav">
          <div className="logo-container">
            <img src="/src/assets/footer-logo.svg" alt="GSU GDG Logo" className="landing-logo" />
            <span className="logo-text">GDG on Campus GSU</span>
          </div>
          <div className="nav-buttons">
            <Link to="/login" className="button button-text">Log in</Link>
            <Link to="/signup" className="button button-primary">Get started</Link>
          </div>
        </nav>

        <div className="hero-content">
          <div className="decorative-pattern top-left">
            <DotsPattern />
          </div>
          <div className="hero-text">
            <h1>Learn AI Development</h1>
            <h2>with GDG on Campus GSU</h2>
            <p className="hero-description">
              Join our community of learners and master artificial intelligence 
              through hands-on projects and expert guidance.
            </p>
            <div className="hero-buttons">
              <Link to="/signup" className="button button-primary button-large">
                Start learning for free
              </Link>
              <a href="#features" className="button button-secondary button-large">
                Explore courses
              </a>
            </div>
          </div>
          <div className="hero-illustration">
            <WelcomeIllustration />
          </div>
          <div className="decorative-pattern bottom-right">
            <CirclePattern />
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="wavy-pattern">
          <WavyPattern />
        </div>
        <div className="decorative-pattern features-left">
          <CirclePattern />
        </div>
        <div className="section-content">
          <h2 className="section-title">Why choose GDG on Campus GSU?</h2>
          <div className="features-grid">
            {[
              {
                icon: 'school',
                title: 'Expert-Led Courses',
                description: 'Learn from industry professionals and Google experts'
              },
              {
                icon: 'code',
                title: 'Hands-on Projects',
                description: 'Build real AI applications from scratch'
              },
              {
                icon: 'group',
                title: 'Community Support',
                description: 'Connect with fellow learners and mentors'
              },
              {
                icon: 'workspace_premium',
                title: 'Certification',
                description: 'Earn recognized certificates upon completion'
              }
            ].map((feature, index) => (
              <div key={index} className="feature-card">
                <span className="material-symbols-rounded feature-icon">
                  {feature.icon}
                </span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="decorative-pattern cta-right">
          <DotsPattern />
        </div>
        <div className="section-content">
          <TypewriterFacts />
          <Link to="/signup" className="button button-primary button-large">
            Get started now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <img src="/src/assets/footer-logo.svg" alt="GDG Footer Logo" />
          </div>
          <p className="footer-text">
            © {new Date().getFullYear()} GDG on Campus GSU. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Landing
