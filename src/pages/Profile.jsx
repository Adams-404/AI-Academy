import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../config/supabase'
import { FaSignOutAlt, FaEdit } from 'react-icons/fa'
import EditProfileModal from '../components/EditProfileModal'
import './Profile.css'

const Profile = () => {
  const { user, logout } = useAuth()
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [profileData, setProfileData] = useState(null)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  useEffect(() => {
    if (user) {
      getProfile()
    }
  }, [user])

  async function getProfile() {
    try {
      setLoading(true)
      setError(null)
      
      if (!user) throw new Error('No user')

      // Get the profile
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // Profile doesn't exist, create it
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert([{
              id: user.id,
              full_name: user.user_metadata?.full_name || '',
              avatar_url: user.user_metadata?.avatar_url || ''
            }])
            .select()
            .single()

          if (insertError) throw insertError
          setProfileData(newProfile)
        } else {
          throw error
        }
      } else {
        setProfileData(data)
      }
    } catch (error) {
      console.error('Error loading profile:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile({ full_name, avatar_url }) {
    try {
      setUpdating(true)
      
      if (!user) throw new Error('No user')

      const updates = {
        id: user.id,
        full_name,
        avatar_url,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase
        .from('profiles')
        .upsert(updates)

      if (error) throw error
      
      setProfileData(prev => ({ ...prev, ...updates }))
    } catch (error) {
      console.error('Error updating profile:', error)
      setError(error.message)
    } finally {
      setUpdating(false)
    }
  }

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

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-card loading-card">
          <div className="loading-content">
            <div className="loading-avatar">
              <div className="loading-pulse"></div>
              <div className="loading-spinner"></div>
            </div>
            <div className="loading-details">
              <div className="loading-header"></div>
              <div className="loading-info">
                <div className="loading-line"></div>
                <div className="loading-line"></div>
                <div className="loading-line"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-content">
          <div className="profile-header">
            <h1>Profile</h1>
            <button 
              className="edit-button"
              onClick={() => setIsEditModalOpen(true)}
            >
              <FaEdit />
              Edit Profile
            </button>
          </div>

          <div className="profile-avatar">
            {user?.user_metadata?.avatar_url ? (
              <img 
                src={user.user_metadata.avatar_url} 
                alt="Profile" 
                className="avatar-image"
              />
            ) : (
              <div className="avatar-initials">
                {getInitials(profileData?.full_name || user?.email)}
              </div>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="profile-info">
            <div className="info-group">
              <label>Full Name</label>
              <p>{profileData?.full_name || user?.user_metadata?.full_name || 'Not set'}</p>
            </div>

            <div className="info-group">
              <label>Email</label>
              <p>{user?.email}</p>
            </div>

            <div className="info-group">
              <label>Member Since</label>
              <p>{new Date(user?.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          <button 
            className="logout-button" 
            onClick={handleLogout}
            disabled={updating}
          >
            <FaSignOutAlt />
            Sign Out
          </button>
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentProfile={profileData}
        onProfileUpdate={(updates) => setProfileData(updates)}
      />
    </div>
  )
}

export default Profile 