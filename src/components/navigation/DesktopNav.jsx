import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import gsuGdgLogo from '../../assets/footer-logo.svg'
import './Navigation.css'

const DesktopNav = ({ onToggle, isExpanded }) => {
  const handleToggle = () => {
    onToggle(!isExpanded)
  }

  const navItems = [
    { 
      to: '/', 
      icon: 'cottage',
      label: 'Home'
    },
    { 
      to: '/courses', 
      icon: 'school',
      label: 'Courses'
    },
    { 
      to: '/projects', 
      icon: 'code',
      label: 'Projects'
    },
    { 
      to: '/events', 
      icon: 'calendar_today',
      label: 'Events'
    },
    { 
      to: '/profile', 
      icon: 'person',
      label: 'Profile'
    }
  ]

  return (
    <nav className={`desktop-nav ${isExpanded ? 'expanded' : ''}`}>
      <div className="nav-header">
        <img 
          src={gsuGdgLogo}
          alt="GSU GDG Academy" 
          className="nav-logo" 
        />
        <span className="nav-title">AI Academy</span>
        <button 
          className="nav-toggle"
          onClick={handleToggle}
          aria-label="Toggle navigation"
        >
          <span className="material-symbols-rounded">
            {isExpanded ? 'chevron_left' : 'chevron_right'}
          </span>
        </button>
      </div>

      <div className="nav-links">
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="material-symbols-rounded">{icon}</span>
            <div className="nav-link-content">
              <span className="nav-label">{label}</span>
            </div>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default DesktopNav 