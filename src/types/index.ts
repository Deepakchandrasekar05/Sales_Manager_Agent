// Status values as per Google Sheets schema
export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'WAITING'
export type TriggerType = 'REMINDER' | 'CHECKIN'
export type HealthStatus = 'healthy' | 'warning' | 'failed'
export type TimelineEventType =
  | 'SCHEDULE_TRIGGER'
  | 'REMINDER_GENERATED'
  | 'CHECKIN_GENERATED'
  | 'WHATSAPP_SENT'
  | 'EMPLOYEE_REPLIED_YES'
  | 'ATTENDANCE_UPDATED_PRESENT'
  | 'TIMEOUT_TRIGGERED'
  | 'ATTENDANCE_UPDATED_ABSENT'

// AttendanceSchedule Sheet - Master schedule source
export interface AttendanceSchedule {
  id: string
  employeeName: string
  placeName: string
  date: string // Format: MM/DD/YYYY
  time: string // Format: h:mm AM/PM
  latitude: number
  longitude: number
  phoneNumber: string
}

// AttendanceLog Sheet - Reminder and Check-In events
export interface AttendanceLog {
  id: string
  employeeName: string
  placeName: string
  scheduledTime: string // Format: h:mm AM/PM
  triggerType: TriggerType // REMINDER or CHECKIN
  triggerTimestamp: string // ISO timestamp
  eventKey: string // Format: {EmployeeName}_{Date}_{Time}_{TriggerType}
  targetLatitude: string
  targetLongitude: string
}

// ProcessedEvents Sheet - For deduplication
export interface ProcessedEvent {
  id: string
  eventKey: string
  timestamp: string
}

// ReplyTracking Sheet - Employee response and attendance status
export interface ReplyTracking {
  id: string
  eventKey: string
  employeeName: string
  placeName: string
  phoneNumber: string
  status: AttendanceStatus // WAITING, PRESENT, ABSENT
  sentTime: string
  responseTime: string | null
  sharedLatitude: string
  sharedLongitude: string
}

export interface TimelineEvent {
  id: string
  type: TimelineEventType
  label: string
  description: string
  timestamp: string
  employeeName?: string
  placeName?: string
  metadata?: Record<string, string>
}

export interface AnalyticsSummary {
  attendanceRate: number
  responseRate: number
  averageResponseTime: number
  totalProcessedEvents: number
  presentCount: number
  absentCount: number
  waitingCount: number
  totalScheduled: number
  totalCheckIns: number
  totalReminders: number
}

export interface SystemHealth {
  workflowStatus: HealthStatus
  lastExecutionTime: string
  activeWorkflows: number
  sheetSyncStatus: HealthStatus
  whatsappApiStatus: HealthStatus
  n8nWorkflowHealth: HealthStatus
  uptime: string
}

export interface DailyAttendance {
  date: string
  present: number
  absent: number
  waiting: number
  total: number
}

export interface LocationAttendance {
  location: string
  present: number
  absent: number
  waiting: number
  total: number
}

export interface HourlyActivity {
  hour: string
  reminders: number
  checkIns: number
  responses: number
}
