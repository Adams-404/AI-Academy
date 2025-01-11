import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import DesktopNav from './components/navigation/DesktopNav'
import MobileNav from './components/navigation/MobileNav'
import Home from './pages/Home'
import Courses from './pages/Courses'
import Projects from './pages/Projects'
import Events from './pages/Events'
import Profile from './pages/Profile'
import './App.css'

function App() {
  const [isNavExpanded, setIsNavExpanded] = useState(true)

  return (
    <Router>
      <div className="app">
        <DesktopNav onToggle={setIsNavExpanded} />
        <MobileNav />
        
        <main className={`main-content ${isNavExpanded ? 'nav-expanded' : ''}`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses/*" element={<Courses />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/events" element={<Events />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
