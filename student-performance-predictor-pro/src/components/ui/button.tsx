import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-[1.15rem] border text-sm font-semibold tracking-[0.01em] transition-all duration-300 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/0 before:via-white/15 before:to-white/0 before:opacity-0 before:transition before:duration-500 hover:-translate-y-0.5 hover:before:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-[linear-gradient(135deg,#67e8f9_0%,#60a5fa_48%,#8b5cf6_100%)] text-slate-950 shadow-[0_20px_60px_-28px_rgba(56,189,248,0.95)] hover:shadow-[0_28px_80px_-28px_rgba(129,140,248,0.85)]',
        ghost:
          'border-transparent bg-transparent text-slate-100 hover:bg-white/8 hover:text-white',
        outline:
          'border-white/14 bg-white/6 text-slate-100 shadow-[0_16px_60px_-36px_rgba(56,189,248,0.75)] hover:border-cyan-300/35 hover:bg-white/10',
        danger:
          'border-transparent bg-[linear-gradient(135deg,#fb7185,#f97316)] text-white shadow-[0_20px_60px_-28px_rgba(251,113,133,0.8)]',
      },
      size: {
        default: 'h-11 px-5',
        sm: 'h-9 rounded-2xl px-3 text-xs',
        lg: 'h-12 px-7 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  },
)
Button.displayName = 'Button'

export { Button }
