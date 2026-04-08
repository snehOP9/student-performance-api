import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { Card } from '../ui/card'

type Props = {
  title: string
  value: string
  delta: string
  icon: LucideIcon
}

export function MetricCard({ title, value, delta, icon: Icon }: Props) {
  return (
    <motion.div whileHover={{ y: -8, scale: 1.01 }} transition={{ duration: 0.25 }}>
      <Card className="h-full">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{title}</p>
            <p className="mt-3 text-3xl font-bold text-white">{value}</p>
            <p className="mt-2 text-sm text-emerald-300">{delta}</p>
          </div>
          <div className="rounded-[1.4rem] border border-cyan-300/30 bg-[linear-gradient(135deg,rgba(34,211,238,0.18),rgba(99,102,241,0.12))] p-3">
            <Icon className="size-5 text-cyan-200" />
          </div>
        </div>
        <div className="mt-5 h-px bg-gradient-to-r from-cyan-300/0 via-cyan-300/30 to-transparent" />
      </Card>
    </motion.div>
  )
}
