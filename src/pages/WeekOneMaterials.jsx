import { Link } from 'react-router-dom'
import { FaArrowLeft, FaBook, FaCode, FaDownload, FaBrain, FaLightbulb } from 'react-icons/fa'
import './WeekOneMaterials.css'

const WeekOneMaterials = () => {
  const aiTopics = [
    "What is Artificial Intelligence?",
    "Types of AI: Narrow vs General AI",
    "Machine Learning & Deep Learning",
    "Neural Networks Basics",
    "AI Applications in Real World"
  ]

  const materials = [
    {
      id: 1,
      title: "Introduction to AI Concepts",
      type: "Video Lecture",
      duration: "4 mins",
      description: "A comprehensive introduction to AI fundamentals and core concepts"
    },
    {
      id: 2,
      title: "Lecture Slides",
      type: "Presentation",
      format: "PDF",
      icon: <FaDownload />,
      description: "Download the presentation slides for offline study",
      action: "Download Slides"
    },
    {
      id: 3,
      title: "Essential AI Resources",
      type: "Learning Resources",
      icon: <FaBook />,
      description: "Curated collection of articles, books, and research papers",
      links: [
        {
          title: "AI Fundamentals Guide",
          source: "Gombe State University",
          url: "#"
        },
        {
          title: "Introduction to Machine Learning",
          source: "MIT OpenCourseWare",
          url: "#"
        },
        {
          title: "AI Ethics and Implications",
          source: "Gombe State University",
          url: "#"
        }
      ],
      action: "Browse Resources"
    },
    {
      id: 4,
      title: "AI Fundamentals Quiz",
      type: "Assessment",
      duration: "20 mins",
      icon: <FaBrain />,
      description: "Test your understanding of AI concepts",
      action: "Take Quiz"
    }
  ]

  return (
    <div className="materials-container">
      <div className="materials-header">
        <Link to="/courses" className="back-button">
          <FaArrowLeft /> Back to Courses
        </Link>
        <h1>Week 1: Introduction to AI</h1>
        <p>Essential materials for your first week</p>
      </div>

      <div className="materials-grid">
        {/* Left Column */}
        <div className="main-content">
          {/* Video Section */}
          <div className="video-card">
            <div className="video-container">
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/WP6z_X5d-Rw?si=FS3sQzHi8M8vBGLC"
                title="Introduction to AI Concepts"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="video-info">
              <h2>Introduction to AI Concepts</h2>
              <p>Video Lecture • 4 mins</p>
            </div>
          </div>

          {/* AI Introduction Section */}
          <div className="intro-section">
            <h2><FaLightbulb /> Understanding Artificial Intelligence</h2>
            <p>
              Artificial Intelligence (AI) represents the simulation of human intelligence in machines programmed 
              to think and learn like humans. This introductory module covers the fundamental concepts and 
              various types of AI systems.
            </p>
            
            <div className="topics-grid">
              {aiTopics.map((topic, index) => (
                <div key={index} className="topic-card">
                  <span className="topic-number">{index + 1}</span>
                  <p>{topic}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Materials List */}
        <div className="materials-list">
          {materials.slice(1).map(material => (
            <div key={material.id} className="material-card">
              <div className="material-icon">
                {material.icon}
              </div>
              <div className="material-content">
                <h3>{material.title}</h3>
                <p className="material-meta">
                  {material.type} {material.duration && `• ${material.duration}`}
                  {material.format && ` • ${material.format}`}
                </p>
                <p className="material-description">{material.description}</p>
                {material.links ? (
                  <div className="resource-links">
                    {material.links.map((link, index) => (
                      <a key={index} href={link.url} className="resource-link">
                        <span className="link-title">{link.title}</span>
                        <span className="link-source">{link.source}</span>
                      </a>
                    ))}
                  </div>
                ) : (
                  <button className="start-button">
                    {material.action}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default WeekOneMaterials 