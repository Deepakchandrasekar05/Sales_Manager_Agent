import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Search, RefreshCw, MessageSquare, Clock, CheckCircle, XCircle, AlertCircle, MapPin } from 'lucide-react'
import { Badge, StatusDot } from '@/components/ui/badge'
import { Input, Select } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { TableSkeleton } from '@/components/ui/skeleton'
import { replyTrackingApi } from '@/lib/api'
import { formatDateTime, secondsToHuman } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { AttendanceStatus } from '@/types'

const TIMEOUT_SEC = 30 * 60

function CountdownBadge({ sentTime }: { sentTime: string }) {
  const [remaining, setRemaining] = useState(() => {
    const elapsed = Math.floor((Date.now() - new Date(sentTime).getTime()) / 1000)
    return Math.max(TIMEOUT_SEC - elapsed, 0)
  })

  useEffect(() => {
    if (remaining <= 0) return
    const t = setInterval(() => setRemaining(r => Math.max(r - 1, 0)), 1000)
    return () => clearInterval(t)
  }, [remaining])

  if (remaining === 0) {
    return (
      <div className="flex items-center gap-1.5 text-status-absent">
        <AlertCircle className="w-3 h-3 shrink-0" />
        <span className="text-[11px] font-medium">Timed out</span>
      </div>
    )
  }

  const pct = (remaining / TIMEOUT_SEC) * 100
  const isUrgent = pct < 20
  const isWarning = pct < 50
  const color = isUrgent ? '#EF4444' : isWarning ? '#F59E0B' : '#22C55E'
  const textColor = isUrgent ? 'text-status-absent' : isWarning ? 'text-status-waiting' : 'text-status-present'

  return (
    <div className="flex items-center gap-2">
      <div className="relative w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <div className={cn('flex items-center gap-1', textColor)}>
        <Clock className="w-3 h-3 shrink-0" />
        <span className="text-[11px] font-mono font-medium">{secondsToHuman(remaining)}</span>
      </div>
    </div>
  )
}

function ResponseTimeBadge({ sentTime, responseTime }: { sentTime: string; responseTime: string }) {
  const diffSec = Math.floor((new Date(responseTime).getTime() - new Date(sentTime).getTime()) / 1000)
  const isfast = diffSec < 60
  const isMed = diffSec < 300
  const color = isfast ? 'text-status-present' : isMed ? 'text-status-waiting' : 'text-status-absent'
  return (
    <span className={cn('text-[11px] font-medium', color)}>
      {secondsToHuman(diffSec)}
    </span>
  )
}

export default function ReplyTrackingPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | AttendanceStatus>('ALL')

  const { data, isLoading, refetch, isFetching, dataUpdatedAt } = useQuery({
    queryKey: ['reply-tracking'],
    queryFn: replyTrackingApi.getAll,
    refetchInterval: 30000,
  })

  const filtered = useMemo(() => {
    if (!data) return []
    return data.filter(r => {
      const matchSearch = !search ||
        r.employeeName.toLowerCase().includes(search.toLowerCase()) ||
        r.eventKey.toLowerCase().includes(search.toLowerCase()) ||
        r.phoneNumber.includes(search)
      const matchStatus = statusFilter === 'ALL' || r.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [data, search, statusFilter])

  const stats = useMemo(() => ({
    total: data?.length ?? 0,
    present: data?.filter(r => r.status === 'PRESENT').length ?? 0,
    waiting: data?.filter(r => r.status === 'WAITING').length ?? 0,
    absent: data?.filter(r => r.status === 'ABSENT').length ?? 0,
  }), [data])

  const presentPct = stats.total ? Math.round((stats.present / stats.total) * 100) : 0

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-7 flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
        <div>
          <h1 className="text-[26px] font-semibold text-white tracking-tight">Reply Tracking</h1>
          <p className="text-[13px] text-white/35 mt-1">Employee response and attendance status from Reply Tracking sheet</p>
        </div>
        <div className="flex items-center gap-3">
          {dataUpdatedAt > 0 && (
            <span className="text-[11px] text-white/25 hidden sm:block">
              Updated {new Date(dataUpdatedAt).toLocaleTimeString()}
            </span>
          )}
          <Button variant="glass" size="sm" onClick={() => refetch()} className={cn(isFetching && 'opacity-60')}>
            <RefreshCw className={cn('w-3.5 h-3.5', isFetching && 'animate-spin')} />
            Auto-refresh 30s
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5"
      >
        {[
          { label: 'Messages Sent', value: stats.total, icon: MessageSquare, color: 'text-white/70' },
          { label: 'Present', value: stats.present, icon: CheckCircle, color: 'text-status-present' },
          { label: 'Waiting', value: stats.waiting, icon: Clock, color: 'text-status-waiting' },
          { label: 'Absent', value: stats.absent, icon: XCircle, color: 'text-status-absent' },
        ].map(s => (
          <div key={s.label} className="glass-card rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-white/35 uppercase tracking-wider font-medium">{s.label}</span>
              <s.icon className={cn('w-3.5 h-3.5', s.color)} />
            </div>
            <div className={cn('text-xl font-semibold', s.color)}>{s.value}</div>
            {s.label === 'Present' && stats.total > 0 && (
              <div className="h-0.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${presentPct}%` }}
                  transition={{ delay: 0.4, duration: 0.7, ease: 'easeOut' }}
                  className="h-full bg-status-present rounded-full"
                />
              </div>
            )}
          </div>
        ))}
      </motion.div>

      {/* Filter */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.13 }}
        className="glass-card rounded-xl p-3.5 mb-4"
      >
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25 pointer-events-none" />
            <Input
              placeholder="Search employee, event key, or phone..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 h-8 text-[13px]"
            />
          </div>
          <Select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as 'ALL' | AttendanceStatus)}
            className="h-8 text-[13px]"
          >
            <option value="ALL">All Statuses</option>
            <option value="PRESENT">Present</option>
            <option value="WAITING">Waiting</option>
            <option value="ABSENT">Absent</option>
          </Select>
          <div className="flex items-center gap-1.5 text-[11px] text-white/25 px-2 shrink-0">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </div>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        className="glass-card rounded-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.05] bg-white/[0.02]">
                {['Event Key', 'Employee', 'Location', 'Phone Number', 'Status', 'Sent Time', 'Response Time', 'Countdown', 'Shared Location'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-white/25 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="p-5"><TableSkeleton rows={5} /></td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-16 text-white/25 text-[13px]">
                    No records found.
                  </td>
                </tr>
              ) : (
                filtered.map((rec, i) => (
                  <motion.tr
                    key={rec.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.025 }}
                    className="border-b border-white/[0.035] last:border-b-0 hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <code className="text-[10px] font-mono text-white/55 bg-white/[0.05] rounded px-1.5 py-0.5">{rec.eventKey}</code>
                    </td>
                    <td className="px-4 py-3 text-[13px] font-medium text-white whitespace-nowrap">{rec.employeeName}</td>
                    <td className="px-4 py-3 text-[12px] text-white/45 whitespace-nowrap">{rec.placeName}</td>
                    <td className="px-4 py-3">
                      <code className="text-[11px] font-mono text-white/40">{rec.phoneNumber}</code>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={rec.status.toLowerCase() as 'present' | 'absent' | 'waiting'}
                        className="text-[11px]"
                      >
                        <StatusDot status={rec.status} />
                        {rec.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-white/45 whitespace-nowrap font-mono">{formatDateTime(rec.sentTime)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {rec.responseTime
                        ? <ResponseTimeBadge sentTime={rec.sentTime} responseTime={rec.responseTime} />
                        : <span className="text-[11px] text-white/20">—</span>
                      }
                    </td>
                    <td className="px-4 py-3">
                      {rec.status === 'WAITING'
                        ? <CountdownBadge sentTime={rec.sentTime} />
                        : <span className="text-[11px] text-white/20">—</span>
                      }
                    </td>
                    <td className="px-4 py-3">
                      {rec.sharedLatitude && rec.sharedLongitude ? (
                        <a
                          href={`https://www.google.com/maps?q=${rec.sharedLatitude},${rec.sharedLongitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[11px] text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <MapPin className="w-3 h-3" />
                          <span className="font-mono">{rec.sharedLatitude}, {rec.sharedLongitude}</span>
                        </a>
                      ) : (
                        <span className="text-[11px] text-white/20">—</span>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
