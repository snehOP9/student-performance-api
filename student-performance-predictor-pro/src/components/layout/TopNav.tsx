import { Bell, LogOut, Moon, Sparkles, Sun } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { logoutSession } from '../../lib/api'
import { clearSessionTokens, readSessionTokens } from '../../lib/session'
import { useAppStore } from '../../store/appStore'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'

export function TopNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const {
    apiStatus,
    theme,
    setTheme,
    currentUser,
    clearAuthState,
  } = useAppStore()

  const routeLabel =
    location.pathname === '/'
      ? 'Landing'
      : location.pathname
          .split('/')
          .filter(Boolean)
          .join(' / ')

  const handleLogout = async () => {
    const { refreshToken } = readSessionTokens()
    try {
      if (refreshToken) {
        await logoutSession(refreshToken)
      }
    } catch {
      // Best-effort server logout; local session is still cleared below.
    } finally {
      clearSessionTokens()
      clearAuthState()
      toast.success('You have been signed out.')
      navigate('/login')
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/55 backdrop-blur-2xl">
      <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-4 lg:px-8">
        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.34em] text-cyan-300/80">
            Student Performance Predictor Pro
          </p>
          <p className="mt-2 text-sm text-slate-200">
            Predict risk. Improve outcomes. Empower every student.
          </p>
          <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-500">{routeLabel}</p>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            className={
              apiStatus === 'offline'
                ? 'border-amber-300/30 bg-amber-400/10 text-amber-100'
                : ''
            }
          >
            <span
              className={`mr-2 inline-block size-2 rounded-full ${
                apiStatus === 'offline'
                  ? 'bg-amber-300'
                  : apiStatus === 'checking'
                    ? 'bg-slate-300'
                    : 'bg-emerald-300'
              }`}
            />
            {apiStatus === 'offline'
              ? 'Fallback mode'
              : apiStatus === 'checking'
                ? 'Checking API'
                : 'AI online'}
          </Badge>
          {currentUser && (
            <div className="hidden rounded-[1rem] border border-white/10 bg-white/5 px-3 py-2 text-right md:block">
              <p className="text-sm text-white">{currentUser.full_name}</p>
              <p className="text-[0.72rem] uppercase tracking-[0.18em] text-slate-500">{currentUser.role}</p>
            </div>
          )}
          <Link to="/assessment">
            <Button size="sm">
              <Sparkles className="mr-2 size-4" />
              New assessment
            </Button>
          </Link>
          <Button variant="ghost" size="sm" aria-label="Notifications">
            <Bell className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
          <Button variant="ghost" size="sm" aria-label="Log out" onClick={handleLogout}>
            <LogOut className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
