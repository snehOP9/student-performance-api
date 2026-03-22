import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Toaster } from 'sonner'
import { useAppStore } from './store/appStore'
import { AppShell } from './components/layout/AppShell'
import { LandingPage } from './pages/LandingPage'
import { LoginPage, SignupPage, ForgotPasswordPage } from './pages/AuthPages'
import { DashboardPage } from './pages/DashboardPage'
import { AssessmentPage } from './pages/AssessmentPage'
import { PredictionResultPage } from './pages/PredictionResultPage'
import { RecommendationsPage } from './pages/RecommendationsPage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { InstitutionalDashboardPage } from './pages/InstitutionalDashboardPage'
import { TeacherDashboardPage } from './pages/TeacherDashboardPage'
import { StudentProfilePage } from './pages/StudentProfilePage'
import { AboutMethodologyPage } from './pages/AboutMethodologyPage'
import { ContactSupportPage } from './pages/ContactSupportPage'
import { SettingsPage } from './pages/SettingsPage'
import { PredictionHistoryPage } from './pages/PredictionHistoryPage'
import { CompareProfilesPage } from './pages/CompareProfilesPage'
import { RoadmapPage } from './pages/RoadmapPage'
import { OnboardingPage } from './pages/OnboardingPage'

function RoutedShell() {
  const location = useLocation()
  const isPublic = ['/', '/login', '/signup', '/forgot-password'].includes(location.pathname)

  if (isPublic) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    )
  }

  return (
    <AppShell>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/assessment" element={<AssessmentPage />} />
        <Route path="/prediction" element={<PredictionResultPage />} />
        <Route path="/recommendations" element={<RecommendationsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/institutional" element={<InstitutionalDashboardPage />} />
        <Route path="/teacher" element={<TeacherDashboardPage />} />
        <Route path="/profile" element={<StudentProfilePage />} />
        <Route path="/history" element={<PredictionHistoryPage />} />
        <Route path="/compare" element={<CompareProfilesPage />} />
        <Route path="/roadmap" element={<RoadmapPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/about" element={<AboutMethodologyPage />} />
        <Route path="/support" element={<ContactSupportPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppShell>
  )
}

function App() {
  const { theme } = useAppStore()

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light')
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <>
      <RoutedShell />
      <Toaster richColors position="top-right" />
    </>
  )
}

export default App
