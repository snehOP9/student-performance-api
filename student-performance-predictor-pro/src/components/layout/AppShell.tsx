import type { ReactNode } from 'react'
import { TopNav } from './TopNav'
import { Sidebar } from './Sidebar'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <TopNav />
      <div className="mx-auto flex max-w-[1500px]">
        <Sidebar />
        <main className="w-full p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
