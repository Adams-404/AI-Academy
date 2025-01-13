import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import { FaSignOutAlt } from 'react-icons/fa'
import './Profile.css'

const Profile = () => {
  const { currentUser, logout } = useAuth()
  const [userData, setUserData] = useState({
    fullName: '',
    photoURL: ''
  })
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return

      try {
        // Set initial data from auth
        setUserData({
          fullName: currentUser.displayName || currentUser.email.split('@')[0],
          photoURL: currentUser.photoURL || ''
        })

        const userRef = doc(db, 'users', currentUser.uid)
        const userSnap = await getDoc(userRef)
        
        if (userSnap.exists()) {
          const data = userSnap.data()
          setUserData(prev => ({
            ...prev,
            fullName: data.fullName || prev.fullName,
            photoURL: data.photoURL || prev.photoURL
          }))
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
        setError(error.message)
      }
    }

    fetchUserData()
  }, [currentUser])

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Failed to log out:', error)
      setError(error.message)
    }
  }

  const getInitials = (name) => {
    if (!name) return '?'
    const names = name.split(' ')
    return names.length >= 2 
      ? `${names[0][0]}${names[1][0]}`.toUpperCase()
      : name[0].toUpperCase()
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-content">
            <p className="error-message">{error}</p>
            <button className="logout-btn" onClick={handleLogout}>
              <FaSignOutAlt />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-content">
          <div className="profile-avatar">
            {userData.photoURL ? (
              <img src={userData.photoURL} alt="Profile" />
            ) : (
              <div className="avatar-initials">
                {getInitials(userData.fullName)}
              </div>
            )}
          </div>

          <h1>{userData.fullName}</h1>
          <p className="profile-email">{currentUser?.email}</p>

          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile 