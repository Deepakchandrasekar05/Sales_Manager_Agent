const SHEET_ID = '1ClYnCVujumpuTW5JqI0iGRLAcIcHGyE6crL7JwWWMJk'
const RAW_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`

// ── Sheet Row Interfaces ─────────────────────────────────────────────────────

export interface AttendanceScheduleRow {
  EmployeeName: string
  PlaceName: string
  Date: string
  Time: string
  TargetLatitude: string
  TargetLongitude: string
  Phone: string
}

export interface TriggerLogRow {
  EmployeeName: string
  PlaceName: string
  ScheduledTime: string
  TriggerType: string
  TriggerTimestamp: string
}

export interface ProcessedEventsRow {
  EventKey: string
  Timestamp: string
}

export interface ReplyTrackingRow {
  EventKey: string
  EmployeeName: string
  PlaceName: string
  PhoneNumber: string
  Status: string
  SentTime: string
  ReplyType: string
  SharedLatitude: string
  SharedLongitude: string
  Distance: string
  AttemptCount: string
  LocationAttemptCount: string
  ProcessedAt: string
  FinalStatus: string
  ManagerAlerted: string
}

// ── Fallback Data ────────────────────────────────────────────────────────────

const FALLBACK_ATTENDANCE: AttendanceScheduleRow[] = [
  { EmployeeName: 'Ravi', PlaceName: 'Apollo Hospital', Date: '04/06/2026', Time: '1:21 AM', TargetLatitude: '19.0812', TargetLongitude: '72.8278', Phone: '916379653771' },
  { EmployeeName: 'Karthik', PlaceName: 'Fortis Hospital', Date: '03/06/2026', Time: '5:00 PM', TargetLatitude: '19.0812', TargetLongitude: '72.8278', Phone: '916379653771' },
  { EmployeeName: 'Priya', PlaceName: 'Government School', Date: '03/06/2026', Time: '10:40 AM', TargetLatitude: '19.0812', TargetLongitude: '72.8278', Phone: '916379653771' },
  { EmployeeName: 'Arjun', PlaceName: 'Primary Health Center', Date: '06/24/2026', Time: '11:45 AM', TargetLatitude: '19.0812', TargetLongitude: '72.8278', Phone: '916379470943' },
  { EmployeeName: 'Meena', PlaceName: 'District Office', Date: '03/06/2026', Time: '11:06 AM', TargetLatitude: '19.0812', TargetLongitude: '72.8278', Phone: '916379653771' },
  { EmployeeName: 'Suresh', PlaceName: 'Revenue Office', Date: '03/06/2026', Time: '12:44 PM', TargetLatitude: '19.0812', TargetLongitude: '72.8278', Phone: '916379470943' },
  { EmployeeName: 'Anand', PlaceName: 'Government Hospital', Date: '03/06/2026', Time: '12:44 PM', TargetLatitude: '19.0812', TargetLongitude: '72.8278', Phone: '916379470943' },
  { EmployeeName: 'Divya', PlaceName: 'Apollo Clinic', Date: '03/06/2026', Time: '12:44 PM', TargetLatitude: '19.0812', TargetLongitude: '72.8278', Phone: '916379470943' },
  { EmployeeName: 'Vignesh', PlaceName: 'City Health Center', Date: '04/06/2026', Time: '10:56 AM', TargetLatitude: '19.0812', TargetLongitude: '72.8278', Phone: '916379470943' },
  { EmployeeName: 'Nisha', PlaceName: 'Model School', Date: '04/06/2026', Time: '12:44 PM', TargetLatitude: '19.0812', TargetLongitude: '72.8278', Phone: '916379470943' },
  { EmployeeName: 'Hari', PlaceName: 'Collector Office', Date: '04/06/2026', Time: '12:44 PM', TargetLatitude: '19.0812', TargetLongitude: '72.8278', Phone: '916379470943' },
  { EmployeeName: 'Sneha', PlaceName: 'Government Polytechnic', Date: '04/06/2026', Time: '12:44 PM', TargetLatitude: '19.0812', TargetLongitude: '72.8278', Phone: '916379470943' },
  { EmployeeName: 'Ajay', PlaceName: 'Urban Health Clinic', Date: '04/06/2026', Time: '12:44 PM', TargetLatitude: '19.0812', TargetLongitude: '72.8278', Phone: '916379470943' },
  { EmployeeName: 'Lakshmi', PlaceName: 'Taluk Office', Date: '04/06/2026', Time: '2:07 PM', TargetLatitude: '19.0812', TargetLongitude: '72.8278', Phone: '916379470943' },
  { EmployeeName: 'Prakash', PlaceName: 'Zonal Office', Date: '04/06/2026', Time: '12:44 PM', TargetLatitude: '19.0812', TargetLongitude: '72.8278', Phone: '916379470943' },
  { EmployeeName: 'Keerthana', PlaceName: 'Public Library', Date: '04/06/2026', Time: '12:44 PM', TargetLatitude: '19.0812', TargetLongitude: '72.8278', Phone: '916379470943' },
  { EmployeeName: 'Mohan', PlaceName: 'Municipal Office', Date: '04/06/2026', Time: '12:20 AM', TargetLatitude: '19.0812', TargetLongitude: '72.8278', Phone: '916379470943' },
  { EmployeeName: 'Pooja', PlaceName: 'Community Center', Date: '04/06/2026', Time: '2:07 PM', TargetLatitude: '19.0812', TargetLongitude: '72.8278', Phone: '916379470943' },
  { EmployeeName: 'Ramesh', PlaceName: 'Primary School', Date: '04/06/2026', Time: '12:44 PM', TargetLatitude: '19.0812', TargetLongitude: '72.8278', Phone: '916379470943' },
  { EmployeeName: 'Kavya', PlaceName: 'Women Welfare Office', Date: '04/06/2026', Time: '12:25 AM', TargetLatitude: '19.0812', TargetLongitude: '72.8278', Phone: '916379470943' },
  { EmployeeName: 'Deepak', PlaceName: 'State Hospital', Date: '04/06/2026', Time: '12:25 AM', TargetLatitude: '19.0812', TargetLongitude: '72.8278', Phone: '916379470943' },
  { EmployeeName: 'Harini', PlaceName: 'Training Center', Date: '04/06/2026', Time: '12:48 AM', TargetLatitude: '19.0812', TargetLongitude: '72.8278', Phone: '916379470943' },
  { EmployeeName: 'Manoj', PlaceName: 'Government College', Date: '04/06/2026', Time: '12:25 AM', TargetLatitude: '19.0812', TargetLongitude: '72.8278', Phone: '916379470943' },
  { EmployeeName: 'Aishwarya', PlaceName: 'Public Health Unit', Date: '04/06/2026', Time: '12:53 AM', TargetLatitude: '19.0812', TargetLongitude: '72.8278', Phone: '916379470943' },
  { EmployeeName: 'Naveen', PlaceName: 'Block Development Office', Date: '04/06/2026', Time: '12:25 AM', TargetLatitude: '19.0812', TargetLongitude: '72.8278', Phone: '916379470943' },
  { EmployeeName: 'Gayathri', PlaceName: 'Sub Registrar Office', Date: '04/06/2026', Time: '12:25 AM', TargetLatitude: '19.0812', TargetLongitude: '72.8278', Phone: '916379470943' },
  { EmployeeName: 'Sanjay', PlaceName: 'Rural Health Center', Date: '04/06/2026', Time: '11:09 PM', TargetLatitude: '19.0812', TargetLongitude: '72.8278', Phone: '916379470943' },
  { EmployeeName: 'Preethi', PlaceName: 'Government ITI', Date: '04/06/2026', Time: '11:09 PM', TargetLatitude: '19.0812', TargetLongitude: '72.8278', Phone: '916379470943' },
  { EmployeeName: 'Kiran', PlaceName: 'Citizen Service Center', Date: '04/06/2026', Time: '2:07 PM', TargetLatitude: '19.0812', TargetLongitude: '72.8278', Phone: '916379470943' },
  { EmployeeName: 'Shalini', PlaceName: 'Regional Office', Date: '04/06/2026', Time: '12:17 AM', TargetLatitude: '11.0707094', TargetLongitude: '76.9181351', Phone: '918015210930' },
]

const FALLBACK_PROCESSED_EVENTS: ProcessedEventsRow[] = [
  { EventKey: 'Keerthana_04/06/2026_11:45 PM_REMINDER', Timestamp: '' },
  { EventKey: 'Pooja_04/06/2026_11:45 PM_REMINDER', Timestamp: '' },
  { EventKey: 'Ramesh_04/06/2026_11:45 PM_REMINDER', Timestamp: '' },
  { EventKey: 'Karthik_03/06/2026_11:44 PM_CHECKIN', Timestamp: '' },
  { EventKey: 'Priya_03/06/2026_11:44 PM_CHECKIN', Timestamp: '' },
  { EventKey: 'Arjun_04/06/2026_11:44 PM_CHECKIN', Timestamp: '' },
  { EventKey: 'Meena_03/06/2026_11:44 PM_CHECKIN', Timestamp: '' },
  { EventKey: 'Suresh_03/06/2026_11:44 PM_CHECKIN', Timestamp: '' },
  { EventKey: 'Anand_03/06/2026_11:44 PM_CHECKIN', Timestamp: '' },
  { EventKey: 'Divya_03/06/2026_11:44 PM_CHECKIN', Timestamp: '' },
  { EventKey: 'Vignesh_04/06/2026_11:44 PM_CHECKIN', Timestamp: '' },
  { EventKey: 'Nisha_04/06/2026_11:44 PM_CHECKIN', Timestamp: '' },
  { EventKey: 'Hari_04/06/2026_11:44 PM_CHECKIN', Timestamp: '' },
  { EventKey: 'Sneha_04/06/2026_11:44 PM_CHECKIN', Timestamp: '' },
  { EventKey: 'Ajay_04/06/2026_11:44 PM_CHECKIN', Timestamp: '' },
  { EventKey: 'Lakshmi_04/06/2026_11:44 PM_CHECKIN', Timestamp: '' },
  { EventKey: 'Prakash_04/06/2026_11:44 PM_CHECKIN', Timestamp: '' },
]

const FALLBACK_REPLY_TRACKING: ReplyTrackingRow[] = [
  { EventKey: 'Keerthana_04/06/2026_11:45 PM_REMINDER', EmployeeName: '', PlaceName: '', PhoneNumber: '6379470943', Status: 'WAITING', SentTime: '', ReplyType: '', SharedLatitude: '', SharedLongitude: '', Distance: '', AttemptCount: '', LocationAttemptCount: '', ProcessedAt: '', FinalStatus: '', ManagerAlerted: '' },
  { EventKey: 'Pooja_04/06/2026_11:45 PM_REMINDER', EmployeeName: '', PlaceName: '', PhoneNumber: '6379470943', Status: 'WAITING', SentTime: '', ReplyType: '', SharedLatitude: '', SharedLongitude: '', Distance: '', AttemptCount: '', LocationAttemptCount: '', ProcessedAt: '', FinalStatus: '', ManagerAlerted: '' },
  { EventKey: 'Ramesh_04/06/2026_11:45 PM_REMINDER', EmployeeName: '', PlaceName: '', PhoneNumber: '6379470943', Status: 'PRESENT', SentTime: '', ReplyType: '', SharedLatitude: '', SharedLongitude: '', Distance: '', AttemptCount: '', LocationAttemptCount: '', ProcessedAt: '', FinalStatus: '', ManagerAlerted: '' },
  { EventKey: 'Karthik_03/06/2026_11:44 PM_CHECKIN', EmployeeName: '', PlaceName: '', PhoneNumber: '6379470943', Status: 'WAITING', SentTime: '', ReplyType: '', SharedLatitude: '', SharedLongitude: '', Distance: '', AttemptCount: '', LocationAttemptCount: '', ProcessedAt: '', FinalStatus: '', ManagerAlerted: '' },
  { EventKey: 'Priya_03/06/2026_11:44 PM_CHECKIN', EmployeeName: '', PlaceName: '', PhoneNumber: '6379470943', Status: 'WAITING', SentTime: '', ReplyType: '', SharedLatitude: '', SharedLongitude: '', Distance: '', AttemptCount: '', LocationAttemptCount: '', ProcessedAt: '', FinalStatus: '', ManagerAlerted: '' },
  { EventKey: 'Arjun_04/06/2026_11:44 PM_CHECKIN', EmployeeName: '', PlaceName: '', PhoneNumber: '6379470943', Status: 'PRESENT', SentTime: '', ReplyType: '', SharedLatitude: '', SharedLongitude: '', Distance: '', AttemptCount: '', LocationAttemptCount: '', ProcessedAt: '', FinalStatus: '', ManagerAlerted: '' },
  { EventKey: 'Meena_03/06/2026_11:44 PM_CHECKIN', EmployeeName: '', PlaceName: '', PhoneNumber: '6379470943', Status: 'WAITING', SentTime: '', ReplyType: '', SharedLatitude: '', SharedLongitude: '', Distance: '', AttemptCount: '', LocationAttemptCount: '', ProcessedAt: '', FinalStatus: '', ManagerAlerted: '' },
  { EventKey: 'Suresh_03/06/2026_11:44 PM_CHECKIN', EmployeeName: '', PlaceName: '', PhoneNumber: '6379470943', Status: 'PRESENT', SentTime: '', ReplyType: '', SharedLatitude: '', SharedLongitude: '', Distance: '', AttemptCount: '', LocationAttemptCount: '', ProcessedAt: '', FinalStatus: '', ManagerAlerted: '' },
  { EventKey: 'Anand_03/06/2026_11:44 PM_CHECKIN', EmployeeName: '', PlaceName: '', PhoneNumber: '6379470943', Status: 'WAITING', SentTime: '', ReplyType: '', SharedLatitude: '', SharedLongitude: '', Distance: '', AttemptCount: '', LocationAttemptCount: '', ProcessedAt: '', FinalStatus: '', ManagerAlerted: '' },
  { EventKey: 'Divya_03/06/2026_11:44 PM_CHECKIN', EmployeeName: '', PlaceName: '', PhoneNumber: '6379470943', Status: 'WAITING', SentTime: '', ReplyType: '', SharedLatitude: '', SharedLongitude: '', Distance: '', AttemptCount: '', LocationAttemptCount: '', ProcessedAt: '', FinalStatus: '', ManagerAlerted: '' },
  { EventKey: 'Vignesh_04/06/2026_11:44 PM_CHECKIN', EmployeeName: '', PlaceName: '', PhoneNumber: '6379470943', Status: 'PRESENT', SentTime: '', ReplyType: '', SharedLatitude: '', SharedLongitude: '', Distance: '', AttemptCount: '', LocationAttemptCount: '', ProcessedAt: '', FinalStatus: '', ManagerAlerted: '' },
  { EventKey: 'Nisha_04/06/2026_11:44 PM_CHECKIN', EmployeeName: '', PlaceName: '', PhoneNumber: '6379470943', Status: 'WAITING', SentTime: '', ReplyType: '', SharedLatitude: '', SharedLongitude: '', Distance: '', AttemptCount: '', LocationAttemptCount: '', ProcessedAt: '', FinalStatus: '', ManagerAlerted: '' },
  { EventKey: 'Hari_04/06/2026_11:44 PM_CHECKIN', EmployeeName: '', PlaceName: '', PhoneNumber: '6379470943', Status: 'WAITING', SentTime: '', ReplyType: '', SharedLatitude: '', SharedLongitude: '', Distance: '', AttemptCount: '', LocationAttemptCount: '', ProcessedAt: '', FinalStatus: '', ManagerAlerted: '' },
  { EventKey: 'Sneha_04/06/2026_11:44 PM_CHECKIN', EmployeeName: '', PlaceName: '', PhoneNumber: '6379470943', Status: 'WAITING', SentTime: '', ReplyType: '', SharedLatitude: '', SharedLongitude: '', Distance: '', AttemptCount: '', LocationAttemptCount: '', ProcessedAt: '', FinalStatus: '', ManagerAlerted: '' },
  { EventKey: 'Ajay_04/06/2026_11:44 PM_CHECKIN', EmployeeName: '', PlaceName: '', PhoneNumber: '6379470943', Status: 'WAITING', SentTime: '', ReplyType: '', SharedLatitude: '', SharedLongitude: '', Distance: '', AttemptCount: '', LocationAttemptCount: '', ProcessedAt: '', FinalStatus: '', ManagerAlerted: '' },
  { EventKey: 'Lakshmi_04/06/2026_11:44 PM_CHECKIN', EmployeeName: '', PlaceName: '', PhoneNumber: '6379470943', Status: 'WAITING', SentTime: '', ReplyType: '', SharedLatitude: '', SharedLongitude: '', Distance: '', AttemptCount: '', LocationAttemptCount: '', ProcessedAt: '', FinalStatus: '', ManagerAlerted: '' },
  { EventKey: 'Prakash_04/06/2026_11:44 PM_CHECKIN', EmployeeName: '', PlaceName: '', PhoneNumber: '6379470943', Status: 'PRESENT', SentTime: '', ReplyType: '', SharedLatitude: '', SharedLongitude: '', Distance: '', AttemptCount: '', LocationAttemptCount: '', ProcessedAt: '', FinalStatus: '', ManagerAlerted: '' },
]

// ── CSV Parser ───────────────────────────────────────────────────────────────

function parseCsvLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  for (const ch of line) {
    if (inQuotes) {
      if (ch === '"') inQuotes = false
      else current += ch
    } else {
      if (ch === '"') inQuotes = true
      else if (ch === ',') { result.push(current.trim()); current = '' }
      else current += ch
    }
  }
  result.push(current.trim())
  return result
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseCsv<T>(text: string): T[] {
  const lines = text.split('\n').filter(l => l.trim())
  if (lines.length < 2) return []
  const headers = parseCsvLine(lines[0])
  return lines.slice(1).map(line => {
    const values = parseCsvLine(line)
    const row: Record<string, string> = {}
    headers.forEach((h, i) => { row[h.trim()] = (values[i] ?? '').trim() })
    return row as unknown as T
  })
}

// ── Generic Fetch with CORS Proxies ──────────────────────────────────────────

async function tryFetchCsv(url: string, timeout = 10000): Promise<string> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)
  try {
    const res = await fetch(url, { signal: controller.signal })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const text = await res.text()
    if (!text.includes(',')) throw new Error('Invalid CSV')
    return text
  } finally {
    clearTimeout(timer)
  }
}

async function fetchCsvWithProxies(url: string): Promise<string> {
  const proxies = [
    `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    `https://corsproxy.io/?${encodeURIComponent(url)}`,
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
    url,
  ]
  for (const proxyUrl of proxies) {
    try {
      const result = await tryFetchCsv(proxyUrl)
      console.log(`Sheet fetch succeeded via: ${proxyUrl.split('?')[0]}`)
      return result
    } catch (e) {
      console.warn(`Sheet fetch failed via: ${proxyUrl.split('?')[0]}`, e)
    }
  }
  throw new Error('All fetch attempts failed')
}

// ── Attendance Schedule (gid=0) ──────────────────────────────────────────────

let cachedAttendance: AttendanceScheduleRow[] | null = null
let cacheAttendanceTime = 0
const CACHE_TTL = 60_000

export async function fetchAttendanceSchedule(): Promise<AttendanceScheduleRow[]> {
  if (cachedAttendance && Date.now() - cacheAttendanceTime < CACHE_TTL) return cachedAttendance
  try {
    const text = await fetchCsvWithProxies(`${RAW_CSV_URL}&gid=0`)
    const rows = parseCsv<AttendanceScheduleRow>(text)
    if (rows.length > 0) {
      cachedAttendance = rows
      cacheAttendanceTime = Date.now()
      console.log(`Fetched ${rows.length} attendance schedule rows`)
      return rows
    }
    throw new Error('Invalid data')
  } catch (e) {
    console.warn('Attendance schedule fetch failed, using fallback', e)
    cachedAttendance = FALLBACK_ATTENDANCE
    cacheAttendanceTime = Date.now()
    return FALLBACK_ATTENDANCE
  }
}

// ── Trigger Log (gid=115132173) ─────────────────────────────────────────────

let cachedTriggerLog: TriggerLogRow[] | null = null
let cacheTriggerLogTime = 0

export async function fetchTriggerLog(): Promise<TriggerLogRow[]> {
  if (cachedTriggerLog && Date.now() - cacheTriggerLogTime < CACHE_TTL) return cachedTriggerLog
  try {
    const text = await fetchCsvWithProxies(`${RAW_CSV_URL}&gid=115132173`)
    const rows = parseCsv<TriggerLogRow>(text)
    if (rows.length > 0) {
      cachedTriggerLog = rows
      cacheTriggerLogTime = Date.now()
      console.log(`Fetched ${rows.length} trigger log rows`)
      return rows
    }
    throw new Error('Invalid data')
  } catch (e) {
    console.warn('Trigger log fetch failed, using empty fallback', e)
    cachedTriggerLog = []
    cacheTriggerLogTime = Date.now()
    return []
  }
}

// ── Processed Events (gid=839706631) ────────────────────────────────────────

let cachedProcessedEvents: ProcessedEventsRow[] | null = null
let cacheProcessedEventsTime = 0

export async function fetchProcessedEvents(): Promise<ProcessedEventsRow[]> {
  if (cachedProcessedEvents && Date.now() - cacheProcessedEventsTime < CACHE_TTL) return cachedProcessedEvents
  try {
    const text = await fetchCsvWithProxies(`${RAW_CSV_URL}&gid=839706631`)
    const rows = parseCsv<ProcessedEventsRow>(text)
    if (rows.length > 0) {
      cachedProcessedEvents = rows
      cacheProcessedEventsTime = Date.now()
      console.log(`Fetched ${rows.length} processed events rows`)
      return rows
    }
    throw new Error('Invalid data')
  } catch (e) {
    console.warn('Processed events fetch failed, using fallback', e)
    cachedProcessedEvents = FALLBACK_PROCESSED_EVENTS
    cacheProcessedEventsTime = Date.now()
    return FALLBACK_PROCESSED_EVENTS
  }
}

// ── Reply Tracking (gid=275948246) ──────────────────────────────────────────

let cachedReplyTracking: ReplyTrackingRow[] | null = null
let cacheReplyTrackingTime = 0

export async function fetchReplyTracking(): Promise<ReplyTrackingRow[]> {
  if (cachedReplyTracking && Date.now() - cacheReplyTrackingTime < CACHE_TTL) return cachedReplyTracking
  try {
    const text = await fetchCsvWithProxies(`${RAW_CSV_URL}&gid=275948246`)
    const rows = parseCsv<ReplyTrackingRow>(text)
    console.log(`Reply Tracking: parsed ${rows.length} rows, first row:`, rows[0])
    if (rows.length > 0) {
      cachedReplyTracking = rows
      cacheReplyTrackingTime = Date.now()
      console.log(`Fetched ${rows.length} reply tracking rows`)
      return rows
    }
    throw new Error('No rows parsed')
  } catch (e) {
    console.warn('Reply tracking fetch failed, using fallback', e)
    cachedReplyTracking = FALLBACK_REPLY_TRACKING
    cacheReplyTrackingTime = Date.now()
    return FALLBACK_REPLY_TRACKING
  }
}

// ── Backward Compatibility ───────────────────────────────────────────────────

export type SheetRow = AttendanceScheduleRow

export async function fetchSheetData(): Promise<AttendanceScheduleRow[]> {
  return fetchAttendanceSchedule()
}
