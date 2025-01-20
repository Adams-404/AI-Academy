import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import './EmailVerificationBanner.css'

export default function EmailVerificationBanner() {
  const { user, resendVerificationEmail } = useAuth()
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (!user || user.email_confirmed_at) return null

  const handleResend = async () => {
    if (isLoading) return
    
    setIsLoading(true)
    setMessage('')

    const { error, message } = await resendVerificationEmail(user.email)
    
    if (error) {
      setMessage('Failed to resend. Please try again later.')
    } else {
      setMessage('Verification email sent! Please check your inbox.')
    }

    setIsLoading(false)
    
    // Clear success message after 5 seconds
    setTimeout(() => setMessage(''), 5000)
  }

  return (
    <div className="verification-banner">
      <div className="verification-content">
        <span>📧 Please check your email to verify your account.</span>
        <div className="verification-actions">
          {message && <span className="verification-message">{message}</span>}
          <button 
            className="resend-button"
            onClick={handleResend}
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Resend Email'}
          </button>
        </div>
      </div>
    </div>
  )
}
