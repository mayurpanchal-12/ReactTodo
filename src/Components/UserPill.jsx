import { useRef, useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { useTodo } from "../Context/todocontext";

function getInitials(email) {
  if (!email) return "?";
  return email.charAt(0).toUpperCase();
}

export default function UserPill() {
  const { user, logout, deleteAccount, isDeleting } = useAuth();
  const { theme, setTheme } = useTodo();
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const pillRef = useRef(null);
  const isDark = theme === "dark";

  useEffect(() => {
    function handleClickOutside(e) {
      if (pillRef.current && !pillRef.current.contains(e.target)) {
        setOpen(false);
        setConfirmDelete(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={pillRef} className="relative w-full">

      {/* ── Trigger button ───────────────────────────── */}
      <button
        onClick={() => { setOpen((p) => !p); setConfirmDelete(false); }}
        className="w-full flex items-center gap-2.5 cursor-pointer select-none px-1 py-1 rounded-xl
          transition-colors duration-100 hover:bg-[var(--bg-surface-2)]"
      >
        {/* Avatar */}
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
            text-white flex-shrink-0"
          style={{ background: "var(--accent)", boxShadow: "0 2px 8px var(--accent-glow)" }}
        >
          {getInitials(user?.email)}
        </div>

        {/* Email */}
        <div className="flex-1 min-w-0 text-left">
          <p className="text-[0.75rem] font-semibold truncate" style={{ color: "var(--text-primary)" }}>
            {user?.email}
          </p>
          <p className="text-[0.65rem]" style={{ color: "var(--text-muted)" }}>
            Signed in
          </p>
        </div>

        {/* Chevron */}
        <svg
          className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
          style={{ color: "var(--text-muted)" }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* ── Dropdown ─────────────────────────────────── */}
      {open && (
        <div
          className="absolute bottom-full left-0 right-0 mb-2 rounded-2xl border overflow-hidden z-50"
          style={{
            background: "var(--bg-overlay)",
            borderColor: "var(--border)",
            boxShadow: "var(--shadow-lg)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            animation: "slideUp 0.15s ease both",
          }}
        >
          {/* Header */}
          <div
            className="px-4 py-3 border-b flex items-center gap-3"
            style={{ borderColor: "var(--border-subtle)", background: "var(--bg-surface-2)" }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold
                text-black flex-shrink-0"
              style={{ background: "var(--accent)", boxShadow: "0 2px 8px var(--accent-glow)" }}
            >
              {getInitials(user?.email)}
            </div>
            <div className="min-w-0">
              <p className="text-[0.78rem] font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                {user?.email}
              </p>
              <span
                className="text-[0.65rem] font-semibold px-2 py-0.5 rounded-full inline-block mt-0.5"
                style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
              >
                ✓ TaskFlow
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="p-1.5 flex flex-col gap-0.5">

            {/* Theme toggle */}
            <button
              onClick={(e) => { e.stopPropagation(); setTheme(isDark ? "light" : "dark"); }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left
                text-[0.78rem] font-medium transition-all duration-100 border-none cursor-pointer
                text-[var(--text-secondary)] bg-transparent
                hover:bg-[var(--bg-surface-2)] hover:text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <span
                className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "var(--bg-surface-3)" }}
              >
                {isDark ? (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="5"/>
                    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                  </svg>
                )}
              </span>
              {isDark ? "Switch to Light" : "Switch to Dark"}
              <span
                className="ml-auto text-[0.65rem] font-mono px-1.5 py-0.5 rounded-md"
                style={{ background: "var(--bg-surface-3)", color: "var(--text-muted)" }}
              >
                {isDark ? "🌙" : "☀️"}
              </span>
            </button>

            {/* Divider */}
            <div className="h-px mx-2 my-0.5" style={{ background: "var(--border-subtle)" }} />

            {/* Logout */}
            <button
              onClick={(e) => { e.stopPropagation(); setOpen(false); setConfirmDelete(false); logout(); }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left
                text-[0.78rem] font-medium transition-all duration-100 border-none cursor-pointer
                bg-transparent text-[var(--text-secondary)]
                hover:bg-[var(--red-soft)] hover:text-[var(--red)]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <span
                className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "var(--bg-surface-3)" }}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </span>
              Logout
            </button>

            {/* Divider */}
            <div className="h-px mx-2 my-0.5" style={{ background: "var(--border-subtle)" }} />

            {/* Delete Account */}
            {!confirmDelete ? (
              <button
                onClick={(e) => { e.stopPropagation(); setConfirmDelete(true); }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left
                  text-[0.78rem] font-medium transition-all duration-100 border-none cursor-pointer
                  bg-transparent text-[var(--text-secondary)]
                  hover:bg-[var(--red-soft)] hover:text-[var(--red)]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                <span
                  className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "var(--bg-surface-3)" }}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <polyline points="3 6 5 6 21 6"/>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 6l-1 14H6L5 6"/>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 11v6M14 11v6"/>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6V4h6v2"/>
                  </svg>
                </span>
                Delete Account
              </button>
            ) : (
              <div className="px-3 py-2.5 flex flex-col gap-1.5">
                <p className="text-[0.72rem] font-semibold" style={{ color: "var(--red)" }}>
                  This is permanent. Are you sure?
                </p>
                <div className="flex gap-1.5">
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteAccount(); }}
                    disabled={isDeleting}
                    className="flex-1 px-2 py-1.5 rounded-lg text-[0.72rem] font-semibold
                      border-none cursor-pointer transition-all duration-100"
                    style={{ background: "var(--red)", color: "#fff", opacity: isDeleting ? 0.6 : 1 }}
                  >
                    {isDeleting ? "Deleting..." : "Yes, Delete"}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setConfirmDelete(false); }}
                    className="flex-1 px-2 py-1.5 rounded-lg text-[0.72rem] font-semibold
                      border-none cursor-pointer transition-all duration-100"
                    style={{ background: "var(--bg-surface-3)", color: "var(--text-secondary)" }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}