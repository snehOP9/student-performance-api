import * as React from 'react'
import { cn } from '../../lib/utils'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      className={cn(
        'flex h-12 w-full rounded-[1.15rem] border border-white/12 bg-[linear-gradient(180deg,rgba(2,6,23,0.88),rgba(15,23,42,0.75))] px-4 py-2 text-sm text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] placeholder:text-slate-500 transition-all duration-300 focus-visible:border-cyan-300/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/30',
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = 'Input'

export { Input }
