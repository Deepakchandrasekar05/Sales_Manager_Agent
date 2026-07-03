import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Activity, BarChart3, ChevronLeft, ChevronRight,
  ClipboardList, LayoutDashboard, MessageSquare,
  Monitor, Timer, Zap, Home,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Overview', end: true },
  { to: '/dashboard/attendance', icon: ClipboardList, label: 'Attendance' },
  { to: '/dashboard/reply-tracking', icon: MessageSquare, label: 'Reply Tracking' },
  { to: '/dashboard/processed-events', icon: Zap, label: 'Processed Events' },
  { to: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/dashboard/timeline', icon: Timer, label: 'Timeline' },
  { to: '/dashboard/monitoring', icon: Monitor, label: 'Monitoring' },
]

interface SidebarProps {
  collapsed: boolean
  setCollapsed: (v: boolean) => void
}

export function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  return (
    <motion.aside
      animate={{ width: collapsed ? 60 : 224 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="hidden md:flex flex-col h-screen sticky top-0 bg-black border-r border-white/[0.06] shrink-0 z-30"
      style={{ minWidth: collapsed ? 60 : 224 }}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center h-16 border-b border-white/[0.06] overflow-hidden transition-all duration-300',
        collapsed ? 'px-[14px]' : 'px-4 gap-2.5'
      )}>
        <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shrink-0">
          <Activity className="w-3.5 h-3.5 text-black" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10, width: 0 }}
              animate={{ opacity: 1, x: 0, width: 'auto' }}
              exit={{ opacity: 0, x: -10, width: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <div className="text-[13px] font-semibold text-white">SalesAgent</div>
              <div className="text-[10px] text-white/30">Attendance System</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-hidden">
        {!collapsed && (
          <div className="px-2.5 pb-2 text-[10px] font-semibold text-white/20 uppercase tracking-[0.12em]">
            Navigation
          </div>
        )}
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            title={collapsed ? item.label : undefined}
            className={({ isActive }) =>
              cn(
                'flex items-center rounded-lg text-[13px] font-medium transition-all duration-150 group relative overflow-hidden',
                collapsed ? 'justify-center h-9 w-9 mx-auto' : 'gap-2.5 px-2.5 py-2',
                isActive
                  ? 'bg-white/[0.09] text-white border border-white/[0.1]'
                  : 'text-white/40 hover:text-white/80 hover:bg-white/[0.05]'
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn('w-4 h-4 shrink-0 transition-colors duration-150', isActive ? 'text-white' : 'text-white/40 group-hover:text-white/70')} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.15 }}
                      className="whitespace-nowrap leading-none"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full bg-white/60"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Live status badge */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="mx-2 mb-2 p-3 rounded-lg bg-white/[0.03] border border-white/[0.05]"
          >
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-present opacity-50" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-status-present" />
              </span>
              <span className="text-[11px] text-white/50 font-medium">All Systems Live</span>
            </div>
            <div className="text-[10px] text-white/25 mt-1 ml-4">Refreshing every 30s</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Home link */}
      <div className="px-2 py-2 border-t border-white/[0.06] space-y-0.5">
        <NavLink
          to="/"
          title={collapsed ? 'Home' : undefined}
          className={cn(
            'flex items-center rounded-lg text-[13px] font-medium text-white/30 hover:text-white/70 hover:bg-white/[0.05] transition-all duration-150',
            collapsed ? 'justify-center h-9 w-9 mx-auto' : 'gap-2.5 px-2.5 py-2'
          )}
        >
          <Home className="w-4 h-4 shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="whitespace-nowrap"
              >
                Back to Home
              </motion.span>
            )}
          </AnimatePresence>
        </NavLink>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={cn(
            'w-full flex items-center rounded-lg text-[13px] font-medium text-white/25 hover:text-white/60 hover:bg-white/[0.05] transition-all duration-150',
            collapsed ? 'justify-center h-9' : 'gap-2.5 px-2.5 py-2'
          )}
        >
          {collapsed
            ? <ChevronRight className="w-4 h-4 shrink-0" />
            : (
              <>
                <ChevronLeft className="w-4 h-4 shrink-0" />
                <AnimatePresence>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="whitespace-nowrap"
                  >
                    Collapse
                  </motion.span>
                </AnimatePresence>
              </>
            )
          }
        </button>
      </div>
    </motion.aside>
  )
}

export function MobileTopBar() {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      <div className="flex items-center justify-between px-4 h-14 bg-black border-b border-white/[0.06] sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center">
            <Activity className="w-3.5 h-3.5 text-black" />
          </div>
          <span className="text-[13px] font-semibold text-white">SalesAgent</span>
        </div>
        <button
          className="text-white/40 hover:text-white transition-colors p-1"
          onClick={() => setOpen(v => !v)}
        >
          {open
            ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          }
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="bg-black border-b border-white/[0.06] px-3 py-2 space-y-0.5 overflow-hidden"
          >
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all',
                    isActive
                      ? 'bg-white/[0.09] text-white border border-white/[0.1]'
                      : 'text-white/40 hover:text-white/80 hover:bg-white/[0.05]'
                  )
                }
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
