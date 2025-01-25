import { useState } from "react"
import { Link } from "react-router-dom"
import {
  FaArrowLeft,
  FaBook,
  FaDownload,
  FaBrain,
  FaLightbulb,
  FaRobot,
  FaCogs,
  FaTools,
  FaCode,
  FaIndustry,
  FaChartLine,
  FaClipboardCheck,
  FaCheck,
  FaBookReader,
  FaClock,
  FaUser,
} from "react-icons/fa"
import "./WeekOneMaterials.css"

const WeekOneMaterials = () => {
  const [activeSection, setActiveSection] = useState("introduction")
  const [progress, setProgress] = useState({
    introduction: false,
    concepts: false,
    applications: false,
  })

  const [showMaterials, setShowMaterials] = useState(false)

  const sections = {
    introduction: {
      title: "Introduction to AI",
      icon: <FaBrain />,
      content: [
        {
          subtitle: "What is Artificial Intelligence?",
          text: "Artificial Intelligence (AI) refers to the simulation of human intelligence in machines programmed to think and learn. At its core, AI is about creating systems that can perform tasks that typically require human intelligence.",
          keyPoints: [
            "Intelligence simulation in machines",
            "Problem-solving capabilities",
            "Learning from experience",
            "Pattern recognition",
            "Decision making abilities",
          ],
        },
        {
          subtitle: "Brief History of AI",
          text: "The field of AI has evolved significantly since its inception in the 1950s:",
          timeline: [
            { year: "1950s", event: "Birth of AI as an academic discipline" },
            { year: "1960s", event: "Development of early expert systems" },
            { year: "1980s", event: "Introduction of machine learning algorithms" },
            { year: "2010s", event: "Deep learning revolution" },
            { year: "Present", event: "AI integration in everyday applications" },
          ],
        },
      ],
    },
    concepts: {
      title: "Basic AI Concepts",
      icon: <FaCogs />,
      content: [
        {
          subtitle: "Types of AI",
          categories: [
            {
              name: "Narrow AI (ANI)",
              description: "Designed for specific tasks (e.g., facial recognition, playing chess)",
              examples: ["Siri", "Chess computers", "Image recognition systems"],
            },
            {
              name: "General AI (AGI)",
              description: "Hypothetical AI with human-like general intelligence",
              examples: ["Not yet achieved", "Subject of ongoing research"],
            },
          ],
        },
        {
          subtitle: "Core Components",
          components: [
            {
              name: "Machine Learning",
              description: "Systems that improve with experience",
              examples: ["Recommendation systems", "Spam filters"],
            },
            {
              name: "Deep Learning",
              description: "Neural networks with multiple layers",
              examples: ["Image recognition", "Natural language processing"],
            },
            {
              name: "Neural Networks",
              description: "Computing systems inspired by biological neural networks",
              examples: ["Pattern recognition", "Data classification"],
            },
          ],
        },
      ],
    },
    applications: {
      title: "Real-World Applications",
      icon: <FaIndustry />,
      content: [
        {
          subtitle: "Current Applications",
          categories: [
            {
              field: "Healthcare",
              examples: ["Disease diagnosis", "Drug discovery", "Patient care optimization"],
            },
            {
              field: "Finance",
              examples: ["Fraud detection", "Algorithmic trading", "Risk assessment"],
            },
            {
              field: "Transportation",
              examples: ["Self-driving cars", "Traffic prediction", "Route optimization"],
            },
          ],
        },
        {
          subtitle: "Case Studies",
          cases: [
            {
              title: "IBM Watson in Healthcare",
              description: "AI system assisting doctors in diagnosis and treatment planning",
              impact: "Improved accuracy in cancer diagnosis by 40%",
            },
            {
              title: "AI in Climate Change",
              description: "Using AI to predict weather patterns and optimize energy usage",
              impact: "Reduced energy consumption in data centers by 30%",
            },
          ],
        },
      ],
    },
  }

  const sectionOrder = ["introduction", "concepts", "applications"]

  const handleNavigation = (direction) => {
    const currentIndex = sectionOrder.indexOf(activeSection)
    const nextIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1
    const nextSection = sectionOrder[nextIndex]
    setActiveSection(nextSection)
    
    // Add this: Scroll to top when changing topics
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const isFirstSection = sectionOrder.indexOf(activeSection) === 0
  const isLastSection = sectionOrder.indexOf(activeSection) === sectionOrder.length - 1

  const completedSections = Object.values(progress).filter(Boolean).length
  const totalSections = Object.keys(progress).length
  const progressPercentage = completedSections / totalSections

  const handleComplete = () => {
    setShowMaterials(true)
  }

  return (
    <div className="materials-container">
      <header className="course-header">
        <div className="header-content">
          <div className="header-main">
            <Link to="/courses" className="back-link">
              <FaArrowLeft />
              <span className="back-text">Back to Courses</span>
            </Link>

            <div className="header-info">
              <h1>{sections[activeSection].title}</h1>
              <div className="course-meta">
                <span>
                  <FaBookReader />
                  Week 1
                </span>
                <span>
                  <FaClock />
                  2h
                </span>
                <span>
                  <FaUser />
                  Dr. Smith
                </span>
              </div>
            </div>

            <div className="progress-indicator">
              <div className="progress-ring">
                <svg viewBox="0 0 36 36" className="circular-chart">
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#eee"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#4CAF50"
                    strokeWidth="3"
                    strokeDasharray={`${progressPercentage * 100}, 100`}
                  />
                </svg>
                <span className="progress-text">{Math.round(progressPercentage * 100)}%</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="materials-grid">
        <div className="main-content">
          {!showMaterials ? (
            <>
              <div className="video-card">
                <div className="video-container">
                  <iframe
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

              <div className="content-section">
                <div className="content-wrapper word-wrap">
                  {sections[activeSection].content.map((item, index) => (
                    <div key={index} className="content-block">
                      <h3>{item.subtitle}</h3>
                      {item.text && <p>{item.text}</p>}

                      {item.keyPoints && (
                        <ul className="key-points">
                          {item.keyPoints.map((point, i) => (
                            <li key={i}>{point}</li>
                          ))}
                        </ul>
                      )}

                      {item.timeline && (
                        <div className="timeline">
                          {item.timeline.map((event, i) => (
                            <div
                              key={i}
                              className="timeline-event"
                              style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                            >
                              <span className="year" style={{ flexShrink: 0, marginRight: "1rem" }}>
                                {event.year}
                              </span>
                              <span className="event" style={{ flexGrow: 1 }}>
                                {event.event}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {item.categories && (
                        <div className="grid-container">
                          <div className="categories-grid">
                            {item.categories.map((category, i) => (
                              <div
                                key={i}
                                className="category-card"
                              >
                                <h4>{category.name || category.field}</h4>
                                {category.description && <p>{category.description}</p>}
                                <ul>
                                  {category.examples.map((example, j) => (
                                    <li key={j}>{example}</li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {item.components && (
                        <div className="grid-container">
                          <div className="components-grid">
                            {item.components.map((component, i) => (
                              <div
                                key={i}
                                className="component-card"
                              >
                                <h4>{component.name}</h4>
                                <p>{component.description}</p>
                                <div className="examples">
                                  {component.examples.map((example, j) => (
                                    <span key={j} className="example-tag">
                                      {example}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {item.cases && (
                        <div className="grid-container">
                          <div className="case-studies">
                            {item.cases.map((case_study, i) => (
                              <div
                                key={i}
                                className="case-card"
                                style={{ display: "flex", flexDirection: "column", height: "100%" }}
                              >
                                <h4>{case_study.title}</h4>
                                <p>{case_study.description}</p>
                                <div className="impact" style={{ marginTop: "auto" }}>
                                  <strong>Impact:</strong> {case_study.impact}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="topic-navigation">
                  {!isFirstSection && (
                    <button className="nav-button prev" onClick={() => handleNavigation("prev")}>
                      <FaArrowLeft /> Previous Topic
                    </button>
                  )}
                  {!isLastSection && (
                    <button className="nav-button next" onClick={() => handleNavigation("next")}>
                      Next Topic <FaArrowLeft style={{ transform: "rotate(180deg)" }} />
                    </button>
                  )}
                  {isLastSection && (
                    <button className="nav-button complete" onClick={handleComplete}>
                      Complete Module <FaCheck />
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="materials-section">
              <h2>Module Materials</h2>
              <div className="materials-list">
                <div className="material-card">
                  <div className="material-icon">
                    <FaDownload />
                  </div>
                  <div className="material-content">
                    <h3>Week 1 Complete Notes</h3>
                    <p className="material-meta">PDF • Comprehensive Notes</p>
                    <button className="start-button">Download Notes</button>
                  </div>
                </div>

                <div className="material-card">
                  <div className="material-icon">
                    <FaBook />
                  </div>
                  <div className="material-content">
                    <h3>Additional Resources</h3>
                    <p className="material-meta">External Links • Reading Material</p>
                    <div className="resource-links">
                      <a href="#" className="resource-link">AI Fundamentals Guide</a>
                      <a href="#" className="resource-link">Stanford Online AI Course</a>
                      <a href="#" className="resource-link">Harvard AI Ethics</a>
                    </div>
                  </div>
                </div>

                <div className="material-card">
                  <div className="material-icon">
                    <FaClipboardCheck />
                  </div>
                  <div className="material-content">
                    <h3>Weekly Assessment</h3>
                    <p className="material-meta">Quiz • 20 minutes</p>
                    <button className="start-button">Start Quiz</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WeekOneMaterials

