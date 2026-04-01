import { useEffect, useRef, useState } from "react";
import { useTodo } from "./todocontext";

const COLORS = [
  "#6366f1", "#e8621a", "#16a34a", "#dc2626",
  "#d97706", "#0d9488", "#7c3aed", "#ec4899",
  "#0ea5e9", "#84cc16",
];

export default function ProjectsPanel({ onNavigate }) {
  const {
    projects, addProject, deleteProject, renameProject,
    activeProject, setActiveProject, todos,
  } = useTodo();

  const [showForm, setShowForm]   = useState(false);
  const [newName, setNewName]     = useState("");
  const [newColor, setNewColor]   = useState(COLORS[0]);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName]   = useState("");
  const nameInputRef              = useRef(null);

  useEffect(() => {
    if (showForm && nameInputRef.current) nameInputRef.current.focus();
  }, [showForm]);

  const handleAdd = () => {
    if (!newName.trim()) return;
    addProject(newName.trim(), newColor);
    setNewName("");
    setNewColor(COLORS[0]);
    setShowForm(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter")  handleAdd();
    if (e.key === "Escape") { setShowForm(false); setNewName(""); }
  };

  const getCount = (projectId) =>
    todos.filter(t => t.projectId === projectId).length;

  const getCompletedCount = (projectId) =>
    todos.filter(t => t.projectId === projectId && t.completed).length;

  return (
    <div className="projects-panel">

      {/* All Projects */}
      <button
        className={`sidebar-nav-item ${activeProject === null ? "active" : ""}`}
        onClick={() => { setActiveProject(null); onNavigate?.(); }}
      >
        <span className="nav-icon">🗂️</span>
        All Projects
        <span className="nav-count">{todos.length}</span>
      </button>

      {/* Project list */}
      {projects.map(p => {
        const total     = getCount(p.id);
        const completed = getCompletedCount(p.id);
        const pct       = total === 0 ? 0 : Math.round((completed / total) * 100);

        return (
          <div key={p.id} className="project-item-wrap">
            {editingId === p.id ? (
              <input
                className="project-edit-input"
                value={editName}
                autoFocus
                onChange={e => setEditName(e.target.value)}
                onBlur={() => { if (editName.trim()) renameProject(p.id, editName.trim()); setEditingId(null); }}
                onKeyDown={e => {
                  if (e.key === "Enter")  { if (editName.trim()) renameProject(p.id, editName.trim()); setEditingId(null); }
                  if (e.key === "Escape") setEditingId(null);
                }}
              />
            ) : (
              <button
                className={`sidebar-nav-item project-nav-item ${activeProject === p.id ? "active" : ""}`}
                onClick={() => { setActiveProject(p.id); onNavigate?.(); }}
              >
                <span className="project-color-dot" style={{ background: p.color }} />
                <span className="project-name">{p.name}</span>
                <span className="nav-count">{total}</span>
              </button>
            )}

            {/* Progress bar under project */}
            {total > 0 && editingId !== p.id && (
              <div className="project-progress-bar">
                <div
                  className="project-progress-fill"
                  style={{ width: `${pct}%`, background: p.color }}
                />
              </div>
            )}

            {/* Hover actions */}
            {editingId !== p.id && (
              <div className="project-actions">
                <button
                  className="project-action-btn"
                  title="Rename project"
                  onClick={e => { e.stopPropagation(); setEditingId(p.id); setEditName(p.name); }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                <button
                  className="project-action-btn danger"
                  title="Delete project"
                  onClick={e => {
                    e.stopPropagation();
                    if (window.confirm(`Delete "${p.name}"? Tasks won't be deleted, just unassigned.`))
                      deleteProject(p.id);
                  }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  </svg>
                </button>
              </div>
            )}
          </div>
        );
      })}

      {/* New project form */}
      {showForm ? (
        <div className="project-form">
          <input
            ref={nameInputRef}
            className="project-name-input"
            placeholder="Project name…"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="color-picker">
            {COLORS.map(c => (
              <button
                key={c}
                type="button"
                className={`color-dot ${newColor === c ? "selected" : ""}`}
                style={{ background: c }}
                onClick={() => setNewColor(c)}
                title={c}
              />
            ))}
          </div>
          <div className="project-form-btns">
            <button type="button" className="project-add-btn" onClick={handleAdd}>
              Create
            </button>
            <button type="button" className="project-cancel-btn" onClick={() => { setShowForm(false); setNewName(""); }}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button className="add-project-btn" onClick={() => setShowForm(true)}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Project
        </button>
      )}
    </div>
  );
}
