import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { FaSignOutAlt } from 'react-icons/fa'
import './Header.css'

const Header = () => {
  const { currentUser, logout } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Failed to log out:', error)
    }
  }

  const getInitials = (name) => {
    if (!name) return '?'
    const names = name.split(' ')
    return names.length >= 2 
      ? `${names[0][0]}${names[1][0]}`.toUpperCase()
      : name[0].toUpperCase()
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="profile-dropdown" ref={dropdownRef}>
          <div 
            className="profile-trigger" 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {currentUser?.photoURL ? (
              <img 
                src={currentUser.photoURL} 
                alt="Profile" 
                className="profile-image"
              />
            ) : (
              <div className="profile-initials">
                {getInitials(currentUser?.displayName || currentUser?.email)}
              </div>
            )}
          </div>

          {isDropdownOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-user-info">
                <div className="user-profile-section">
                  <div className="user-profile-image">
                    {currentUser?.photoURL ? (
                      <img src={currentUser.photoURL} alt="Profile" />
                    ) : (
                      <div className="user-profile-initials">
                        {getInitials(currentUser?.displayName || currentUser?.email)}
                      </div>
                    )}
                  </div>
                  <div className="user-info-text">
                    <h3>{currentUser?.displayName || currentUser?.email.split('@')[0]}</h3>
                    <p>{currentUser?.email}</p>
                  </div>
                </div>
              </div>
              <button className="dropdown-logout-btn" onClick={handleLogout}>
                <FaSignOutAlt size={14} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header 