import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  FaGoogle, FaCode, FaUsers, FaLaptopCode,
  FaBrain, FaRobot, FaPython, FaNetworkWired, 
  FaComments, FaMicrochip, FaDatabase 
} from 'react-icons/fa'
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
    "Welcome Back AI Enthusiast...",
    "Continue Your Learning Journey.",
    "Access Your Projects.",
    "Connect With Your Community.",
    "Resume Your Progress!"
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
      const { data, error } = await login(email, password)
      
      if (error) {
        if (error.message.includes('Email not confirmed')) {
          setError('Please verify your email before signing in. Check your inbox for the verification link.')
        } else if (error.message.includes('Invalid login credentials')) {
          setError('Invalid email or password.')
        } else {
          setError(error.message)
        }
        return
      }

      if (data?.user) {
        navigate('/home', { replace: true })
      }
    } catch (error) {
      setError(error.message || 'Failed to sign in')
      console.error('Login error:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleSignIn() {
    try {
      setError('')
      setLoading(true)
      const { error } = await signInWithGoogle()
      if (error) throw error
      // Google OAuth will handle the redirect
    } catch (error) {
      setError('Failed to sign in with Google')
      console.error('Google sign in error:', error.message)
      setLoading(false)
    }
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

        <div className="floating-elements">
          <div className="float-card google-blue" style={{ top: '15%', right: '25%' }}>
            <FaBrain />
            <span>AI Learning</span>
          </div>
          <div className="float-card google-red" style={{ bottom: '90%', left: '24%', right: '30%' }}>
            <FaRobot />
            <span>ML Models</span>
          </div>
          <div className="float-card" style={{ top: '5%', left: '70%' }}>
            <FaPython />
            <span>Python</span>
          </div>
          <div className="float-card google-green" style={{ top: '73%', right: '0%' }}>
            <FaNetworkWired />
            <span>Deep Learning</span>
          </div>
          <div className="float-card google-yellow" style={{ bottom: '48%', right: '0%', left: '60%' }}>
            <FaComments />
            <span>Prompt Engineering</span>
          </div>
          <div className="float-card" style={{ top: '92%', left: '20%' }}>
            <FaMicrochip />
            <span>Neural Networks</span>
          </div>
          <div className="float-card google-blue" style={{ bottom: '10%', right: '0%', top: '83%' }}>
            <FaDatabase />
            <span>TensorFlow</span>
          </div>
        </div>

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

        <div className="auth-info">
          <h2 className="auth-info-title">Welcome to AI Academy</h2>
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
          <img src={footerLogo} alt="AI Academy Logo" className="gdg-logo" />
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