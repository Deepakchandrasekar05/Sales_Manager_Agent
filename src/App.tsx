import { Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import LandingPage from '@/pages/LandingPage'
import OverviewPage from '@/pages/OverviewPage'
import AttendancePage from '@/pages/AttendancePage'
import ReplyTrackingPage from '@/pages/ReplyTrackingPage'
import ProcessedEventsPage from '@/pages/ProcessedEventsPage'
import AnalyticsPage from '@/pages/AnalyticsPage'
import TimelinePage from '@/pages/TimelinePage'
import MonitoringPage from '@/pages/MonitoringPage'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'

export default function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<OverviewPage />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="reply-tracking" element={<ReplyTrackingPage />} />
          <Route path="processed-events" element={<ProcessedEventsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="timeline" element={<TimelinePage />} />
          <Route path="monitoring" element={<MonitoringPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}
