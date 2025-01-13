import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import DesktopNav from './components/navigation/DesktopNav'
import MobileNav from './components/navigation/MobileNav'
import ScrollToTop from './components/layout/ScrollToTop'
import Home from './pages/Home'
import Courses from './pages/Courses'
import WeekOneMaterials from './pages/WeekOneMaterials'
import Projects from './pages/Projects'
import Events from './pages/Events'
import Profile from './pages/Profile'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import './App.css'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import PrivateRoute from './components/auth/PrivateRoute'

function App() {
  const [isNavExpanded, setIsNavExpanded] = useState(true)
  const location = useLocation()
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (currentUser && location.pathname === '/') {
      navigate('/home')
    }
  }, [currentUser, location])

  return (
    <div className="app">
      {currentUser && (
        <>
          <DesktopNav onToggle={setIsNavExpanded} />
          <MobileNav />
        </>
      )}
      <ScrollToTop />
      
      <main className={`main-content ${isNavExpanded ? 'nav-expanded' : ''}`}>
        <TransitionGroup component={null}>
          <CSSTransition
            key={location.key}
            timeout={300}
            classNames="page"
            unmountOnExit
          >
            <div className="page-transition">
              <Routes location={location}>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/home" element={
                  <PrivateRoute>
                    <Home />
                  </PrivateRoute>
                } />
                <Route path="/courses" element={
                  <PrivateRoute>
                    <Courses />
                  </PrivateRoute>
                } />
                <Route path="/WeekOneMaterials" element={
                  <PrivateRoute>
                    <WeekOneMaterials />
                  </PrivateRoute>
                } />
                <Route path="/projects" element={
                  <PrivateRoute>
                    <Projects />
                  </PrivateRoute>
                } />
                <Route path="/events" element={
                  <PrivateRoute>
                    <Events />
                  </PrivateRoute>
                } />
                <Route path="/profile" element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                } />
              </Routes>
            </div>
          </CSSTransition>
        </TransitionGroup>
      </main>
    </div>
  )
}

export default function AppWrapper() {
  return (
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  )
}
