/*
# Attendance Agent - Schema Update for Google Sheets Structure

Updates the schema to exactly match the Google Sheets document:

1. AttendanceSchedule Sheet - Master schedule source
   Columns: EmployeeName, PlaceName, Date, Time, Latitude, Longitude, PhoneNumber

2. AttendanceLog Sheet - Stores Reminder and Check-In events
   Columns: EmployeeName, PlaceName, ScheduledTime, TriggerType, TriggerTimestamp, EventKey
   TriggerType values: REMINDER, CHECKIN

3. ProcessedEvents Sheet - Deduplication
   Columns: EventKey, Timestamp

4. ReplyTracking Sheet - Employee response tracking
   Columns: EventKey, EmployeeName, PlaceName, PhoneNumber, Status, SentTime, ResponseTime
   Status values: WAITING, PRESENT, ABSENT
*/

-- Drop existing tables
DROP TABLE IF EXISTS timeline_events CASCADE;
DROP TABLE IF EXISTS processed_events CASCADE;
DROP TABLE IF EXISTS reply_tracking CASCADE;
DROP TABLE IF EXISTS attendance_records CASCADE;

-- ═══════════════════════════════════════════════════════════
-- 1. ATTENDANCE SCHEDULE (Master Schedule Source)
-- ═══════════════════════════════════════════════════════════

CREATE TABLE attendance_schedule (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_name text NOT NULL,
  place_name text NOT NULL,
  date text NOT NULL,
  time text NOT NULL,
  latitude double precision,
  longitude double precision,
  phone_number text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_schedule_employee ON attendance_schedule(employee_name);
CREATE INDEX idx_schedule_date ON attendance_schedule(date);

ALTER TABLE attendance_schedule ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_access_schedule" ON attendance_schedule FOR ALL
TO anon, authenticated USING (true) WITH CHECK (true);


-- ═══════════════════════════════════════════════════════════
-- 2. ATTENDANCE LOG (Reminder and Check-In Events)
-- ═══════════════════════════════════════════════════════════

CREATE TABLE attendance_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_name text NOT NULL,
  place_name text NOT NULL,
  scheduled_time text NOT NULL,
  trigger_type text NOT NULL CHECK (trigger_type IN ('REMINDER', 'CHECKIN')),
  trigger_timestamp timestamptz NOT NULL DEFAULT now(),
  event_key text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_log_event_key ON attendance_log(event_key);
CREATE INDEX idx_log_employee ON attendance_log(employee_name);
CREATE INDEX idx_log_timestamp ON attendance_log(trigger_timestamp DESC);

ALTER TABLE attendance_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_access_log" ON attendance_log FOR ALL
TO anon, authenticated USING (true) WITH CHECK (true);


-- ═══════════════════════════════════════════════════════════
-- 3. PROCESSED EVENTS (Deduplication Log)
-- ═══════════════════════════════════════════════════════════

CREATE TABLE processed_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_key text NOT NULL,
  timestamp timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_processed_event_key ON processed_events(event_key);

ALTER TABLE processed_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_access_processed" ON processed_events FOR ALL
TO anon, authenticated USING (true) WITH CHECK (true);


-- ═══════════════════════════════════════════════════════════
-- 4. REPLY TRACKING (Employee Response Tracking)
-- ═══════════════════════════════════════════════════════════

CREATE TABLE reply_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_key text NOT NULL,
  employee_name text NOT NULL,
  place_name text NOT NULL,
  phone_number text NOT NULL,
  status text NOT NULL DEFAULT 'WAITING' CHECK (status IN ('WAITING', 'PRESENT', 'ABSENT')),
  sent_time timestamptz NOT NULL DEFAULT now(),
  response_time timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_reply_event_key ON reply_tracking(event_key);
CREATE INDEX idx_reply_status ON reply_tracking(status);
CREATE INDEX idx_reply_sent_time ON reply_tracking(sent_time DESC);

ALTER TABLE reply_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_access_reply" ON reply_tracking FOR ALL
TO anon, authenticated USING (true) WITH CHECK (true);


-- ═══════════════════════════════════════════════════════════
-- 5. TIMELINE EVENTS (Activity Feed)
-- ═══════════════════════════════════════════════════════════

CREATE TABLE timeline_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  label text NOT NULL,
  description text NOT NULL DEFAULT '',
  employee_name text,
  place_name text,
  metadata jsonb,
  event_timestamp timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_timeline_timestamp ON timeline_events(event_timestamp DESC);

ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_access_timeline" ON timeline_events FOR ALL
TO anon, authenticated USING (true) WITH CHECK (true);
