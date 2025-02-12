import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { FaGoogle, FaCode, FaUsers, FaLaptopCode, FaBrain, FaRobot, FaPython, FaNetworkWired, FaComments, FaMicrochip, FaDatabase, FaCamera } from 'react-icons/fa'
import footerLogo from '../assets/footer-logo.svg'
import './Auth.css'
import { v4 as uuidv4 } from 'uuid'

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    avatar: null
  })
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const { signup, signInWithGoogle } = useAuth()
  const navigate = useNavigate()

  const [currentText, setCurrentText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const phrases = [
    "Learn with Industry Experts...",
    "Build Real-World Projects.",
    "Join AI Community Now!",
    "Grow Your Technical Skills.",
    "Connect with Tech Leaders."
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

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Reset any previous errors
      setError('')
      
      // Validate file size and type
      const fileSize = file.size / 1024 / 1024 // in MB
      const fileType = file.type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg']

      if (fileSize > 2) {
        setError('Avatar image must be less than 2MB')
        return
      }

      if (!validTypes.includes(fileType)) {
        setError('Please upload a valid image file (JPG, PNG, or GIF)')
        return
      }

      // If validation passes, update form data and preview
      setFormData(prev => ({ ...prev, avatar: file }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const checkPasswordStrength = (password) => {
    let strength = 0
    if (password.length >= 8) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1
    setPasswordStrength(strength)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (name === 'password') {
      checkPasswordStrength(value)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    
    // 1. Validation
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match')
    }

    // 2. Avatar validation
    if (formData.avatar) {
      const fileSize = formData.avatar.size / 1024 / 1024 // in MB
      const fileType = formData.avatar.type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg']

      if (fileSize > 2) {
        return setError('Avatar image must be less than 2MB')
      }

      if (!validTypes.includes(fileType)) {
        return setError('Please upload a valid image file (JPG, PNG, or GIF)')
      }
    }

    try {
      setError('')
      setLoading(true)
      
      let avatarUrl = null;

      // Handle avatar upload first if there is one
      if (formData.avatar) {
        try {
          setIsUploading(true)
          setUploadProgress(0)
          
          const fileExt = formData.avatar.name.split('.').pop()
          const fileName = `avatars/${uuidv4()}.${fileExt}`
          
          // Upload with progress tracking
          const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, formData.avatar, {
              cacheControl: '3600',
              upsert: false,
              onUploadProgress: (progress) => {
                const percent = (progress.loaded / progress.total) * 100
                setUploadProgress(Math.round(percent))
              }
            })

          if (uploadError) throw uploadError

          // Get the public URL
          const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName)

          avatarUrl = publicUrl;
        } catch (avatarError) {
          console.error('Avatar upload error:', avatarError)
          throw avatarError
        }
      }

      // Now proceed with signup
      const { data, error: signUpError } = await signup(formData.email, formData.password, {
        fullName: formData.fullName,
        avatar_url: avatarUrl
      })

      if (signUpError) throw signUpError

      // Success handling
      setSuccess('Account created successfully!')
      setTimeout(() => {
        navigate('/home')
      }, 2000)

    } catch (error) {
      setError(error.message || 'Failed to create an account')
      console.error('Signup error:', error)
    } finally {
      setLoading(false)
      setIsUploading(false)
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
          <div className="avatar-upload">
            <div className="avatar-preview" onClick={() => document.getElementById('avatar-input').click()}>
              {avatarPreview ? (
                <>
                  <img src={avatarPreview} alt="Profile preview" />
                  {isUploading && (
                    <div className="upload-overlay">
                      <div className="progress-container">
                        <div 
                          className="progress-bar" 
                          style={{ width: `${uploadProgress}%` }} 
                        />
                        <span>{uploadProgress}%</span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <FaCamera className="camera-icon" />
              )}
            </div>
            <input
              type="file"
              id="avatar-input"
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ display: 'none' }}
            />
            <p>{isUploading ? 'Uploading...' : 'Add profile picture'}</p>
          </div>

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
            <div className="password-strength">
              <div className={`strength-bar ${passwordStrength >= 1 ? 'active' : ''}`}></div>
              <div className={`strength-bar ${passwordStrength >= 2 ? 'active' : ''}`}></div>
              <div className={`strength-bar ${passwordStrength >= 3 ? 'active' : ''}`}></div>
              <div className={`strength-bar ${passwordStrength >= 4 ? 'active' : ''}`}></div>
            </div>
            <div className="password-requirements">
              <div className={`requirement ${formData.password.length >= 8 ? 'met' : ''}`}>
                At least 8 characters
              </div>
              <div className={`requirement ${/[A-Z]/.test(formData.password) ? 'met' : ''}`}>
                At least 1 uppercase letter
              </div>
              <div className={`requirement ${/[0-9]/.test(formData.password) ? 'met' : ''}`}>
                At least 1 number
              </div>
              <div className={`requirement ${/[^A-Za-z0-9]/.test(formData.password) ? 'met' : ''}`}>
                At least 1 special character
              </div>
            </div>
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