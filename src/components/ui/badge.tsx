import * as React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'present' | 'absent' | 'waiting' | 'confirmed' | 'pending' | 'timeout' | 'declined' | 'active' | 'warning' | 'failed'
}

const variantClasses: Record<string, string> = {
  default: 'bg-white/10 text-white/80 border-white/20',
  present: 'status-present border',
  absent: 'status-absent border',
  waiting: 'status-waiting border',
  confirmed: 'status-present border',
  pending: 'status-waiting border',
  timeout: 'status-absent border',
  declined: 'status-absent border',
  active: 'status-present border',
  warning: 'status-waiting border',
  failed: 'status-absent border',
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function StatusDot({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    PRESENT: 'bg-status-present',
    CONFIRMED: 'bg-status-present',
    ABSENT: 'bg-status-absent',
    TIMEOUT: 'bg-status-absent',
    DECLINED: 'bg-status-absent',
    WAITING: 'bg-status-waiting',
    PENDING: 'bg-status-waiting',
    healthy: 'bg-status-active',
    warning: 'bg-status-warning',
    failed: 'bg-status-failed',
  }
  const pulseMap: Record<string, string> = {
    PRESENT: 'pulse-dot-green',
    CONFIRMED: 'pulse-dot-green',
    healthy: 'pulse-dot-green',
    WAITING: 'pulse-dot-amber',
    PENDING: 'pulse-dot-amber',
    warning: 'pulse-dot-amber',
    ABSENT: 'pulse-dot-red',
    TIMEOUT: 'pulse-dot-red',
    DECLINED: 'pulse-dot-red',
    failed: 'pulse-dot-red',
  }
  return (
    <span className={cn('pulse-dot', pulseMap[status])}>
      <span className={cn('block w-2 h-2 rounded-full', colorMap[status] || 'bg-white/40')} />
    </span>
  )
}
