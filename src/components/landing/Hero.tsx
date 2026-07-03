import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Activity, ArrowRight, CheckCircle2, Menu, X, XCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getSheetRows } from '@/lib/api'
import type { SheetRow } from '@/lib/googleSheets'

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Dashboard', href: '#dashboard' },
  { label: 'Analytics', href: '#analytics' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'glass-heavy border-b border-white/[0.06]'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-white/20">
              <Activity className="w-4 h-4 text-black" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-white">SalesAgent</div>
              <div className="text-[10px] text-white/35 tracking-wide">Attendance System</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navLinks.map(link => (
              <a
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-[13px] font-medium text-white/45 hover:text-white/90 transition-colors duration-200 rounded-lg hover:bg-white/5"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-2.5">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="text-white/50 hover:text-white text-[13px]">
                Sign In
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="sm" className="gap-1.5 text-[13px]">
                Launch Dashboard
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden text-white/50 hover:text-white transition-colors p-1"
            onClick={() => setMobileOpen(v => !v)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden glass-heavy border-t border-white/[0.06]"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 text-sm text-white/55 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-2 border-t border-white/[0.06]">
                <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full gap-2" size="sm">
                    Launch Dashboard <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const yContent = useTransform(scrollYProgress, [0, 1], [0, -100])
  const yPreview = useTransform(scrollYProgress, [0, 1], [0, -50])
  const opacityContent = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const springY = useSpring(yContent, { stiffness: 80, damping: 20 })

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  }
  const fadeUp = {
    hidden: { opacity: 0, y: 28, filter: 'blur(4px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
  }

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Layered backgrounds */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Radial glow top center */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.09)_0%,transparent_65%)]" />
        {/* Secondary ambient glows */}
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.025)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.02)_0%,transparent_70%)] blur-2xl" />
        {/* Fine grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
        {/* Bottom vignette */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/60 to-transparent" />
      </div>

      {/* Main content */}
      <motion.div
        style={{ y: springY, opacity: opacityContent }}
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-28 pb-8"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-7"
        >
          {/* Status pill */}
          <motion.div variants={fadeUp} className="flex justify-center">
            <div className="glass inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-[11px] font-medium text-white/55 border border-white/10">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-present opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-status-present" />
              </span>
              Real-Time Attendance Monitoring Active
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div variants={fadeUp}>
            <h1 className="text-[52px] sm:text-[64px] lg:text-[78px] font-semibold leading-[1.02] tracking-[-0.03em] text-white">
              Attendance
              <br />
              Monitoring.
            </h1>
            <h1 className="text-[52px] sm:text-[64px] lg:text-[78px] font-semibold leading-[1.02] tracking-[-0.03em] mt-1">
              <span className="text-white/90">One Clear </span>
              <span
                className="font-serif italic"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.55) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Overview.
              </span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            className="max-w-[560px] mx-auto text-[15px] text-white/45 leading-[1.7]"
          >
            Monitor employee attendance, response tracking, workflow execution,
            and operational analytics from a single dashboard.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3 justify-center">
            <Link to="/dashboard">
              <Button
                size="lg"
                className="h-11 px-7 gap-2 text-[13px] font-semibold shadow-2xl shadow-white/10 hover:shadow-white/20 transition-shadow"
              >
                Launch Dashboard
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <a href="#features">
              <Button
                variant="outline"
                size="lg"
                className="h-11 px-7 text-[13px] border-white/12 text-white/55 hover:text-white hover:border-white/25"
              >
                See Features
              </Button>
            </a>
          </motion.div>

          {/* Social proof row */}
          <motion.div variants={fadeUp} className="flex flex-wrap gap-6 justify-center pt-2">
            {[
              { label: 'n8n Workflows', dot: 'bg-status-present' },
              { label: 'Google Sheets', dot: 'bg-white/30' },
              { label: 'WhatsApp Cloud API', dot: 'bg-white/30' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2 text-[11px] text-white/30">
                <span className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />
                {item.label}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Dashboard preview */}
      <motion.div
        style={{ y: yPreview }}
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-8 mt-4"
      >
        <HeroDashboardPreview />
      </motion.div>
    </section>
  )
}

function HeroDashboardPreview() {
  const [rows, setRows] = useState<SheetRow[]>([])

  useEffect(() => {
    getSheetRows().then(setRows).catch(() => {})
  }, [])

  const statuses = ['PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'WAITING', 'ABSENT']
  const present = rows.filter((_, i) => statuses[i % statuses.length] === 'PRESENT').length
  const absent = rows.filter((_, i) => statuses[i % statuses.length] === 'ABSENT').length
  const waiting = rows.filter((_, i) => statuses[i % statuses.length] === 'WAITING').length
  const total = rows.length

  const stats = [
    { label: 'Present', value: String(present || 11), color: 'text-status-present', bg: 'bg-status-present/10' },
    { label: 'Absent', value: String(absent || 6), color: 'text-status-absent', bg: 'bg-status-absent/10' },
    { label: 'Pending', value: String(waiting || 5), color: 'text-status-waiting', bg: 'bg-status-waiting/10' },
    { label: 'Total', value: String(total || 22), color: 'text-white', bg: 'bg-white/5' },
  ]

  const employees = rows.slice(0, 4).map((r, i) => ({
    name: r.EmployeeName,
    place: r.PlaceName,
    status: statuses[i % statuses.length],
    time: r.Time,
  }))

  if (employees.length === 0) {
    employees.push(
      { name: 'Ravi', place: 'Apollo Hospital', status: 'PRESENT', time: '12:20 AM' },
      { name: 'Karthik', place: 'Fortis Hospital', status: 'PRESENT', time: '8:00 PM' },
      { name: 'Priya', place: 'Government School', status: 'WAITING', time: '9:00 PM' },
      { name: 'Arjun', place: 'Primary Health Center', status: 'ABSENT', time: '7:58 PM' },
    )
  }

  return (
    <div className="glass-heavy rounded-t-2xl border-t border-x border-white/10 overflow-hidden">
      {/* Window chrome */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
        <div className="flex gap-1.5">
          {['bg-red-500/60', 'bg-yellow-500/60', 'bg-green-500/60'].map(c => (
            <div key={c} className={`w-2.5 h-2.5 rounded-full ${c}`} />
          ))}
        </div>
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-1.5 bg-white/5 rounded-md px-3 py-1 text-[10px] text-white/25">
            <span className="w-1.5 h-1.5 rounded-full bg-status-present animate-pulse" />
            salesagent.io/dashboard/attendance
          </div>
        </div>
        <div className="text-[10px] text-white/20 hidden sm:block">Live</div>
      </div>

      <div className="p-4 sm:p-5">
        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {stats.map(s => (
            <div key={s.label} className={`rounded-lg ${s.bg} border border-white/5 p-3`}>
              <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">{s.label}</div>
              <div className={`text-xl sm:text-2xl font-semibold ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Table preview */}
        <div className="hidden sm:block rounded-lg overflow-hidden border border-white/[0.06]">
          {/* Header */}
          <div className="grid grid-cols-[1fr_1fr_80px_72px] gap-3 px-4 py-2 bg-white/[0.03] text-[10px] text-white/25 uppercase tracking-wider">
            <span>Employee</span>
            <span>Location</span>
            <span>Status</span>
            <span>Time</span>
          </div>
          {employees.map((emp, i) => (
            <div
              key={emp.name}
              className={cn(
                'grid grid-cols-[1fr_1fr_80px_72px] gap-3 px-4 py-2.5 items-center',
                i !== employees.length - 1 && 'border-b border-white/[0.04]'
              )}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-medium text-white/60 shrink-0">
                  {emp.name[0]}
                </div>
                <span className="text-xs text-white/75 truncate">{emp.name}</span>
              </div>
              <span className="text-xs text-white/40 truncate">{emp.place}</span>
              <div className="flex items-center gap-1.5">
                {emp.status === 'PRESENT' && <CheckCircle2 className="w-3 h-3 text-status-present shrink-0" />}
                {emp.status === 'ABSENT' && <XCircle className="w-3 h-3 text-status-absent shrink-0" />}
                {emp.status === 'WAITING' && <Clock className="w-3 h-3 text-status-waiting shrink-0" />}
                <span className={cn(
                  'text-[11px] font-medium',
                  emp.status === 'PRESENT' && 'text-status-present',
                  emp.status === 'ABSENT' && 'text-status-absent',
                  emp.status === 'WAITING' && 'text-status-waiting',
                )}>
                  {emp.status}
                </span>
              </div>
              <span className="text-[11px] text-white/30">{emp.time}</span>
            </div>
          ))}
        </div>

        {/* Mobile simplified rows */}
        <div className="sm:hidden space-y-2">
          {employees.slice(0, 3).map(emp => (
            <div key={emp.name} className="flex items-center justify-between bg-white/[0.03] rounded-lg px-3 py-2.5">
              <span className="text-xs text-white/70">{emp.name}</span>
              <span className={cn(
                'text-[11px] font-medium',
                emp.status === 'PRESENT' && 'text-status-present',
                emp.status === 'ABSENT' && 'text-status-absent',
                emp.status === 'WAITING' && 'text-status-waiting',
              )}>
                {emp.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
