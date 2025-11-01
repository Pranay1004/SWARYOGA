# SwarYoga - Architecture & Dataflow Overview

## 🏗️ Application Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + TypeScript)                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │               React Router (SPA Routing)                   │ │
│  │                                                            │ │
│  │  ├─ HomePage          ├─ LifePlanner    ├─ Blog          │ │
│  │  ├─ SignIn/SignUp     ├─ Dashboard      ├─ Contact       │ │
│  │  └─ Admin Panel       └─ Calendar       └─ About         │ │
│  └────────────────────────────────────────────────────────────┘ │
│                            ▼                                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              Context Providers                             │ │
│  │  ┌─────────────┐        ┌──────────────┐                 │ │
│  │  │ AuthContext │        │ ThemeContext │                 │ │
│  │  │ - User Info │        │ - Dark/Light │                 │ │
│  │  │ - JWT Token │        │ - Preferences│                 │ │
│  │  └─────────────┘        └──────────────┘                 │ │
│  └────────────────────────────────────────────────────────────┘ │
│                            ▼                                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │          Component Library (40+ Components)               │ │
│  │                                                            │ │
│  │  Life Planner Suite:                                      │ │
│  │  ├─ Daily/Weekly/Monthly/Yearly Views                    │ │
│  │  ├─ Goal & Task Management                               │ │
│  │  ├─ Vision Board & Affirmations                          │ │
│  │  └─ PDF Export Functionality                             │ │
│  │                                                            │ │
│  │  Calendar Suite:                                          │ │
│  │  ├─ Hindu Calendar Integration                           │ │
│  │  ├─ Astronomical Calculations                            │ │
│  │  └─ Location-based Data                                  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                            ▼                                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │         Services & Utilities Layer                        │ │
│  │  ├─ API Client (Axios)                                   │ │
│  │  ├─ Mock Data Fallback                                   │ │
│  │  ├─ PDF Generator (jsPDF)                                │ │
│  │  └─ Hindu Calendar API Integration                       │ │
│  └────────────────────────────────────────────────────────────┘ │
│                            ▼                                    │
│              HTTP Client (Axios + Proxy)                       │
│                 to http://localhost:3001                       │
└─────────────────────────────────────────────────────────────────┘
              ▼▼▼▼▼▼▼▼▼▼ API Requests ▼▼▼▼▼▼▼▼▼▼
┌─────────────────────────────────────────────────────────────────┐
│                  BACKEND (Express.js + Node)                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │          Express.js Server (index.js)                     │ │
│  │  - CORS enabled                                           │ │
│  │  - Middleware stack                                       │ │
│  │  - Route handlers                                         │ │
│  └────────────────────────────────────────────────────────────┘ │
│                            ▼                                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              API Routes (/routes)                         │ │
│  │  ├─ affirmations.js   - Affirmation CRUD                │ │
│  │  ├─ goals.js          - Goal Management                 │ │
│  │  ├─ tasks.js          - Task CRUD                       │ │
│  │  ├─ todos.js          - Todo Management                 │ │
│  │  ├─ visions.js        - Vision Board Data               │ │
│  │  ├─ words.js          - Daily Words/Mantras             │ │
│  │  └─ diamondPeople.js  - Relationship Tracking           │ │
│  └────────────────────────────────────────────────────────────┘ │
│                            ▼                                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │         Data Models (Mongoose Schemas)                    │ │
│  │  ├─ Vision          ├─ Goal            ├─ Task           │ │
│  │  ├─ Todo            ├─ Word            ├─ Affirmation    │ │
│  │  └─ DiamondPeople   └─ User (implied)                   │ │
│  └────────────────────────────────────────────────────────────┘ │
│                            ▼                                    │
│              Database Layer (MongoDB via Mongoose)             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow Diagrams

### 1️⃣ User Authentication Flow

```
User Input (SignIn/SignUp)
         │
         ▼
    ProtectedRoute Component
         │
         ▼
    AuthContext Provider
         │
    ┌────┴────┐
    ▼         ▼
 /signin    /signup
    │         │
    └────┬────┘
         │
         ▼
    API Call (POST /auth)
         │
         ▼
    Express Backend
         │
         ├─ Validate credentials
         ├─ Hash password (bcryptjs)
         └─ Generate JWT
         │
         ▼
    JWT Token + User Info
         │
         ▼
    Store in AuthContext
         │
         ▼
    Access Protected Routes
```

### 2️⃣ Life Planning Flow

```
User Opens LifePlanner
         │
         ▼
    LifePlannerTabs Component
         │
    ┌────┬─────┬──────┬──────┐
    ▼    ▼     ▼      ▼      ▼
  Daily Weekly Monthly Yearly Planning
    │    │     │      │
    └─┬──┴──┬──┴──┬───┴──┐
      ▼     ▼     ▼      ▼
    Goals Tasks Todos Affirmations
      │     │     │      │
      └─┬───┴─────┴──────┘
        │
        ▼
    State Management (React Hooks)
        │
        ▼
    API Service Layer
        │
        ▼
    Express Routes
        │
    ┌───┴────┐
    ▼        ▼
  Mock Data   DB
    │        │
    └────┬───┘
         │
         ▼
    Component Rendering
         │
         ▼
    Display with Animations
```

### 3️⃣ Calendar Feature Flow

```
User Opens Calendar
         │
         ▼
    SwarCalendar Component
         │
    ┌────┴────────────────┐
    ▼                     ▼
Select Date         Select Location
    │                     │
    └────────┬────────────┘
             │
             ▼
    Calculate Hindu Calendar Data
    ├─ Date conversion
    ├─ Lunar phase calculation
    ├─ Tithi determination
    └─ Nadi calculation
             │
             ▼
    Fetch Astronomical Data
    ├─ Via hinduCalendarAPI
    ├─ Sunrise/Sunset via SunCalc
    └─ Moon phase data
             │
             ▼
    Generate Results
             │
    ┌────────┴────────┐
    ▼                 ▼
Calendar Data    Astrological Info
    │                 │
    └────────┬────────┘
             │
             ▼
    Display SwarCalendarInfo
         │
         ▼
    User Views Results
```

### 4️⃣ PDF Export Flow

```
User in Life Planner Dashboard
         │
         ▼
    Click "Download as PDF"
         │
         ▼
    PDFDownloadButton Component
         │
         ▼
    pdfGenerator.ts Utility
         │
    ├─ Prepare planning data
    ├─ Create PDF document
    ├─ Add sections:
    │  ├─ Goals & Progress
    │  ├─ Tasks & Timeline
    │  ├─ Affirmations
    │  └─ Vision Board
    └─ Generate styles
         │
         ▼
    jsPDF + html2canvas Processing
         │
         ▼
    Browser Download
         │
         ▼
    PDF File Saved Locally
```

---

## 🔐 Security Architecture

```
┌─────────────────────────────────────────┐
│        FRONTEND (Client)                │
│                                         │
│  Protected Routes                       │
│  └─ Check AuthContext for JWT          │
│     └─ If no JWT → Redirect to Login    │
│                                         │
│  API Requests                           │
│  └─ Include JWT in headers              │
│     └─ Axios interceptors               │
└─────────────────────────────────────────┘
            ▼ HTTP Request with JWT ▼
┌─────────────────────────────────────────┐
│      BACKEND (Server)                   │
│                                         │
│  Request Validation                     │
│  ├─ Check JWT validity                  │
│  ├─ Verify user permissions             │
│  └─ Sanitize inputs                     │
│                                         │
│  Authentication Middleware              │
│  └─ jsonwebtoken verification           │
│                                         │
│  Password Hashing                       │
│  └─ bcryptjs for secure storage         │
│                                         │
│  CORS Policy                            │
│  └─ Only allow from frontend origin     │
└─────────────────────────────────────────┘
```

---

## 🎨 Component Hierarchy

```
App
├── AuthProvider
│   ├── Router
│   │   ├── HomePage
│   │   ├── SignIn
│   │   ├── SignUp
│   │   ├── ProtectedRoute
│   │   │   ├── LifePlanner
│   │   │   │   ├── LifePlannerTabs
│   │   │   │   │   ├── DailyPlanner
│   │   │   │   │   ├── WeeklyPlanner
│   │   │   │   │   ├── MonthlyPlanner
│   │   │   │   │   ├── YearlyPlanner
│   │   │   │   │   ├── MyGoal
│   │   │   │   │   ├── MyTasks
│   │   │   │   │   ├── MyTodos
│   │   │   │   │   ├── MyAffirmations
│   │   │   │   │   ├── MyVision
│   │   │   │   │   ├── MyWord
│   │   │   │   │   └── MyDiamondPeoples
│   │   │   │   ├── Sidebar
│   │   │   │   ├── TopNavigation
│   │   │   │   └── PDFPreviewModal
│   │   │   ├── LifePlannerDashboard
│   │   │   └── Admin
│   │   ├── Blog
│   │   ├── Contact
│   │   └── SwarCalendar
│   │       ├── Swarcalendar
│   │       ├── SwarCalendarInfo
│   │       └── CalendarResults
│   └── Footer/Header
```

---

## 📈 Performance Optimization Strategies

```
Current Optimization:
├─ Vite for fast development & production builds
├─ React lazy loading (code-splitting ready)
├─ Tailwind CSS utility-first (minimal CSS)
├─ Framer Motion for hardware-accelerated animations
└─ HTTP/2 support via Vite

Recommended Optimizations:
├─ Dynamic imports for large route components
├─ Image optimization & lazy loading
├─ Service Workers for offline capability
├─ Bundle analysis with rollup visualization
├─ API response caching
└─ Database query optimization
```

---

## 🚀 Deployment Architecture

```
Development Environment
└─ npm run dev
   └─ Vite dev server (localhost:5173)
   └─ Express backend (localhost:3001)

Production Build
└─ npm run build
   └─ Outputs to /dist folder
   └─ Optimized bundles ready for CDN
   └─ Source maps for debugging

Deployment Options:
├─ Vercel (recommended for frontend)
├─ Netlify with serverless functions
├─ Docker containerization
├─ AWS S3 + CloudFront
└─ Self-hosted Node.js server
```

---

*Architecture Documentation - November 1, 2025*
