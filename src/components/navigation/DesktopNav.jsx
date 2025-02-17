import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../config/supabase'
import basirFlowLogo from '../../assets/BasirFlow-Logo.svg'
import './Navigation.css'

const DesktopNav = ({ onToggle, isExpanded }) => {
  const { user } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user?.id) {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single()
        
        if (data && !error) {
          setIsAdmin(data.is_admin)
        }
      }
    }
    
    checkAdminStatus()
  }, [user])

  useEffect(() => {
    console.log('User object:', user);
    console.log('User metadata:', user?.user_metadata);
  }, [user]);

  const handleToggle = () => {
    onToggle(!isExpanded)
  }

  const navItems = [
    ...(user?.user_metadata?.role === 'admin' ? [{
      to: '/admin/courses',
      icon: 'admin_panel_settings',
      label: 'Admin'
    }] : []),
    { 
      to: '/home', 
      icon: 'cottage',
      label: 'Home'
    },
    { 
      to: '/courses', 
      icon: 'school',
      label: 'Courses'
    },
    { 
      to: '/blog', 
      icon: 'article',
      label: 'Blog'
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
          src={basirFlowLogo}
          alt="BasiraFlow" 
          className={`nav-logo ${!isExpanded ? 'small' : ''}`}
        />
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
            end
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