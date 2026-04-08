import type { ReactNode } from 'react'
import { Card } from '../ui/card'

type Props = {
  title: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
}

export function ChartCard({ title, subtitle, action, children }: Props) {
  return (
    <Card className="min-h-[24rem]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.24em] text-cyan-200/75">Live analytics</p>
          <h3 className="mt-2 text-xl font-semibold text-white">{title}</h3>
          {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="h-80">{children}</div>
    </Card>
  )
}
