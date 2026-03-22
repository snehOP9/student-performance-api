import { Bell, Moon, Sun } from 'lucide-react'
import { useAppStore } from '../../store/appStore'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'

export function TopNav() {
  const { theme, setTheme } = useAppStore()

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-4 lg:px-8">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">Student Performance Predictor Pro</p>
          <p className="text-sm text-slate-400">Predict risk. Improve outcomes. Empower every student.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge>AI online</Badge>
          <Button variant="ghost" size="sm">
            <Bell className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
        </div>
      </div>
    </header>
  )
}
