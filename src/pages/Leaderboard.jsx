import { useState } from 'react'
import { FaTrophy, FaMedal, FaAward, FaInfoCircle } from 'react-icons/fa'
import './Leaderboard.css'

const Leaderboard = () => {
  const [timeframe, setTimeframe] = useState('weekly')

  // Demo data - this would come from your backend later
  const leaderboardData = [
    { id: 1, name: "Sarah Johnson", score: 2840, progress: 95, avatar: null },
    { id: 2, name: "Michael Chen", score: 2720, progress: 92, avatar: null },
    { id: 3, name: "Emma Davis", score: 2650, progress: 88, avatar: null },
    { id: 4, name: "James Wilson", score: 2500, progress: 85, avatar: null },
    { id: 5, name: "Sophia Lee", score: 2400, progress: 82, avatar: null },
    { id: 6, name: "David Brown", score: 2350, progress: 80, avatar: null },
    { id: 7, name: "Lisa Anderson", score: 2200, progress: 78, avatar: null },
    { id: 8, name: "John Smith", score: 2150, progress: 75, avatar: null },
    { id: 9, name: "Maria Garcia", score: 2100, progress: 72, avatar: null },
    { id: 10, name: "Alex Turner", score: 2050, progress: 70, avatar: null },
  ]

  const getInitials = (name) => {
    const names = name.split(' ')
    return names.length >= 2 
      ? `${names[0][0]}${names[1][0]}`.toUpperCase()
      : name[0].toUpperCase()
  }

  const getRankIcon = (rank) => {
    switch(rank) {
      case 1:
        return <FaTrophy className="rank-icon gold" />
      case 2:
        return <FaMedal className="rank-icon silver" />
      case 3:
        return <FaMedal className="rank-icon bronze" />
      default:
        return <span className="rank-number">{rank}</span>
    }
  }

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h1>Leaderboard</h1>
        <div className="timeframe-selector">
          <button 
            className={timeframe === 'weekly' ? 'active' : ''} 
            onClick={() => setTimeframe('weekly')}
          >
            Weekly
          </button>
          <button 
            className={timeframe === 'monthly' ? 'active' : ''} 
            onClick={() => setTimeframe('monthly')}
          >
            Monthly
          </button>
          <button 
            className={timeframe === 'allTime' ? 'active' : ''} 
            onClick={() => setTimeframe('allTime')}
          >
            All Time
          </button>
        </div>
      </div>

      <div className="info-banner">
        <FaInfoCircle />
        <p>
          Points are earned through course completion, quiz performance, and 
          practical project submissions. Keep learning to climb the ranks!
        </p>
      </div>

      <div className="leaderboard-list">
        {leaderboardData.map((user, index) => (
          <div key={user.id} className="leaderboard-item">
            <div className="rank">
              {getRankIcon(index + 1)}
            </div>
            <div className="user-info">
              <div className="avatar">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} />
                ) : (
                  <div className="avatar-initials">
                    {getInitials(user.name)}
                  </div>
                )}
              </div>
              <div className="user-details">
                <h3>{user.name}</h3>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${user.progress}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="score">
              <span>{user.score}</span>
              <small>points</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Leaderboard 