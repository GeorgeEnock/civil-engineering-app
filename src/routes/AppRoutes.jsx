import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../supabase.js'
import MainLayout from '../layouts/MainLayout.jsx'
import Dashboard from '../pages/Dashboard.jsx'
import Projects from '../pages/Projects.jsx'
import SectionLanding from '../pages/SectionLanding.jsx'
import SectionDetail from '../pages/SectionDetail.jsx'
import Documents from '../pages/Documents.jsx'
import Reports from '../pages/Reports.jsx'
import Settings from '../pages/Settings.jsx'
import Login from '../pages/Login.jsx'
import LoadingPage from '../pages/LoadingPage.jsx'
import AboutDev from '../pages/AboutDev.jsx'

function RequireAuth({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return <LoadingPage />
  }

  return session ? children : <Navigate to="/login" replace />
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/about-dev" element={<AboutDev />} />
      <Route
        element={
          <RequireAuth>
            <MainLayout />
          </RequireAuth>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/construction" element={<SectionLanding />} />
        <Route path="/civil-engineering" element={<SectionLanding />} />
        <Route path="/architecture" element={<SectionLanding />} />
        <Route path="/project-management" element={<SectionLanding />} />
        <Route path="/specialized" element={<SectionLanding />} />
        <Route path="/:section/:item" element={<SectionDetail />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}