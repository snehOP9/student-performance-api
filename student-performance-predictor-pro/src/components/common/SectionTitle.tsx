import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

type Props = {
  title: string
  subtitle?: string
  action?: ReactNode
  eyebrow?: string
}

export function SectionTitle({ title, subtitle, action, eyebrow = 'AI command layer' }: Props) {
  return (
    <motion.div
      className="mb-6 flex flex-wrap items-end justify-between gap-4"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      <div>
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-cyan-200/80">
          {eyebrow}
        </p>
        <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">{title}</h2>
        {subtitle && <p className="mt-2 max-w-3xl text-sm text-slate-300 md:text-base">{subtitle}</p>}
      </div>
      {action}
    </motion.div>
  )
}
