import type {
  AttendanceLog,
  ReplyTracking,
  ProcessedEvent,
  TimelineEvent,
  AnalyticsSummary,
  SystemHealth,
  DailyAttendance,
  LocationAttendance,
  HourlyActivity,
} from '@/types'

const now = new Date()
const ts = (offsetMinutes: number) =>
  new Date(now.getTime() - offsetMinutes * 60 * 1000).toISOString()

// AttendanceLog Sheet - Stores Reminder and Check-In events
export const mockAttendanceLogs: AttendanceLog[] = [
  { id: '1', employeeName: 'Ravi', placeName: 'Apollo Hospital', scheduledTime: '2:00 PM', triggerType: 'REMINDER', triggerTimestamp: '2026-06-04 13:55:00', eventKey: 'Ravi_04/06/2026_2:00PM_REMINDER', targetLatitude: '19.0812', targetLongitude: '72.8278' },
  { id: '2', employeeName: 'Ravi', placeName: 'Apollo Hospital', scheduledTime: '2:00 PM', triggerType: 'CHECKIN', triggerTimestamp: '2026-06-04 14:00:00', eventKey: 'Ravi_04/06/2026_2:00PM_CHECKIN', targetLatitude: '19.0812', targetLongitude: '72.8278' },
  { id: '3', employeeName: 'Priya', placeName: 'City Mall Branch', scheduledTime: '9:00 AM', triggerType: 'REMINDER', triggerTimestamp: '2026-06-04 08:55:00', eventKey: 'Priya_04/06/2026_9:00AM_REMINDER', targetLatitude: '19.0812', targetLongitude: '72.8278' },
  { id: '4', employeeName: 'Priya', placeName: 'City Mall Branch', scheduledTime: '9:00 AM', triggerType: 'CHECKIN', triggerTimestamp: '2026-06-04 09:00:00', eventKey: 'Priya_04/06/2026_9:00AM_CHECKIN', targetLatitude: '19.0812', targetLongitude: '72.8278' },
  { id: '5', employeeName: 'Amit', placeName: 'Tech Park Office', scheduledTime: '10:00 AM', triggerType: 'REMINDER', triggerTimestamp: '2026-06-04 09:55:00', eventKey: 'Amit_04/06/2026_10:00AM_REMINDER', targetLatitude: '19.0812', targetLongitude: '72.8278' },
  { id: '6', employeeName: 'Amit', placeName: 'Tech Park Office', scheduledTime: '10:00 AM', triggerType: 'CHECKIN', triggerTimestamp: '2026-06-04 10:00:00', eventKey: 'Amit_04/06/2026_10:00AM_CHECKIN', targetLatitude: '19.0812', targetLongitude: '72.8278' },
  { id: '7', employeeName: 'Sneha', placeName: 'Central Hospital', scheduledTime: '11:30 AM', triggerType: 'REMINDER', triggerTimestamp: '2026-06-04 11:25:00', eventKey: 'Sneha_04/06/2026_11:30AM_REMINDER', targetLatitude: '19.0812', targetLongitude: '72.8278' },
  { id: '8', employeeName: 'Sneha', placeName: 'Central Hospital', scheduledTime: '11:30 AM', triggerType: 'CHECKIN', triggerTimestamp: '2026-06-04 11:30:00', eventKey: 'Sneha_04/06/2026_11:30AM_CHECKIN', targetLatitude: '19.0812', targetLongitude: '72.8278' },
  { id: '9', employeeName: 'Vikram', placeName: 'Downtown Hub', scheduledTime: '3:00 PM', triggerType: 'REMINDER', triggerTimestamp: '2026-06-04 14:55:00', eventKey: 'Vikram_04/06/2026_3:00PM_REMINDER', targetLatitude: '19.0812', targetLongitude: '72.8278' },
  { id: '10', employeeName: 'Vikram', placeName: 'Downtown Hub', scheduledTime: '3:00 PM', triggerType: 'CHECKIN', triggerTimestamp: '2026-06-04 15:00:00', eventKey: 'Vikram_04/06/2026_3:00PM_CHECKIN', targetLatitude: '19.0812', targetLongitude: '72.8278' },
]

// ReplyTracking Sheet - Employee response and attendance status
export const mockReplyTracking: ReplyTracking[] = [
  { id: '1', eventKey: 'Ravi_04/06/2026_2:00PM_CHECKIN', employeeName: 'Ravi', placeName: 'Apollo Hospital', phoneNumber: '918015210930', status: 'PRESENT', sentTime: '2026-06-04 14:00:00', responseTime: '2026-06-04 14:01:10', sharedLatitude: '19.0812', sharedLongitude: '72.8278' },
  { id: '2', eventKey: 'Priya_04/06/2026_9:00AM_CHECKIN', employeeName: 'Priya', placeName: 'City Mall Branch', phoneNumber: '919876543210', status: 'PRESENT', sentTime: '2026-06-04 09:00:00', responseTime: '2026-06-04 09:02:30', sharedLatitude: '19.0812', sharedLongitude: '72.8278' },
  { id: '3', eventKey: 'Amit_04/06/2026_10:00AM_CHECKIN', employeeName: 'Amit', placeName: 'Tech Park Office', phoneNumber: '918765432109', status: 'WAITING', sentTime: ts(30), responseTime: null, sharedLatitude: '', sharedLongitude: '' },
  { id: '4', eventKey: 'Sneha_04/06/2026_11:30AM_CHECKIN', employeeName: 'Sneha', placeName: 'Central Hospital', phoneNumber: '919012345678', status: 'ABSENT', sentTime: ts(90), responseTime: null, sharedLatitude: '', sharedLongitude: '' },
  { id: '5', eventKey: 'Vikram_04/06/2026_3:00PM_CHECKIN', employeeName: 'Vikram', placeName: 'Downtown Hub', phoneNumber: '918912345670', status: 'PRESENT', sentTime: ts(60), responseTime: ts(58), sharedLatitude: '19.0812', sharedLongitude: '72.8278' },
]

// ProcessedEvents Sheet - For deduplication
export const mockProcessedEvents: ProcessedEvent[] = [
  { id: '1', eventKey: 'Ravi_04/06/2026_2:00PM_REMINDER', timestamp: '2026-06-04 13:55:00' },
  { id: '2', eventKey: 'Ravi_04/06/2026_2:00PM_CHECKIN', timestamp: '2026-06-04 14:00:00' },
  { id: '3', eventKey: 'Priya_04/06/2026_9:00AM_REMINDER', timestamp: '2026-06-04 08:55:00' },
  { id: '4', eventKey: 'Priya_04/06/2026_9:00AM_CHECKIN', timestamp: '2026-06-04 09:00:00' },
  { id: '5', eventKey: 'Amit_04/06/2026_10:00AM_REMINDER', timestamp: '2026-06-04 09:55:00' },
  { id: '6', eventKey: 'Amit_04/06/2026_10:00AM_CHECKIN', timestamp: '2026-06-04 10:00:00' },
  { id: '7', eventKey: 'Sneha_04/06/2026_11:30AM_REMINDER', timestamp: '2026-06-04 11:25:00' },
  { id: '8', eventKey: 'Sneha_04/06/2026_11:30AM_CHECKIN', timestamp: '2026-06-04 11:30:00' },
]

export const mockTimelineEvents: TimelineEvent[] = [
  { id: 't1', type: 'SCHEDULE_TRIGGER', label: 'Schedule Trigger Executed', description: 'Morning attendance schedule triggered for Apollo Hospital', timestamp: ts(120), employeeName: 'Ravi', placeName: 'Apollo Hospital' },
  { id: 't2', type: 'CHECKIN_GENERATED', label: 'Check-in Generated', description: 'Attendance check-in request generated and queued', timestamp: ts(119), employeeName: 'Ravi', placeName: 'Apollo Hospital' },
  { id: 't3', type: 'WHATSAPP_SENT', label: 'WhatsApp Message Sent', description: 'Attendance confirmation message sent via WhatsApp Cloud API', timestamp: ts(118), employeeName: 'Ravi' },
  { id: 't4', type: 'EMPLOYEE_REPLIED_YES', label: 'Employee Replied YES', description: 'Employee confirmed attendance via WhatsApp reply', timestamp: ts(116), employeeName: 'Ravi' },
  { id: 't5', type: 'ATTENDANCE_UPDATED_PRESENT', label: 'Attendance Updated to PRESENT', description: 'Attendance status updated to PRESENT in Google Sheets', timestamp: ts(115), employeeName: 'Ravi', placeName: 'Apollo Hospital' },
  { id: 't6', type: 'REMINDER_GENERATED', label: 'Reminder Generated', description: 'Reminder sent for Sneha — no initial response', timestamp: ts(90), employeeName: 'Sneha', placeName: 'Central Hospital' },
  { id: 't7', type: 'WHATSAPP_SENT', label: 'WhatsApp Message Sent', description: 'Reminder message sent to Sneha', timestamp: ts(89), employeeName: 'Sneha' },
  { id: 't8', type: 'TIMEOUT_TRIGGERED', label: 'Timeout Triggered', description: 'No response received within the 30-minute window', timestamp: ts(60), employeeName: 'Sneha' },
  { id: 't9', type: 'ATTENDANCE_UPDATED_ABSENT', label: 'Attendance Updated to ABSENT', description: 'Status updated to ABSENT due to timeout', timestamp: ts(59), employeeName: 'Sneha', placeName: 'Central Hospital' },
  { id: 't10', type: 'CHECKIN_GENERATED', label: 'Check-in Generated', description: 'Check-in generated for Amit', timestamp: ts(35), employeeName: 'Amit', placeName: 'Tech Park Office' },
  { id: 't11', type: 'WHATSAPP_SENT', label: 'WhatsApp Message Sent', description: 'Message dispatched to Amit', timestamp: ts(34), employeeName: 'Amit' },
]

export const mockAnalyticsSummary: AnalyticsSummary = {
  attendanceRate: 60,
  responseRate: 40,
  averageResponseTime: 95,
  totalProcessedEvents: 8,
  presentCount: 3,
  absentCount: 1,
  waitingCount: 1,
  totalScheduled: 5,
  totalCheckIns: 5,
  totalReminders: 5,
}

export const mockSystemHealth: SystemHealth = {
  workflowStatus: 'healthy',
  lastExecutionTime: ts(5),
  activeWorkflows: 3,
  sheetSyncStatus: 'healthy',
  whatsappApiStatus: 'warning',
  n8nWorkflowHealth: 'healthy',
  uptime: '99.7%',
}

export const mockDailyAttendance: DailyAttendance[] = [
  { date: 'Mon', present: 18, absent: 4, waiting: 2, total: 24 },
  { date: 'Tue', present: 20, absent: 2, waiting: 1, total: 23 },
  { date: 'Wed', present: 16, absent: 6, waiting: 3, total: 25 },
  { date: 'Thu', present: 19, absent: 3, waiting: 2, total: 24 },
  { date: 'Fri', present: 21, absent: 1, waiting: 1, total: 23 },
  { date: 'Sat', present: 14, absent: 3, waiting: 2, total: 19 },
  { date: 'Sun', present: 11, absent: 6, waiting: 1, total: 18 },
]

export const mockLocationAttendance: LocationAttendance[] = [
  { location: 'Apollo Hospital', present: 5, absent: 1, waiting: 1, total: 7 },
  { location: 'City Mall Branch', present: 4, absent: 1, waiting: 0, total: 5 },
  { location: 'Tech Park Office', present: 6, absent: 2, waiting: 1, total: 9 },
  { location: 'Central Hospital', present: 3, absent: 2, waiting: 0, total: 5 },
  { location: 'Downtown Hub', present: 5, absent: 0, waiting: 1, total: 6 },
]

export const mockHourlyActivity: HourlyActivity[] = [
  { hour: '07:00', reminders: 0, checkIns: 2, responses: 1 },
  { hour: '08:00', reminders: 1, checkIns: 4, responses: 3 },
  { hour: '09:00', reminders: 3, checkIns: 8, responses: 6 },
  { hour: '10:00', reminders: 4, checkIns: 6, responses: 4 },
  { hour: '11:00', reminders: 2, checkIns: 3, responses: 2 },
  { hour: '12:00', reminders: 1, checkIns: 2, responses: 2 },
  { hour: '13:00', reminders: 0, checkIns: 1, responses: 1 },
  { hour: '14:00', reminders: 1, checkIns: 2, responses: 1 },
]
