import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../config/supabase'
import './Auth.css'

const VerifyEmail = () => {
  const [searchParams] = useSearchParams()
  const [verifying, setVerifying] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = searchParams.get('token')
    const type = searchParams.get('type')

    async function verifyEmail() {
      try {
        if (type === 'signup' && token) {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'signup'
          })

          if (error) throw error

          // Wait a moment before redirecting
          setTimeout(() => {
            navigate('/login', { 
              state: { 
                message: 'Email verified successfully! You can now log in.' 
              }
            })
          }, 2000)
        }
      } catch (error) {
        console.error('Verification error:', error)
        setError(error.message)
      } finally {
        setVerifying(false)
      }
    }

    verifyEmail()
  }, [searchParams, navigate])

  return (
    <div className="auth-container">
      <div className="auth-content">
        <div className="auth-header">
          <h1>{verifying ? 'Verifying your email...' : 
              error ? 'Verification Failed' : 
              'Email Verified!'}</h1>
          
          {verifying && (
            <div className="loading-spinner"></div>
          )}

          {error && (
            <div className="error-message">
              {error}
              <button 
                onClick={() => navigate('/login')}
                className="link-button"
              >
                Return to Login
              </button>
            </div>
          )}

          {!verifying && !error && (
            <div className="success-message">
              <p>Your email has been verified successfully!</p>
              <p>Redirecting to login...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail
