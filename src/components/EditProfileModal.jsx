import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../config/supabase'
import './EditProfileModal.css'

export default function EditProfileModal({ isOpen, onClose, currentProfile, onProfileUpdate }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [preview, setPreview] = useState(null)
  const [formData, setFormData] = useState({
    full_name: currentProfile?.full_name || user?.user_metadata?.full_name || '',
    avatar_url: currentProfile?.avatar_url || user?.user_metadata?.avatar_url || null
  })

  const handleFileChange = async (e) => {
    try {
      setError(null)
      const file = e.target.files[0]
      if (!file) return

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)

      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file')
      }
      if (file.size > 2 * 1024 * 1024) {
        throw new Error('File size must be less than 2MB')
      }

      setLoading(true)
      
      // Create unique file name
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Math.random()}.${fileExt}`
      const filePath = `avatars/${fileName}`  // Add 'avatars/' to the path

      // Upload to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      setFormData(prev => ({ ...prev, avatar_url: publicUrl }))
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error('Error uploading avatar:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)

      if (!user) throw new Error('No user')

      const updates = {
        id: user.id,
        full_name: formData.full_name,
        avatar_url: formData.avatar_url,
        updated_at: new Date().toISOString()
      }

      // Update profile in the database
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(updates)

      if (profileError) throw profileError

      // Update user metadata
      const { error: userError } = await supabase.auth.updateUser({
        data: {
          full_name: formData.full_name,
          avatar_url: formData.avatar_url
        }
      })

      if (userError) throw userError

      onProfileUpdate(updates)
      
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        onClose()
      }, 2000)
    } catch (error) {
      console.error('Error updating profile:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Profile</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">Profile updated successfully!</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="full_name">Full Name</label>
            <input
              type="text"
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="avatar">Profile Picture</label>
            <input
              type="file"
              id="avatar"
              accept="image/*"
              onChange={handleFileChange}
            />
            {(preview || formData.avatar_url) && (
              <img 
                src={preview || formData.avatar_url} 
                alt="Preview" 
                className="avatar-preview" 
              />
            )}
          </div>

          <div className="modal-actions">
            <button 
              type="button" 
              className="button-secondary" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="button-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 