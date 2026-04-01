import { useState, useRef, useEffect } from "react";
import TodoDownloadDropdown from "./download.jsx";
import ErrorBoundary from "./ErrorBoundary.jsx";
import FilterBar from "./filter.jsx";
import { TodoProvider, useTodo } from "./todocontext.jsx";
import TodoForm from "./todoform.jsx";
import TodoItem from "./todoitem.jsx";
import Dashboard from "./dashboard.jsx";
import CalendarView from "./calendar.jsx";
import BoardView from "./board.jsx";
import PomodoroTimer from "./pomodoro.jsx";
import HistoryView from "./history.jsx";
import ProjectsPanel from "./projects.jsx";

import TodayFocusBtn from "./todayfocus.jsx";
import PinnedPanel from "./pinned.jsx";
import TagsPanel from "./tagspanel.jsx";

function TodoList() {
  const {
    groupedTodos, activeCount, completedCount, overdueCount, totalCount,
    filter, setFilter, theme, setTheme, categoryFilter, setCategoryFilter,
    clearCompleted, projects, activeProject, setActiveProject,todayFocus, activeTag, 
  } = useTodo();

  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showDashboard, setShowDashboard]               = useState(false);
  const [viewMode, setViewMode]                         = useState("list");
  const [sidebarOpen, setSidebarOpen]                   = useState(false);
  const categoryDropdownRef = useRef(null);

  const categoryIcons  = { finance: "💰", study: "📚", work: "💼", other: "📝" };
  const categoryLabels = { finance: "Finance", study: "Study", work: "Work", other: "Other" };

  const isDark = theme === "dark";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(e.target))
        setShowCategoryDropdown(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") setSidebarOpen(false); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const handleCategorySelect = (cat) => {
    setCategoryFilter(categoryFilter === cat ? null : cat);
    setFilter("all");
    setShowCategoryDropdown(false);
  };

  const handleStatusFilter = (f) => {
    setFilter(f);
    if (f !== "all") setCategoryFilter(null);
  };

  const formatDateHeader = (ds) => {
    if (ds === "no-date") return "No Due Date";
    const date = new Date(ds);
    const today = new Date(), tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (date.toDateString() === today.toDateString())
      return `Today · ${date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
    if (date.toDateString() === tomorrow.toDateString())
      return `Tomorrow · ${date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
    return date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" });
  };

  const getGroupClass = (ds) => {
    if (ds === "no-date") return "todo-group";
    const date = new Date(ds);
    if (date.toDateString() === new Date().toDateString()) return "todo-group group-today";
    if (date < new Date()) return "todo-group group-overdue";
    return "todo-group";
  };

  const completionRate = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  // Page title
  const activeProjectObj = projects.find(p => p.id === activeProject);
  // const pageTitle = activeProjectObj
  //   ? activeProjectObj.name
  //   : categoryFilter
  //     ? `${categoryIcons[categoryFilter]} ${categoryLabels[categoryFilter]}`
  //     : { list: "All Tasks", board: "Board", calendar: "Calendar", history: "History" }[viewMode] || "All Tasks";


  const pageTitle = todayFocus
  ? "📅 Today's Focus"
  : activeTag
    ? `🏷️ #${activeTag}`
    : activeProjectObj
      ? activeProjectObj.name
      : categoryFilter
        ? `${categoryIcons[categoryFilter]} ${categoryLabels[categoryFilter]}`
        : { list: "All Tasks", board: "Board", calendar: "Calendar", history: "History" }[viewMode] || "All Tasks";

  useEffect(() => {
    document.title = `${pageTitle} | TaskFlow`;
  }, [pageTitle]);

  return (
    <div className="app-bg">
      {/* UX: Skip navigation link — keyboard users can jump to content (WCAG 2.4.1) */}
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {/* ── Sidebar Overlay ── */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? "visible" : ""}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* ── Sidebar ── */}
      <aside
        className={`app-sidebar ${sidebarOpen ? "open" : ""}`}
        aria-label="Navigation sidebar"
        aria-hidden={!sidebarOpen}
        role="navigation"
      >
        <button className="sidebar-close-btn" onClick={() => setSidebarOpen(false)}>×</button>

<div className="sidebar-logo">
  <div className="sidebar-logo-icon">✓</div>
  Task<span>Flow</span>
</div>

{/* Quick Add */}
<button
  className="sidebar-quick-add"
  onClick={() => {
    setViewMode("list");
    setActiveProject(null);
    setSidebarOpen(false);
    setTimeout(() => document.querySelector(".form-input-text")?.focus(), 150);
  }}
>
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
  New Task
</button>

{/* Today's Focus */}
<div className="sidebar-section-label">Focus</div>
<TodayFocusBtn onNavigate={() => { setViewMode("list"); setSidebarOpen(false); }} />

{/* Pinned Tasks */}
<div className="sidebar-section-label">Pinned</div>
<PinnedPanel onNavigate={() => { setViewMode("list"); setSidebarOpen(false); }} />

{/* Tags */}
<div className="sidebar-section-label">Tags</div>
<TagsPanel onNavigate={() => { setViewMode("list"); setSidebarOpen(false); }} />

<div className="sidebar-divider" />

{/* Projects */}
<div className="sidebar-section-label">Projects</div>
<ProjectsPanel onNavigate={() => { setViewMode("list"); setSidebarOpen(false); }} />

<div className="sidebar-divider" />

{/* Bottom nav */}
<nav className="sidebar-nav">
  <button className="sidebar-nav-item" onClick={() => { setShowDashboard(true); setSidebarOpen(false); }}>
    <span className="nav-icon">📊</span>
    Analytics
  </button>
  <button
    className={`sidebar-nav-item ${viewMode === "history" ? "active" : ""}`}
    onClick={() => { setViewMode("history"); setSidebarOpen(false); }}
  >
    <span className="nav-icon">🕐</span>
    Activity History
  </button>
</nav>

<div className="sidebar-footer">
  <span className="sidebar-footer-label">Theme</span>
  <button className="theme-btn" onClick={() => setTheme(isDark ? "light" : "dark")}>
    {isDark ? (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5"/>
        <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      </svg>
    ) : (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
    )}
  </button>
</div>
      </aside>

      {/* ── Main Content ── */}
      <main className="app-main" id="main-content">

        {/* ── Top Bar ── */}
        <header className="topbar" role="banner">
          <button className="sidebar-toggle-btn" onClick={() => setSidebarOpen(true)} aria-label="Open navigation sidebar" aria-expanded={sidebarOpen} aria-controls="app-sidebar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>

          <div className="topbar-logo">
            <div className="topbar-logo-dot" />
            TaskFlow
          </div>

          {/* Page title + active project badge */}
          <div className="topbar-title">
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {activeProjectObj && (
                <span
                  className="topbar-project-badge"
                  style={{ background: activeProjectObj.color + "22", color: activeProjectObj.color, borderColor: activeProjectObj.color + "55" }}
                >
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: activeProjectObj.color, display: "inline-block", flexShrink: 0 }} />
                  {activeProjectObj.name}
                </span>
              )}
              <p className="page-title">{pageTitle}</p>
            </div>
          </div>

          {/* View Tabs */}
          <div className="view-tabs" role="tablist" aria-label="View modes">
            {[
              { id: "list",     label: "List",     icon: "☰" },
              { id: "board",    label: "Board",    icon: "⊞" },
              { id: "calendar", label: "Calendar", icon: "📅" },
              { id: "history",  label: "History",  icon: "🕐" },
            ].map(v => (
              <button
                key={v.id}
                className={`view-tab ${viewMode === v.id ? "active" : ""}`}
                onClick={() => setViewMode(v.id)}
                role="tab"
                aria-selected={viewMode === v.id}
                aria-label={v.label}
              >
                <span>{v.icon}</span>
                {v.label}
              </button>
            ))}
          </div>

          <div className="header-actions">
            <button className="action-btn danger" onClick={clearCompleted} title="Clear completed tasks" aria-label="Clear all completed tasks">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6M14 11v6"/>
              </svg>
              Clear done
            </button>
            <div style={{ position: "relative" }}>
              <TodoDownloadDropdown />
            </div>
          </div>
        </header>

        {/* ── Quick Stats Bar ── */}
        <div className="quickstats" role="region" aria-label="Task statistics">
          <div className="quickstat-item accent">
            <span className="quickstat-num">{totalCount}</span>
            <span className="quickstat-label">Total<br />Tasks</span>
          </div>
          <div className="quickstat-sep" />
          <div className="quickstat-item indigo">
            <span className="quickstat-num">{activeCount}</span>
            <span className="quickstat-label">Active<br />Tasks</span>
          </div>
          <div className="quickstat-sep" />
          <div className="quickstat-item green">
            <span className="quickstat-num">{completedCount}</span>
            <span className="quickstat-label">Completed<br />Tasks</span>
          </div>
          <div className="quickstat-sep" />
          <div className="quickstat-item red">
            <span className="quickstat-num">{overdueCount}</span>
            <span className="quickstat-label">Overdue<br />Tasks</span>
          </div>
          {activeProjectObj && (
            <>
              <div className="quickstat-sep" />
              <div className="quickstat-item" style={{ "--c": activeProjectObj.color }}>
                <span className="quickstat-num" style={{ color: activeProjectObj.color }}>
                  {Math.round((completedCount / (totalCount || 1)) * 100)}%
                </span>
                <span className="quickstat-label">Project<br />Progress</span>
              </div>
            </>
          )}
          <div className="progress-bar-wrap">
            <span className="progress-label">{completionRate}%</span>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${completionRate}%` }} />
            </div>
            <span className="progress-label" style={{ fontSize: "0.64rem", opacity: 0.6 }}>done</span>
          </div>
        </div>

        {/* ── Main scrollable area ── */}
        <div className="main-inner">

          {/* Filter pills — list view only */}
          {viewMode === "list" && (
            <div className="stats-row">
              {[
                { id: "all",       label: "All",     count: totalCount,     cls: "" },
                { id: "active",    label: "Active",  count: activeCount,    cls: "pill-active-active" },
                { id: "completed", label: "Done",    count: completedCount, cls: "pill-active-completed" },
                { id: "overdue",   label: "Overdue", count: overdueCount,   cls: "pill-active-overdue" },
              ].map(p => (
                <button
                  key={p.id}
                  className={`stats-pill ${filter === p.id && !categoryFilter ? (p.id === "all" ? "pill-active" : p.cls) : ""}`}
                  onClick={() => handleStatusFilter(p.id)}
                >
                  {p.label} <span className="pill-count">{p.count}</span>
                </button>
              ))}

              {/* Category dropdown */}
              <div style={{ position: "relative" }} ref={categoryDropdownRef}>
                <button
                  className={`stats-pill ${categoryFilter ? "pill-active-category" : ""}`}
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                >
                  {categoryFilter
                    ? <>{categoryIcons[categoryFilter]} {categoryLabels[categoryFilter]}</>
                    : <>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M4 6h16M7 12h10M10 18h4" />
                        </svg>
                        Category
                      </>
                  }
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {showCategoryDropdown && (
                  <div className="cat-dropdown">
                    <div className="cat-label">Filter by category</div>
                    {Object.keys(categoryIcons).map(cat => (
                      <button
                        key={cat}
                        className={`cat-option ${categoryFilter === cat ? "active" : ""}`}
                        onClick={() => handleCategorySelect(cat)}
                      >
                        <span>{categoryIcons[cat]}</span>
                        <span>{categoryLabels[cat]}</span>
                        {categoryFilter === cat && (
                          <svg style={{ marginLeft: "auto" }} width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </button>
                    ))}
                    {categoryFilter && (
                      <button className="cat-clear" onClick={() => { setCategoryFilter(null); setShowCategoryDropdown(false); }}>
                        Clear filter
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Search */}
          {(viewMode === "list" || viewMode === "board") && <FilterBar />}

          {/* Add Task Form */}
          {viewMode === "list" && <TodoForm />}

          {/* ── Views ── */}
          {viewMode === "list" && (
            <div className="todo-groups animate-fade-in">
              {groupedTodos.length === 0 ? (
                <div className="empty-state" role="status" aria-live="polite">
                  <span className="empty-icon" aria-hidden="true">✓</span>
                  <p className="empty-label">
                    {activeProject ? "No tasks in this project yet" : "Nothing here yet — add a task above"}
                  </p>
                  <p className="empty-hint">
                    {activeProject ? "Use the form above to add your first task to this project." : "Type a task name and press Add Task to get started."}
                  </p>
                </div>
              ) : (
                groupedTodos.map(group => (
                  <div key={group.date} className={getGroupClass(group.date)}>
                    <div className="group-header">
                      <div className="group-line" />
                      <span className="group-date-label">{formatDateHeader(group.date)}</span>
                      <div className="group-line" />
                    </div>
                    <div className="todo-grid">
                      {group.todos.map(todo => (
                        <TodoItem key={todo.id} todo={todo} />
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {viewMode === "board"    && <BoardView />}
          {viewMode === "calendar" && <CalendarView />}
          {viewMode === "history"  && <HistoryView />}
        </div>
      </main>

      {showDashboard && <Dashboard onClose={() => setShowDashboard(false)} />}
      <PomodoroTimer />
    </div>
  );
}

export default function App() {
  return (
    <TodoProvider>
      <ErrorBoundary>
        <TodoList />
      </ErrorBoundary>
    </TodoProvider>
  );
}
