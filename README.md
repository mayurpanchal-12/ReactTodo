# TaskFlow — Cloud Task Manager

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Firebase](https://img.shields.io/badge/Firebase-Auth%20%2B%20Firestore-orange?logo=firebase)
![Cloudinary](https://img.shields.io/badge/Cloudinary-File%20Storage-3448C5?logo=cloudinary)
![Vite](https://img.shields.io/badge/Vite-Fast%20Build-green?logo=vite)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)

---

A **production-grade cloud task management SPA** built with React 18, Firebase Auth, Firestore, and Cloudinary. Every piece of your data lives in the cloud — open the app on two devices and watch changes appear instantly in real time.

---

## 🔗 Live Demo

[View the live app on Vercel](https://react-todo-sage-phi.vercel.app/)

## 🔗 GitHub Repository

[View source on GitHub](https://github.com/mayurpanchal-12/ReactTodo.git)

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| UI | React 18, CSS Custom Properties, Vite |
| Auth | Firebase Authentication (Google + Email/Password) |
| Database | Cloud Firestore (real-time sync) |
| File Storage | Cloudinary (direct browser uploads) |
| Deployment | Vercel (auto-deploy on push) |
| Export | jsPDF (dynamic import), native CSV |
| Voice | Web Speech API |
| Drag & Drop | Native HTML5 Drag and Drop API |

---

## ✨ Full Feature List

### 🔐 Auth & Account
- Google OAuth sign-in and email/password login on the same screen
- New account registration with password confirmation
- Forgot password — reset link sent via Firebase email
- Delete account — automatically re-authenticates via Google popup if the session is stale, then deletes cleanly
- All data is isolated per user — Firestore security rules enforce this server-side, not just in the UI

### ✅ Task Creation
- Task name with voice input (Web Speech API — click mic, speak, done)
- Due date + time picker
- Priority — 🔴 High / 🟡 Medium / 🟢 Low
- Category — 💰 Finance / 📚 Study / 💼 Work / 📝 Other
- Repeat — None / Daily / Weekly / Monthly (auto-clones task on completion with next due date)
- Assign to a project directly from the form
- Pin a task directly from the form
- Add #tags directly from the form
- Add subtasks (nested checklist) directly from the form
- Add markdown notes (bold, italic, code) directly from the form
- Attach images (max 2MB) or files (max 5MB), up to 5 per task — uploaded to Cloudinary

### 📋 List View
- Tasks grouped by due date — Today, Tomorrow, or weekday label
- Within each group, sorted High → Medium → Low priority automatically
- Overdue tasks get a red accent and overdue badge
- Skeleton loading cards shown while Firestore data loads after login
- Empty state message when no tasks match the active filter

### 🗃️ Board View (Kanban)
- Three columns — **To Do / In Progress / Done**
- Drag and drop tasks between columns using the native browser Drag and Drop API (no external library)
- Dropping a card updates its status in Firestore in real time
- Columns respect the active search, category, and status filters

### 🗓️ Calendar View
- Full month calendar with prev/next month navigation and a Today button
- Each date cell shows tasks due on that day as colored dots
- Tasks respect the active search and category filter
- Click a date cell to see its tasks inline

### 📊 Analytics Dashboard
- **Completion rate** — radial SVG ring showing percentage of all tasks completed
- **GitHub-style heatmap** — 28-day grid of task completions, intensity-coded by count
- **Best day** — shows which day in the last 28 had the most completions
- **Category breakdown** — horizontal bar chart for Finance / Study / Work / Other
- **Status overview** — Total / Active / Completed / Overdue counts

### 🕐 Activity History
- Chronological log of every create, edit, complete, and delete event
- Each entry shows the task name, category icon, priority icon, and a relative timestamp (e.g. "2h ago")
- Filter history by action type — All / Created / Edited / Completed / Deleted
- Clear history button with confirmation
- Capped at 300 entries — oldest entries drop off automatically

### 📁 Projects
- Create projects with a name and one of 10 color labels
- Rename a project inline — click the edit icon, type, press Enter
- Delete a project — tasks are unassigned (not deleted), confirmed with a prompt
- Each project shows a live task count and a color-coded progress bar (% completed)
- Click a project in the sidebar to filter all views to that project only
- Assign tasks to projects from the task form or task edit panel

### 📌 Pinned Tasks
- Pin any task from the form or from the task card
- All pinned tasks appear in the sidebar panel for quick access
- Click a pinned task in the sidebar to jump straight to it

### 🏷️ Tags
- Add multiple #tags to any task
- All unique tags appear in the sidebar Tags panel
- Click a tag to filter the list view to only tasks with that tag
- Tags are stored lowercase and deduplicated automatically

### 🎯 Today Focus Mode
- One click in the sidebar to show only tasks due today plus any overdue incomplete tasks
- Works across List, Board, and Calendar views

### ⏱️ Pomodoro Timer
- Attach a focus timer to any task from the task card
- 25-minute work session → 5-minute break, cycles automatically
- Shows the active task name in the timer widget
- Collapses to a bottom sheet on mobile screens

### 🔍 Search & Filter
- Debounced search bar — filters task name matches across all visible tasks
- Status filter pills — All / Active / Completed / Overdue
- Category dropdown filter — Finance / Study / Work / Other
- All filters combine — search + status + category + project + tag all work together

### 📤 Export
- **CSV** — exports all currently visible (filtered) tasks with name, due date, priority, category, completion status
- **PDF** — landscape table with header row, data rows, and a summary (total / completed / active) at the bottom
- PDF library (jsPDF) is loaded dynamically on demand — not included in the initial bundle
- Export is blocked when a category filter is active (to prevent partial data confusion)

### 🌙 Dark / Light Mode
- Full dark mode — all CSS tokens remapped, not just inverted colors
- Theme preference saved to the user's Firestore document — persists across devices and sessions
- Toggle from the user menu in the sidebar footer

### ♿ Accessibility
- Skip navigation link for keyboard users (WCAG 2.4.1)
- Visible focus ring on every interactive element via `:focus-visible` (WCAG 2.4.7)
- Minimum 44px touch targets (WCAG 2.5.5)
- Color never used alone to convey meaning — always paired with icon or text (WCAG 1.4.1)
- `prefers-reduced-motion` disables all animations (WCAG 2.3.3)
- `aria-label`, `aria-pressed`, `aria-selected`, `aria-live`, `role` used throughout (WCAG 4.1.2)
- High contrast mode support via `forced-colors: active`

---

## ⚙️ Key Engineering Decisions

| Decision | Reason |
|---|---|
| Firestore over localStorage | Real-time sync across devices, survives browser clears, no data loss |
| Cloudinary for file attachments | Firestore has a 1MB per-document limit — storing images as base64 inline would silently corrupt user data |
| `onSnapshot` for reads | Live updates with no polling — changes on one device appear instantly on all others |
| Debounced Firestore writes (600ms) | Rapid state changes (e.g. typing) get batched into one write — avoids rate limits and unnecessary cost |
| `skipNextSave` ref flag | Prevents the `onSnapshot` callback from immediately triggering a write back to Firestore (write-on-read bug) |
| `TodoProvider` inside `AppContent` | Firestore subscription only initializes after a confirmed authenticated user exists — no wasted reads |
| `crypto.randomUUID()` for all IDs | Guaranteed collision-free — `Date.now()` IDs can clash when React batches state updates in the same millisecond |
| Re-auth before account delete | Firebase requires a fresh session for destructive operations — handled automatically via Google popup, no manual logout needed |
| Dynamic jsPDF import | ~500KB PDF library only loads when the user actually clicks export, keeping the initial bundle lean |
| Native HTML5 Drag and Drop | Full Kanban functionality with zero external drag-and-drop dependencies |
| Error Boundary with reset button | Catches render crashes, offers in-place "Try again" recovery without forcing a full page reload |

---

## 📱 App Flow

```
Open app
  → Firebase checks auth state
  → Loading spinner while auth resolves

Not logged in
  → Login screen (Google / Email+Password / Register / Forgot Password)

Logged in
  → Firestore snapshot loads all user data in real time
  → Skeleton cards shown while data arrives

Sidebar
  → 🎯 Today Focus  → tasks due today + overdue
  → 📌 Pinned       → all pinned tasks
  → 🏷️ Tags         → browse by #tag
  → 📁 Projects     → create / rename / delete / switch projects
  → 📊 Analytics    → dashboard overlay
  → 🕐 History      → activity log

Add task (list view form)
  → name + date + time + priority + category + repeat + project
  → voice input, subtasks, tags, notes, pin, file/image attach
  → submit → Firestore write (debounced 600ms) → syncs everywhere

Switch views
  → Board    → drag tasks across To Do / In Progress / Done
  → Calendar → browse tasks by month, see due dates on grid
  → History  → filter and clear activity log

Export
  → CSV or PDF of currently filtered tasks

User menu (sidebar footer)
  → Switch dark / light theme
  → Logout
  → Delete account (with re-auth if needed)
```

---

## ▶️ Getting Started

```bash
git clone https://github.com/mayurpanchal-12/ReactTodo.git
cd ReactTodo
npm install
```

Create a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=
```

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🌐 Deployment

Deployed on **Vercel** — auto-builds and deploys on every push to `main`.

All `VITE_*` environment variables are set in Vercel → Project Settings → Environment Variables.

Live: [https://react-todo-sage-phi.vercel.app/](https://react-todo-sage-phi.vercel.app/)