import { NavLink } from 'react-router-dom'
import {
  Home,
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { useAppStore } from '../../store/appStore'
import { getManagementLinks, getWorkspaceLinks } from './navigation'

function NavSection({
  label,
  items,
}: {
  label: string
  items: Array<{ to: string; label: string; icon: typeof Home }>
}) {
  return (
    <div>
      <p className="mb-2 px-2 text-[0.65rem] uppercase tracking-[0.28em] text-slate-500">{label}</p>
      <nav className="space-y-1.5">
        {items.map(({ to, label: itemLabel, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-[1.15rem] px-3 py-3 text-sm text-slate-300 transition hover:bg-white/8 hover:text-white',
                isActive && 'bg-[linear-gradient(135deg,rgba(34,211,238,0.16),rgba(99,102,241,0.08))] text-cyan-100 shadow-[0_18px_50px_-35px_rgba(34,211,238,0.95)]',
              )
            }
          >
            <Icon className="size-4" />
            {itemLabel}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export function Sidebar() {
  const role = useAppStore((state) => state.currentUser?.role)
  const workspaceLinks = getWorkspaceLinks(role)
  const managementLinks = getManagementLinks(role)

  return (
    <aside className="sticky top-24 hidden h-[calc(100vh-7rem)] overflow-auto lg:block lg:w-[19rem]">
      <div className="glass-panel rounded-[2rem] border border-white/10 p-4">
        <NavLink
          to="/"
          className="mb-6 block rounded-[1.5rem] border border-cyan-300/15 bg-[linear-gradient(135deg,rgba(34,211,238,0.12),rgba(99,102,241,0.06))] p-4 transition hover:border-cyan-300/35 hover:bg-[linear-gradient(135deg,rgba(34,211,238,0.2),rgba(99,102,241,0.12))]"
          aria-label="Go to home page"
        >
          <p className="text-[0.7rem] uppercase tracking-[0.28em] text-cyan-200/80">Neural cockpit</p>
          <h3 className="mt-2 text-lg font-semibold text-white">Student Performance Predictor Pro</h3>
          <p className="mt-2 text-sm text-slate-400">
            Premium academic intelligence, intervention design, and cohort-level forecasting.
          </p>
        </NavLink>

        <div className="space-y-6">
          <NavSection label="Workspace" items={workspaceLinks} />
          <NavSection label="Operations" items={managementLinks} />
        </div>
      </div>
    </aside>
  )
}
