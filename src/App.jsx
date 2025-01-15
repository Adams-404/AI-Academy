import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom'
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
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Leaderboard from './pages/Leaderboard'
import './App.css'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import PrivateRoute from './components/auth/PrivateRoute'

function App() {
  const [isNavExpanded, setIsNavExpanded] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const location = useLocation()
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (currentUser) {
      setTimeout(() => {
        setIsLoading(false)
      }, 100)
      
      if (location.pathname === '/') {
        navigate('/home')
      }
    } else {
      if (!['/login', '/signup', '/'].includes(location.pathname)) {
        navigate('/login')
      }
      setIsLoading(false)
    }
  }, [currentUser, location, navigate])

  if (isLoading) {
    return null
  }

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
                <Route path="/" element={
                  currentUser ? <Navigate to="/home" /> : <Landing />
                } />
                <Route path="/login" element={
                  currentUser ? <Navigate to="/home" /> : <Login />
                } />
                <Route path="/signup" element={
                  currentUser ? <Navigate to="/home" /> : <Signup />
                } />
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
                <Route path="/leaderboard" element={
                  <PrivateRoute>
                    <Leaderboard />
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
