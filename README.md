# Advanced_TodoManager — Task Management React Application
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-Fast-green?logo=vite)
![GitHub](https://img.shields.io/badge/GitHub-Repo-black?logo=github)
![Vercel](https://img.shields.io/badge/Vercel-Deployment-black?logo=vercel)

---

A **production-grade Todo Manager Single Page Application** built using React and Context API. It demonstrates real-world frontend engineering concepts including **priority-based grouping, debounced search with inline highlights, file attachments, voice input, CSV/PDF export, and persistent storage.**

---

## 🔗 Live Demo

[View the live app on Vercel](https://react-todo-sage-phi.vercel.app/)

## 🔗 Git Repo

[View source code on GitHub](https://github.com/mayurpanchal-12/ReactTodo.git)

---

## 🚀 Project Overview

Advanced Todo Manager is a complete task management platform where users can:

- Add, edit, and delete todos with text, date, time, priority, and category
- Attach images (max 2MB) and files (max 5MB), up to 5 per todo
- Use voice-to-text input via Web Speech API
- Filter todos by status (All / Active / Completed / Overdue) and category
- Search with debounce — highlights matching text inline
- Toggle completion status — green card + strikethrough applied
- Export filtered todos as CSV or PDF
- Switch between dark and light mode with persistence

- Per-route Error Boundary 

The project focuses on **production-level practices**, not just basic CRUD.

---

## Application Flow

```
Open App → View all Todos grouped by due date
        ↓
Add Todo → text + date + time required
        ↓
Set Priority (low / mid / high) + Category (finance / study / work / other)
        ↓
Attach images (max 2MB) or files (max 5MB), up to 5 per todo
        ↓
Use voice input 🎤 → Speech Recognition fills text field
        ↓
Todo saved → grouped by date, sorted by priority within group
        ↓
Filter by Status (All / Active / Completed / Overdue) or Category
        ↓
Search with debounce → highlights matching text inline
        ↓
Edit inline → update text, date, priority, category, attachments
        ↓
Toggle complete → card turns green, strikethrough applied
        ↓
Clear Completed → bulk delete all completed todos
        ↓
Download filtered todos as CSV or PDF
        ↓
Toggle dark/light mode → persists via localStorage ☀️🌙
```

---

## 🧭 Navigation

- 📋 Todo List (Single Page App — no routing needed)

---

## 🛠 Tech Stack

### Core

- React 18 (useState, useEffect, useRef, useContext — no routing needed)
- Context API (TodoContext — centralized todos, filters, theme, all CRUD operations)
- TailwindCSS v4 (@custom-variant dark, utility-first with dynamic class composition)
- Vite (fast dev server and build tool)
- localStorage (todos and theme persisted across refresh via useEffect sync)

---

### 📦 Libraries & Tools

- Web Speech API — SpeechRecognition for voice-to-text input in TodoForm
- FileReader API — reads image and file attachments as base64 data URLs
- jsPDF — dynamic import from CDN, generates landscape PDF export
- Vercel — deployment with automatic preview on push
- GitHub — version control and source hosting

---

## ✨ Core Features

- CRUD — add, edit, delete todos with full field support
- Set Priority & Category — low / mid / high priority, finance / study / work / other categories
- Toggle Status — complete / incomplete with green card and strikethrough
- Filters — status (All / Active / Completed / Overdue) and category filters
- Persistent Storage — todos and theme saved to localStorage across refresh
- Counts & Clear All — live todo counts, bulk delete completed todos
- Export Options — download filtered todos as CSV or PDF
- Search Functionality — debounced search with inline text highlight on matches
- Voice Input — Web Speech API fills text field via microphone
- File Attachments — images (max 2MB) and files (max 5MB), up to 5 per todo

---

## 🔥 Additional Highlights

### 📅 Date Grouping & Priority Sorting
- Todos grouped by due date with Today / Tomorrow labels, sorted chronologically
- Within each date group, high → mid → low priority order applied automatically
- Overdue todos detected via `isOverdue()` — red card highlight for incomplete past-due tasks

---

### 🔍 Debounced Search with Inline Highlight
- 300ms debounce on search input via `useRef` timer — avoids re-filter on every keystroke
- `highlightText()` splits todo text by query and wraps matches in `<mark>` inline
- Search and filters work together simultaneously

---

### 📎 Attachment System
- Images validated at max 2MB, files at max 5MB per item
- Up to 5 attachments per todo stored as base64 data URLs in localStorage
- Invalid files skipped silently — other valid files still attach

---

### 🎤 Voice Input
- Web Speech API with continuous + interim results
- Stops automatically on form submit or manually via button
- Fills text field in real time as speech is recognised

---

### 📥 Export with Guard
- CSV and PDF download available for filtered todo list
- Download disabled when category filter is active — avoids partial data confusion
- Empty list guard — `filteredTodos.length === 0` check fires before any export attempt

---

## ⚙️ Key Engineering Decisions

- **Context API** → TodoContext holds all state and CRUD logic — no prop drilling, no Redux needed at this scale
- **Date grouping + priority sort** → computed via `useMemo` on every filter change — no stored sort order needed
- **base64 attachments** → FileReader API converts files to data URLs for localStorage compatibility
- **Dynamic jsPDF import** → PDF library loaded from CDN only when user triggers download — keeps initial bundle lean
- **Error Boundary on TodoList** → isolated crash containment — render errors don't break the whole app

---

## ⚡ Performance Optimizations

- `useMemo` for grouped, filtered, and sorted todo computation
- 300ms debounced search — avoids excessive re-renders on keystroke
- Dynamic jsPDF import — PDF library not included in main bundle
- localStorage sync via `useEffect` — no redundant writes on unrelated state changes
- Minimal bundle — no router, no Redux, no heavy UI library

---

## 🛡️ Error Handling Strategy

```text
TodoList or TodoItem throws during render
↓
Unexpected JS error fires
↓
ErrorBoundary wrapping TodoList catches it
↓
"Something went wrong ⚠️" fallback shown ✅


User selects file > 5MB (or image > 2MB)
↓
file.size > maxSize check fires
↓
File skipped silently in loop
↓
Other valid files still attach ✅


User clicks Download → PDF
↓
jsPDF CDN import or generation throws
↓
try/catch in downloadTodoPDF catches it
↓
"PDF download failed" alert shown ✅


User clicks Download with no visible todos
↓
filteredTodos.length === 0
↓
Early guard check fires
↓
"No visible todos to download" alert shown ✅
```

---

## ▶️ Getting Started

```bash
git clone https://github.com/mayurpanchal-12/ReactTodo.git
cd ReactTodo
npm install
npm run dev
```