import { useState } from 'react'
import { 
  FaFilter as FilterOutline,
  FaPlus as AddOutline,
  FaLink as LinkOutline,
  FaUser as PersonOutline,
  FaClock as TimeOutline
} from 'react-icons/fa'
import './Projects.css'

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState('all')

  const filters = [
    { id: 'all', label: 'All Projects' },
    { id: 'chatbots', label: 'Chatbots' },
    { id: 'ai-tools', label: 'AI Tools' },
    { id: 'ml-models', label: 'ML Models' }
  ]

  const projects = [
    {
      id: 1,
      title: "AI-Powered Chat Assistant",
      description: "A chatbot built using Dialogflow that helps students with course-related queries",
      type: "chatbots",
      author: "Sarah Johnson",
      date: "March 10, 2024",
      thumbnail: "https://via.placeholder.com/300x200",
      tags: ["Dialogflow", "Node.js", "Natural Language Processing"]
    },
    {
      id: 2,
      title: "Image Recognition Tool",
      description: "An AI tool that can identify objects in images using TensorFlow",
      type: "ai-tools",
      author: "Michael Chen",
      date: "March 8, 2024",
      thumbnail: "https://via.placeholder.com/300x200",
      tags: ["TensorFlow", "Computer Vision", "Python"]
    },
    // Add more projects...
  ]

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => project.type === activeFilter)

  return (
    <div className="projects-page">
      <header className="page-header">
        <div className="header-content">
          <div>
            <h1 className="page-title">Student Projects</h1>
            <p className="page-description">Explore AI projects built by our students</p>
          </div>
          <button className="button button-primary">
            <AddOutline color="white" />
            <span>Submit Project</span>
          </button>
        </div>

        <div className="filters-container">
          <FilterOutline color="#5f6368" />
          <div className="filter-buttons">
            {filters.map(filter => (
              <button
                key={filter.id}
                className={`filter-button ${activeFilter === filter.id ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="projects-grid">
        {filteredProjects.map(project => (
          <div key={project.id} className="project-card">
            <div className="project-thumbnail">
              <img src={project.thumbnail} alt={project.title} />
            </div>
            <div className="project-content">
              <h2>{project.title}</h2>
              <p>{project.description}</p>
              
              <div className="project-tags">
                {project.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>

              <div className="project-meta">
                <div className="meta-item">
                  <PersonOutline color="#5f6368" />
                  <span>{project.author}</span>
                </div>
                <div className="meta-item">
                  <TimeOutline color="#5f6368" />
                  <span>{project.date}</span>
                </div>
              </div>

              <button className="button button-secondary">
                <LinkOutline color="#1a73e8" />
                <span>View Project</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Projects 