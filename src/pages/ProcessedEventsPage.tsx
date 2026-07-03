import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import {
  Search, Zap, ChevronLeft, ChevronRight,
  ShieldCheck, AlertTriangle,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { TableSkeleton } from '@/components/ui/skeleton'
import { processedEventsApi } from '@/lib/api'
import { formatDateTime, timeAgo } from '@/lib/utils'
import { cn } from '@/lib/utils'

const PAGE_SIZE = 15

export default function ProcessedEventsPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['processed-events'],
    queryFn: processedEventsApi.getAll,
    refetchInterval: 30000,
  })

  const filtered = useMemo(() => {
    if (!data) return []
    return data.filter(e =>
      !search || e.eventKey.toLowerCase().includes(search.toLowerCase())
    )
  }, [data, search])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const allKeys = data?.map(e => e.eventKey) ?? []
  const uniqueKeys = new Set(allKeys).size
  const dupCount = allKeys.length - uniqueKeys

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-7 flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
        <div>
          <h1 className="text-[26px] font-semibold text-white tracking-tight">Processed Events</h1>
          <p className="text-[13px] text-white/35 mt-1">Deduplication log from Processed Events sheet</p>
        </div>
        <div className={cn(
          'flex items-center gap-2 rounded-lg px-3 py-1.5 text-[11px] font-medium',
          dupCount === 0 ? 'bg-status-present/10 border border-status-present/20 text-status-present' : 'bg-status-waiting/10 border border-status-waiting/20 text-status-waiting'
        )}>
          {dupCount === 0
            ? <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            : <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          }
          {dupCount === 0 ? 'No duplicates detected' : `${dupCount} duplicate event${dupCount > 1 ? 's' : ''}`}
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
          { label: 'Total Events', value: data?.length ?? 0, color: 'text-white/80' },
          { label: 'Unique Keys', value: uniqueKeys, color: 'text-status-present' },
          { label: 'Duplicates', value: dupCount, color: dupCount > 0 ? 'text-status-absent' : 'text-white/50' },
          { label: 'Showing', value: `${pageData.length} / ${filtered.length}`, color: 'text-white/80' },
        ].map(s => (
          <div key={s.label} className="glass-card rounded-xl p-4">
            <div className="text-[10px] text-white/35 uppercase tracking-wider font-medium mb-2">{s.label}</div>
            <div className={cn('text-xl font-semibold', s.color)}>{s.value}</div>
          </div>
        ))}
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.13 }}
        className="glass-card rounded-xl p-3.5 mb-4"
      >
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25 pointer-events-none" />
          <Input
            placeholder="Search event key (e.g. EVT-2024-0001)..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            className="pl-9 h-8 text-[13px]"
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Timeline Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="glass-card rounded-xl p-5 lg:col-span-1 h-fit"
        >
          <h3 className="text-[12px] font-semibold text-white mb-4">Recent Events</h3>
          <div className="relative">
            <div className="absolute left-2 top-0 bottom-0 w-px bg-white/[0.08]" />
            <div className="space-y-3">
              {(data?.slice(0, 14) ?? []).map((event, i) => (
                <div key={event.id} className="flex items-start gap-3 pl-6 relative">
                  <div className={cn(
                    'absolute left-1.5 top-1.5 w-1.5 h-1.5 rounded-full',
                    i === 0 ? 'bg-status-present animate-pulse' : 'bg-white/20'
                  )} />
                  <div>
                    <div className="text-[11px] font-mono text-white/60">{event.eventKey}</div>
                    <div className="text-[10px] text-white/25 mt-0.5">{timeAgo(event.timestamp)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="lg:col-span-3 glass-card rounded-xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.05] bg-white/[0.02]">
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-white/25 uppercase tracking-wider w-12">#</th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-white/25 uppercase tracking-wider">Event Key</th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-white/25 uppercase tracking-wider">Timestamp</th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-white/25 uppercase tracking-wider">Age</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={4} className="p-5"><TableSkeleton rows={8} /></td></tr>
                ) : pageData.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-16 text-white/25 text-[13px]">
                      No events found.
                    </td>
                  </tr>
                ) : (
                  pageData.map((event, i) => (
                    <motion.tr
                      key={event.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className="border-b border-white/[0.035] last:border-b-0 hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="px-4 py-3 text-[11px] text-white/20 font-mono">
                        {(page - 1) * PAGE_SIZE + i + 1}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Zap className="w-3 h-3 text-white/25 shrink-0" />
                          <code className="text-[12px] font-mono text-white/70">{event.eventKey}</code>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[12px] font-mono text-white/50 whitespace-nowrap">
                        {formatDateTime(event.timestamp)}
                      </td>
                      <td className="px-4 py-3 text-[11px] text-white/35">
                        {timeAgo(event.timestamp)}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.04]">
              <span className="text-[11px] text-white/25">
                Page {page} of {totalPages} · {filtered.length} total events
              </span>
              <div className="flex gap-1.5">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="h-7 px-2"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </Button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i
                  return (
                    <Button
                      key={p}
                      variant={p === page ? 'outline' : 'ghost'}
                      size="sm"
                      onClick={() => setPage(p)}
                      className="h-7 w-7 p-0 text-[11px]"
                    >
                      {p}
                    </Button>
                  )
                })}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="h-7 px-2"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
