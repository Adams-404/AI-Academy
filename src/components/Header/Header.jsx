import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import './Header.css'
import { WiSunrise, WiDaySunny, WiSunset } from 'react-icons/wi'

// Move greeting logic outside component
const getGreetingData = () => {
  const hour = new Date().getHours()
  if (hour < 12) return { text: 'Good morning, ', icon: <WiSunrise className="greeting-icon" /> }
  if (hour < 17) return { text: 'Good afternoon, ', icon: <WiDaySunny className="greeting-icon" /> }
  return { text: 'Good evening, ', icon: <WiSunset className="greeting-icon" /> }
}

const Header = ({ isNavExpanded }) => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [greetingText, setGreetingText] = useState('')
  const [nameText, setNameText] = useState('')
  const [isTypingGreeting, setIsTypingGreeting] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [icon, setIcon] = useState(null)

  // Memoize greeting data to prevent recalculation
  const greetingData = useMemo(() => getGreetingData(), [])

  const fullName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'

  useEffect(() => {
    const typeSpeed = isDeleting ? 100 : 150 // Slower typing speed

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (isTypingGreeting) {
          if (greetingText.length < greetingData.text.length) {
            setGreetingText(greetingData.text.slice(0, greetingText.length + 1))
          } else {
            setIsTypingGreeting(false)
          }
        } else {
          if (nameText.length < fullName.length) {
            setNameText(fullName.slice(0, nameText.length + 1))
          } else {
            setTimeout(() => setIsDeleting(true), 2000)
          }
        }
      } else {
        if (nameText.length > 0) {
          setNameText(nameText.slice(0, -1))
        } else if (greetingText.length > 0) {
          setGreetingText(greetingText.slice(0, -1))
        } else {
          setIsDeleting(false)
          setIsTypingGreeting(true)
        }
      }
    }, typeSpeed)

    return () => clearTimeout(timeout)
  }, [greetingText, nameText, isTypingGreeting, isDeleting, greetingData.text])

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
          {greetingData.icon}
          <div className="greeting-text">
            <h1>
              {greetingText}
              {nameText && <span className="styled-name">{nameText}</span>}
              <span className="cursor"></span>
            </h1>
          </div>
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