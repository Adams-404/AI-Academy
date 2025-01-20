import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import './Header.css'

const Header = ({ isNavExpanded }) => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const getGreeting = () => {
      const hour = new Date().getHours()
      if (hour < 12) return 'Good morning'
      if (hour < 17) return 'Good afternoon'
      return 'Good evening'
    }

    setGreeting(getGreeting())

    // Update greeting every minute
    const interval = setInterval(() => {
      setGreeting(getGreeting())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const getInitials = (name) => {
    if (!name) return '?'
    return name.split('@')[0][0].toUpperCase()
  }

  const getUserDisplayName = () => {
    return user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  }

  return (
    <header className={`app-header ${!isNavExpanded ? 'nav-collapsed' : ''}`}>
      <div className="header-content">
        <div className="header-greeting">
          <h1>{greeting},</h1>
          <h2>{getUserDisplayName()}</h2>
        </div>

        <div className="profile-section" onClick={() => navigate('/profile')}>
          {user?.user_metadata?.avatar_url ? (
            <img 
              src={user.user_metadata.avatar_url} 
              alt="Profile" 
              className="profile-image"
            />
          ) : (
            <div className="profile-initials">
              {getInitials(user?.email)}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header 