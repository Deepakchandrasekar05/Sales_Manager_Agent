import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import {
  Activity, AlertTriangle, ArrowUpRight, CheckCircle2,
  Clock, MessageSquare, Users, Zap,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { Badge, StatusDot } from '@/components/ui/badge'
import { CardSkeleton } from '@/components/ui/skeleton'
import { analyticsApi, attendanceLogApi, systemApi } from '@/lib/api'
import { formatDateTime, timeAgo } from '@/lib/utils'
import { cn } from '@/lib/utils'

const stagger = {
  visible: { transition: { staggerChildren: 0.06 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
}

const sparkData = [2, 5, 3, 8, 6, 9, 7, 11, 8, 13, 11, 14]
const sparkDataInv = [14, 11, 13, 8, 10, 6, 8, 4, 7, 3, 5, 2]
const sparkDataFlat = [4, 5, 5, 6, 4, 5, 6, 5, 4, 5, 6, 5]

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const chartData = data.map((v, i) => ({ v, i }))
  return (
    <ResponsiveContainer width="100%" height={32}>
      <LineChart data={chartData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}

function StatCard2({
  label, value, sub, icon: Icon, color, sparkData: sd, href, loading,
}: {
  label: string
  value: string | number
  sub?: string
  icon: React.ElementType
  color: string
  sparkData?: number[]
  href?: string
  loading?: boolean
}) {
  if (loading) return <CardSkeleton />

  const card = (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="glass-card rounded-xl p-4 group relative overflow-hidden"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', `bg-[${color}]/10`)}>
          <Icon className="w-4 h-4 shrink-0" style={{ color }} />
        </div>
        {href && (
          <ArrowUpRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 transition-colors duration-200" />
        )}
      </div>
      <div className="space-y-0.5 mb-2">
        <div className="text-[22px] font-semibold text-white tracking-tight">{value}</div>
        <div className="text-[11px] font-medium text-white/40 uppercase tracking-wider">{label}</div>
        {sub && <div className="text-[11px] text-white/30">{sub}</div>}
      </div>
      {sd && (
        <div className="mt-2 opacity-40 group-hover:opacity-70 transition-opacity">
          <MiniSparkline data={sd} color={color} />
        </div>
      )}
    </motion.div>
  )

  return href ? <Link to={href}>{card}</Link> : card
}

export default function OverviewPage() {
  const { data: summary, isLoading: loadingSum } = useQuery({
    queryKey: ['analytics-summary'],
    queryFn: analyticsApi.getSummary,
    refetchInterval: 30000,
  })
  const { data: attendanceLog, isLoading: loadingAtt } = useQuery({
    queryKey: ['attendance-log'],
    queryFn: attendanceLogApi.getAll,
    refetchInterval: 30000,
  })
  const { data: health } = useQuery({
    queryKey: ['system-health'],
    queryFn: systemApi.getHealth,
    refetchInterval: 30000,
  })

  const recent = attendanceLog?.slice(0, 7) ?? []

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-present opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-status-present" />
            </span>
            <span className="text-[11px] font-medium text-white/35 uppercase tracking-[0.1em]">Live Dashboard</span>
          </div>
          <h1 className="text-[26px] font-semibold text-white tracking-tight">Overview</h1>
          <p className="text-[13px] text-white/35 mt-1">Sales Manager Attendance Agent · Real-time operational status from Google Sheets</p>
        </div>
        <div className="text-[11px] text-white/25 hidden sm:block">
          Auto-refresh every 30s
        </div>
      </motion.div>

      {/* Stat Cards */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6"
      >
        {loadingSum ? (
          Array.from({ length: 6 }).map((_, i) => <div key={i}><CardSkeleton /></div>)
        ) : (
          <>
            <StatCard2 label="Present" value={summary?.presentCount ?? 0} icon={CheckCircle2} color="#22C55E" sparkData={sparkData} href="/dashboard/reply-tracking" />
            <StatCard2 label="Absent" value={summary?.absentCount ?? 0} icon={AlertTriangle} color="#EF4444" sparkData={sparkDataInv} href="/dashboard/reply-tracking" />
            <StatCard2 label="Waiting" value={summary?.waitingCount ?? 0} icon={Clock} color="#F59E0B" sparkData={sparkDataFlat} href="/dashboard/reply-tracking" />
            <StatCard2 label="Check-Ins" value={summary?.totalCheckIns ?? 0} icon={Users} color="#FFFFFF" href="/dashboard/attendance" />
            <StatCard2 label="Reminders" value={summary?.totalReminders ?? 0} icon={MessageSquare} color="#FFFFFF" href="/dashboard/attendance" />
            <StatCard2 label="Events" value={summary?.totalProcessedEvents ?? 0} icon={Zap} color="#FFFFFF" href="/dashboard/processed-events" />
          </>
        )}
      </motion.div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Attendance Feed */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.45 }}
          className="lg:col-span-2 glass-card rounded-xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
            <div>
              <h3 className="text-[13px] font-semibold text-white">Recent Attendance</h3>
              <p className="text-[11px] text-white/35 mt-0.5">Latest events across all locations</p>
            </div>
            <Link
              to="/dashboard/attendance"
              className="flex items-center gap-1 text-[11px] text-white/35 hover:text-white/65 transition-colors"
            >
              View All <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Table header */}
          <div className="grid grid-cols-[1fr_1fr_90px_90px] gap-2 px-5 py-2.5 border-b border-white/[0.04] bg-white/[0.02]">
            {['Employee', 'Location', 'Trigger', 'Time'].map(h => (
              <span key={h} className="text-[10px] font-semibold text-white/25 uppercase tracking-wider">{h}</span>
            ))}
          </div>

          <div>
            {loadingAtt ? (
              <div className="p-5 space-y-3">
                {[...Array(5)].map((_, i) => <div key={i} className="h-10 bg-white/[0.03] rounded-lg animate-pulse" />)}
              </div>
            ) : (
              recent.map((rec, i) => (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="grid grid-cols-[1fr_1fr_90px_90px] gap-2 items-center px-5 py-3 border-b border-white/[0.03] last:border-b-0 hover:bg-white/[0.03] transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-white/[0.07] flex items-center justify-center shrink-0 text-[11px] font-semibold text-white/60">
                      {rec.employeeName[0]}
                    </div>
                    <span className="text-[13px] font-medium text-white truncate">{rec.employeeName}</span>
                  </div>
                  <span className="text-[12px] text-white/45 truncate">{rec.placeName}</span>
                  <div>
                    <Badge
                      variant={rec.triggerType === 'CHECKIN' ? 'present' : 'waiting'}
                      className="text-[10px]"
                    >
                      {rec.triggerType}
                    </Badge>
                  </div>
                  <span className="text-[11px] text-white/30">{timeAgo(rec.triggerTimestamp)}</span>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Right column */}
        <div className="space-y-4">
          {/* System Health */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.45 }}
            className="glass-card rounded-xl overflow-hidden"
          >
            <div className="px-4 py-4 border-b border-white/[0.05]">
              <h3 className="text-[13px] font-semibold text-white">System Health</h3>
              <p className="text-[11px] text-white/35 mt-0.5">Infrastructure status</p>
            </div>
            <div className="p-4 space-y-3">
              {health && [
                { label: 'Workflow Engine', status: health.workflowStatus },
                { label: 'Sheet Sync', status: health.sheetSyncStatus },
                { label: 'WhatsApp API', status: health.whatsappApiStatus },
                { label: 'n8n Health', status: health.n8nWorkflowHealth },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-1">
                  <span className="text-[12px] text-white/55">{item.label}</span>
                  <div className="flex items-center gap-1.5">
                    <StatusDot status={item.status} />
                    <span className={cn(
                      'text-[11px] font-medium capitalize',
                      item.status === 'healthy' ? 'text-status-present' :
                      item.status === 'warning' ? 'text-status-waiting' : 'text-status-absent'
                    )}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t border-white/[0.05] space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-white/35">Last Execution</span>
                  <span className="text-white/60">{health ? formatDateTime(health.lastExecutionTime) : '—'}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-white/35">Uptime</span>
                  <span className="text-status-present font-medium">{health?.uptime}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Rates */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.45 }}
            className="glass-card rounded-xl p-4 space-y-3"
          >
            <h3 className="text-[13px] font-semibold text-white mb-1">Performance</h3>
            {[
              { label: 'Attendance Rate', value: summary?.attendanceRate ?? 0, color: '#22C55E' },
              { label: 'Response Rate', value: summary?.responseRate ?? 0, color: '#60A5FA' },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-[11px] mb-1.5">
                  <span className="text-white/50">{item.label}</span>
                  <span className="font-semibold text-white">{item.value}%</span>
                </div>
                <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ delay: 0.6, duration: 0.9, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
            <div className="flex justify-between text-[11px] pt-1">
              <span className="text-white/35">Avg Response</span>
              <span className="text-white/70 font-semibold">
                {Math.round(summary?.averageResponseTime ?? 0)}s
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
