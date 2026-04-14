import { useTodo } from "../Context/todocontext";

export default function Dashboard({ onClose }) {
  const { todos, completedCount, totalCount, overdueCount } = useTodo();

  const completionRate = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);
  const activeCount    = todos.filter(t => !t.completed).length;

  const categoryCounts = todos.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + 1; return acc;
  }, {});
  const maxCat = Math.max(1, ...Object.values(categoryCounts));

  const catConfig = {
    finance: { icon:"💰", color:"var(--amber)" },
    study:   { icon:"📚", color:"var(--indigo)" },
    work:    { icon:"💼", color:"var(--teal)" },
    other:   { icon:"📝", color:"var(--purple)" },
  };

  // Completion over last 28 days (heatmap cells)
  const now = Date.now();
  const completedByDate = {};
  todos.filter(t => t.completed && t.completedAt).forEach(t => {
    const daysAgo = Math.floor((now - new Date(t.completedAt).getTime()) / 86400000);
    if (daysAgo < 28) {
      completedByDate[daysAgo] = (completedByDate[daysAgo] || 0) + 1;
    }
  });
  const maxDay = Math.max(1, ...Object.values(completedByDate));

  const heatCells = Array.from({ length: 28 }, (_, i) => {
    const count = completedByDate[27 - i] || 0;
    const ratio = count / maxDay;
    const lv = ratio === 0 ? 0 : ratio < 0.25 ? 1 : ratio < 0.5 ? 2 : ratio < 0.75 ? 3 : 4;
    return { count, lv };
  });

  const bestDay = Object.keys(completedByDate).reduce((a, b) =>
    completedByDate[a] > completedByDate[b] ? a : b, null);

  // Radial ring
  const r = 36, circ = 2 * Math.PI * r;
  const offset = circ - (completionRate / 100) * circ;

  return (
    <div className="dashboard-overlay" onClick={onClose}>
      <div className="dashboard-panel" onClick={e => e.stopPropagation()}>
        <div className="dashboard-header">
          <h2>📊 Productivity Analytics</h2>
          <button className="dashboard-close" onClick={onClose}>×</button>
        </div>

        <div className="dashboard-content">

          {/* Completion Rate */}
          <div className="stat-card">
            <h3>Completion Rate</h3>
            <div className="radial-wrap">
              <svg className="radial-svg" width="90" height="90" viewBox="0 0 90 90">
                <circle className="radial-track" cx="45" cy="45" r={r} />
                <circle
                  className="radial-fill"
                  cx="45" cy="45" r={r}
                  strokeDasharray={circ}
                  strokeDashoffset={offset}
                />
                <text className="radial-label" x="45" y="45">{completionRate}%</text>
              </svg>
              <div>
                <div className="stat-card-value">{completedCount}</div>
                <div className="stat-card-desc">of {totalCount} tasks<br/>completed</div>
              </div>
            </div>
          </div>

          {/* Tasks by Category */}
          <div className="stat-card" style={{ gap:"0.75rem" }}>
            <h3>By Category</h3>
            {Object.entries(catConfig).map(([cat, cfg]) => (
              <div key={cat} className="cat-bar-row">
                <div className="cat-bar-label"><span>{cfg.icon}</span>{cat}</div>
                <div className="cat-bar-track">
                  <div
                    className="cat-bar-fill"
                    style={{ width:`${((categoryCounts[cat] || 0) / maxCat) * 100}%`, background: cfg.color }}
                  />
                </div>
                <div className="cat-bar-count">{categoryCounts[cat] || 0}</div>
              </div>
            ))}
          </div>

          {/* Status Overview */}
          <div className="stat-card">
            <h3>Status Overview</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:"0.5rem" }}>
              {[
                { label:"Active",    count: activeCount,    color:"var(--indigo)" },
                { label:"Completed", count: completedCount, color:"var(--green)" },
                { label:"Overdue",   count: overdueCount,   color:"var(--red)" },
              ].map(s => (
                <div key={s.label} style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <span style={{ fontSize:"0.82rem", color:"var(--text-secondary)", fontWeight:500 }}>{s.label}</span>
                  <span style={{ fontFamily:"var(--font-mono)", fontWeight:700, fontSize:"1rem", color: s.color }}>
                    {s.count}
                  </span>
                </div>
              ))}
            </div>
            {bestDay !== null && (
              <div style={{ marginTop:"0.75rem", paddingTop:"0.75rem", borderTop:"1px solid var(--border-subtle)" }}>
                <div style={{ fontSize:"0.7rem", color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.06em", fontWeight:700, marginBottom:"0.25rem" }}>Best Day</div>
                <div style={{ fontSize:"0.84rem", color:"var(--text-primary)", fontWeight:600 }}>
                  {Number(bestDay) === 0 ? "Today" : `${bestDay} days ago`}
                  <span style={{ color:"var(--text-muted)", fontWeight:400, fontSize:"0.78rem" }}> — {completedByDate[bestDay]} tasks</span>
                </div>
              </div>
            )}
          </div>

          {/* Activity Heatmap */}
          <div className="stat-card">
            <h3>Activity — Last 28 Days</h3>
            <div className="heatmap-grid" style={{ gridTemplateColumns:"repeat(7, 1fr)" }}>
              {heatCells.map((cell, i) => (
                <div
                  key={i}
                  className={`heatmap-cell lv${cell.lv}`}
                  title={`${cell.count} task${cell.count !== 1 ? "s" : ""} completed`}
                />
              ))}
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginTop:"0.5rem" }}>
              <span style={{ fontSize:"0.68rem", color:"var(--text-muted)" }}>Less</span>
              {[0,1,2,3,4].map(lv => (
                <div key={lv} className={`heatmap-cell lv${lv}`} style={{ width:14, height:14, borderRadius:3 }} />
              ))}
              <span style={{ fontSize:"0.68rem", color:"var(--text-muted)" }}>More</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
