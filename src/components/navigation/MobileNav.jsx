import { NavLink } from 'react-router-dom'
import './Navigation.css'

const MobileNav = () => {
  const navItems = [
    { to: '/home', icon: 'home', label: 'Home' },
    { to: '/courses', icon: 'school', label: 'Courses' },
    { to: '/blog', icon: 'article', label: 'Blog' },
    { to: '/events', icon: 'calendar_month', label: 'Events' },
    { to: '/profile', icon: 'person', label: 'Profile' }
  ]

  return (
    <nav className="mobile-nav">
      {navItems.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          end
        >
          <span className="material-symbols-rounded">{icon}</span>
          <span className="nav-label">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export default MobileNav 