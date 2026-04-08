import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-cyan-300/30 bg-[linear-gradient(135deg,rgba(34,211,238,0.18),rgba(96,165,250,0.12))] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-cyan-100 shadow-[0_12px_40px_-20px_rgba(34,211,238,0.7)]',
        className,
      )}
      {...props}
    />
  )
}
