# TaskFlow — Task Management App

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-Fast-green?logo=vite)
![Firebase](https://img.shields.io/badge/Firebase-Auth%20%2B%20Firestore-orange?logo=firebase)
![Cloudinary](https://img.shields.io/badge/Cloudinary-File%20Storage-blue?logo=cloudinary)
![PWA](https://img.shields.io/badge/PWA-Enabled-purple?logo=googlechrome)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)

---

A production-grade **Task Management SPA** built with **React** and **Context API**, applying real-world engineering practices: scalable **state management**, **real-time Firestore sync**, **code splitting**, and **Progressive Web App (PWA)** support for offline use.

The app integrates **Firebase Authentication** for secure login, **Firestore** for per-user persistent storage, and **Cloudinary** for file attachments. Core features include a **Kanban board** with drag-and-drop, a **monthly calendar view**, **per-task Pomodoro timer**, **repeating tasks**, **project workspaces**, **tag-based filtering**, and an **analytics dashboard** with activity heatmap.

user can create seprate project for specific Todos

---
## 🔗 Live Demo

[View the live app on Vercel](https://react-todo-sage-phi.vercel.app/)

## 🔗 Git Repo

[View source code on GitHub](https://github.com/mayurpanchal-12/ReactTodo.git)

---

## 🚀 Application Flow

```
Open App → Firebase checks auth state
        ↓
Not logged in → LoginPage (Google OAuth or Email/Password)
        ↓
Logged in → Firestore loads user data via real-time onSnapshot listener
        ↓
Skeleton placeholders shown while data loads
        ↓
View All Tasks (List view — grouped by due date, sorted by priority)
        ↓
Add Task → set title, due date + time, priority, category, project, tags,
           description, subtasks, repeat, attachments (Cloudinary), pin
        ↓
Voice input via mic → Web Speech API fills task name hands-free
        ↓
Task cards → edit inline, complete, pin, tag, attach files, start Pomodoro
        ↓
Pomodoro Timer → 25min work / 5min break cycles, linked to specific task
        ↓
Repeating task completed → auto-clones with next due date ✅
        ↓
Switch to Board view → drag and drop between To Do / In Progress / Done
        ↓
Switch to Calendar view → browse tasks by due date on monthly grid
        ↓
Switch to History view → activity log (created / edited / completed / deleted)
        ↓
Filter by status → All / Active / Done / Overdue
        ↓
Filter by category → Finance / Study / Work / Other
        ↓
Filter by tag → click tag chip in sidebar to isolate tasks
        ↓
Today's Focus → shows only today's tasks + all overdue active tasks
        ↓
Pinned panel → quick-access pinned tasks, click to scroll + flash highlight
        ↓
Projects panel → create color-labeled workspaces, scope all views per project
        ↓
Analytics Dashboard → completion rate, category breakdown, 28-day heatmap
        ↓
Export filtered tasks → CSV or PDF via Export dropdown
        ↓
Install as PWA → Add to device from quick-stats bar
        ↓
Toggle dark / light mode → persisted to Firestore per user
        ↓
Delete account → re-authenticates via Google popup, then deletes Firebase user
```

---

## 🛡️ Error Handling

```
Any component throws a JS error
        ↓
ErrorBoundary catches it → getDerivedStateFromError fires
        ↓
"Something went wrong" screen shown
        ↓
Two options: Try Again (resets state) or Reload Page ✅


No tasks match active filters
        ↓
Empty state shown → contextual message based on view / project / filter ✅


File attachment upload fails
        ↓
Cloudinary error caught → task saved without attachment ✅


Account delete requires recent login
        ↓
auth/requires-recent-login caught → re-auth popup triggered automatically ✅


Export clicked with no visible tasks
        ↓
Alert shown before CSV / PDF generation attempted ✅
```

---

## 🛠️ Tech Stack

### Core
| Technology | Usage |
|-----------|-------|
| React 18 | Hooks, Context, class-based ErrorBoundary |
| Context API + useState | Single `TodoContext` — no Redux needed |
| Vite | Fast dev server, `import.meta.env` for secure keys, PWA plugin |
| Custom CSS + CSS Variables | Full design system with light/dark token remapping |

### Backend & Storage
| Service | Usage |
|---------|-------|
| Firebase Auth | Google OAuth + Email/Password login, account deletion with re-auth |
| Firestore | Real-time `onSnapshot` listener, debounced writes (600ms), per-user doc |
| Firebase Analytics | Usage tracking (safe-init — no crash if measurementId missing) |
| Cloudinary | File and image upload per task, unsigned preset, no backend needed |

### Libraries & APIs
| Library / API | Usage |
|--------------|-------|
| Web Speech API | Voice-to-text task input via browser's `SpeechRecognition` |
| jsPDF | PDF export of filtered task list |
| `virtual:pwa-register` | Service worker registration for offline PWA support |

---

## ✨ Features

### 🔐 Authentication
- Google OAuth and Email/Password login via Firebase Auth
- `select_account` prompt on Google sign-in — always shows account picker
- Account deletion with automatic re-authentication if session is stale
- Per-user data isolation — all data scoped to `users/{uid}` in Firestore

### ✅ Task Management
- Add tasks with: title, due date + time, priority (High / Mid / Low), category, project, tags, description, subtasks, repeat schedule, file attachments, and pin
- Inline editing on every task card — edit and save without a separate page
- Three-state status: `todo` → `in_progress` → `completed`
- `toggleComplete` and `updateTaskStatus` are separate — board drag-and-drop uses status, checkbox uses toggle
- Tasks grouped by due date in list view, sorted by priority within each group
- Today and Tomorrow date groups labelled contextually

### 📋 Subtasks
- Add multiple subtasks to any task
- Subtask completion tracked independently
- Subtask progress visible on the task card

### 🔁 Repeating Tasks
- Repeat options: Daily / Weekly / Monthly / None
- On completion, a new task is auto-cloned with the next due date calculated
- Original task marked complete, clone pushed to the list immediately

### 📌 Pinned Tasks
- Pin any task for quick sidebar access
- Click a pinned item → navigates to list view, scrolls to the task, flashes a highlight
- Pins persisted to Firestore

### 🏷️ Tags
- Add any number of custom tags to a task
- Tags panel in sidebar lists all unique tags across all tasks
- Tag color derived deterministically from tag name (consistent across sessions)
- Click any tag to filter the full task list to that tag
- Tag count shown per chip

### 📁 Projects
- Create color-labeled project workspaces (10 accent colors available)
- Rename and delete projects — deleting a project unassigns but does not delete its tasks
- All views (list, board, calendar, history) scope to the active project
- Quick-stats bar shows project completion percentage when a project is active

### 📊 Analytics Dashboard
- Overall completion rate with progress indicator
- Active / Completed / Overdue counts
- Category breakdown with relative bar lengths (Finance, Study, Work, Other)
- 28-day activity heatmap — cells colored by completion intensity (4 levels)
- Best day highlight — the day with most completions in the last 28 days

### 🗃️ Kanban Board
- Three columns: To Do / In Progress / Done
- Full drag-and-drop between columns via HTML5 Drag API
- `dataTransfer.setData` / `getData` — no library dependency
- Dropping a card calls `updateTaskStatus` which handles repeat-clone logic

### 📅 Calendar View
- Full monthly grid with prev / next / today navigation
- Tasks appear on their due date cells
- Up to 3 tasks shown per day, overflow count displayed
- Respects active status, category, and search filters

### 🕐 Activity History
- Log of all create / edit / complete / delete actions (up to 300 entries)
- Each entry shows: task name, category icon, priority icon, time-ago label, formatted timestamp
- Filter history by action type
- Clear all history button

### ⏱️ Pomodoro Timer
- Floating widget — appears when a task has an active Pomodoro session
- 25-minute work / 5-minute break automatic cycle
- Circular SVG progress ring updates in real time
- Task name shown inside the timer
- Reset and close controls

### 🎙️ Voice Input
- Mic button on the task form
- Uses `webkitSpeechRecognition` / `SpeechRecognition` with `continuous: true`
- Transcript appended to the task title field in real time

### 📎 File Attachments
- Attach images (max 2MB) and files (max 5MB) per task — up to 5 attachments
- Images uploaded to Cloudinary — URL and metadata stored in Firestore
- Image thumbnails shown inline on the task card
- File attachments shown with filename and icon
- Click to open in new tab

### 📅 Today's Focus
- Sidebar shortcut that filters to: today's tasks + all overdue active tasks
- Count badge shows urgency (red when > 0)
- Resets all other active filters when enabled

### 🔍 Search & Filter
- Live search across task titles (`searchInput` updates instantly, `searchQuery` used in filtering)
- Status filter pills: All / Active / Done / Overdue
- Category dropdown filter: Finance / Study / Work / Other
- Tag filter from sidebar Tags panel
- Today's Focus mode
- Project scope from sidebar Projects panel
- All filters composable — project + tag + status can be active simultaneously
- Export disabled when category filter is active

### 💾 Export
- Export **filtered** task list as CSV or PDF
- CSV includes: task name, status, priority, category, due date, tags, project
- PDF rendered via jsPDF in landscape layout
- Export button disabled when category filter is active

### 🎨 Theme System
- Light mode and Dark mode
- Full CSS variable token remapping — not just a color inversion
- Theme toggled from the `UserPill` dropdown in the sidebar footer
- Theme persisted to Firestore — syncs across devices

### 📲 Progressive Web App (PWA)
- Service worker registered via `vite-plugin-pwa` on app load (`main.jsx`)
- `beforeinstallprompt` captured globally, stored on `window.__installPromptEvent`
- Install button appears in the quick-stats bar when prompt is available
- Clicking Install calls `deferredPrompt.prompt()` — browser handles the dialog
- Button hides itself on `appinstalled` event

---

## 🧠 State Management

```
TodoContext (single context for all task state)
├── todos              — full task array
├── filteredTodos      — derived from todos + all active filters
├── groupedTodos       — filteredTodos grouped by due date, sorted by priority
├── filter             — status filter (all / active / completed / overdue)
├── searchInput        — raw input value (immediate UI update)
├── searchQuery        — debounced string used in actual filtering
├── categoryFilter     — active category or null
├── activeProject      — active project id or null
├── activeTag          — active tag string or null
├── todayFocus         — boolean focus mode
├── pinnedIds          — array of pinned task ids
├── projects           — project objects with id, name, color
├── history            — activity log (max 300 entries)
├── theme              — 'light' | 'dark'
├── activePomodoroId   — task id with active Pomodoro or null
└── loaded             — true once Firestore snapshot has arrived

AuthContext
├── user               — Firebase user object or null (undefined = loading)
├── logout             — signs out via Firebase
├── deleteAccount      — deletes user, re-auths automatically if needed
└── isDeleting         — boolean loading state for account deletion
```

**Firestore sync strategy:**
- On login: `onSnapshot` on `users/{uid}` — real-time listener, fires immediately with cached data
- `skipNextSave` ref prevents write-effect from firing right after a snapshot read — avoids unnecessary round-trips
- On change: debounced `setDoc` with `{ merge: true }` — 600ms delay batches rapid changes into a single write

---

## ⚙️ Engineering Decisions

| Decision | Reason |
|----------|--------|
| Single `TodoContext` (not split) | All task state is tightly coupled — splitting would require cross-context access everywhere |
| `skipNextSave` ref pattern | Prevents snapshot → state update → write → snapshot infinite loop in Firestore listener |
| Debounced Firestore write (600ms) | Rapid toggles / edits batch into one write instead of firing on every state change |
| `searchInput` + `searchQuery` split | Input updates instantly for UI responsiveness; filter applies on a short delay |
| `todosRef` synced via effect | Gives `deleteTodo` / `clearCompleted` access to latest todos without stale closure |
| HTML5 Drag API for Kanban | No library dependency — sufficient for a 3-column board |
| `updateTaskStatus` separate from `toggleComplete` | Board drag sets arbitrary status; checkbox toggle needs repeat-clone logic — kept separate |
| `pushHistory` called inside state updaters | History entry reflects actual mutation, not a stale snapshot |
| Cloudinary unsigned preset | File upload with zero backend — URL returned directly from Cloudinary API |
| `select_account` on Google provider | Forces account picker even if user is already signed in |
| ErrorBoundary with two recovery options | "Try Again" resets boundary state; "Reload" hard-resets the page — covers both error types |

---

## 🔒 Security

- Firebase Auth — no passwords stored in app, Google handles OAuth flow
- Firestore data scoped to `users/{uid}` — users can only access their own document
- Re-authentication required before account deletion — prevents accidental deletion with stale session
- All API keys in `.env` via `import.meta.env` — never hardcoded in source
- Cloudinary upload uses unsigned preset — no secret key exposed in client

---

## ▶️ Getting Started

```bash
git clone <https://github.com/mayurpanchal-12/ReactTodo.git>
cd taskflow
npm install
```

Create a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---


## 👤 Author

Built by **Mayur Panchal** — React Developer