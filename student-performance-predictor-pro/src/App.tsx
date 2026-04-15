import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AppShell } from './components/layout/AppShell'
import { healthCheck } from './lib/api'
import { useAppStore } from './store/appStore'
import { AboutMethodologyPage } from './pages/AboutMethodologyPage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { AssessmentPage } from './pages/AssessmentPage'
import { CompareProfilesPage } from './pages/CompareProfilesPage'
import { ContactSupportPage } from './pages/ContactSupportPage'
import { DashboardPage } from './pages/DashboardPage'
import { HowItWorksPage } from './pages/HowItWorksPage'
import { InstitutionalDashboardPage } from './pages/InstitutionalDashboardPage'
import { LandingPage } from './pages/LandingPage'
import { ModelGovernancePage } from './pages/ModelGovernancePage'
import { ModelLimitationsPage } from './pages/ModelLimitationsPage'
import { OnboardingPage } from './pages/OnboardingPage'
import { PredictionHistoryPage } from './pages/PredictionHistoryPage'
import { PredictionResultPage } from './pages/PredictionResultPage'
import { PrivacyPage } from './pages/PrivacyPage'
import { RecommendationsPage } from './pages/RecommendationsPage'
import { RoadmapPage } from './pages/RoadmapPage'
import { SettingsPage } from './pages/SettingsPage'
import { StudentProfilePage } from './pages/StudentProfilePage'
import { TeacherDashboardPage } from './pages/TeacherDashboardPage'
import { TermsPage } from './pages/TermsPage'

function HomeRoute() {
  const currentUser = useAppStore((state) => state.currentUser)

  if (!currentUser) {
    return <LandingPage />
  }

  if (currentUser.role === 'admin') {
    return <Navigate to="/institutional" replace />
  }

  if (currentUser.role === 'teacher') {
    return <Navigate to="/teacher" replace />
  }

  return <Navigate to="/student" replace />
}

function RoutedShell() {
  return (
    <Routes>
      <Route path="/" element={<HomeRoute />} />
      <Route path="/login" element={<Navigate to="/dashboard" replace />} />
      <Route path="/signup" element={<Navigate to="/dashboard" replace />} />
      <Route path="/forgot-password" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="*"
        element={
          <AppShell>
            <Routes>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/student" element={<StudentProfilePage />} />
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
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/limitations" element={<ModelLimitationsPage />} />
              <Route path="/governance" element={<ModelGovernancePage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/support" element={<ContactSupportPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </AppShell>
        }
      />
    </Routes>
  )
}

function App() {
  const { setApiStatus, theme } = useAppStore()

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light')
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  useEffect(() => {
    let mounted = true

    healthCheck()
      .then((result) => {
        if (!mounted) return
        const isOffline = String(result?.status ?? '').toLowerCase() === 'offline'
        setApiStatus(isOffline ? 'offline' : 'online')
      })
      .catch(() => {
        if (mounted) {
          setApiStatus('offline')
        }
      })

    return () => {
      mounted = false
    }
  }, [setApiStatus])

  return (
    <>
      <RoutedShell />
      <Toaster richColors position="top-right" />
    </>
  )
}

export default App
