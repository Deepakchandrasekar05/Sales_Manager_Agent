/*
# Sales Manager Attendance Agent — Database Schema

## Overview
Creates all tables required to persist attendance monitoring data for the
Sales Manager Attendance Agent system, replacing the in-memory mock data layer
with a real Supabase-backed persistent store.

## New Tables

### 1. `attendance_records`
Stores every attendance event — check-ins, reminders, and manual triggers —
mirroring the AttendanceSchedule and AttendanceLog Google Sheets.

Columns:
- `id` (uuid, PK)
- `employee_name` (text, not null)
- `place_name` (text, not null)
- `scheduled_time` (timestamptz)
- `trigger_type` (text) — 'SCHEDULE' | 'MANUAL' | 'REMINDER'
- `attendance_status` (text) — 'PRESENT' | 'ABSENT' | 'WAITING'
- `response_status` (text) — 'CONFIRMED' | 'PENDING' | 'TIMEOUT' | 'DECLINED'
- `phone_number` (text, nullable)
- `timestamp` (timestamptz, defaults to now())
- `created_at` (timestamptz)

### 2. `reply_tracking`
Tracks WhatsApp message delivery and employee reply state (ReplyTracking sheet).

Columns:
- `id` (uuid, PK)
- `event_key` (text, not null, unique)
- `employee_name` (text)
- `place_name` (text)
- `phone_number` (text)
- `sent_time` (timestamptz)
- `response_time` (timestamptz, nullable — null until replied)
- `current_status` (text) — 'CONFIRMED' | 'PENDING' | 'TIMEOUT' | 'DECLINED'
- `created_at` (timestamptz)

### 3. `processed_events`
Deduplication log — every event key processed by n8n workflows (ProcessedEvents sheet).

Columns:
- `id` (uuid, PK)
- `event_key` (text, not null, unique)
- `timestamp` (timestamptz)
- `created_at` (timestamptz)

### 4. `timeline_events`
Workflow activity feed — every step from schedule trigger to final attendance update.

Columns:
- `id` (uuid, PK)
- `event_type` (text) — one of 8 workflow step types
- `label` (text)
- `description` (text)
- `employee_name` (text, nullable)
- `place_name` (text, nullable)
- `metadata` (jsonb, nullable)
- `event_timestamp` (timestamptz)
- `created_at` (timestamptz)

## Security
- RLS enabled on all tables
- Public (anon + authenticated) read/write — single-tenant operational dashboard,
  no user accounts required; data is shared operational state
- All policies use USING (true) / WITH CHECK (true) because this is a
  single-tenant system dashboard, not multi-user isolated data

## Indexes
- `attendance_records`: index on (attendance_status), (employee_name), (timestamp DESC)
- `reply_tracking`: index on (current_status), (event_key)
- `processed_events`: unique index on (event_key)
- `timeline_events`: index on (event_timestamp DESC)
*/

-- ═══════════════════════════════════════════════════════════
-- 1. ATTENDANCE RECORDS
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS attendance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_name text NOT NULL,
  place_name text NOT NULL,
  scheduled_time timestamptz,
  trigger_type text NOT NULL DEFAULT 'SCHEDULE',
  attendance_status text NOT NULL DEFAULT 'WAITING',
  response_status text NOT NULL DEFAULT 'PENDING',
  phone_number text,
  timestamp timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_attendance_status ON attendance_records(attendance_status);
CREATE INDEX IF NOT EXISTS idx_attendance_employee ON attendance_records(employee_name);
CREATE INDEX IF NOT EXISTS idx_attendance_timestamp ON attendance_records(timestamp DESC);

ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_attendance" ON attendance_records;
CREATE POLICY "public_select_attendance" ON attendance_records FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_attendance" ON attendance_records;
CREATE POLICY "public_insert_attendance" ON attendance_records FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_update_attendance" ON attendance_records;
CREATE POLICY "public_update_attendance" ON attendance_records FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public_delete_attendance" ON attendance_records;
CREATE POLICY "public_delete_attendance" ON attendance_records FOR DELETE
TO anon, authenticated USING (true);


-- ═══════════════════════════════════════════════════════════
-- 2. REPLY TRACKING
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS reply_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_key text NOT NULL,
  employee_name text NOT NULL,
  place_name text NOT NULL DEFAULT '',
  phone_number text NOT NULL DEFAULT '',
  sent_time timestamptz NOT NULL DEFAULT now(),
  response_time timestamptz,
  current_status text NOT NULL DEFAULT 'PENDING',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_reply_event_key ON reply_tracking(event_key);
CREATE INDEX IF NOT EXISTS idx_reply_status ON reply_tracking(current_status);

ALTER TABLE reply_tracking ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_reply" ON reply_tracking;
CREATE POLICY "public_select_reply" ON reply_tracking FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_reply" ON reply_tracking;
CREATE POLICY "public_insert_reply" ON reply_tracking FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_update_reply" ON reply_tracking;
CREATE POLICY "public_update_reply" ON reply_tracking FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public_delete_reply" ON reply_tracking;
CREATE POLICY "public_delete_reply" ON reply_tracking FOR DELETE
TO anon, authenticated USING (true);


-- ═══════════════════════════════════════════════════════════
-- 3. PROCESSED EVENTS
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS processed_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_key text NOT NULL,
  timestamp timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_processed_event_key ON processed_events(event_key);
CREATE INDEX IF NOT EXISTS idx_processed_timestamp ON processed_events(timestamp DESC);

ALTER TABLE processed_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_processed" ON processed_events;
CREATE POLICY "public_select_processed" ON processed_events FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_processed" ON processed_events;
CREATE POLICY "public_insert_processed" ON processed_events FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_update_processed" ON processed_events;
CREATE POLICY "public_update_processed" ON processed_events FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public_delete_processed" ON processed_events;
CREATE POLICY "public_delete_processed" ON processed_events FOR DELETE
TO anon, authenticated USING (true);


-- ═══════════════════════════════════════════════════════════
-- 4. TIMELINE EVENTS
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS timeline_events (
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

CREATE INDEX IF NOT EXISTS idx_timeline_timestamp ON timeline_events(event_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_timeline_type ON timeline_events(event_type);

ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_timeline" ON timeline_events;
CREATE POLICY "public_select_timeline" ON timeline_events FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_timeline" ON timeline_events;
CREATE POLICY "public_insert_timeline" ON timeline_events FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_update_timeline" ON timeline_events;
CREATE POLICY "public_update_timeline" ON timeline_events FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public_delete_timeline" ON timeline_events;
CREATE POLICY "public_delete_timeline" ON timeline_events FOR DELETE
TO anon, authenticated USING (true);
