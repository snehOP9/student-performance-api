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
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card className="h-full">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-400">{title}</p>
            <p className="mt-2 text-3xl font-bold text-white">{value}</p>
            <p className="mt-1 text-sm text-emerald-300">{delta}</p>
          </div>
          <div className="rounded-2xl border border-cyan-300/30 bg-cyan-400/10 p-3">
            <Icon className="size-5 text-cyan-200" />
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
