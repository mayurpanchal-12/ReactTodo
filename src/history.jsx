import { useState } from "react";
import { useTodo } from "./todocontext";

const ACTION_MAP = {
  completed: { label: "Completed", cls: "completed", dot: "✓", color: "var(--green)" },
  deleted:   { label: "Deleted",   cls: "deleted",   dot: "×", color: "var(--red)" },
  created:   { label: "Created",   cls: "created",   dot: "+", color: "var(--indigo)" },
  edited:    { label: "Edited",    cls: "edited",     dot: "✎", color: "var(--amber)" },
};

const CAT_ICONS = { finance: "💰", study: "📚", work: "💼", other: "📝" };
const PRI_ICONS = { high: "🔴", mid: "🟡", low: "🟢" };
const FILTERS   = ["all", "completed", "created", "edited", "deleted"];

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d}d ago`;
  if (h > 0) return `${h}h ago`;
  if (m > 0) return `${m}m ago`;
  return "just now";
}

function formatDateTime(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    + " · " + d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

export default function HistoryView() {
  const { history, setHistory } = useTodo();
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered = activeFilter === "all"
    ? history
    : history.filter(h => h.action === activeFilter);

  const counts = FILTERS.slice(1).reduce((acc, f) => {
    acc[f] = history.filter(h => h.action === f).length;
    return acc;
  }, {});

  const clearHistory = () => {
    if (window.confirm("Clear all activity history? This cannot be undone.")) {
      setHistory([]);
    }
  };

  return (
    <div className="history-view animate-fade-in">

      {/* Header */}
      <div className="history-header">
        <div>
          <h2 className="history-title">Activity History</h2>
          <p className="history-subtitle">
            {history.length} event{history.length !== 1 ? "s" : ""} recorded
          </p>
        </div>
        {history.length > 0 && (
          <button className="history-clear-btn" onClick={clearHistory}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            </svg>
            Clear History
          </button>
        )}
      </div>

      {/* Summary cards */}
      {history.length > 0 && (
        <div className="history-summary">
          {[
            { label: "Created",   count: counts.created,   color: "var(--indigo)", icon: "+" },
            { label: "Completed", count: counts.completed, color: "var(--green)",  icon: "✓" },
            { label: "Edited",    count: counts.edited,    color: "var(--amber)",  icon: "✎" },
            { label: "Deleted",   count: counts.deleted,   color: "var(--red)",    icon: "×" },
          ].map(s => (
            <div key={s.label} className="history-summary-card" style={{ "--card-color": s.color }}>
              <span className="history-summary-icon">{s.icon}</span>
              <span className="history-summary-count">{s.count}</span>
              <span className="history-summary-label">{s.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Filter tabs */}
      <div className="history-filters">
        {FILTERS.map(f => (
          <button
            key={f}
            className={`history-filter-btn ${activeFilter === f ? "active" : ""}`}
            onClick={() => setActiveFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f !== "all" && counts[f] > 0 && (
              <span className="history-filter-count">{counts[f]}</span>
            )}
            {f === "all" && (
              <span className="history-filter-count">{history.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Timeline */}
      {filtered.length === 0 ? (
        <div className="history-empty">
          <span className="history-empty-icon">🕐</span>
          <p className="history-empty-text">
            {activeFilter === "all" ? "No activity yet" : `No ${activeFilter} events`}
          </p>
          <p className="history-empty-desc">
            {activeFilter === "all"
              ? "Start adding, completing, or editing tasks — every action is tracked here."
              : `Switch to "All" to see other events.`}
          </p>
        </div>
      ) : (
        <div className="history-timeline">
          {filtered.map((item, idx) => {
            const meta = ACTION_MAP[item.action] || ACTION_MAP.edited;
            const showDate = idx === 0 || (
              new Date(filtered[idx - 1].timestamp).toDateString() !==
              new Date(item.timestamp).toDateString()
            );

            return (
              <div key={item.id}>
                {showDate && (
                  <div className="history-date-sep">
                    <div className="history-date-line" />
                    <span className="history-date-label">
                      {new Date(item.timestamp).toLocaleDateString("en-US", {
                        weekday: "short", month: "short", day: "numeric"
                      })}
                    </span>
                    <div className="history-date-line" />
                  </div>
                )}
                <div className="history-item animate-slide-left" style={{ animationDelay: `${(idx % 10) * 0.03}s` }}>
                  <div className="history-dot" style={{ background: meta.color }}>
                    {meta.dot}
                  </div>
                  <div className="history-content">
                    <div className="history-task-name">{item.taskName}</div>
                    <div className="history-meta">
                      <span
                        className="history-action-badge"
                        style={{ background: `color-mix(in srgb, ${meta.color} 12%, transparent)`, color: meta.color }}
                      >
                        {meta.label}
                      </span>
                      {item.category && (
                        <span className="history-meta-tag">
                          {CAT_ICONS[item.category] || "📝"} {item.category}
                        </span>
                      )}
                      {item.priority && (
                        <span className="history-meta-tag">{PRI_ICONS[item.priority] || "🟡"}</span>
                      )}
                      <span className="history-time">{formatDateTime(item.timestamp)}</span>
                      <span className="history-ago">{timeAgo(item.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
