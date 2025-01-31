import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  FaPlay, 
  FaCheckCircle, 
  FaClock, 
  FaLock, 
  FaBook,
  FaGraduationCap,
  FaTrophy,
  FaChartLine,
  FaCalendarAlt,
  FaStopwatch,
  FaBrain,
  FaRocket,
  FaLayerGroup
} from 'react-icons/fa'
import './Courses.css'

const DIFFICULTY_LEVELS = {
  BEGINNER: { label: 'Beginner Friendly', color: '#34a853', icon: FaBrain },
  INTERMEDIATE: { label: 'Intermediate', color: '#fbbc04', icon: FaRocket },
  ADVANCED: { label: 'Advanced', color: '#ea4335', icon: FaGraduationCap }
}

const Courses = () => {
  const [activeMonth, setActiveMonth] = useState(1)
  const navigate = useNavigate()

  // Mock user progress data (this should come from your backend/state management)
  const userProgress = {
    week1: {
      materialsAccessed: true,
      timeSpent: 15, // minutes
      lastAccessedMaterial: 'video2',
      completedMaterials: ['video1', 'video2', 'document1'],
      assignmentUnlocked: true
    }
  }

  // Calculate course progress based on actual data
  const calculateProgress = () => {
    const totalWeeks = 12
    const totalMonths = 3
    const currentMonth = 1
    
    // Calculate completed weeks from userProgress
    const completedWeeks = Object.values(userProgress).filter(
      week => week.completedMaterials.length === 3 && week.assignmentUnlocked
    ).length

    // Calculate current week based on progress
    const currentWeek = Object.keys(userProgress).length

    // Calculate overall progress percentage
    const overallProgress = Math.round((completedWeeks / totalWeeks) * 100)

    return {
      totalWeeks,
      totalMonths,
      completedWeeks,
      currentWeek,
      currentMonth,
      overallProgress
    }
  }

  const courseProgress = calculateProgress()

  const curriculum = [
    {
      month: 1,
      title: "Getting Hands-On with AI Basics and Tools",
      description: "Foundation concepts and practical tools",
      progress: 25,
      icon: FaBrain,
      weeks: [
        {
          week: 1,
          title: "Introduction to AI and Practical Tools",
          difficulty: DIFFICULTY_LEVELS.BEGINNER,
          topics: [
            "AI Types & History",
            "ChatGPT & DALL·E",
            "Real-world Applications"
          ],
          status: "completed",
          achievements: ["First AI Chat", "Tool Master"],
          requiredMaterials: ['video1', 'video2', 'document1'],
          assignment: {
            title: "AI Tools Implementation",
            description: "Generate text/image outputs and reflect on experiences",
            duration: "2-3 hours",
            points: 100
          }
        },
        {
          week: 2,
          title: "Exploring Types of AI and Simple Applications",
          difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
          topics: [
            "Narrow AI vs General AI",
            "Dialogflow Basics",
            "Chatbot Development"
          ],
          status: "locked",
          achievements: [
            "AI Explorer",
            "Bot Builder",
            "Dialogflow Master"
          ],
          requiredMaterials: ['video1', 'video2', 'document1'],
          assignment: {
            title: "Deploy Your First Chatbot",
            description: "Create and deploy a chatbot using Dialogflow",
            duration: "3-4 hours",
            points: 150
          }
        },
        {
          week: 3,
          title: "Introduction to Prompt Engineering",
          difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
          topics: [
            "Prompt Engineering Basics",
            "AI Model Testing",
            "Prompt Optimization"
          ],
          status: "locked",
          assignment: {
            title: "Effective Prompts Guide",
            description: "Create a comprehensive guide for different AI tasks",
            duration: "3-4 hours",
            points: 150
          },
          achievements: [
            "Prompt Engineer",
            "AI Whisperer",
            "Content Creator"
          ]
        },
        {
          week: 4,
          title: "AI in Content Creation",
          difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
          topics: [
            "AI in Media",
            "MidJourney & Graphics",
            "Content Writing with AI"
          ],
          status: "locked",
          assignment: {
            title: "Digital Content Creation",
            description: "Create and publish AI-generated content",
            duration: "4-5 hours",
            points: 200
          },
          achievements: [
            "Media Master",
            "Creative AI",
            "Content Publisher"
          ]
        }
      ]
    },
    {
      month: 2,
      title: "Diving Deeper into AI Applications",
      description: "Advanced concepts and practical implementations",
      progress: 0,
      icon: FaRocket,
      weeks: [
        {
          week: 5,
          title: "AI for Developers – Coding with AI",
          difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
          topics: [
            "AI-powered IDEs",
            "GitHub Copilot",
            "Code Assistance"
          ],
          status: "locked",
          assignment: {
            title: "AI-Assisted Coding",
            description: "Submit improved code with AI suggestions",
            duration: "3-4 hours",
            points: 150
          },
          achievements: [
            "Code Assistant",
            "AI Developer",
            "GitHub Pro"
          ]
        },
        {
          week: 6,
          title: "AI in Cybersecurity",
          difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
          topics: [
            "Threat Detection",
            "AI Security Tools",
            "Prevention Systems"
          ],
          status: "locked",
          assignment: {
            title: "Security Analysis",
            description: "Create a threat detection report",
            duration: "4-5 hours",
            points: 200
          },
          achievements: [
            "Security Expert",
            "Threat Hunter",
            "AI Guardian"
          ]
        },
        {
          week: 7,
          title: "Building AI-Powered Applications",
          difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
          topics: [
            "OpenAI API",
            "API Integration",
            "App Development"
          ],
          status: "locked",
          assignment: {
            title: "AI Web Application",
            description: "Develop and deploy an AI-powered app",
            duration: "5-6 hours",
            points: 250
          },
          achievements: [
            "API Master",
            "App Creator",
            "Integration Pro"
          ]
        },
        {
          week: 8,
          title: "Midterm Project",
          difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
          topics: [
            "Team Collaboration",
            "Project Planning",
            "Development & Testing"
          ],
          status: "locked",
          assignment: {
            title: "Group Project",
            description: "Develop an AI solution in teams",
            duration: "10-12 hours",
            points: 300
          },
          achievements: [
            "Team Player",
            "Project Leader",
            "Solution Architect"
          ]
        }
      ]
    },
    {
      month: 3,
      title: "Advanced Tools and Capstone Project",
      description: "Professional implementation and final project",
      progress: 0,
      icon: FaGraduationCap,
      weeks: [
        {
          week: 9,
          title: "Exploring Advanced AI Tools and Platforms",
          difficulty: DIFFICULTY_LEVELS.ADVANCED,
          topics: [
            "Hugging Face",
            "TensorFlow Lite",
            "Advanced Applications"
          ],
          status: "locked",
          assignment: {
            title: "Advanced Tool Project",
            description: "Create a project using advanced AI tools",
            duration: "4-5 hours",
            points: 200
          },
          achievements: [
            "Tool Expert",
            "Platform Master",
            "Advanced Developer"
          ]
        },
        {
          week: 10,
          title: "AI Deployment and Real-World Applications",
          difficulty: DIFFICULTY_LEVELS.ADVANCED,
          topics: [
            "Deployment Techniques",
            "Vercel & Heroku",
            "Production Testing"
          ],
          status: "locked",
          assignment: {
            title: "Model Deployment",
            description: "Deploy and test an AI model",
            duration: "4-5 hours",
            points: 200
          },
          achievements: [
            "Deployment Pro",
            "Production Expert",
            "Cloud Master"
          ]
        },
        {
          week: 11,
          title: "Preparing for the Final Project",
          difficulty: DIFFICULTY_LEVELS.ADVANCED,
          topics: [
            "Project Planning",
            "Task Management",
            "Development Strategy"
          ],
          status: "locked",
          assignment: {
            title: "Project Proposal",
            description: "Submit detailed project plan",
            duration: "6-8 hours",
            points: 250
          },
          achievements: [
            "Project Planner",
            "Strategy Master",
            "Team Leader"
          ]
        },
        {
          week: 12,
          title: "Final Project Presentation",
          difficulty: DIFFICULTY_LEVELS.ADVANCED,
          topics: [
            "Project Completion",
            "Documentation",
            "Final Presentation"
          ],
          status: "locked",
          assignment: {
            title: "Final Project",
            description: "Present and submit final project",
            duration: "10-12 hours",
            points: 400
          },
          achievements: [
            "AI Graduate",
            "Project Master",
            "Course Champion"
          ]
        }
      ]
    }
  ]

  const WeekCard = ({ week }) => {
    const weekProgress = userProgress[`week${week.week}`]
    const canAccessAssignment = weekProgress?.assignmentUnlocked
    const materialsProgress = weekProgress ? 
      (weekProgress.completedMaterials.length / week.requiredMaterials.length) * 100 : 0

    return (
      <div className={`week-card ${week.status}`}>
        <div className="week-status-indicator">
          {week.status === 'completed' && <FaCheckCircle className="status-icon completed" />}
          {week.status === 'in-progress' && <FaPlay className="status-icon in-progress" />}
          {week.status === 'locked' && <FaLock className="status-icon locked" />}
        </div>
        
        <div className="week-content">
          <h3>Week {week.week}: {week.title}</h3>
          
          {week.difficulty && (
            <div className="difficulty-indicator" style={{ color: week.difficulty.color }}>
              <week.difficulty.icon />
              <span>{week.difficulty.label}</span>
            </div>
          )}

          <div className="week-details">
            <div className="topics">
              {week.topics.map((topic, index) => (
                <span key={index} className="topic-tag">{topic}</span>
              ))}
            </div>
          </div>

          {weekProgress && (
            <div className="materials-progress">
              <div className="progress-bar">
                <div 
                  className="progress" 
                  style={{ width: `${materialsProgress}%` }}
                />
              </div>
              <span className="progress-text">
                {weekProgress.completedMaterials.length}/{week.requiredMaterials.length} materials completed
              </span>
              {weekProgress.timeSpent > 0 && (
                <span className="time-spent">
                  <FaStopwatch /> {weekProgress.timeSpent} mins spent
                </span>
              )}
            </div>
          )}

          {week.achievements && (
            <div className="achievements">
              {week.achievements.map((achievement, index) => (
                <span key={index} className="achievement">
                  <FaTrophy /> {achievement}
                </span>
              ))}
            </div>
          )}

          <div className="week-actions">
            {week.status !== 'locked' && (
              <>
                <button 
                  className="button button-primary"
                  onClick={() => navigate('/WeekOneMaterials')}
                >
                  <FaBook /> Access Materials
                </button>
                {week.assignment && (
                  <button 
                    className={`button ${canAccessAssignment ? 'button-secondary' : 'button-disabled'}`}
                    onClick={() => canAccessAssignment && navigate(`/weekly-assignment/${week.week}`)}
                    title={!canAccessAssignment ? "Complete all materials to unlock assignment" : ""}
                  >
                    <FaGraduationCap /> Start Assignment
                    {!canAccessAssignment && <FaLock className="lock-icon" />}
                  </button>
                )}
              </>
            )}
          </div>

          {week.assignment && (
            <div className="assignment-info">
              <span className="assignment-duration">
                <FaClock /> {week.assignment.duration}
              </span>
              <span className="assignment-points">
                <FaTrophy /> {week.assignment.points} points
              </span>
            </div>
          )}
        </div>
      </div>
    )
  }

  const handleAccessMaterials = () => {
    navigate('/week-one-materials')
  }

  return (
    <div className="courses-page">
      <div className="course-header">
        <div className="course-overview">
          <h1>AI Development Course</h1>
          <p>Master AI development through practical projects and hands-on learning</p>
          
          <div className="progress-stats">
            <div className="stat-card">
              <FaChartLine />
              <div className="stat-info">
                <span className="stat-value">{courseProgress.overallProgress}%</span>
                <span className="stat-label">Overall Progress</span>
              </div>
            </div>
            <div className="stat-card">
              <FaCalendarAlt />
              <div className="stat-info">
                <span className="stat-value">
                  Month {courseProgress.currentMonth}/{courseProgress.totalMonths}
                </span>
                <span className="stat-label">Current Month</span>
              </div>
            </div>
            <div className="stat-card">
              <FaCheckCircle />
              <div className="stat-info">
                <span className="stat-value">
                  Week {courseProgress.currentWeek}/{courseProgress.totalWeeks}
                </span>
                <span className="stat-label">Current Week</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="course-timeline">
        <div className="months-progress">
          {curriculum.map(month => (
            <button
              key={month.month}
              className={`month-tab ${activeMonth === month.month ? 'active' : ''}`}
              onClick={() => setActiveMonth(month.month)}
            >
              <div className="month-icon">
                <month.icon />
              </div>
              <span className="month-number">Month {month.month}</span>
              <span className="month-title">{month.title}</span>
              <div className="progress-bar">
                <div 
                  className="progress" 
                  style={{ width: `${month.progress}%` }}
                />
              </div>
            </button>
          ))}
        </div>

        <div className="weeks-grid">
          {curriculum
            .find(m => m.month === activeMonth)
            ?.weeks.map(week => (
              <WeekCard key={week.week} week={week} />
            ))}
        </div>
      </div>
    </div>
  )
}

export default Courses 