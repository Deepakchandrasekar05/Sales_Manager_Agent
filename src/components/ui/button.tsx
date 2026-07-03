import * as React from 'react'
import { cn } from '@/lib/utils'

export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'default' | 'outline' | 'ghost' | 'glass' | 'danger'
    size?: 'sm' | 'md' | 'lg'
  }
>(({ className, variant = 'default', size = 'md', ...props }, ref) => {
  const variants: Record<string, string> = {
    default: 'bg-white text-black hover:bg-white/90 shadow-lg shadow-white/10',
    outline: 'border border-white/20 bg-transparent text-white hover:bg-white/10',
    ghost: 'bg-transparent text-white hover:bg-white/10',
    glass: 'glass-heavy text-white hover:bg-white/15',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  }
  const sizes: Record<string, string> = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-9 px-4 text-sm',
    lg: 'h-11 px-6 text-sm',
  }
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
})
Button.displayName = 'Button'
