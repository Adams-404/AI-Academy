import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { FaGoogle, FaCode, FaUsers, FaLaptopCode, FaBrain, FaRobot, FaPython, FaNetworkWired, FaComments, FaMicrochip, FaDatabase } from 'react-icons/fa'
import footerLogo from '../assets/footer-logo.svg'
import './Auth.css'

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const { signup, signInWithGoogle } = useAuth()
  const navigate = useNavigate()

  const [currentText, setCurrentText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  const phrases = [
    "Learn to Code with Industry Experts",
    "Build Real-World Projects",
    "Join a Community of Developers",
    "Grow Your Technical Skills",
    "Connect with Tech Leaders"
  ]

  useEffect(() => {
    const typeSpeed = isDeleting ? 50 : 50 // Faster deletion, slower typing
    const currentPhrase = phrases[currentIndex]

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (currentText.length < currentPhrase.length) {
          setCurrentText(currentPhrase.slice(0, currentText.length + 1))
        } else {
          // Wait before starting to delete
          setTimeout(() => setIsDeleting(true), 2000)
        }
      } else {
        // Deleting
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

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match')
    }

    try {
      setError('')
      setLoading(true)
      await signup(formData.email, formData.password, {
        fullName: formData.fullName
      })
      setSuccess('Account created successfully! Redirecting...')
      // Wait for 1.5 seconds before redirecting
      setTimeout(() => {
        navigate('/home')
      }, 1500)
    } catch (error) {
      setError('Failed to create an account: ' + error.message)
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleSignIn() {
    try {
      setError('')
      setLoading(true)
      await signInWithGoogle()
      setSuccess('Signed in successfully! Redirecting...')
      setTimeout(() => {
        navigate('/home')
      }, 1500)
    } catch (error) {
      setError('Failed to sign in with Google')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-info-section">
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
          <div className="float-card google-red" style={{ bottom: '25%', left: '15%' }}>
            <FaRobot />
            <span>ML Models</span>
          </div>
          <div className="float-card" style={{ top: '20%', left: '10%' }}>
            <FaPython />
            <span>Python</span>
          </div>
          <div className="float-card google-green" style={{ top: '35%', right: '10%' }}>
            <FaNetworkWired />
            <span>Deep Learning</span>
          </div>
          <div className="float-card google-yellow" style={{ bottom: '30%', right: '20%' }}>
            <FaComments />
            <span>Prompt Engineering</span>
          </div>
          <div className="float-card" style={{ top: '90%', left: '20%' }}>
            <FaMicrochip />
            <span>Neural Networks</span>
          </div>
          <div className="float-card google-blue" style={{ bottom: '15%', right: '0%' }}>
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
              <span>Learn from expert developers</span>
            </div>
            <div className="feature-item">
              <FaUsers />
              <span>Join a community of passionate learners</span>
            </div>
            <div className="feature-item">
              <FaLaptopCode />
              <span>Build real-world projects</span>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-content">
        <div className="auth-header">
          <img src={footerLogo} alt="GDG Logo" className="gdg-logo" />
          <h1>Create Account</h1>
          <p>Join the GDG GSU community</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
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
          <span>{loading ? 'Signing in...' : 'Sign up with Google'}</span>
        </button>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Sign In</Link></p>
        </div>
      </div>
    </div>
  )
}

export default Signup 