import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'

const NavItem = ({ to, icon: Icon, label, collapsed }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `nav-item ${isActive ? 'active' : ''} ${collapsed ? 'collapsed' : ''}`
      }
    >
      <Icon className="nav-icon" />
      {!collapsed && <span className="nav-label">{label}</span>}
    </NavLink>
  )
}

NavItem.propTypes = {
  to: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  collapsed: PropTypes.bool
}

export default NavItem 