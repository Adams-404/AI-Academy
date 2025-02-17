import { 
  FaBook, 
  FaCode, 
  FaCalendarAlt, 
  FaUser,
  FaBrain,
  FaRobot,
  FaPython,
  FaNetworkWired,
  FaComments,
  FaMicrochip,
  FaDatabase,
  FaChartLine,
  FaBookmark
} from 'react-icons/fa'
import './Home.css'
import WelcomeIllustration from '../components/illustrations/WelcomeIllustration'
import { DotsPattern, WavePattern } from '../components/illustrations/Patterns'
import ProgressGraph from '../components/illustrations/ProgressGraph'
import ModuleIllustration from '../components/illustrations/ModuleIllustration'
import EventsIllustration from '../components/illustrations/EventsIllustration'
import CardPatterns from '../components/illustrations/CardPatterns'
import Header from '../components/Header/Header'

const Home = () => {
  // Mock data - would come from your backend in a real app
  const progress = 25 // Percentage completed
  const upcomingEvents = [
    {
      id: 1,
      title: "Week 1: Introduction to AI",
      date: "March 15, 2024",
      time: "10:00 AM"
    },
    {
      id: 2,
      title: "Practical Session: ChatGPT & DALL·E",
      date: "March 17, 2024",
      time: "2:00 PM"
    }
  ]

  return (
    <>
      <Header />
      <div className="home-container">
        <CardPatterns />
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">Welcome to BasiraFlow</h1>
            <p className="hero-description">
              Your journey into Artificial Intelligence starts here. Learn, build, and connect with 
              AI enthusiasts from around the world.
            </p>
            <div className="hero-actions">
              <button className="button button-primary">Start Learning</button>
              <button className="button button-secondary">View Roadmap</button>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-value">4.8k+</span>
                <span className="stat-label">Students</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">12+</span>
                <span className="stat-label">Courses</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">98%</span>
                <span className="stat-label">Success Rate</span>
              </div>
            </div>
          </div>
          <div className="hero-illustration">
            <WelcomeIllustration />
            <div className="floating-elements">
              <div className="float-card" style={{ top: '15%', right: '25%' }}>
                <FaBrain />
                <span>AI Learning</span>
              </div>
              <div className="float-card" style={{ bottom: '25%', left: '15%' }}>
                <FaRobot />
                <span>ML Models</span>
              </div>
              <div className="float-card" style={{ top: '20%', left: '10%' }}>
                <FaPython />
                <span>Python</span>
              </div>
              <div className="float-card google-blue" style={{ top: '35%', right: '10%' }}>
                <FaNetworkWired />
                <span>Deep Learning</span>
              </div>
              <div className="float-card google-red" style={{ bottom: '30%', right: '20%' }}>
                <FaComments />
                <span>Prompt Engineering</span>
              </div>
              <div className="float-card google-yellow" style={{ top: '45%', left: '20%' }}>
                <FaMicrochip />
                <span>Neural Networks</span>
              </div>
              <div className="float-card google-green" style={{ bottom: '15%', right: '35%' }}>
                <FaDatabase />
                <span>TensorFlow</span>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          {/* Progress Overview Card */}
          <div className="card progress-card">
            <div className="card-header">
              <FaChartLine color="#4285f4" />
              <h2>Your Progress</h2>
            </div>
            <ProgressGraph progress={progress} />
            <p>{progress}% of course completed</p>
          </div>

          {/* Current Module Card */}
          <div className="card current-module">
            <div className="card-header">
              <ModuleIllustration />
              <h2>Current Module</h2>
            </div>
            <h3>Week 1: Introduction to AI</h3>
            <p>Getting started with AI fundamentals and tools</p>
            <button className="button button-primary">Continue Learning</button>
          </div>

          {/* Upcoming Events Card */}
          <div className="card events-card">
            <div className="card-header">
              <EventsIllustration />
              <h2>Upcoming Events</h2>
            </div>
            <div className="events-list">
              {upcomingEvents.map(event => (
                <div key={event.id} className="event-item">
                  <div className="event-time">
                    <p className="date">{event.date}</p>
                    <p className="time">{event.time}</p>
                  </div>
                  <p className="event-title">{event.title}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links Card */}
          <div className="card quick-links">
            <div className="card-header">
              <FaBookmark color="#fbbc04" />
              <h2>Quick Links</h2>
            </div>
            <div className="links-grid">
              <a href="/courses" className="quick-link">
                <div className="quick-link-icon">
                  <FaBook />
                </div>
                <span>Course Material</span>
              </a>
              <a href="/projects" className="quick-link">
                <div className="quick-link-icon">
                  <FaCode />
                </div>
                <span>My Projects</span>
              </a>
              <a href="/events" className="quick-link">
                <div className="quick-link-icon">
                  <FaCalendarAlt />
                </div>
                <span>Upcoming Events</span>
              </a>
              <a href="/profile" className="quick-link">
                <div className="quick-link-icon">
                  <FaUser />
                </div>
                <span>My Profile</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home 