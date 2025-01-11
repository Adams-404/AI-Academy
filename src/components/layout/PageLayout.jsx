import PropTypes from 'prop-types'

const PageLayout = ({ children }) => {
  return (
    <div className="page-layout">
      <div className="page-content">
        {children}
      </div>
    </div>
  )
}

PageLayout.propTypes = {
  children: PropTypes.node.isRequired
}

export default PageLayout 