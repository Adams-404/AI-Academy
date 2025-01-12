import { useState } from 'react'
import { 
  FaGithub, 
  FaLinkedin, 
  FaTwitter,
  FaGraduationCap,
  FaEdit
} from 'react-icons/fa'
import './Profile.css'

const Profile = () => {
  const [user, setUser] = useState({
    name: "Muh'd Adamu Aliyu",
    role: "AI Student",
    avatar: "https://ui-avatars.com/api/?name=Muh'd+Adamu+Aliyu&background=1a73e8&color=fff",
    bio: "AI enthusiast and student developer at GDG GSU. Passionate about machine learning and building innovative solutions.",
    social: {
      github: "github.com/alexj",
      linkedin: "linkedin.com/in/alexj",
      twitter: "twitter.com/alexj"
    }
  })

  const [progress] = useState({
    currentWeek: 1,
    totalWeeks: 12,
    currentTopic: "Introduction to AI",
    nextSession: "Thursday, 2:00 PM",
    achievements: [
      { id: 1, title: "First AI Model", date: "March 15" },
      { id: 2, title: "Perfect Attendance", date: "March 10" },
      { id: 3, title: "Group Project Lead", date: "March 8" }
    ]
  })

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editFormData, setEditFormData] = useState({ ...user })

  const handleEditProfile = () => {
    setIsEditModalOpen(true)
  }

  const handleUpdateProfile = (e) => {
    e.preventDefault()
    setUser(editFormData)
    setIsEditModalOpen(false)
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditFormData(prev => ({
          ...prev,
          avatar: reader.result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="profile-wrapper">
      <div className="profile-grid">
        {/* User Profile Card */}
        <div className="user-card">
          <div className="user-header">
            <div className="avatar-container">
              <img src={user.avatar} alt={user.name} className="user-avatar" />
              <button className="edit-profile-btn" onClick={handleEditProfile}>
                <FaEdit />
              </button>
            </div>
            <div className="user-info">
              <h1>{user.name}</h1>
              <div className="user-role">
                <FaGraduationCap />
                <span>{user.role}</span>
              </div>
            </div>
          </div>
          <p className="user-bio">{user.bio}</p>
          <div className="social-links">
            <a href={`https://${user.social.github}`} target="_blank" rel="noopener noreferrer">
              <FaGithub />
            </a>
            <a href={`https://${user.social.linkedin}`} target="_blank" rel="noopener noreferrer">
              <FaLinkedin />
            </a>
            <a href={`https://${user.social.twitter}`} target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </a>
          </div>
        </div>

        {/* Main Progress Card */}
        <div className="progress-card">
          <div className="progress-header">
            <svg className="progress-icon" viewBox="0 0 24 24">
              <path d="M3.5 18.5L9.5 12.5L13.5 16.5L22 6.92L20.59 5.5L13.5 13.5L9.5 9.5L2 17L3.5 18.5Z" />
            </svg>
            <h2>Course Progress</h2>
          </div>
          
          <div className="weeks-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${(progress.currentWeek / progress.totalWeeks) * 100}%` }}
              />
            </div>
            <div className="weeks-info">
              <div className="info-item">
                <span className="info-number">{progress.currentWeek}</span>
                <span className="info-label">Week Completed</span>
              </div>
              <div className="info-item">
                <span className="info-number">{progress.totalWeeks - progress.currentWeek}</span>
                <span className="info-label">Weeks Remaining</span>
              </div>
            </div>
          </div>
        </div>

        {/* Current Status Card */}
        <div className="status-card">
          <div className="status-header">
            <svg className="status-icon" viewBox="0 0 24 24">
              <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM16.2 16.2L11 13V7H12.5V12.2L17 14.9L16.2 16.2Z" />
            </svg>
            <h2>Current Status</h2>
          </div>
          
          <div className="status-content">
            <div className="status-item">
              <h3>Current Week</h3>
              <p>{progress.currentWeek}</p>
            </div>
            <div className="status-item">
              <h3>Current Topic</h3>
              <p>{progress.currentTopic}</p>
            </div>
            <div className="status-item">
              <h3>Next Session</h3>
              <p>{progress.nextSession}</p>
            </div>
          </div>
        </div>

        {/* Achievements Card */}
        <div className="achievements-card">
          <div className="achievements-header">
            <svg className="achievement-icon" viewBox="0 0 24 24">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            <h2>Recent Achievements</h2>
          </div>
          
          <div className="achievements-list">
            {progress.achievements.map(achievement => (
              <div key={achievement.id} className="achievement-item">
                <div className="achievement-badge">🏆</div>
                <div className="achievement-details">
                  <h3>{achievement.title}</h3>
                  <p>{achievement.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Edit Profile Modal */}
        {isEditModalOpen && (
          <div className="modal-overlay">
            <div className="edit-modal">
              <h2>Edit Profile</h2>
              <form onSubmit={handleUpdateProfile}>
                <div className="form-group">
                  <label>Profile Picture</label>
                  <div className="avatar-upload">
                    <img src={editFormData.avatar} alt="Preview" />
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={e => setEditFormData(prev => ({
                      ...prev,
                      name: e.target.value
                    }))}
                  />
                </div>
                <div className="form-group">
                  <label>Bio</label>
                  <textarea
                    value={editFormData.bio}
                    onChange={e => setEditFormData(prev => ({
                      ...prev,
                      bio: e.target.value
                    }))}
                  />
                </div>
                <div className="form-actions">
                  <button type="button" onClick={() => setIsEditModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile 