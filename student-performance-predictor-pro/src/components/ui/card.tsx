import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[1.9rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.82),rgba(15,23,42,0.54))] p-5 shadow-[0_24px_120px_-48px_rgba(56,189,248,0.62)] backdrop-blur-2xl',
        className,
      )}
      {...props}
    />
  )
}
