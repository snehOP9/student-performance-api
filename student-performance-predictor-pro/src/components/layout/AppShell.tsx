import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { DashboardAmbientScene } from '../three/DashboardAmbientScene'
import { cn } from '../../lib/utils'
import { useAppStore } from '../../store/appStore'
import { Sidebar } from './Sidebar'
import { getWorkspaceLinks } from './navigation'
import { TopNav } from './TopNav'

export function AppShell({ children }: { children: ReactNode }) {
  const role = useAppStore((state) => state.currentUser?.role)
  const workspaceLinks = getWorkspaceLinks(role)

  return (
    <div className="relative min-h-screen text-slate-100">
      <DashboardAmbientScene />
      <TopNav />
      <div className="mx-auto flex max-w-[1600px] gap-6 px-4 pb-24 pt-6 lg:px-6">
        <Sidebar />
        <main className="w-full min-w-0">{children}</main>
      </div>
      <nav className="fixed inset-x-4 bottom-4 z-40 flex items-center justify-between rounded-[1.6rem] border border-white/10 bg-slate-950/75 p-2 backdrop-blur-2xl lg:hidden">
        {workspaceLinks.slice(0, 5).map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex flex-1 flex-col items-center gap-1 rounded-[1.1rem] px-2 py-2 text-[0.65rem] text-slate-400 transition',
                isActive && 'bg-cyan-400/12 text-cyan-100',
              )
            }
          >
            <Icon className="size-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
