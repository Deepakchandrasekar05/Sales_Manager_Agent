import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  BarChart, Bar, Legend,
  RadialBarChart, RadialBar,
  AreaChart, Area,
} from 'recharts'
import { CardSkeleton } from '@/components/ui/skeleton'
import { analyticsApi } from '@/lib/api'
import { secondsToHuman } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'

const C = {
  present: '#22C55E',
  absent: '#EF4444',
  waiting: '#F59E0B',
  blue: '#60A5FA',
  violet: '#A78BFA',
  grid: 'rgba(255,255,255,0.05)',
  axis: 'rgba(255,255,255,0.18)',
  tick: 'rgba(255,255,255,0.35)',
}

const tooltipStyle = {
  backgroundColor: 'rgba(0,0,0,0.9)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '12px',
  padding: '8px 12px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
}

// Mock response time distribution
const responseTimeData = [
  { range: '<1m', count: 8 },
  { range: '1–3m', count: 12 },
  { range: '3–5m', count: 6 },
  { range: '5–10m', count: 3 },
  { range: '>10m', count: 2 },
]

function ChartCard({ title, subtitle, children, delay = 0, className = '' }: {
  title: string
  subtitle?: string
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={cn('glass-card rounded-xl overflow-hidden', className)}
    >
      <div className="px-5 py-4 border-b border-white/[0.05]">
        <h3 className="text-[13px] font-semibold text-white">{title}</h3>
        {subtitle && <p className="text-[11px] text-white/35 mt-0.5">{subtitle}</p>}
      </div>
      <div className="p-5">{children}</div>
    </motion.div>
  )
}

function KpiCard({ label, value, sub, trend, loading }: {
  label: string
  value: string | number
  sub?: string
  trend?: { value: number }
  loading?: boolean
}) {
  if (loading) return <CardSkeleton />
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-xl p-4 space-y-1"
    >
      <div className="text-[10px] text-white/35 uppercase tracking-wider font-medium">{label}</div>
      <div className="text-[22px] font-semibold text-white tracking-tight">{value}</div>
      {(sub || trend) && (
        <div className="flex items-center gap-1.5">
          {trend && (
            <div className={cn('flex items-center gap-0.5 text-[11px] font-medium', trend.value >= 0 ? 'text-status-present' : 'text-status-absent')}>
              {trend.value >= 0
                ? <TrendingUp className="w-3 h-3" />
                : <TrendingDown className="w-3 h-3" />
              }
              {Math.abs(trend.value)}%
            </div>
          )}
          {sub && <span className="text-[11px] text-white/25">{sub}</span>}
        </div>
      )}
    </motion.div>
  )
}

export default function AnalyticsPage() {
  const { data: summary, isLoading } = useQuery({
    queryKey: ['analytics-summary'],
    queryFn: analyticsApi.getSummary,
    refetchInterval: 30000,
  })
  const { data: daily } = useQuery({
    queryKey: ['analytics-daily'],
    queryFn: analyticsApi.getDailyAttendance,
  })
  const { data: locations } = useQuery({
    queryKey: ['analytics-locations'],
    queryFn: analyticsApi.getLocationAttendance,
  })
  const { data: hourly } = useQuery({
    queryKey: ['analytics-hourly'],
    queryFn: analyticsApi.getHourlyActivity,
  })

  const pieData = summary ? [
    { name: 'Present', value: summary.presentCount, color: C.present },
    { name: 'Absent', value: summary.absentCount, color: C.absent },
    { name: 'Waiting', value: summary.waitingCount, color: C.waiting },
  ] : []

  const gaugeData = summary
    ? [{ name: 'Rate', value: summary.attendanceRate, fill: C.present }]
    : []

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-7">
        <h1 className="text-[26px] font-semibold text-white tracking-tight">Attendance Analytics</h1>
        <p className="text-[13px] text-white/35 mt-1">Performance metrics, trends, and distribution analysis</p>
      </motion.div>

      {/* KPI Row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-5"
      >
        <KpiCard label="Attendance Rate" value={`${summary?.attendanceRate ?? 0}%`} trend={{ value: 3.2 }} sub="vs last week" loading={isLoading} />
        <KpiCard label="Response Rate" value={`${summary?.responseRate ?? 0}%`} trend={{ value: 1.5 }} sub="vs last week" loading={isLoading} />
        <KpiCard label="Avg Response" value={secondsToHuman(summary?.averageResponseTime ?? 0)} trend={{ value: -8.3 }} sub="vs last week" loading={isLoading} />
        <KpiCard label="Processed Events" value={summary?.totalProcessedEvents ?? 0} sub="all time" loading={isLoading} />
        <KpiCard
          label="Waiting"
          value={summary?.waitingCount ?? 0}
          sub="pending response"
          loading={isLoading}
        />
      </motion.div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Pie */}
        <ChartCard title="Attendance Distribution" subtitle="Today's breakdown by status" delay={0.1}>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="55%" height={180}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={72}
                  strokeWidth={0}
                  dataKey="value"
                  paddingAngle={3}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3 flex-1">
              {pieData.map(d => (
                <div key={d.name} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: d.color }} />
                      <span className="text-[11px] text-white/50">{d.name}</span>
                    </div>
                    <span className="text-[12px] font-semibold text-white">{d.value}</span>
                  </div>
                  <div className="h-0.5 bg-white/[0.05] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: summary?.totalScheduled ? `${(d.value / summary.totalScheduled) * 100}%` : '0%' }}
                      transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ background: d.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        {/* Gauge */}
        <ChartCard title="Success Rate" subtitle="Overall attendance gauge" delay={0.15}>
          <div className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={160}>
              <RadialBarChart
                innerRadius="55%"
                outerRadius="80%"
                data={gaugeData}
                startAngle={180}
                endAngle={0}
              >
                <RadialBar
                  dataKey="value"
                  cornerRadius={4}
                  background={{ fill: 'rgba(255,255,255,0.04)' }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="-mt-8 text-center">
              <div className="text-[32px] font-semibold text-white tracking-tight">{summary?.attendanceRate ?? 0}%</div>
              <div className="text-[11px] text-white/35 mt-0.5">Attendance Rate</div>
            </div>
          </div>
        </ChartCard>

        {/* Response Time Distribution */}
        <ChartCard title="Response Time Distribution" subtitle="Employee reply speed analysis" delay={0.2}>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={responseTimeData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.grid} vertical={false} />
              <XAxis dataKey="range" stroke={C.axis} tick={{ fill: C.tick, fontSize: 10 }} />
              <YAxis stroke={C.axis} tick={{ fill: C.tick, fontSize: 10 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" name="Responses" fill={C.blue} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 gap-4 mb-4">
        {/* Daily Trend */}
        <ChartCard title="Weekly Attendance Trend" subtitle="Present vs Absent per day this week" delay={0.25}>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={daily ?? []} margin={{ top: 4, right: 16, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradPresent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.present} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={C.present} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradAbsent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.absent} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={C.absent} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.grid} />
              <XAxis dataKey="date" stroke={C.axis} tick={{ fill: C.tick, fontSize: 11 }} />
              <YAxis stroke={C.axis} tick={{ fill: C.tick, fontSize: 11 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', paddingTop: '8px' }} />
              <Area type="monotone" dataKey="present" stroke={C.present} strokeWidth={2} fill="url(#gradPresent)" dot={false} name="Present" />
              <Area type="monotone" dataKey="absent" stroke={C.absent} strokeWidth={2} fill="url(#gradAbsent)" dot={false} name="Absent" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Hourly Activity */}
        <ChartCard title="Hourly Activity Breakdown" subtitle="Check-ins, reminders, and responses by hour" delay={0.3}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={hourly ?? []} margin={{ top: 4, right: 8, left: -24, bottom: 0 }} barSize={8} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.grid} vertical={false} />
              <XAxis dataKey="hour" stroke={C.axis} tick={{ fill: C.tick, fontSize: 10 }} />
              <YAxis stroke={C.axis} tick={{ fill: C.tick, fontSize: 10 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', paddingTop: '8px' }} />
              <Bar dataKey="checkIns" name="Check-ins" fill={C.blue} radius={[3, 3, 0, 0]} />
              <Bar dataKey="reminders" name="Reminders" fill={C.waiting} radius={[3, 3, 0, 0]} />
              <Bar dataKey="responses" name="Responses" fill={C.present} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Location distribution */}
        <ChartCard title="Attendance by Location" subtitle="Present rate across all sites" delay={0.35}>
          <div className="space-y-3.5">
            {(locations ?? []).slice(0, 6).map((loc, i) => {
              const pct = loc.total ? Math.round((loc.present / loc.total) * 100) : 0
              return (
                <div key={loc.location}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[11px] text-white/45 truncate">{loc.location}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className="text-[11px] text-white/30">{loc.present}/{loc.total}</span>
                      <span className="text-[12px] font-semibold text-white">{pct}%</span>
                    </div>
                  </div>
                  <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.5 + i * 0.07, duration: 0.6, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ background: pct >= 70 ? C.present : pct >= 40 ? C.waiting : C.absent }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </ChartCard>
      </div>
    </div>
  )
}
