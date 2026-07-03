import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface CardProps {
  className?: string
  children: ReactNode
  hoverable?: boolean
  shimmer?: boolean
}

export function Card({ className, children, hoverable, shimmer }: CardProps) {
  return (
    <div
      className={cn(
        'glass-card rounded-xl',
        hoverable && 'transition-all duration-300 hover:bg-white/[0.07] hover:border-white/15 hover:shadow-2xl cursor-pointer',
        shimmer && 'shimmer',
        className
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn('flex items-center justify-between p-5 pb-3', className)}>
      {children}
    </div>
  )
}

export function CardTitle({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <h3 className={cn('text-sm font-semibold text-white/90', className)}>
      {children}
    </h3>
  )
}

export function CardContent({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn('px-5 pb-5', className)}>
      {children}
    </div>
  )
}

interface StatCardProps {
  label: string
  value: string | number
  icon?: ReactNode
  trend?: { value: number; label: string }
  color?: 'white' | 'green' | 'amber' | 'red'
  className?: string
}

export function StatCard({ label, value, icon, trend, color = 'white', className }: StatCardProps) {
  const colorMap = {
    white: 'text-white',
    green: 'text-status-present',
    amber: 'text-status-waiting',
    red: 'text-status-absent',
  }
  return (
    <Card hoverable className={cn('p-5', className)}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-medium text-white/50 uppercase tracking-wider">{label}</span>
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40">
            {icon}
          </div>
        )}
      </div>
      <div className={cn('text-2xl font-semibold tracking-tight', colorMap[color])}>
        {value}
      </div>
      {trend && (
        <div className={cn('flex items-center gap-1 mt-2 text-xs', trend.value >= 0 ? 'text-status-present' : 'text-status-absent')}>
          <span>{trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%</span>
          <span className="text-white/30">{trend.label}</span>
        </div>
      )}
    </Card>
  )
}
