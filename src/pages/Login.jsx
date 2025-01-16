import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { FaGoogle, FaCode, FaUsers, FaLaptopCode } from 'react-icons/fa'
import footerLogo from '../assets/footer-logo.svg'
import './Auth.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, signInWithGoogle } = useAuth()
  const navigate = useNavigate()

  // Typewriter effect state
  const [currentText, setCurrentText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  const phrases = [
    "Welcome Back Developer",
    "Continue Your Learning Journey",
    "Access Your Projects",
    "Connect With Your Community",
    "Resume Your Progress"
  ]

  useEffect(() => {
    const typeSpeed = isDeleting ? 50 : 50
    const currentPhrase = phrases[currentIndex]

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < currentPhrase.length) {
          setCurrentText(currentPhrase.slice(0, currentText.length + 1))
        } else {
          setTimeout(() => setIsDeleting(true), 2000)
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1))
        } else {
          setIsDeleting(false)
          setCurrentIndex((prev) => (prev + 1) % phrases.length)
        }
      }
    }, typeSpeed)

    return () => clearTimeout(timeout)
  }, [currentText, isDeleting, currentIndex])

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      setError('')
      setLoading(true)
      await login(email, password)
      navigate('/home')
    } catch (error) {
      setError('Failed to sign in. Please check your credentials.')
    }
    setLoading(false)
  }

  async function handleGoogleSignIn() {
    try {
      setError('')
      setLoading(true)
      await signInWithGoogle()
      navigate('/home')
    } catch (error) {
      setError('Failed to sign in with Google.')
    }
    setLoading(false)
  }

  return (
    <div className="auth-container">
      <div className="auth-info-section">
        {/* Decorative SVGs */}
        <div className="decorative-svg svg-top-right">
          <svg viewBox="0 0 200 200">
            <path d="M 100 100 L 300 100 L 200 300 z" fill="currentColor"/>
          </svg>
        </div>
        <div className="decorative-svg svg-bottom-left">
          <svg viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="80" fill="currentColor"/>
          </svg>
        </div>
        <div className="decorative-svg svg-center">
          <svg viewBox="0 0 400 400">
            {/* Neural network pattern */}
            <g stroke="currentColor" fill="none" strokeWidth="2">
              <path d="M100,100 C150,150 250,150 300,100"/>
              <path d="M100,200 C150,250 250,250 300,200"/>
              <circle cx="100" cy="100" r="10"/>
              <circle cx="300" cy="100" r="10"/>
              <circle cx="100" cy="200" r="10"/>
              <circle cx="300" cy="200" r="10"/>
            </g>
          </svg>
        </div>

        {/* Neural network animation nodes */}
        <div className="neural-nodes">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className="node" 
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        <div className="auth-info-content">
          <div className="ai-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
            </svg>
            AI Academy
          </div>
          
          <h2 className="auth-info-title">Welcome to GDG GSU</h2>
          <div className="typewriter-text">
            {currentText}
            <span className="cursor">|</span>
          </div>
          <div className="auth-info-features">
            <div className="feature-item">
              <FaCode />
              <span>Continue your learning journey</span>
            </div>
            <div className="feature-item">
              <FaUsers />
              <span>Reconnect with your community</span>
            </div>
            <div className="feature-item">
              <FaLaptopCode />
              <span>Access your ongoing projects</span>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-content">
        <div className="auth-header">
          <img src={footerLogo} alt="GDG Logo" className="gdg-logo" />
          <h1>Welcome Back</h1>
          <p>Sign in to continue learning</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <button 
          onClick={handleGoogleSignIn} 
          className="google-button"
          disabled={loading}
        >
          <FaGoogle />
          <span>{loading ? 'Signing in...' : 'Sign in with Google'}</span>
        </button>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
        </div>
      </div>
    </div>
  )
}

export default Login 