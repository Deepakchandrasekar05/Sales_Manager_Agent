import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Activity, BarChart3, Bell, MessageCircle,
  RefreshCw, Shield, Workflow, Zap,
} from 'lucide-react'

const features = [
  {
    icon: Activity,
    title: 'Live Attendance Monitor',
    description: 'Track all check-ins and absences in real time with instant status updates from WhatsApp confirmations.',
    tag: 'Core',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp Reply Tracking',
    description: 'Monitor employee responses with live countdown timers and auto-escalation when timeouts occur.',
    tag: 'Live',
  },
  {
    icon: BarChart3,
    title: 'Attendance Analytics',
    description: 'Visual charts showing present vs absent trends, location breakdowns, and response time analytics.',
    tag: 'Charts',
  },
  {
    icon: Workflow,
    title: 'Workflow Timeline',
    description: 'Live activity feed showing every step — schedule triggers, reminders, messages, and status updates.',
    tag: 'Live',
  },
  {
    icon: RefreshCw,
    title: 'Auto Refresh',
    description: 'Dashboard data refreshes every 30 seconds automatically to stay in sync with live operations.',
    tag: 'Realtime',
  },
  {
    icon: Bell,
    title: 'Reminder Management',
    description: 'Track all reminder messages sent with timestamps and full escalation history.',
    tag: 'Alerts',
  },
  {
    icon: Zap,
    title: 'n8n Integration',
    description: 'Seamlessly integrated with n8n workflows for automated schedule triggers and event processing.',
    tag: 'Integration',
  },
  {
    icon: Shield,
    title: 'Deduplication Guard',
    description: 'ProcessedEvents monitoring ensures no duplicate triggers pollute attendance data.',
    tag: 'Safety',
  },
]

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 18, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

export function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="features" className="py-32 px-4 sm:px-6 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-[11px] font-medium text-white/45 border border-white/[0.08] mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
            Everything you need
          </div>
          <h2 className="text-[36px] sm:text-[44px] font-semibold tracking-[-0.025em] text-white">
            Built for operational{' '}
            <span className="font-serif italic text-white/65">excellence.</span>
          </h2>
          <p className="mt-4 text-white/40 max-w-lg mx-auto text-[14px] leading-relaxed">
            A complete toolkit for managing the Sales Manager Attendance Agent workflow
            from trigger to confirmation.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={container}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
        >
          {features.map(f => (
            <motion.div
              key={f.title}
              variants={item}
              className="glass-card rounded-xl p-5 hover:bg-white/[0.07] hover:border-white/12 transition-all duration-300 group cursor-default"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors duration-300">
                  <f.icon className="w-[17px] h-[17px] text-white/55 group-hover:text-white/80 transition-colors duration-300" />
                </div>
                <span className="text-[10px] font-medium text-white/25 bg-white/5 rounded-full px-2 py-0.5">
                  {f.tag}
                </span>
              </div>
              <h3 className="text-[13px] font-semibold text-white mb-1.5 group-hover:text-white transition-colors">
                {f.title}
              </h3>
              <p className="text-xs text-white/38 leading-relaxed">
                {f.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
