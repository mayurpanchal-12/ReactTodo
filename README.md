# TaskFlow — Advanced Todo Manager

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-Fast-green?logo=vite)
![Context API](https://img.shields.io/badge/Context_API-State_Management-orange)
![localStorage](https://img.shields.io/badge/localStorage-Persistent-yellow)
![GitHub](https://img.shields.io/badge/GitHub-Repo-black?logo=github)
![Vercel](https://img.shields.io/badge/Vercel-Deployment-black?logo=vercel)

---

A **production-grade task management Single Page Application** built with React and Context API. Demonstrates real-world frontend engineering including **state management, drag-and-drop, voice input, analytics, accessibility (WCAG 2.x), and responsive design.**

---

## 🔗 Live Demo

[View the live app on Vercel](https://react-todo-sage-phi.vercel.app/)

## 🔗 GitHub Repository

[View source code on GitHub](https://github.com/mayurpanchal-12/ReactTodo.git)

---

## 🚀 Project Overview

TaskFlow is a complete task management platform where users can:

- Create, edit, delete, and complete tasks with priority, category, due date, subtasks, and markdown notes
- Manage projects in a Notion-style workspace with color labels
- Drag and drop tasks across a Kanban board (Todo → In Progress → Done)
- Browse tasks on a calendar view by due date
- View analytics — completion rate, GitHub-style activity heatmap, category charts
- Use voice input to create tasks hands-free
- Attach images and files per task
- Export filtered tasks as CSV or PDF
- Track all activity in a creative history log

The project focuses on **production-level practices** — design tokens, accessibility, mobile-first layout, and purpose-driven animations.

---

## 📱 Application Flow

```
Open App → Sidebar: Focus / Today / Projects / Pinned / Tags / Analytics / History
        ↓
Click Focus → Today's high-priority tasks only
        ↓
Click Projects → Create Notion-style project with color label
        ↓
Add Task → text + date + time + priority + category + voice input
        ↓
Attach images (max 2MB) or files (max 5MB), up to 5 per task
Add subtasks (nested checklist) + markdown notes
        ↓
Task saved → grouped by due date, sorted by priority within group
        ↓
Switch to Board View → drag tasks across Todo / In Progress / Done
        ↓
Switch to Calendar View → tasks plotted on calendar by due date
        ↓
Click Analytics → completion rate, GitHub heatmap, category chart, status overview
        ↓
Click History → creative log of every add / edit / delete with timestamps
        ↓
Filter by status or category → debounced search highlights matches inline
        ↓
Export filtered tasks as CSV or PDF → toggle dark / light mode (persists via localStorage)
```

---

## 🧭 Navigation (Sidebar)

- 🎯 Focus Mode — today's high-priority tasks
- 📋 All Tasks — full list grouped by due date
- 📁 Projects — Notion-style project workspaces
- 📌 Pinned — all pinned tasks
- 🏷️ Tags — tasks grouped by #tag
- 📊 Analytics — heatmap, charts, completion stats
- 🗓️ Calendar — tasks by due date on a calendar
- 🗃️ Board — Kanban drag-and-drop view
- 🕓 History — activity log (add / edit / delete)
- ☀️🌙 Theme — dark / light toggle

---

## 🛠 Tech Stack

### Core

- React 18 (Hooks — useState, useEffect, useRef, useContext)
- Context API — centralized state for todos, filters, theme, projects, history
- CSS Custom Properties — full design token system
- Vite — fast dev server and optimized build

### Browser APIs

- Web Speech API — voice-to-text input
- Drag and Drop API — native Kanban board
- FileReader API — image and file attachments as base64
- localStorage — persistent data, theme, and history across refresh

### Libraries & Tools

- jsPDF — dynamic PDF export of filtered tasks
- Vercel — deployment

---

## ✨ Core Features

- **CRUD** — add, edit, delete, toggle complete
- **Sidebar** — focus mode, projects, pinned, tags, analytics, theme, history
- **Notion-style projects** — create projects with color labels, assign tasks
- **Pinned tasks** — pin any task, view all pinned in sidebar
- **Tag collections** — group by #tag, browse from sidebar
- **Kanban board** — drag-and-drop across Todo / In Progress / Done
- **Calendar view** — tasks plotted by due date, click to filter
- **Analytics dashboard** — completion rate, GitHub-style heatmap, category chart, status overview
- **Activity history** — creative chronological log with timestamps
- **Subtasks** — nested checklist with progress bar
- **Markdown notes** — per-task editor with bold, italic, code rendering
- **Voice input** — Web Speech API fills text field from microphone
- **Attachments** — images (max 2MB) and files (max 5MB), up to 5 per task
- **Repeat tasks** — daily / weekly / monthly recurrence
- **Pomodoro timer** — per-task focus timer, bottom-sheet on mobile
- **Debounced search** — 300ms debounce, highlights matches inline
- **Filters** — by status (All / Active / Completed / Overdue) and category
- **Export** — filtered tasks as CSV or PDF (blocked on category filter to avoid partial data)
- **Dark / Light mode** — all CSS tokens fully remapped, not just inverted
- **Error Boundary** — catches render crashes, shows fallback UI with refresh prompt
- **Persistent storage** — all data, theme, projects, and history survive page refresh

---

## 🔥 Key Highlights

### 📌 Sidebar Navigation
Collapsible sidebar with focus mode, Notion-style project workspaces, pinned tasks, tag browser, analytics dashboard, theme toggle, and activity history — all from one panel.

### 🗃️ Kanban Board
Drag-and-drop across Todo / In Progress / Done columns using the native browser Drag and Drop API — no external library needed.

### 📊 Analytics Dashboard
Completion rate card, GitHub-style daily entry heatmap, category-wise completion chart, and status overview panel — all driven from localStorage data.

### 🗓️ Calendar View
Tasks plotted on a date-picker calendar by due date. Click any date to filter tasks due on that day.

### 🕓 Activity History
Creative chronological log of every add, edit, and delete event with timestamps and diff display.

### 🎯 Smart Task Grouping
Tasks grouped by due date with Today / Tomorrow labels, sorted chronologically. Within each group, high → mid → low priority order applied automatically.

### 🔴 Overdue Detection
`isOverdue()` checks `dueDate < now` for incomplete tasks — red card accent and overdue badge applied automatically.

### 🎤 Voice Input
Web Speech API with continuous and interim results. Stops on form submit or manually via button.

### 📎 Attachment System
Images (max 2MB) and files (max 5MB), up to 5 per task, stored as base64 in localStorage.

### 🌙 Dark Mode
All CSS tokens fully remapped for dark — not just inverted. Persists via localStorage with no flash on reload.

---

## ♿ Accessibility (WCAG 2.x)

- **WCAG 2.4.1** — skip navigation link for keyboard users
- **WCAG 2.4.7** — visible focus ring on every interactive element via `:focus-visible`
- **WCAG 2.5.5** — minimum 40px touch targets on all inputs and buttons
- **WCAG 1.4.1** — never color alone to convey meaning; double-encoded with icon + text
- **WCAG 2.3.3** — `prefers-reduced-motion` disables all animations for motion-sensitive users
- **WCAG 4.1.2** — `aria-label` on icon-only buttons; `aria-pressed`, `aria-selected`, `aria-live`, `role` attributes throughout
- High contrast mode support via `forced-colors: active`

---

## 🎨 UI/UX Design Principles

### Visual Hierarchy
- F-pattern layout — most important info anchored top-left
- Progressive disclosure — card actions hidden until hover or focus
- Gestalt proximity — related controls grouped in segmented containers
- Redundant coding — completed tasks use strikethrough + muted color, not color alone
- Semantic color system — red=danger, amber=warning, green=success, indigo=active

### Design Token System
- 4px spacing scale — all spacing is multiples of 4px
- Full color palette with `-soft` 10–12% opacity variants for backgrounds
- Typography scale — Syne (headings), DM Sans (body), JetBrains Mono (numbers/code)
- Border-radius scale — xs/sm/md/lg/xl tokens throughout
- CSS custom properties as single source of truth for every value

### Motion & Animation
- Purpose-driven animation only — every animation communicates state
- `cubic-bezier(0.4, 0, 0.2, 1)` easing for entrances, `ease` for micro-interactions
- Stagger animations — list items animate in sequence to convey hierarchy
- Skeleton loading states — shows structure before content loads

### Responsive Design
- Mobile-first breakpoints — 480px, 640px, 768px, 900px
- View tabs collapse to icon-only on small screens
- Pomodoro widget becomes a bottom sheet on mobile
- Calendar cells scale down gracefully
- Print stylesheet — removes UI chrome, outputs clean task list

---

## 🛡️ Error Handling Strategy

```
TodoItem throws during render
↓
JavaScript error fires
↓
ErrorBoundary wrapping TodoList catches it
↓
"Something went wrong ⚠️" fallback UI shown ✅


User attaches file > 5MB (or image > 2MB)
↓
file.size > maxSize check fires
↓
File skipped silently in loop
↓
Other valid files still attach ✅


User clicks Download PDF
↓
jsPDF CDN import or generation throws
↓
try/catch catches it
↓
"PDF download failed" alert shown ✅


User clicks Download with no visible tasks
↓
filteredTodos.length === 0
↓
Early guard check fires
↓
"No visible todos to download" alert shown ✅
```

---

## ⚙️ Key Engineering Decisions

- **Context API** — centralized todos, filters, theme, projects, history; no prop drilling
- **CSS Custom Properties** — full design token system, efficient dark mode remapping
- **Native Drag and Drop API** — Kanban board without any external DnD library
- **Debounced search** — 300ms debounce via `useRef` timer, avoids re-filter on every keystroke
- **base64 attachments** — FileReader API stores images and files directly in localStorage
- **Dynamic jsPDF import** — PDF library loaded on demand, not in the initial bundle
- **Error Boundary** — isolates TodoList render crashes from the rest of the app

---

## ▶️ Getting Started

```bash
git clone https://github.com/mayurpanchal-12/ReactTodo.git
cd ReactTodo
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---


## 🌐 Deployment

Deployed on **Vercel** with automatic builds on push to `main`.

Live: [https://react-todo-sage-phi.vercel.app/](https://react-todo-sage-phi.vercel.app/)