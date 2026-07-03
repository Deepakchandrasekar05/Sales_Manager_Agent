# Sales Manager Attendance Agent

A field employee attendance monitoring system powered by **n8n** workflow automation, Google Sheets, WhatsApp Cloud API, and Google Gemini AI. The n8n workflow handles scheduling, message delivery, AI-powered response analysis, GPS verification, and deduplication — while a React dashboard visualizes everything in real time.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          n8n Workflow Engine                        │
│                                                                     │
│  ┌──────────────┐   ┌──────────────┐   ┌────────────────────────┐  │
│  │  Attendance   │   │   WhatsApp   │   │   Monitor Trigger      │  │
│  │  Scheduler    │   │   Reply      │   │   (timeout + GPS)      │  │
│  │  (every sec)  │   │   Listener   │   │   (every minute)       │  │
│  └──────┬───────┘   └──────┬───────┘   └──────────┬─────────────┘  │
│         │                  │                       │                │
│         ▼                  ▼                       ▼                │
│  ┌──────────────┐   ┌──────────────┐   ┌────────────────────────┐  │
│  │ Time Matching │   │  GPS Check / │   │ Distance Calculation   │  │
│  │ + Dedup       │   │  AI Agent    │   │ (Haversine formula)    │  │
│  └──────┬───────┘   │  (Gemini)    │   └──────────┬─────────────┘  │
│         │           └──────┬───────┘              │                │
│         ▼                  ▼                       ▼                │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    Google Sheets (4 tabs)                    │  │
│  │  AttendanceSchedule │ TriggerLog │ ProcessedEvents │ Reply   │  │
│  └──────────────────────────────────────────────────────────────┘  │
│         │                  │                       │                │
│         ▼                  ▼                       ▼                │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              WhatsApp Cloud API (messages)                   │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    React Dashboard (this repo)                      │
│  Reads Google Sheets via CSV export → displays real-time UI        │
└─────────────────────────────────────────────────────────────────────┘
```

### Branches

#### Branch A: Attendance Scheduling
```
Schedule Trigger → Read Sheet → Time Match → Generate Key → Dedup → Switch
  ├─ REMINDER → Log Trigger → Format Message → Send WhatsApp
  └─ CHECKIN  → Log Trigger → Format Message → Send WhatsApp → Log ReplyTracking → Log ProcessedEvents
```

#### Branch B: WhatsApp Reply Handling
```
WhatsApp Webhook → Route (Location vs Text)
  ├─ Location → Extract GPS → Update ReplyTracking (SharedLat/SharedLng)
  └─ Text → AI Agent (Gemini) → Parse JSON → Reply via WhatsApp
```

#### Branch C: Timeout & GPS Monitoring
```
Schedule Trigger (1min) → Read ReplyTracking → Filter WAITING → Check Elapsed > 2min
  ├─ Yes → Send Manager Alert → Read Shared Location → Read Target Location
  │        → Haversine Distance Check
  │          ├─ < 100m → Update PRESENT → Send Confirmation
  │          └─ >= 100m → Update ABSENT → Send Location Mismatch
  └─ No → Skip
```

### AI Agent (Google Gemini)

The AI Agent analyzes employee WhatsApp text responses and decides the next action:

| Employee Response | AI Action | Reply |
|---|---|---|
| "Yes, I've reached" / "On the way" / "Traffic" | `REQUEST_LOCATION` | "Please share your current live location" |
| "I can't come today" | `ABSENT` | "Your manager will be notified" |
| Excessive delay | `ESCALATE` | "Your delay has been noted" |
| Unclear message | `ASK_CLARIFICATION` | "Could you tell me if you've reached?" |

### Credentials Required

| Credential | Used By | Purpose |
|---|---|---|
| Google Sheets OAuth2 | 8 Google Sheets nodes | Read/write spreadsheet data |
| WhatsApp OAuth | WhatsApp Reply Listener | Receive employee replies |
| WhatsApp API | 4 HTTP Request nodes | Send messages to employees |
| Google Gemini (PaLM) | AI Agent | Analyze employee responses |

## Google Sheets Structure

| Sheet | GID | Purpose |
|---|---|---|
| **AttendanceSchedule** | `0` | Employee names, locations, dates, times, target coordinates, phone numbers |
| **TriggerLog** | `115132173` | CHECKIN and REMINDER trigger events with timestamps |
| **ProcessedEvents** | `839706631` | Deduplication log of processed event keys |
| **ReplyTracking** | `275948246` | WhatsApp response status, shared GPS coordinates, distance, final status |

## Dashboard Features

The React dashboard reads Google Sheets via CSV export and displays:

- **Attendance Log** — Full event log with sortable columns, search, filtering, and clickable Google Maps links for target locations
- **Reply Tracking** — Live WhatsApp response monitoring with 30-minute countdown timers, response time badges, and shared employee GPS coordinates (Google Maps links)
- **Analytics** — Interactive charts: donut, radial gauge, bar, area, grouped bar, and location breakdown
- **Processed Events** — Deduplication monitoring with duplicate detection, pagination, and timeline
- **Timeline** — Chronological workflow activity feed with 8 color-coded event types
- **System Monitoring** — Health indicators for n8n, Google Sheets, WhatsApp API with uptime charts

## Tech Stack

| Layer | Technology |
|---|---|
| **Automation** | **n8n** (self-hosted workflow engine) |
| **AI** | Google Gemini (via LangChain agent in n8n) |
| **Messaging** | WhatsApp Cloud API v23 |
| **Database** | Google Sheets (CSV export) |
| **Frontend** | React 18, TypeScript, Vite 5 |
| **Styling** | Tailwind CSS 3 (glassmorphism) |
| **Charts** | Recharts 2 |
| **Animation** | Framer Motion 11 |
| **State** | TanStack React Query v5 (30s polling) |
| **Hosting** | Firebase Hosting |

## Project Structure

```
├── workflows/
│   └── Sales_Manager_Agent_Workflow.json   # n8n workflow (import this)
├── src/
│   ├── components/
│   │   ├── dashboard/        # DashboardLayout, Sidebar
│   │   ├── landing/          # Hero, Features
│   │   └── ui/               # Badge, Button, Card, Input, Skeleton
│   ├── data/                 # Mock/fallback data
│   ├── lib/
│   │   ├── api.ts            # Data transformation + business logic
│   │   ├── googleSheets.ts   # Sheet CSV fetching, parsing, caching
│   │   └── utils.ts          # Helpers (cn, formatDateTime, etc.)
│   ├── pages/
│   │   ├── LandingPage.tsx
│   │   ├── OverviewPage.tsx
│   │   ├── AttendancePage.tsx
│   │   ├── ReplyTrackingPage.tsx
│   │   ├── ProcessedEventsPage.tsx
│   │   ├── AnalyticsPage.tsx
│   │   ├── TimelinePage.tsx
│   │   └── MonitoringPage.tsx
│   ├── types/                # TypeScript interfaces
│   ├── App.tsx               # Route definitions
│   └── main.tsx              # Entry point
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── firebase.json
```

## Getting Started

### Prerequisites

- **n8n** instance (self-hosted or cloud)
- Google Cloud project with Sheets API enabled
- WhatsApp Cloud API phone number and access token
- Google Gemini API key
- Node.js 18+

### 1. Import n8n Workflow

1. Open your n8n instance
2. Go to **Workflows → Import from File**
3. Select `workflows/Sales_Manager_Agent_Workflow.json`
4. Set up the required credentials (Google Sheets, WhatsApp, Gemini)
5. Update the phone number and sheet ID in the workflow nodes
6. Activate the workflow

### 2. Set Up Google Sheets

Create a spreadsheet with 4 tabs matching the schema above, or use the existing sheet referenced in the workflow.

### 3. Run the Dashboard

```bash
git clone https://github.com/Deepakchandrasekar05/Sales_Manager_Agent.git
cd Sales_Manager_Agent
npm install
npm run dev
```

### Build & Deploy

```bash
npm run build
firebase deploy
```

## License

This project is for educational and internal use.
