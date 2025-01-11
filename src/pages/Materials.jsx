import { useState } from 'react'
import { 
  FaBook, 
  FaVideo, 
  FaFileAlt, 
  FaCode,
  FaDownload,
  FaExternalLinkAlt,
  FaSearch,
  FaFilter
} from 'react-icons/fa'
import './Materials.css'
import { useParams } from 'react-router-dom'

const Materials = () => {
  const { weekId } = useParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedModule, setSelectedModule] = useState('all')

  const materialsByWeek = {
    week1: {
      title: "Introduction to AI and Practical Tools",
      materials: [
        {
          id: 1,
          title: "AI Fundamentals Lecture",
          type: "video",
          duration: "45 mins",
          description: "Introduction to AI concepts and terminology",
          downloadable: false,
          url: "https://youtube.com/..."
        },
        {
          id: 2,
          title: "ChatGPT Practice Guide",
          type: "document",
          pages: 12,
          description: "Step-by-step guide for ChatGPT exercises",
          downloadable: true,
          url: "/materials/week1/chatgpt-guide.pdf"
        },
        // ... more week 1 materials
      ]
    },
    week2: {
      title: "Exploring Types of AI and Simple Applications",
      materials: [
        {
          id: 1,
          title: "Types of AI Explained",
          type: "video",
          duration: "50 mins",
          description: "Deep dive into different AI categories",
          downloadable: false,
          url: "https://youtube.com/..."
        },
        {
          id: 2,
          title: "Dialogflow Starter Code",
          type: "code",
          size: "2.1 MB",
          description: "Template for chatbot development",
          downloadable: true,
          url: "/materials/week2/dialogflow-starter.zip"
        },
        // ... more week 2 materials
      ]
    },
    // ... more weeks
  }

  const filterMaterials = () => {
    const currentWeekMaterials = weekId ? materialsByWeek[weekId]?.materials : 
      Object.values(materialsByWeek).flatMap(week => week.materials)

    return currentWeekMaterials?.filter(material => {
      const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          material.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = selectedType === 'all' || material.type === selectedType
      return matchesSearch && matchesType
    }) || []
  }

  const MaterialCard = ({ material }) => {
    const getIcon = (type) => {
      switch(type) {
        case 'video': return <FaVideo />
        case 'code': return <FaCode />
        case 'document': return <FaFileAlt />
        default: return <FaBook />
      }
    }

    return (
      <div className="material-card">
        <div className="material-icon">
          {getIcon(material.type)}
        </div>
        <div className="material-content">
          <h3>{material.title}</h3>
          <p>{material.description}</p>
          <div className="material-meta">
            {material.duration && <span>{material.duration}</span>}
            {material.size && <span>{material.size}</span>}
            {material.pages && <span>{material.pages} pages</span>}
          </div>
        </div>
        <div className="material-actions">
          {material.downloadable ? (
            <button className="button button-primary">
              <FaDownload /> Download
            </button>
          ) : (
            <a href={material.url} target="_blank" rel="noopener noreferrer" className="button button-secondary">
              <FaExternalLinkAlt /> View
            </a>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="materials-page">
      <header className="materials-header">
        <h1>
          {weekId ? materialsByWeek[weekId]?.title : "All Learning Materials"}
        </h1>
        <p>Access course resources, documentation, and code samples</p>
      </header>

      <div className="materials-filters">
        <div className="search-bar">
          <FaSearch />
          <input 
            type="text"
            placeholder="Search materials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-options">
          <select 
            value={selectedType} 
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="video">Videos</option>
            <option value="code">Code</option>
            <option value="document">Documents</option>
          </select>

          <select 
            value={selectedModule} 
            onChange={(e) => setSelectedModule(e.target.value)}
          >
            <option value="all">All Modules</option>
            <option value="module1">Module 1</option>
            <option value="module2">Module 2</option>
            <option value="module3">Module 3</option>
          </select>
        </div>
      </div>

      <div className="materials-grid">
        {filterMaterials().map(material => (
          <MaterialCard key={material.id} material={material} />
        ))}
      </div>
    </div>
  )
}

export default Materials 