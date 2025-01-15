import { NavLink } from 'react-router-dom'
import { 
  MdOutlineHome,
  MdOutlineSchool,
  MdOutlineCode,
  MdOutlineCalendarToday,
  MdOutlinePerson
} from 'react-icons/md'
import './Navigation.css'

const Navigation = () => {
  const navItems = [
    {
      path: '/home',
      icon: <MdOutlineHome size={22} />,
      label: 'Home'
    },
    {
      path: '/courses',
      icon: <MdOutlineSchool size={22} />,
      label: 'Courses'
    },
    {
      path: '/projects',
      icon: <MdOutlineCode size={22} />,
      label: 'Projects'
    },
    {
      path: '/events',
      icon: <MdOutlineCalendarToday size={22} />,
      label: 'Events'
    },
    {
      path: '/profile',
      icon: <MdOutlinePerson size={22} />,
      label: 'Profile'
    }
  ]

  return (
    <nav className="desktop-nav">
      <div className="nav-logo">
        <img src="/footer-logo.svg" alt="GDG" />
        <span>AI Academy</span>
      </div>
      <div className="nav-links">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default Navigation 