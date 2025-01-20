import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
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
import Leaderboard from './pages/Leaderboard'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import VerifyEmail from './pages/VerifyEmail'
import { supabase } from './config/supabase'
import './App.css'

function App() {
  const [isNavExpanded, setIsNavExpanded] = useState(() => {
    const savedState = localStorage.getItem('navState')
    return savedState ? JSON.parse(savedState) : true
  })
  
  const { user, loading } = useAuth()
  const location = useLocation()
  const isPublicRoute = ['/', '/login', '/signup'].includes(location.pathname)
  const navigate = useNavigate()

  // Save nav state to localStorage
  useEffect(() => {
    if (!isPublicRoute) {
      localStorage.setItem('navState', JSON.stringify(isNavExpanded))
    }
  }, [isNavExpanded, isPublicRoute])

  // Add console logs to debug
  useEffect(() => {
    console.log('Current user:', user)
  }, [user])

  // Modified auth state change handler
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event)
      console.log('Session:', session)
      
      if (event === 'SIGNED_IN') {
        // Only navigate to home if we're on a public route
        if (isPublicRoute) {
          navigate('/home')
        }
      } else if (event === 'SIGNED_OUT') {
        navigate('/login')
      }
    })

    // Save the last visited route if user is authenticated
    if (user && !isPublicRoute) {
      localStorage.setItem('lastRoute', location.pathname)
    }

    return () => subscription.unsubscribe()
  }, [navigate, user, isPublicRoute, location])

  // Restore last route on initial load
  useEffect(() => {
    if (user && !loading) {
      const lastRoute = localStorage.getItem('lastRoute')
      if (lastRoute && isPublicRoute) {
        navigate(lastRoute)
      }
    }
  }, [user, loading, navigate, isPublicRoute])

  if (loading) {
    return <LoadingScreen />
  }

  // Protected Route component
  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" />
    }
    return children
  }

  return (
    <div className={`app ${isPublicRoute ? 'public-route' : ''}`}>
      {/* Show navigation only when user is authenticated and not on public routes */}
      {user && !isPublicRoute && (
        <>
          <DesktopNav onToggle={(state) => setIsNavExpanded(state)} isExpanded={isNavExpanded} />
          <MobileNav />
        </>
      )}
      
      {/* ScrollToTop component to reset scroll position */}
      <ScrollToTop />
      
      <main className={isPublicRoute ? '' : `main-content ${isNavExpanded ? 'nav-expanded' : 'nav-collapsed'}`}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={user ? <Navigate to="/home" /> : <Landing />} />
          <Route path="/login" element={user ? <Navigate to="/home" /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to="/home" /> : <Signup />} />
          
          {/* Protected routes */}
          <Route path="/home" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route 
            path="/courses" 
            element={
              <ProtectedRoute>
                <Courses />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/WeekOneMaterials" 
            element={
              <ProtectedRoute>
                <WeekOneMaterials />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/projects" 
            element={
              <ProtectedRoute>
                <Projects />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/events" 
            element={
              <ProtectedRoute>
                <Events />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/leaderboard" 
            element={
              <ProtectedRoute>
                <Leaderboard />
              </ProtectedRoute>
            } 
          />

          {/* Auth callback route */}
          <Route path="/auth/callback" element={<Navigate to="/home" replace />} />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />

          <Route path="/auth/verify" element={<VerifyEmail />} />
        </Routes>
      </main>
    </div>
  )
}

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-spinner"></div>
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