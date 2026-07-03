import { Navbar, HeroSection } from '@/components/landing/Hero'
import { FeaturesSection } from '@/components/landing/Features'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      {/* Hero */}
      <HeroSection />

      {/* Add breathing room below hero for the floating preview */}
      <div className="h-64 sm:h-80 lg:h-96" />

      {/* Features */}
      <FeaturesSection />

      {/* CTA Section */}
      <section id="dashboard" className="py-28 px-4 sm:px-6 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[radial-gradient(ellipse_at_bottom,rgba(255,255,255,0.05)_0%,transparent_65%)]" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="glass-heavy rounded-2xl p-10 sm:p-14 border border-white/[0.08]">
            <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-[11px] font-medium text-white/45 border border-white/[0.08] mb-6">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-present opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-status-present" />
              </span>
              Ready to deploy
            </div>
            <h2 className="text-[32px] sm:text-[40px] font-semibold tracking-[-0.025em] text-white mb-4">
              Ready to monitor{' '}
              <span className="font-serif italic text-white/75">attendance</span>
              {' '}at scale?
            </h2>
            <p className="text-white/40 text-[14px] mb-8 max-w-xl mx-auto leading-relaxed">
              Connect your n8n workflows, Google Sheets, and WhatsApp Cloud API to get
              real-time visibility into your entire Sales Manager attendance operation.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/dashboard">
                <button className="inline-flex items-center gap-2 bg-white text-black rounded-xl px-8 py-3 text-[13px] font-semibold hover:bg-white/90 transition-all shadow-2xl shadow-white/10 hover:shadow-white/20">
                  Launch Dashboard
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <a href="#features">
                <button className="inline-flex items-center gap-2 glass border border-white/[0.1] text-white/60 hover:text-white hover:border-white/20 rounded-xl px-8 py-3 text-[13px] font-semibold transition-all">
                  View Features
                </button>
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.05] py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[11px] text-white/20">
            © 2024 Sales Manager Attendance Agent. All rights reserved.
          </div>
          <div className="flex gap-5 text-[11px] text-white/20">
            {['n8n Workflows', 'Google Sheets', 'WhatsApp Cloud API', 'Supabase'].map(s => (
              <span key={s}>{s}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
