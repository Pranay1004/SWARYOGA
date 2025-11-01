# SwarYoga Project - Detailed Directory Analysis & Build Report

## 📋 Project Overview

**Project Name:** SwarYoga  
**Type:** Full-stack React + Express.js Application  
**Build Tool:** Vite + TypeScript  
**Styling:** Tailwind CSS with PostCSS  

---

## 📁 Directory Structure

### Root Level Files
```
project/
├── index.html              # HTML entry point for Vite
├── package.json            # Project dependencies & scripts
├── package-lock.json       # Locked dependency versions
├── tsconfig.json           # TypeScript configuration
├── tsconfig.node.json      # TypeScript config for Node/Vite
├── vite.config.ts          # Vite build configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
└── .env                    # Environment variables
```

### Source Directory (`src/`)

#### **Main Application Files**
- `main.tsx` - React application entry point with ReactDOM
- `App.tsx` - Main routing component with React Router
- `index.css` - Global styles including Tailwind imports

#### **Context Providers** (`src/context/` & `src/contexts/`)
- `AuthContext.tsx` - Authentication state management (login, logout, user info)
- `ThemeContext.tsx` - Theme management (dark/light mode)

#### **Pages** (`src/pages/`)
| Component | Purpose |
|-----------|---------|
| `HomePage.tsx` | Landing page with feature overview |
| `SignIn.tsx` | User login page |
| `SignUp.tsx` | User registration page |
| `LifePlanner.tsx` | Main life planner interface |
| `LifePlannerLogin.tsx` | Dedicated login for planner |
| `LifePlannerDashboard.tsx` | Dashboard with planning stats |
| `Admin.tsx` | Admin control panel |
| `Blog.tsx` | Blog listing & reading interface |
| `Contact.tsx` | Contact/inquiry form |

#### **Components** (`src/components/`)

**LifePlanner Components** (`src/components/LifePlanner/`)
- `LifePlannerTabs.tsx` - Tab navigation for planner features
- `Sidebar.tsx` - Left navigation sidebar
- `TopNavigation.tsx` - Header navigation bar
- `DailyPlanner.tsx` - Daily scheduling interface
- `WeeklyPlanner.tsx` - Weekly planning view
- `MonthlyPlanner.tsx` - Monthly overview
- `YearlyPlanner.tsx` - Yearly planning & roadmap
- `MyGoal.tsx` - Goal display & management
- `MyTasks.tsx` - Task management interface
- `MyTodos.tsx` - Todo list management
- `MyAffirmations.tsx` - Affirmation tracking
- `MyDiamondPeoples.tsx` - Relationship tracking
- `MyVision.tsx` - Vision board & goals
- `MyWord.tsx` - Daily word/mantra tracking
- `PDFDownloadButton.tsx` - PDF export functionality
- `PDFPreviewModal.tsx` - PDF preview dialog
- `DailyRoutineForm.tsx` - Daily routine input form
- `TaskForm.tsx` - Task creation/editing form
- `TodoForm.tsx` - Todo creation form
- `TaskCreationModal.tsx` - Modal for new tasks
- `VisionForm.tsx` - Vision creation/editing form
- `WordForm.tsx` - Word/mantra form
- `GoalForm.tsx` - Goal creation form
- `ProtectedRoute.tsx` - Route protection wrapper

**Swar Calendar Components** (`src/components/SwarCalendar/`)
- `Swarcalendar.tsx` - Hindu calendar with astronomical data
- `SwarCalendarInfo.tsx` - Calendar information display
- `CalendarResults.txs` - Results rendering component

**Utilities** (`src/components/utils/`)
- `hinduCalendarAPI.ts` - Hindu calendar calculations and API integration

#### **Services** (`src/services/`)
- `api.ts` - API client with mock data fallback
- `mockData.ts` - Mock data for development

#### **Utilities** (`src/utils/`)
- `pdfGenerator.ts` - PDF export functionality
- `hinduCalendarAPI.ts` - Hindu calendar computations

#### **Models** (`src/models/`)
- `index.ts` - Mongoose schema definitions (reference)

#### **Server** (`src/server/`)
- `index.js` - Express.js server entry point

**Server Routes** (`src/server/routes/`)
- `affirmations.js` - Affirmation CRUD endpoints
- `goals.js` - Goal management endpoints
- `tasks.js` - Task management endpoints
- `todos.js` - Todo management endpoints
- `visions.js` - Vision management endpoints
- `words.js` - Word/mantra endpoints
- `diamondPeople.js` - Relationship tracking endpoints

---

## 🛠️ Technology Stack

### Frontend
- **React 18.2** - UI library
- **TypeScript 5.2** - Type safety
- **Vite 5.0** - Build tool & dev server
- **React Router 6.8** - Client-side routing
- **Tailwind CSS 3.3** - Utility-first CSS
- **Framer Motion 10.16** - Animation library
- **Lucide React 0.294** - Icon library

### Backend
- **Express.js 4.18** - Web server framework
- **Node.js** - JavaScript runtime
- **CORS 2.8** - Cross-origin resource sharing
- **Dotenv 16.3** - Environment configuration

### Utilities & Libraries
- **Axios 1.10** - HTTP client
- **jsPDF 2.5** - PDF generation
- **html2canvas 1.4** - Canvas rendering
- **SunCalc 1.9** - Sun position calculations
- **bcryptjs 2.4** - Password hashing
- **jsonwebtoken 9.0** - JWT authentication

---

## 🔧 Build Configuration

### Vite Config (`vite.config.ts`)
```typescript
- Proxy: API requests to localhost:3001
- Output directory: 'dist'
- Source maps enabled for debugging
- React plugin for JSX transformation
```

### TypeScript Config (`tsconfig.json`)
- **Target:** ES2020
- **Module:** ESNext
- **Strict Mode:** Disabled (for compatibility)
- **JSX Mode:** react-jsx
- **Supports:** Vite client types & Node.js types

### Tailwind Config (`tailwind.config.js`)
- Configured for template-based content matching
- Default Tailwind theme with customizations

---

## 📦 Build Process & Output

### Build Steps
1. ✅ TypeScript compilation (`tsc`)
2. ✅ Vite bundling with code splitting
3. ✅ CSS processing with Tailwind + PostCSS
4. ✅ Minification and optimization

### Build Output (`dist/`)
```
dist/
├── index.html                           (0.45 KB)
├── assets/
│   ├── index-8EJf772H.css              (65.81 KB)
│   ├── purify.es-C_uT9hQ1.js           (22.02 KB)
│   ├── index.es-EoS0c92c.js            (150.46 KB)
│   ├── html2canvas.esm-CBrSDip1.js     (201.48 KB)
│   └── index-BVL5gQ1-.js              (1,728.38 KB)
```

### Bundle Size Analysis
| Asset | Size | Gzipped |
|-------|------|---------|
| CSS | 65.81 KB | 9.86 KB |
| Purify | 22.02 KB | 8.73 KB |
| Main JS | 150.46 KB | 51.25 KB |
| html2canvas | 201.48 KB | 47.75 KB |
| Other JS | 1,728.38 KB | 405.35 KB |

**⚠️ Note:** Large chunk detected (>500KB). Consider code-splitting for production.

---

## 🚀 Features & Functionality

### Core Modules
1. **Life Planner**
   - Daily, weekly, monthly, yearly planning
   - Goal tracking with milestones
   - Task and todo management
   - Vision boards
   - Affirmations tracking

2. **Swar Calendar**
   - Hindu calendar integration
   - Astronomical data (sunrise, moon phases)
   - Tithi (lunar day) calculations
   - Nadi calculations
   - Location-based calculations

3. **Authentication**
   - User registration & login
   - JWT-based authentication
   - Protected routes
   - Session management

4. **Export Features**
   - PDF generation from plans
   - PDF preview functionality

5. **Blog & Content**
   - Blog post listing
   - Contact/inquiry system
   - About & resource pages

---

## 🔌 API Structure

### Available Endpoints
- `/api/affirmations` - Affirmation management
- `/api/goals` - Goal CRUD operations
- `/api/tasks` - Task management
- `/api/todos` - Todo list management
- `/api/visions` - Vision board data
- `/api/words` - Daily word/mantra tracking
- `/api/diamond-people` - Relationship tracking

**Proxy:** `http://localhost:3001`

---

## 📝 npm Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run lint         # Run ESLint on TypeScript/JSX files
npm run preview      # Preview production build locally
npm start-server     # Start Express backend server
```

---

## ✅ Build Status

| Item | Status |
|------|--------|
| TypeScript Compilation | ✅ Pass |
| Vite Build | ✅ Pass |
| Bundle Creation | ✅ Success |
| Preview Server | ✅ Running on http://127.0.0.1:5173 |

---

## 🎯 Next Steps & Recommendations

1. **Code Splitting** - Consider dynamic imports for large chunks
2. **Environment Setup** - Configure `.env` with API endpoints
3. **Backend Setup** - Start Express server on port 3001
4. **Authentication** - Implement JWT token storage (localStorage/cookies)
5. **Testing** - Add unit and integration tests
6. **Performance** - Monitor bundle size and optimize assets

---

## 📊 Project Stats

- **Total Dependencies:** 30+ production packages
- **Dev Dependencies:** 20+ development packages
- **Main Component Count:** 40+ React components
- **Routes Defined:** 8+ main routes
- **Build Output:** ~2.2 MB total, ~520 KB gzipped
- **Backend Endpoints:** 7+ API routes

---

## 🖥️ Live Preview

**Preview Server:** http://127.0.0.1:5173/

The application is now built and running! You can interact with:
- Home page with feature overview
- Authentication pages (Sign In/Sign Up)
- Life Planner dashboard (requires login)
- Blog section
- Contact page
- Calendar features

---

*Generated on: November 1, 2025*
