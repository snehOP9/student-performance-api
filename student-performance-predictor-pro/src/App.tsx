import type { ReactElement } from 'react'
import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AppShell } from './components/layout/AppShell'
import { fetchMe, healthCheck, refreshSession } from './lib/api'
import { clearSessionTokens, readSessionTokens, storeSessionTokens } from './lib/session'
import { useAppStore } from './store/appStore'
import type { UserRole } from './types'
import { AboutMethodologyPage } from './pages/AboutMethodologyPage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { AssessmentPage } from './pages/AssessmentPage'
import { LoginPage, SignupPage, ForgotPasswordPage } from './pages/AuthPages'
import { CompareProfilesPage } from './pages/CompareProfilesPage'
import { ContactSupportPage } from './pages/ContactSupportPage'
import { DashboardPage } from './pages/DashboardPage'
import { InstitutionalDashboardPage } from './pages/InstitutionalDashboardPage'
import { LandingPage } from './pages/LandingPage'
import { OnboardingPage } from './pages/OnboardingPage'
import { PredictionHistoryPage } from './pages/PredictionHistoryPage'
import { PredictionResultPage } from './pages/PredictionResultPage'
import { RecommendationsPage } from './pages/RecommendationsPage'
import { RoadmapPage } from './pages/RoadmapPage'
import { SettingsPage } from './pages/SettingsPage'
import { StudentProfilePage } from './pages/StudentProfilePage'
import { TeacherDashboardPage } from './pages/TeacherDashboardPage'

function FullPageStatus({ label }: { label: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-center">
      <div className="rounded-[1.75rem] border border-white/10 bg-white/5 px-8 py-6">
        <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/80">Session</p>
        <p className="mt-3 text-sm text-slate-200">{label}</p>
      </div>
    </div>
  )
}

function RequireAuth({
  children,
  roles,
}: {
  children: ReactElement
  roles?: UserRole[]
}) {
  const location = useLocation()
  const { authStatus, currentUser } = useAppStore()

  if (authStatus === 'checking') {
    return <FullPageStatus label="Restoring your secure session..." />
  }

  if (authStatus !== 'authenticated' || !currentUser) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (roles && !roles.includes(currentUser.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

function PublicOnly({ children }: { children: ReactElement }) {
  const { authStatus } = useAppStore()
  if (authStatus === 'checking') {
    return <FullPageStatus label="Checking your session..." />
  }
  if (authStatus === 'authenticated') {
    return <Navigate to="/dashboard" replace />
  }
  return children
}

function RoutedShell() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicOnly>
            <LandingPage />
          </PublicOnly>
        }
      />
      <Route
        path="/login"
        element={
          <PublicOnly>
            <LoginPage />
          </PublicOnly>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicOnly>
            <SignupPage />
          </PublicOnly>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicOnly>
            <ForgotPasswordPage />
          </PublicOnly>
        }
      />
      <Route
        path="*"
        element={
          <RequireAuth>
            <AppShell>
              <Routes>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/assessment" element={<AssessmentPage />} />
                <Route path="/prediction" element={<PredictionResultPage />} />
                <Route path="/recommendations" element={<RecommendationsPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route
                  path="/institutional"
                  element={
                    <RequireAuth roles={['admin']}>
                      <InstitutionalDashboardPage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/teacher"
                  element={
                    <RequireAuth roles={['teacher', 'admin']}>
                      <TeacherDashboardPage />
                    </RequireAuth>
                  }
                />
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
          </RequireAuth>
        }
      />
    </Routes>
  )
}

function App() {
  const {
    setApiStatus,
    theme,
    setAuthStatus,
    setAuthenticated,
    clearAuthState,
  } = useAppStore()

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

  useEffect(() => {
    let mounted = true

    async function bootstrapSession() {
      setAuthStatus('checking')
      const { accessToken, refreshToken } = readSessionTokens()

      if (!accessToken && !refreshToken) {
        if (mounted) clearAuthState()
        return
      }

      try {
        if (accessToken) {
          const user = await fetchMe(accessToken)
          if (mounted) setAuthenticated(user)
          return
        }

        throw new Error('Access token missing')
      } catch {
        if (!refreshToken) {
          clearSessionTokens()
          if (mounted) clearAuthState()
          return
        }
      }

      try {
        const refreshed = await refreshSession(refreshToken!)
        if (!refreshed.access_token || !refreshed.refresh_token) {
          throw new Error('Refresh did not return new tokens')
        }

        storeSessionTokens(refreshed.access_token, refreshed.refresh_token)
        const user = await fetchMe(refreshed.access_token)
        if (mounted) setAuthenticated(user)
      } catch {
        clearSessionTokens()
        if (mounted) clearAuthState()
      }
    }

    void bootstrapSession()

    return () => {
      mounted = false
    }
  }, [clearAuthState, setAuthStatus, setAuthenticated])

  return (
    <>
      <RoutedShell />
      <Toaster richColors position="top-right" />
    </>
  )
}

export default App
