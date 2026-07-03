# Sales Manager Attendance Agent

A real-time operational dashboard for monitoring field employee attendance, built with React, TypeScript, and Google Sheets as the data backend. Tracks employee check-ins, WhatsApp responses, and location sharing through an automated n8n workflow pipeline.

## Features

- **Attendance Log** — Full event log of CHECKIN and REMINDER triggers with sortable columns, search, filtering, and clickable Google Maps links for target locations
- **Reply Tracking** — Live WhatsApp response monitoring with 30-minute countdown timers, response time badges, and shared employee GPS coordinates
- **Analytics** — Interactive charts including attendance distribution (donut), success rate (radial gauge), response time (bar), weekly trends (area), hourly activity (grouped bar), and location breakdown
- **Processed Events** — Deduplication monitoring with duplicate detection, pagination, and event timeline
- **Timeline** — Chronological workflow activity feed with 8 color-coded event types and scroll-triggered animations
- **System Monitoring** — Health indicators for n8n workflows, Google Sheets sync, WhatsApp API, and connected integrations with endpoints and status
- **Landing Page** — Marketing page with parallax hero, live dashboard preview, and feature showcase

## Tech Stack

| Category | Technology |
|---|---|
| Framework | React 18, TypeScript 5 |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS 3 with glassmorphism utilities |
| State Management | TanStack React Query v5 (polling, caching) |
| Animation | Framer Motion 11 |
| Charts | Recharts 2 |
| UI Primitives | Radix UI (14 packages) |
| Routing | React Router DOM 6 |
| Data Source | Google Sheets CSV export (via CORS proxies) |
| Database | Supabase (PostgreSQL, prepared) |
| Hosting | Firebase Hosting |

## Project Structure

```
src/
├── components/
│   ├── dashboard/        # DashboardLayout, Sidebar
│   ├── landing/          # Hero, Features
│   └── ui/               # Badge, Button, Card, Input, Skeleton
├── data/                 # Mock/fallback data
├── lib/
│   ├── api.ts            # Data transformation + business logic
│   ├── googleSheets.ts   # Sheet CSV fetching, parsing, caching
│   ├── supabase.ts       # Supabase client
│   └── utils.ts          # Helpers (cn, formatDateTime, etc.)
├── pages/
│   ├── LandingPage.tsx
│   ├── OverviewPage.tsx
│   ├── AttendancePage.tsx
│   ├── ReplyTrackingPage.tsx
│   ├── ProcessedEventsPage.tsx
│   ├── AnalyticsPage.tsx
│   ├── TimelinePage.tsx
│   └── MonitoringPage.tsx
├── types/                # TypeScript interfaces
├── App.tsx               # Route definitions
└── main.tsx              # Entry point
```

## Google Sheets Integration

The dashboard reads data from 4 sheet tabs via CSV export:

| Sheet | GID | Data |
|---|---|---|
| AttendanceSchedule | `0` | Employee names, locations, dates, times, target coordinates, phone numbers |
| Trigger Log | `115132173` | CHECKIN and REMINDER trigger events with timestamps |
| ProcessedEvents | `839706631` | Deduplication log of processed event keys |
| ReplyTracking | `275948246` | WhatsApp response status, shared employee coordinates, distance data |

Data is fetched through a CORS proxy chain (`allorigins.win` → `corsproxy.io` → `codetabs.com` → direct) and cached in-memory for 60 seconds. Fallback data is used when fetches fail.

## Data Pipeline

```
Google Sheets (AttendanceSchedule)
        ↓
   n8n Workflows (schedule triggers)
        ↓
   WhatsApp Cloud API (messages to employees)
        ↓
   Employee replies (YES / location share)
        ↓
   Google Sheets (ReplyTracking, TriggerLog, ProcessedEvents)
        ↓
   This Dashboard (CSV export → React UI)
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/Deepakchandrasekar05/Sales_Manager_Agent.git
cd Sales_Manager_Agent
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Environment Variables

Create a `.env` file in the project root (optional — Supabase is prepared but not actively used):

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Supabase Setup (Optional)

Run the migrations in `supabase/migrations/` to create the database schema:

- `attendance_records` — Attendance events
- `reply_tracking` — WhatsApp response tracking
- `processed_events` — Deduplication log
- `timeline_events` — Workflow activity feed

All tables have RLS enabled with public read/write access for single-tenant dashboard use.

## Deployment

The project is configured for Firebase Hosting:

```bash
npm run build
firebase deploy
```

## License

This project is for educational and internal use.
