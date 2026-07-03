import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'flex h-9 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-sm text-white placeholder:text-white/30',
        'focus:outline-none focus:ring-1 focus:ring-white/25 focus:border-white/25 transition-all',
        'disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
)
Input.displayName = 'Input'

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        'flex h-9 rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-sm text-white',
        'focus:outline-none focus:ring-1 focus:ring-white/25 focus:border-white/25 transition-all',
        'disabled:opacity-50 cursor-pointer',
        className
      )}
      style={{ colorScheme: 'dark' }}
      {...props}
    >
      {children}
    </select>
  )
)
Select.displayName = 'Select'
