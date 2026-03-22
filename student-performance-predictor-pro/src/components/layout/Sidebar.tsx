import { NavLink } from 'react-router-dom'
import { BarChart3, Building2, ClipboardPenLine, Compass, Contact, Gauge, History, Home, Landmark, Lightbulb, Settings, User, Users } from 'lucide-react'
import { cn } from '../../lib/utils'

const items = [
  { to: '/dashboard', label: 'Dashboard', icon: Home },
  { to: '/assessment', label: 'Assessment', icon: ClipboardPenLine },
  { to: '/prediction', label: 'Prediction', icon: Gauge },
  { to: '/recommendations', label: 'Recommendations', icon: Lightbulb },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/institutional', label: 'Institutional', icon: Building2 },
  { to: '/teacher', label: 'Teacher', icon: Users },
  { to: '/profile', label: 'Student Profile', icon: User },
  { to: '/history', label: 'History', icon: History },
  { to: '/compare', label: 'Compare Profiles', icon: Compass },
  { to: '/roadmap', label: 'Roadmap', icon: Landmark },
  { to: '/about', label: 'Methodology', icon: Contact },
  { to: '/support', label: 'Support', icon: Contact },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] overflow-auto border-r border-white/10 bg-slate-950/60 px-3 py-6 lg:block lg:w-72">
      <nav className="space-y-1">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/10',
                isActive && 'bg-cyan-400/15 text-cyan-200',
              )
            }
          >
            <Icon className="size-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
