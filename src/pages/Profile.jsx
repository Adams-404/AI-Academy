import { 
  PersonOutline,
  MailOutline,
  SchoolOutline,
  TrendingUpOutline,
  RibbonOutline,
  NotificationsOutline,
  SettingsOutline
} from 'react-ionicons'
import './Profile.css'

const Profile = () => {
  // Mock user data - would come from your backend
  const user = {
    name: "Alex Johnson",
    email: "alex.j@gmail.com",
    avatar: "https://via.placeholder.com/150",
    role: "Student",
    progress: {
      completed: 5,
      total: 12,
      currentWeek: "Week 5: AI for Developers"
    },
    achievements: [
      {
        id: 1,
        title: "Quick Starter",
        description: "Completed first week assignments ahead of schedule",
        icon: "🚀"
      },
      {
        id: 2,
        title: "AI Explorer",
        description: "Successfully built first AI-powered application",
        icon: "🤖"
      }
    ],
    recentActivity: [
      {
        id: 1,
        type: "submission",
        title: "Chatbot Project",
        date: "March 10, 2024"
      },
      {
        id: 2,
        type: "achievement",
        title: "Completed Week 4",
        date: "March 8, 2024"
      }
    ]
  }

  const progressPercentage = (user.progress.completed / user.progress.total) * 100

  return (
    <div className="profile-page">
      <header className="page-header">
        <h1 className="page-title">Profile</h1>
        <div className="header-actions">
          <button className="button button-secondary">
            <NotificationsOutline color="#1a73e8" />
          </button>
          <button className="button button-secondary">
            <SettingsOutline color="#1a73e8" />
          </button>
        </div>
      </header>

      <div className="profile-grid">
        {/* User Info Card */}
        <div className="card user-info">
          <div className="avatar-section">
            <img src={user.avatar} alt={user.name} className="avatar" />
            <div className="user-details">
              <h2>{user.name}</h2>
              <div className="meta-info">
                <span className="meta-item">
                  <MailOutline color="#5f6368" />
                  {user.email}
                </span>
                <span className="meta-item">
                  <SchoolOutline color="#5f6368" />
                  {user.role}
                </span>
              </div>
            </div>
          </div>
          <button className="button button-primary">Edit Profile</button>
        </div>

        {/* Progress Card */}
        <div className="card progress-overview">
          <div className="card-header">
            <TrendingUpOutline color="#4285f4" />
            <h2>Course Progress</h2>
          </div>
          <div className="progress-stats">
            <div className="circular-progress">
              <div className="progress-value">{Math.round(progressPercentage)}%</div>
            </div>
            <div className="progress-details">
              <p className="current-module">{user.progress.currentWeek}</p>
              <p className="completion-status">
                {user.progress.completed} of {user.progress.total} weeks completed
              </p>
            </div>
          </div>
        </div>

        {/* Achievements Card */}
        <div className="card achievements">
          <div className="card-header">
            <RibbonOutline color="#ea4335" />
            <h2>Achievements</h2>
          </div>
          <div className="achievements-list">
            {user.achievements.map(achievement => (
              <div key={achievement.id} className="achievement-item">
                <span className="achievement-icon">{achievement.icon}</span>
                <div className="achievement-details">
                  <h3>{achievement.title}</h3>
                  <p>{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Card */}
        <div className="card recent-activity">
          <div className="card-header">
            <PersonOutline color="#34a853" />
            <h2>Recent Activity</h2>
          </div>
          <div className="activity-list">
            {user.recentActivity.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className="activity-content">
                  <h3>{activity.title}</h3>
                  <p>{activity.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile 