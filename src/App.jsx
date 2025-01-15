import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
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
  const [isNavExpanded, setIsNavExpanded] = useState(() => {
    const savedState = localStorage.getItem('navState')
    return savedState ? JSON.parse(savedState) : true
  })
  const [isLoading, setIsLoading] = useState(true)
  const location = useLocation()
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  const isPublicRoute = ['/', '/login', '/signup'].includes(location.pathname)

  useEffect(() => {
    if (!isPublicRoute) {
      localStorage.setItem('navState', JSON.stringify(isNavExpanded))
    }
  }, [isNavExpanded, isPublicRoute])

  const handleNavToggle = (state) => {
    setIsNavExpanded(state)
  }

  useEffect(() => {
    if (currentUser) {
      setIsLoading(false)
      if (location.pathname === '/') {
        navigate('/home', { replace: true })
      }
    } else {
      if (!['/login', '/signup', '/'].includes(location.pathname)) {
        navigate('/login', { replace: true })
      }
      setIsLoading(false)
    }
  }, [currentUser, location.pathname, navigate])

  if (isLoading) {
    return null
  }

  return (
    <div className="app">
      {currentUser && !isPublicRoute && (
        <>
          <DesktopNav onToggle={handleNavToggle} isExpanded={isNavExpanded} />
          <MobileNav />
        </>
      )}
      <ScrollToTop />
      
      <main className={`main-content ${isPublicRoute ? 'public-route' : ''} ${!isPublicRoute && isNavExpanded ? 'nav-expanded' : 'nav-collapsed'}`}>
        <Routes location={location}>
          <Route path="/" element={
            currentUser ? <Navigate to="/home" replace /> : <Landing />
          } />
          <Route path="/login" element={
            currentUser ? <Navigate to="/home" replace /> : <Login />
          } />
          <Route path="/signup" element={
            currentUser ? <Navigate to="/home" replace /> : <Signup />
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
