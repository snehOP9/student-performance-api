import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_80px_-30px_rgba(34,211,238,0.4)] backdrop-blur-xl',
        className,
      )}
      {...props}
    />
  )
}
