import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import DesktopNav from './components/navigation/DesktopNav'
import MobileNav from './components/navigation/MobileNav'
import ScrollToTop from './components/layout/ScrollToTop'
import Home from './pages/Home'
import Courses from './pages/Courses'
import WeekOneMaterials from './pages/WeekOneMaterials'
import WeeklyAssignment from './pages/WeeklyAssignment'
import Blog from './pages/Blog'
import WriteArticle from './pages/WriteArticle'
import ArticleView from './pages/ArticleView'
import Events from './pages/Events'
import Profile from './pages/Profile'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Leaderboard from './pages/Leaderboard'
import CourseManagement from './pages/admin/CourseManagement'
import ModuleEditor from './pages/admin/ModuleEditor'
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
  const navigate = useNavigate()
  const isPublicRoute = location.pathname === '/' || 
    location.pathname === '/login' || 
    location.pathname === '/signup' || 
    location.pathname === '/auth/verify'

  // Update the hideNavOnRoutes array to include the write page
  const hideNavOnRoutes = ['/WeekOneMaterials', '/weekly-assignment', '/write', '/blog/edit']
  const shouldHideMobileNav = hideNavOnRoutes.some(route => location.pathname.startsWith(route))

  // Add this new check for article view pages
  const isArticleView = location.pathname.startsWith('/blog/') && 
    location.pathname !== '/blog/edit/' && 
    location.pathname !== '/blog'

  // Save nav state to localStorage
  useEffect(() => {
    if (!isPublicRoute) {
      localStorage.setItem('navState', JSON.stringify(isNavExpanded))
    }
  }, [isNavExpanded, isPublicRoute])

  // Modified auth state change handler with debounce
  useEffect(() => {
    let timeoutId;
    
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (timeoutId) clearTimeout(timeoutId);
      
      timeoutId = setTimeout(() => {
        if (event === 'SIGNED_IN') {
          // Only navigate to home if we're on a public route
          if (isPublicRoute) {
            navigate('/home', { replace: true })
          }
        } else if (event === 'SIGNED_OUT') {
          navigate('/login', { replace: true })
        }
      }, 100);
    })

    return () => {
      subscription.unsubscribe()
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [navigate, isPublicRoute])

  // Restore last route on initial load with debounce
  useEffect(() => {
    if (!loading) {
      const timeoutId = setTimeout(() => {
        if (user) {
          const lastRoute = localStorage.getItem('lastRoute')
          if (lastRoute && isPublicRoute) {
            navigate(lastRoute, { replace: true })
          }
        }
      }, 100)

      return () => clearTimeout(timeoutId)
    }
  }, [user, loading, navigate, isPublicRoute])

  // Save the current route
  useEffect(() => {
    if (user && !isPublicRoute && !loading) {
      localStorage.setItem('lastRoute', location.pathname)
    }
  }, [location.pathname, user, isPublicRoute, loading])

  // Show loading screen while auth state is being determined
  if (loading) {
    return <LoadingScreen />;
  }

  // Protected Route component
  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" replace />
    }
    return children
  }

  // Admin Route component
  const AdminRoute = ({ children }) => {
    const { user } = useAuth();
    const isAdmin = user?.user_metadata?.role === 'admin';
    
    if (!user || !isAdmin) {
      return <Navigate to="/home" replace />;
    }
    return children;
  };

  return (
    <div className={`app ${isPublicRoute ? 'public-route' : ''}`}>
      {/* Show navigation only when user is authenticated and not on public routes */}
      {user && !isPublicRoute && (
        <>
          <DesktopNav onToggle={(state) => setIsNavExpanded(state)} isExpanded={isNavExpanded} />
          {!shouldHideMobileNav && !isArticleView && <MobileNav />}
        </>
      )}
      
      {/* ScrollToTop component to reset scroll position */}
      <ScrollToTop />
      
      <main className={isPublicRoute ? '' : `main-content ${isNavExpanded ? 'nav-expanded' : 'nav-collapsed'}`}>
        <div className="content-wrapper">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={user ? <Navigate to="/home" replace /> : <Landing />} />
            <Route path="/login" element={user ? <Navigate to="/home" replace /> : <Login />} />
            <Route path="/signup" element={user ? <Navigate to="/home" replace /> : <Signup />} />
            
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
              path="/weekly-assignment/:weekId" 
              element={
                <ProtectedRoute>
                  <WeeklyAssignment />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/blog" 
              element={
                <ProtectedRoute>
                  <Blog />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/blog/:slug" 
              element={
                <ProtectedRoute>
                  <ArticleView />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/write" 
              element={
                <ProtectedRoute>
                  <WriteArticle />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/blog/edit/:id" 
              element={
                <ProtectedRoute>
                  <WriteArticle isEditing={true} />
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

            {/* Admin routes */}
            <Route 
              path="/admin/courses" 
              element={
                <AdminRoute>
                  <CourseManagement />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/courses/module/:moduleId" 
              element={
                <AdminRoute>
                  <ModuleEditor />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/courses/module/:moduleId/preview" 
              element={
                <AdminRoute>
                  <WeekOneMaterials />
                </AdminRoute>
              } 
            />

            {/* Auth callback route */}
            <Route path="/auth/callback" element={<Navigate to="/home" replace />} />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />

            <Route path="/auth/verify" element={<VerifyEmail />} />
          </Routes>
        </div>
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