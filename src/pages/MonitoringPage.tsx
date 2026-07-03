import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import {
  Activity, RefreshCw, Server, Smartphone,
  Wifi, Database, CheckCircle2, AlertTriangle, XCircle,
} from 'lucide-react'
import { systemApi } from '@/lib/api'
import { formatDateTime } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { HealthStatus } from '@/types'
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts'

const uptimeData = [
  { t: '00:00', up: 1 }, { t: '04:00', up: 1 }, { t: '08:00', up: 1 },
  { t: '09:12', up: 0.95 }, { t: '10:00', up: 1 }, { t: '12:00', up: 1 },
  { t: '14:00', up: 1 }, { t: '16:00', up: 1 }, { t: '18:00', up: 1 },
  { t: '20:00', up: 1 }, { t: 'now', up: 1 },
]

const tooltipStyle = {
  backgroundColor: 'rgba(0,0,0,0.9)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '6px',
  fontSize: '11px',
  color: '#fff',
  padding: '6px 10px',
}

function HealthIndicator({ status, label, description, icon: Icon }: {
  status: HealthStatus
  label: string
  description: string
  icon: React.ElementType
}) {
  const cfg = {
    healthy: { color: '#22C55E', text: 'text-status-present', icon: CheckCircle2, label: 'Operational' },
    warning: { color: '#F59E0B', text: 'text-status-waiting', icon: AlertTriangle, label: 'Degraded' },
    failed: { color: '#EF4444', text: 'text-status-absent', icon: XCircle, label: 'Failed' },
  }[status]

  return (
    <div className="flex items-center gap-3.5 p-4 glass-card rounded-xl hover:bg-white/[0.06] transition-all duration-200 group">
      <div className="w-9 h-9 rounded-xl bg-white/[0.05] flex items-center justify-center shrink-0 group-hover:bg-white/[0.08] transition-colors">
        <Icon className="w-4 h-4 text-white/50" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-medium text-white">{label}</div>
        <div className="text-[11px] text-white/35 truncate mt-0.5">{description}</div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <div
          className="w-2 h-2 rounded-full"
          style={{ background: cfg.color, boxShadow: status !== 'failed' ? `0 0 8px ${cfg.color}60` : 'none' }}
        />
        <span className={cn('text-[11px] font-semibold', cfg.text)}>{cfg.label}</span>
      </div>
    </div>
  )
}

export default function MonitoringPage() {
  const { data: health, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['system-health'],
    queryFn: systemApi.getHealth,
    refetchInterval: 15000,
  })

  const allHealthy = health && [
    health.workflowStatus,
    health.sheetSyncStatus,
    health.whatsappApiStatus,
    health.n8nWorkflowHealth,
  ].every(s => s === 'healthy')

  const hasWarning = health && [
    health.workflowStatus,
    health.sheetSyncStatus,
    health.whatsappApiStatus,
    health.n8nWorkflowHealth,
  ].some(s => s === 'warning')

  const overallLabel = allHealthy ? 'All Systems Operational' : hasWarning ? 'Degraded Performance' : 'Service Disruption'
  const overallColor = allHealthy ? '#22C55E' : hasWarning ? '#F59E0B' : '#EF4444'

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-7 flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            {health && (
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  background: overallColor,
                  boxShadow: `0 0 8px ${overallColor}60`,
                  animation: allHealthy ? 'pulse 2s ease-in-out infinite' : 'none',
                }}
              />
            )}
            <span className="text-[11px] font-medium text-white/35 uppercase tracking-[0.1em]">
              {health ? overallLabel : 'Checking...'}
            </span>
          </div>
          <h1 className="text-[26px] font-semibold text-white tracking-tight">Real-Time Monitoring</h1>
          <p className="text-[13px] text-white/35 mt-1">Infrastructure health, workflow status, and integration monitoring</p>
        </div>
        <button
          onClick={() => refetch()}
          className={cn(
            'flex items-center gap-1.5 text-[11px] text-white/35 hover:text-white/60 transition-colors',
            isFetching && 'opacity-50'
          )}
        >
          <RefreshCw className={cn('w-3.5 h-3.5', isFetching && 'animate-spin')} />
          Refresh
        </button>
      </motion.div>

      {/* Metric Cards */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 glass-card rounded-xl animate-pulse" />
          ))}
        </div>
      ) : health ? (
        <>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5"
          >
            {[
              { icon: Activity, label: 'Active Workflows', value: health.activeWorkflows, sub: 'running now' },
              { icon: Server, label: 'System Uptime', value: health.uptime, sub: 'last 30 days' },
              { icon: Database, label: 'Sheet Sync', value: 'Live', sub: `Status: ${health.sheetSyncStatus}` },
              { icon: Smartphone, label: 'Last Execution', value: formatDateTime(health.lastExecutionTime), sub: 'n8n workflow' },
            ].map(m => (
              <div key={m.label} className="glass-card rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <m.icon className="w-3.5 h-3.5 text-white/40" />
                  <span className="text-[10px] text-white/35 uppercase tracking-wider font-medium">{m.label}</span>
                </div>
                <div className="text-[15px] font-semibold text-white leading-tight">{m.value}</div>
                <div className="text-[10px] text-white/25">{m.sub}</div>
              </div>
            ))}
          </motion.div>

          {/* Status Grid */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5"
          >
            <HealthIndicator status={health.workflowStatus} label="Workflow Engine" description="n8n automation core" icon={Activity} />
            <HealthIndicator status={health.sheetSyncStatus} label="Sheet Synchronization" description="Google Sheets API v4" icon={Database} />
            <HealthIndicator status={health.whatsappApiStatus} label="WhatsApp Cloud API" description="graph.facebook.com/v18.0" icon={Smartphone} />
            <HealthIndicator status={health.n8nWorkflowHealth} label="n8n Workflow Health" description="All automation workflows" icon={Wifi} />
          </motion.div>

          {/* Uptime Chart */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
            className="glass-card rounded-xl overflow-hidden mb-4"
          >
            <div className="px-5 py-4 border-b border-white/[0.05]">
              <h3 className="text-[13px] font-semibold text-white">System Uptime — Last 24h</h3>
              <p className="text-[11px] text-white/35 mt-0.5">Service availability over time</p>
            </div>
            <div className="px-5 py-4">
              <ResponsiveContainer width="100%" height={80}>
                <LineChart data={uptimeData} margin={{ top: 4, right: 4, left: -40, bottom: 0 }}>
                  <Line
                    type="stepAfter"
                    dataKey="up"
                    stroke="#22C55E"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(v: number) => [v === 1 ? 'Operational' : 'Degraded', 'Status']}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-between mt-3 text-[10px] text-white/25">
                <span>24h ago</span>
                <span className="text-status-present font-medium">99.7% uptime</span>
                <span>Now</span>
              </div>
            </div>
          </motion.div>

          {/* Integration Detail */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 }}
            className="glass-card rounded-xl overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-white/[0.05]">
              <h3 className="text-[13px] font-semibold text-white">Connected Integrations</h3>
              <p className="text-[11px] text-white/35 mt-0.5">Active services and data sources</p>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {[
                {
                  icon: Wifi,
                  name: 'n8n Webhooks',
                  endpoint: 'https://n8n.internal/webhook/attendance',
                  status: health.n8nWorkflowHealth,
                  detail: 'POST /trigger/schedule',
                },
                {
                  icon: Database,
                  name: 'Google Sheets API',
                  endpoint: 'AttendanceSchedule · AttendanceLog · ReplyTracking · ProcessedEvents',
                  status: health.sheetSyncStatus,
                  detail: 'spreadsheets.values.get · batchUpdate',
                },
                {
                  icon: Smartphone,
                  name: 'WhatsApp Cloud API',
                  endpoint: 'graph.facebook.com/v18.0/messages',
                  status: health.whatsappApiStatus,
                  detail: 'Send + webhook receiver',
                },
                {
                  icon: Server,
                  name: 'Supabase Database',
                  endpoint: 'attendance_records · reply_tracking · processed_events · timeline_events',
                  status: 'healthy' as HealthStatus,
                  detail: 'Real-time persistence layer',
                },
              ].map(svc => {
                const statusCfg = {
                  healthy: { color: '#22C55E', text: 'text-status-present', label: 'Connected' },
                  warning: { color: '#F59E0B', text: 'text-status-waiting', label: 'Degraded' },
                  failed: { color: '#EF4444', text: 'text-status-absent', label: 'Failed' },
                }[svc.status]

                return (
                  <div key={svc.name} className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center shrink-0">
                      <svc.icon className="w-3.5 h-3.5 text-white/40" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium text-white">{svc.name}</div>
                      <div className="text-[10px] text-white/30 truncate mt-0.5">{svc.endpoint}</div>
                      <div className="text-[10px] text-white/20 mt-0.5">{svc.detail}</div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          background: statusCfg.color,
                          boxShadow: svc.status !== 'failed' ? `0 0 6px ${statusCfg.color}60` : 'none',
                          animation: svc.status === 'healthy' ? 'pulse 2s ease-in-out infinite' : 'none',
                        }}
                      />
                      <span className={cn('text-[11px] font-medium', statusCfg.text)}>{statusCfg.label}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </>
      ) : null}
    </div>
  )
}
