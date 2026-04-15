import { useState, useRef, useEffect } from "react";
import TodoDownloadDropdown from "./Components/download.jsx";
import ErrorBoundary from "./ErrorBoundary.jsx";
import FilterBar from "./Components/filter.jsx";
import { TodoProvider, useTodo } from "./Context/todocontext.jsx"

import TodoForm from "./Components/todoform.jsx";
import TodoItem from "./Pages/todoitem.jsx";
import Dashboard from "./Pages/dashboard.jsx";
import CalendarView from "./Pages/calendar.jsx";
import BoardView from "./Pages/board.jsx";
import PomodoroTimer from "./Components/pomodoro.jsx";
import HistoryView from "./Pages/history.jsx";
import ProjectsPanel from "./Pages/projects.jsx";
import TodayFocusBtn from "./Components/todayfocus.jsx";
import PinnedPanel from "./Components/pinned.jsx";
import TagsPanel from "./Components/tagspanel.jsx";
import LoginPage from "./Pages/LoginPage.jsx";
import { AuthProvider, useAuth } from "./Context/AuthContext.jsx";
import UserPill from "./Components/UserPill.jsx";

import About from "./Pages/About.jsx";

function PageLoader() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg-app, #0f0f0f)",
    }}>
      <div style={{
        width: 32, height: 32,
        border: "3px solid rgba(255,255,255,0.1)",
        borderTop: "3px solid var(--accent, #6366f1)",
        borderRadius: "50%",
        animation: "spin 0.7s linear infinite",
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function TodoList() {
  const {
    groupedTodos, activeCount, completedCount, overdueCount, totalCount,
    filter, setFilter, theme, setTheme, categoryFilter, setCategoryFilter,
    clearCompleted, projects, activeProject, setActiveProject, todayFocus, activeTag,
    loaded,
  } = useTodo();

  const { user, logout } = useAuth();
  const [showAbout, setShowAbout] = useState(false);
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

  const [installPrompt, setInstallPrompt] = useState(null);
  useEffect(() => {
    if (window.__installPromptEvent) {
      setInstallPrompt(window.__installPromptEvent);
      window.__installPromptEvent = null;
    }
    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);
  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') setInstallPrompt(null);
  };

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
  const activeProjectObj = projects.find(p => p.id === activeProject);

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
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <div
        className={`sidebar-overlay ${sidebarOpen ? "visible" : ""}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

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

        <div className="sidebar-section-label">Focus</div>
        <TodayFocusBtn onNavigate={() => { setViewMode("list"); setSidebarOpen(false); }} />

        <div className="sidebar-section-label">Pinned</div>
        <PinnedPanel onNavigate={() => { setViewMode("list"); setSidebarOpen(false); }} />

        <div className="sidebar-section-label">Tags</div>
        <TagsPanel onNavigate={() => { setViewMode("list"); setSidebarOpen(false); }} />

        <div className="sidebar-divider" />

        <div className="sidebar-section-label">Projects</div>
        <ProjectsPanel onNavigate={() => { setViewMode("list"); setSidebarOpen(false); }} />

        <div className="sidebar-divider" />

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

          <button
  className="sidebar-nav-item"
  onClick={() => { setShowAbout(true); setSidebarOpen(false); }}
>
  <span className="nav-icon">ℹ️</span>
  About
</button>
        </nav>

        <div className="sidebar-footer">
          <UserPill/>
        </div>
      </aside>

      <main className="app-main" id="main-content">

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

          <div className="view-tabs" role="tablist" aria-label="View modes">
            {[
              { id: "list",     label: <span>List</span>,     icon: "☰" },
              { id: "board",    label: <span>Board</span>,    icon: "⊞" },
             { id: "calendar", label: <span>Calendar</span>, icon: "📅" },
             { id: "history",  label: <span>History</span>,  icon: "🕐" },
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
            <div className="quickstat-icon">
              <svg fill="none" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="quickstat-info">
              <span className="quickstat-num">{totalCount}</span>
              <span className="quickstat-label">Total Tasks</span>
            </div>
          </div>

          <div className="quickstat-sep" />

          <div className="quickstat-item indigo">
            <div className="quickstat-icon">
              <svg fill="none" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="quickstat-info">
              <span className="quickstat-num">{activeCount}</span>
              <span className="quickstat-label">Active Tasks</span>
            </div>
          </div>

          <div className="quickstat-sep" />

          <div className="quickstat-item green">
            <div className="quickstat-icon">
              <svg fill="none" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="quickstat-info">
              <span className="quickstat-num">{completedCount}</span>
              <span className="quickstat-label">Completed</span>
            </div>
          </div>

          <div className="quickstat-sep" />

          <div className="quickstat-item red">
            <div className="quickstat-icon">
              <svg fill="none" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="quickstat-info">
              <span className="quickstat-num">{overdueCount}</span>
              <span className="quickstat-label">Overdue</span>
            </div>
          </div>

          {activeProjectObj && (
            <>
              <div className="quickstat-sep" />
              <div className="quickstat-item" style={{ "--c": activeProjectObj.color }}>
                <div className="quickstat-icon" style={{ background: activeProjectObj.color + "22" }}>
                  <svg fill="none" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor" style={{ stroke: activeProjectObj.color }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="quickstat-info">
                  <span className="quickstat-num" style={{ color: activeProjectObj.color }}>
                    {Math.round((completedCount / (totalCount || 1)) * 100)}%
                  </span>
                  <span className="quickstat-label">Project Progress</span>
                </div>
              </div>
            </>
          )}

          {installPrompt && (
            <>
              <div className="quickstat-sep" />
              <div className="quickstat-item" onClick={handleInstall} style={{ cursor: 'pointer' }}>
                <div className="quickstat-icon" style={{ background: 'var(--accent-soft)' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round">
                    <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
                <div className="quickstat-info">
                  <span className="quickstat-num" style={{ color: 'var(--accent)', fontSize: '0.75rem' }}>
                    Install
                  </span>
                  <span className="quickstat-label">Add to device</span>
                </div>
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

        <div className="main-inner">

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

          {(viewMode === "list" || viewMode === "board") && <FilterBar />}
          {viewMode === "list" && <TodoForm />}

          {viewMode === "list" && !loaded && (
            <div className="todo-groups">
              {[1,2,3].map(i => (
                <div key={i} className="todo-group" style={{ marginBottom: "1rem" }}>
                  <div style={{ height: 14, width: 120, borderRadius: 6, background: "var(--bg-surface-2)", marginBottom: "0.75rem", opacity: 0.5 }} />
                  {[1,2].map(j => (
                    <div key={j} style={{ height: 56, borderRadius: 10, background: "var(--bg-surface-2)", marginBottom: "0.5rem", opacity: 0.4 }} />
                  ))}
                </div>
              ))}
            </div>
          )}

          {viewMode === "list" && loaded && (
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
{showAbout    && <About     onClose={() => setShowAbout(false)}    />}
      <PomodoroTimer />
    </div>
  );
}

function AppContent() {
  const { user } = useAuth();
  if (user === undefined) return <PageLoader />;
  if (!user) return <LoginPage />;
  return (
    <TodoProvider>
      <TodoList />
    </TodoProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </AuthProvider>
  );
}