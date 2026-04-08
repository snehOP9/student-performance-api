import type { PropsWithChildren } from 'react'
import { motion } from 'framer-motion'

type MotionPageProps = PropsWithChildren<{
  className?: string
}>

export function MotionPage({ children, className }: MotionPageProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24, filter: 'blur(14px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
