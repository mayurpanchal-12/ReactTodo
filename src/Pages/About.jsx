export default function About({ onClose }) {
  const features = [
    { icon: "☁️", title: "Real-time Cloud Sync",     desc: "All tasks sync instantly across every device via Firestore." },
    { icon: "🔐", title: "Secure Authentication",    desc: "Google OAuth and email/password login with per-user data isolation." },
    { icon: "🗃️", title: "Kanban Board",             desc: "Drag and drop tasks across Todo / In Progress / Done columns." },
    { icon: "📅", title: "Calendar View",             desc: "Browse tasks by due date on a full monthly calendar." },
    { icon: "📊", title: "Analytics Dashboard",       desc: "Completion rate, activity heatmap, and category breakdown." },
    { icon: "📁", title: "Projects",                  desc: "Organize tasks into color-labeled Notion-style workspaces." },
    { icon: "📎", title: "File Attachments",          desc: "Attach images and files per task — stored on Cloudinary." },
    { icon: "🎤", title: "Voice Input",               desc: "Dictate task names hands-free using the Web Speech API." },
    { icon: "⏱️", title: "Pomodoro Timer",            desc: "Per-task focus timer with automatic work/break cycles." },
    { icon: "🔁", title: "Repeat Tasks",              desc: "Daily, weekly, or monthly recurrence — auto-clones on completion." },
    { icon: "📤", title: "Export",                    desc: "Download your tasks as CSV or PDF at any time." },
    { icon: "🌙", title: "Dark / Light Mode",         desc: "Fully remapped color tokens — not just an inversion." },
  ];

  const stack = [
    { name: "React 18",      color: "var(--indigo)",  soft: "var(--indigo-soft)"  },
    { name: "Firebase Auth", color: "var(--amber)",   soft: "var(--amber-soft)"   },
    { name: "Firestore",     color: "var(--amber)",   soft: "var(--amber-soft)"   },
    { name: "Cloudinary",    color: "var(--teal)",    soft: "var(--teal-soft)"    },
    { name: "Vite",          color: "var(--purple)",  soft: "var(--purple-soft)"  },
    { name: "Vercel",        color: "var(--accent)",  soft: "var(--accent-soft)"  },
    { name: "PWA",           color: "var(--green)",   soft: "var(--green-soft)"   },
    { name: "Context API",   color: "var(--indigo)",  soft: "var(--indigo-soft)"  },
  ];

  return (
    <div
      className="dashboard-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="About TaskFlow"
    >
      <div
        className="dashboard-panel"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: 560, maxHeight: "88vh", overflowY: "auto" }}
      >

        {/* ── Header ── */}
        <div className="dashboard-header">
          <h2 style={{ fontFamily: "var(--font-display)" }}>About TaskFlow</h2>
          <button className="dashboard-close" onClick={onClose} aria-label="Close about panel">×</button>
        </div>

        <div style={{ padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {/* ── Hero ── */}
          <div style={{
            background: "var(--accent-soft)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            padding: "1.25rem",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: "var(--radius-sm)",
              background: "var(--accent)", display: "flex",
              alignItems: "center", justifyContent: "center",
              fontSize: "1.4rem", flexShrink: 0,
              boxShadow: "var(--shadow-accent)",
            }}>✓</div>
            <div>
              <p style={{
                fontFamily: "var(--font-display)", fontSize: "1.1rem",
                fontWeight: 800, color: "var(--text-primary)",
                letterSpacing: "var(--ls-tight)", marginBottom: "0.2rem",
              }}>
                Task<span style={{ color: "var(--accent)" }}>Flow</span>
                <span style={{
                  marginLeft: "0.5rem", fontSize: "0.65rem", fontFamily: "var(--font-mono)",
                  background: "var(--accent)", color: "#fff",
                  padding: "2px 8px", borderRadius: "var(--radius-pill)",
                  fontWeight: 600, verticalAlign: "middle",
                }}>v2.0</span>
              </p>
              <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                A production-grade cloud task manager — built to actually help you get things done.
              </p>
            </div>
          </div>

          {/* ── Features grid ── */}
          <div>
            <p style={{
              fontSize: "0.62rem", fontWeight: 700, letterSpacing: "var(--ls-widest)",
              color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "0.75rem",
            }}>Features</p>
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr",
              gap: "0.5rem",
            }}>
              {features.map((f, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "flex-start", gap: "0.6rem",
                  background: "var(--bg-surface-2)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-sm)",
                  padding: "0.625rem 0.75rem",
                }}>
                  <span style={{ fontSize: "1rem", flexShrink: 0, marginTop: 1 }}>{f.icon}</span>
                  <div>
                    <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.1rem" }}>
                      {f.title}
                    </p>
                    <p style={{ fontSize: "0.68rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Tech stack ── */}
          <div>
            <p style={{
              fontSize: "0.62rem", fontWeight: 700, letterSpacing: "var(--ls-widest)",
              color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "0.75rem",
            }}>Built with</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
              {stack.map((s, i) => (
                <span key={i} style={{
                  fontSize: "0.72rem", fontWeight: 600,
                  padding: "0.25rem 0.65rem",
                  borderRadius: "var(--radius-pill)",
                  background: s.soft,
                  color: s.color,
                  border: `1px solid ${s.soft}`,
                }}>
                  {s.name}
                </span>
              ))}
            </div>
          </div>

          {/* ── Data & privacy ── */}
          <div style={{
            background: "var(--bg-surface-2)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            padding: "1rem 1.125rem",
          }}>
            <p style={{
              fontSize: "0.62rem", fontWeight: 700, letterSpacing: "var(--ls-widest)",
              color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "0.625rem",
            }}>Data & Privacy</p>
            {[
              "Your data is stored in Firestore under your user ID — no one else can access it.",
              "Files and images are uploaded to Cloudinary and linked only to your account.",
              "No personal data is sold or shared with third parties.",
              "Delete your account anytime — all your data is permanently removed.",
            ].map((line, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", marginBottom: "0.4rem" }}>
                <span style={{ color: "var(--green)", fontSize: "0.75rem", marginTop: 2, flexShrink: 0 }}>✓</span>
                <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>{line}</p>
              </div>
            ))}
          </div>

          {/* ── Footer ── */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            paddingTop: "0.5rem",
            borderTop: "1px solid var(--border-subtle)",
          }}>
            <p style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
              Made with ♥ · TaskFlow v2.0
            </p>
           
          </div>

        </div>
      </div>
    </div>
  );
}