import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { timelineApi } from '@/lib/api'
import { formatDateTime, timeAgo } from '@/lib/utils'
import type { TimelineEventType } from '@/types'
import {
  Zap, Bell, LogIn, MessageCircle,
  CheckCircle2, XCircle, Clock, Users,
} from 'lucide-react'

const eventConfig: Record<TimelineEventType, {
  icon: React.ElementType
  color: string
  bg: string
  border: string
  label: string
}> = {
  SCHEDULE_TRIGGER: {
    icon: Zap,
    color: '#60A5FA',
    bg: 'rgba(96,165,250,0.08)',
    border: 'rgba(96,165,250,0.2)',
    label: 'Schedule',
  },
  REMINDER_GENERATED: {
    icon: Bell,
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.2)',
    label: 'Reminder',
  },
  CHECKIN_GENERATED: {
    icon: LogIn,
    color: 'rgba(255,255,255,0.5)',
    bg: 'rgba(255,255,255,0.05)',
    border: 'rgba(255,255,255,0.1)',
    label: 'Check-in',
  },
  WHATSAPP_SENT: {
    icon: MessageCircle,
    color: '#34D399',
    bg: 'rgba(52,211,153,0.08)',
    border: 'rgba(52,211,153,0.2)',
    label: 'WhatsApp',
  },
  EMPLOYEE_REPLIED_YES: {
    icon: CheckCircle2,
    color: '#22C55E',
    bg: 'rgba(34,197,94,0.08)',
    border: 'rgba(34,197,94,0.2)',
    label: 'Replied YES',
  },
  ATTENDANCE_UPDATED_PRESENT: {
    icon: CheckCircle2,
    color: '#22C55E',
    bg: 'rgba(34,197,94,0.12)',
    border: 'rgba(34,197,94,0.3)',
    label: 'PRESENT',
  },
  TIMEOUT_TRIGGERED: {
    icon: Clock,
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.2)',
    label: 'Timeout',
  },
  ATTENDANCE_UPDATED_ABSENT: {
    icon: XCircle,
    color: '#EF4444',
    bg: 'rgba(239,68,68,0.08)',
    border: 'rgba(239,68,68,0.2)',
    label: 'ABSENT',
  },
}

function TimelineItem({ event, index, isFirst }: {
  event: ReturnType<typeof timelineApi.getAll> extends Promise<infer T> ? T extends (infer U)[] ? U : never : never
  index: number
  isFirst: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-20px' })
  const cfg = eventConfig[event.type as TimelineEventType]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -16 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-start gap-3.5 group"
    >
      {/* Icon */}
      <div
        className="relative z-10 w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300 group-hover:scale-105"
        style={{ background: cfg.bg, borderColor: cfg.border }}
      >
        <cfg.icon className="w-4 h-4 shrink-0" style={{ color: cfg.color }} />
        {isFirst && (
          <span
            className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-black"
            style={{ background: cfg.color }}
          >
            <span
              className="absolute inset-0 rounded-full animate-ping"
              style={{ background: cfg.color, opacity: 0.5 }}
            />
          </span>
        )}
      </div>

      {/* Card */}
      <div className="flex-1 glass-card rounded-xl p-3.5 hover:bg-white/[0.07] transition-all duration-200 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="text-[10px] font-semibold rounded-full px-2 py-0.5"
                style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
              >
                {cfg.label}
              </span>
              <span className="text-[13px] font-semibold text-white truncate">{event.label}</span>
            </div>
            <p className="text-[12px] text-white/45 mt-1 leading-relaxed">{event.description}</p>
            {(event.employeeName || event.placeName) && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {event.employeeName && (
                  <div className="flex items-center gap-1 text-[10px] text-white/40 bg-white/[0.05] rounded-md px-2 py-0.5">
                    <Users className="w-2.5 h-2.5" />
                    {event.employeeName}
                  </div>
                )}
                {event.placeName && (
                  <div className="flex items-center gap-1 text-[10px] text-white/40 bg-white/[0.05] rounded-md px-2 py-0.5">
                    <span>📍</span>
                    {event.placeName}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="text-right shrink-0">
            <div className="text-[11px] font-medium text-white/35">{timeAgo(event.timestamp)}</div>
            <div className="text-[10px] text-white/20 mt-0.5 whitespace-nowrap">{formatDateTime(event.timestamp)}</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function TimelinePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['timeline'],
    queryFn: timelineApi.getAll,
    refetchInterval: 30000,
  })

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-7">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-present opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-status-present" />
          </span>
          <span className="text-[11px] font-medium text-white/35 uppercase tracking-[0.1em]">Live Feed</span>
        </div>
        <h1 className="text-[26px] font-semibold text-white tracking-tight">Workflow Timeline</h1>
        <p className="text-[13px] text-white/35 mt-1">Real-time activity feed of all workflow automation events</p>
      </motion.div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-xl p-4 mb-6"
      >
        <div className="text-[10px] text-white/30 uppercase tracking-wider font-medium mb-3">Event Types</div>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(eventConfig) as [TimelineEventType, typeof eventConfig[TimelineEventType]][]).map(([, cfg]) => (
            <div
              key={cfg.label}
              className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium"
              style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
            >
              <cfg.icon className="w-2.5 h-2.5 shrink-0" />
              {cfg.label}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[18px] top-0 bottom-0 w-px bg-gradient-to-b from-white/20 via-white/10 to-transparent" />

        <div className="space-y-2.5">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex gap-3.5 pl-12">
                <div className="h-20 flex-1 glass-card rounded-xl animate-pulse" />
              </div>
            ))
          ) : (
            (data ?? []).map((event, i) => (
              <TimelineItem key={event.id} event={event} index={i} isFirst={i === 0} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
