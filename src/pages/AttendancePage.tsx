import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import {
  Search, Filter, RefreshCw, Users, CheckCircle2,
  XCircle, Clock, Bell, Activity, ChevronUp, ChevronDown, MapPin,
} from 'lucide-react'
import { Badge, StatusDot } from '@/components/ui/badge'
import { Input, Select } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { TableSkeleton } from '@/components/ui/skeleton'
import { attendanceLogApi } from '@/lib/api'
import { formatDateTime } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { AttendanceStatus, TriggerType } from '@/types'

type TFilter = 'ALL' | TriggerType

const AVATAR_COLORS = [
  'bg-blue-500/20 text-blue-300',
  'bg-emerald-500/20 text-emerald-300',
  'bg-violet-500/20 text-violet-300',
  'bg-orange-500/20 text-orange-300',
  'bg-rose-500/20 text-rose-300',
  'bg-cyan-500/20 text-cyan-300',
]

function getAvatarColor(name: string) {
  const sum = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return AVATAR_COLORS[sum % AVATAR_COLORS.length]
}

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase()
}

export default function AttendancePage() {
  const [search, setSearch] = useState('')
  const [triggerFilter, setTriggerFilter] = useState<TFilter>('ALL')
  const [sortField, setSortField] = useState<string>('triggerTimestamp')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['attendance-log'],
    queryFn: attendanceLogApi.getAll,
    refetchInterval: 30000,
  })

  function toggleSort(field: string) {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('desc') }
  }

  const filtered = useMemo(() => {
    if (!data) return []
    let result = data.filter(r => {
      const matchSearch = !search ||
        r.employeeName.toLowerCase().includes(search.toLowerCase()) ||
        r.placeName.toLowerCase().includes(search.toLowerCase()) ||
        r.eventKey.toLowerCase().includes(search.toLowerCase())
      const matchTrigger = triggerFilter === 'ALL' || r.triggerType === triggerFilter
      return matchSearch && matchTrigger
    })
    result = [...result].sort((a, b) => {
      const aVal = (a as unknown as Record<string, unknown>)[sortField]
      const bVal = (b as unknown as Record<string, unknown>)[sortField]
      const cmp = String(aVal).localeCompare(String(bVal))
      return sortDir === 'asc' ? cmp : -cmp
    })
    return result
  }, [data, search, triggerFilter, sortField, sortDir])

  const stats = useMemo(() => ({
    total: data?.length ?? 0,
    reminders: data?.filter(r => r.triggerType === 'REMINDER').length ?? 0,
    checkIns: data?.filter(r => r.triggerType === 'CHECKIN').length ?? 0,
  }), [data])

  function SortIcon({ field }: { field: string }) {
    if (sortField !== field) return <ChevronUp className="w-3 h-3 text-white/15" />
    return sortDir === 'asc'
      ? <ChevronUp className="w-3 h-3 text-white/60" />
      : <ChevronDown className="w-3 h-3 text-white/60" />
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-7 flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
        <div>
          <h1 className="text-[26px] font-semibold text-white tracking-tight">Attendance Log</h1>
          <p className="text-[13px] text-white/35 mt-1">Live computed CHECKIN and REMINDER events based on scheduled time</p>
        </div>
        <Button variant="glass" size="sm" onClick={() => refetch()} className={cn(isFetching && 'opacity-60')}>
          <RefreshCw className={cn('w-3.5 h-3.5', isFetching && 'animate-spin')} />
          {isFetching ? 'Refreshing...' : 'Refresh'}
        </Button>
      </motion.div>

      {/* Stat Strip */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="grid grid-cols-3 gap-3 mb-5"
      >
        {[
          { label: 'Total Events', value: stats.total, icon: Activity, color: 'text-white/70' },
          { label: 'Reminders', value: stats.reminders, icon: Bell, color: 'text-status-waiting' },
          { label: 'Check-Ins', value: stats.checkIns, icon: CheckCircle2, color: 'text-status-present' },
        ].map(s => (
          <div key={s.label} className="glass-card rounded-xl p-3.5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-white/35 uppercase tracking-wider font-medium">{s.label}</span>
              <s.icon className={cn('w-3.5 h-3.5', s.color)} />
            </div>
            <span className={cn('text-xl font-semibold', s.color)}>{s.value}</span>
          </div>
        ))}
      </motion.div>

      {/* Filters */}
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
              placeholder="Search employee, location, or event key..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 h-8 text-[13px]"
            />
          </div>
          <Select
            value={triggerFilter}
            onChange={e => setTriggerFilter(e.target.value as TFilter)}
            className="h-8 text-[13px]"
          >
            <option value="ALL">All Triggers</option>
            <option value="REMINDER">Reminder</option>
            <option value="CHECKIN">Check-In</option>
          </Select>
          <div className="flex items-center gap-1.5 text-[11px] text-white/25 px-2 shrink-0">
            <Filter className="w-3 h-3" />
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
                {[
                  { label: 'Employee', field: 'employeeName' },
                  { label: 'Location', field: 'placeName' },
                  { label: 'Scheduled Time', field: 'scheduledTime' },
                  { label: 'Trigger Type', field: 'triggerType' },
                  { label: 'Timestamp', field: 'triggerTimestamp' },
                  { label: 'Event Key', field: 'eventKey' },
                  { label: 'Target Location', field: 'targetLatitude' },
                ].map(col => (
                  <th
                    key={col.field}
                    onClick={() => toggleSort(col.field)}
                    className="px-4 py-3 text-left text-[10px] font-semibold text-white/25 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:text-white/50 transition-colors select-none"
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      <SortIcon field={col.field} />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-5">
                    <TableSkeleton rows={6} />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-white/25 text-[13px]">
                    No records match your filters.
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
                      <div className="flex items-center gap-2.5">
                        <div className={cn('w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold', getAvatarColor(rec.employeeName))}>
                          {getInitials(rec.employeeName)}
                        </div>
                        <span className="text-[13px] font-medium text-white whitespace-nowrap">{rec.employeeName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-white/50 whitespace-nowrap">{rec.placeName}</td>
                    <td className="px-4 py-3 text-[12px] text-white/50 whitespace-nowrap">{rec.scheduledTime}</td>
                    <td className="px-4 py-3">
                      <Badge variant={rec.triggerType === 'CHECKIN' ? 'present' : 'waiting'} className="text-[11px]">
                        {rec.triggerType}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-white/50 whitespace-nowrap font-mono">{formatDateTime(rec.triggerTimestamp)}</td>
                    <td className="px-4 py-3">
                      <code className="text-[10px] font-mono text-white/45 bg-white/[0.05] rounded px-1.5 py-0.5">{rec.eventKey}</code>
                    </td>
                    <td className="px-4 py-3">
                      {rec.targetLatitude && rec.targetLongitude ? (
                        <a
                          href={`https://www.google.com/maps?q=${rec.targetLatitude},${rec.targetLongitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[11px] text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <MapPin className="w-3 h-3" />
                          <span className="font-mono">{rec.targetLatitude}, {rec.targetLongitude}</span>
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
        {!isLoading && filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-white/[0.04] flex items-center justify-between">
            <span className="text-[11px] text-white/25">
              Showing {filtered.length} of {data?.length ?? 0} events
            </span>
            <span className="text-[11px] text-white/25">
              {stats.reminders} reminders · {stats.checkIns} check-ins
            </span>
          </div>
        )}
      </motion.div>
    </div>
  )
}
