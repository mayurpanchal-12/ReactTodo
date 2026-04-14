import { useEffect, useRef, useState } from "react";
import { useTodo } from "../Context/todocontext";
import { TodoItemAttachmentsEdit, TodoItemAttachmentsView } from "../Components/todoitemattachments";
export default function TodoItem({ todo }) {
  const {
    updateTodo, deleteTodo, toggleComplete, isOverdue, theme,
    searchQuery, setActivePomodoroId, projects, togglePin, pinnedIds,
    addTagToTodo, removeTagFromTodo,
  } = useTodo();

  const project  = projects?.find(p => p.id === todo.projectId) || null;
  const isDark   = theme === "dark";
  const isPinned = pinnedIds.includes(todo.id);

  const [newTag,      setNewTag]      = useState("");
  const [showTags,    setShowTags]    = useState(false);
  const [isEditing,   setIsEditing]   = useState(false);
  const [msg,         setMsg]         = useState(todo.todo);
  const [dueDate,     setDueDate]     = useState("");
  const [dueTime,     setDueTime]     = useState("");
  const [priority,    setPriority]    = useState(todo.priority || "mid");
  const [category,    setCategory]    = useState(todo.category || "other");
  const [attachments, setAttachments] = useState(todo.attachments || []);
  const [repeat,      setRepeat]      = useState(todo.repeat || "none");
  const [subtasks,    setSubtasks]    = useState(todo.subtasks || []);
  const [newSubtask,  setNewSubtask]  = useState("");
  const [description, setDescription] = useState(todo.description || "");
  const [showNotes,   setShowNotes]   = useState(false);

  const fileInputRef  = useRef(null);
  const imageInputRef = useRef(null);

  const MAX_ATTACHMENTS = 5;
  const MAX_IMAGE_SIZE  = 2 * 1024 * 1024;
  const MAX_FILE_SIZE   = 5 * 1024 * 1024;

  const priorityConfig = {
    low:  { icon: "🟢", label: "Low",  color: "var(--green)" },
    mid:  { icon: "🟡", label: "Mid",  color: "var(--amber)" },
    high: { icon: "🔴", label: "High", color: "var(--red)" },
  };

  const categoryConfig = {
    finance: { icon: "💰", label: "Finance" },
    study:   { icon: "📚", label: "Study"   },
    work:    { icon: "💼", label: "Work"    },
    other:   { icon: "📝", label: "Other"   },
  };

  useEffect(() => {
    setMsg(todo.todo);
    setPriority(todo.priority || "mid");
    setCategory(todo.category || "other");
    setAttachments(todo.attachments || []);
    setRepeat(todo.repeat || "none");
    setSubtasks(todo.subtasks || []);
    setDescription(todo.description || "");
    if (todo.dueDate) {
      const dt = new Date(todo.dueDate);
      setDueDate(dt.toISOString().split("T")[0]);
      setDueTime(dt.toTimeString().slice(0, 5));
    } else {
      setDueDate("");
      setDueTime("");
    }
  }, [todo]);

  const handleSave = () => {
    let dueStr = null;
    if (dueDate && dueTime) dueStr = `${dueDate}T${dueTime}`;
    else if (dueDate)       dueStr = `${dueDate}T23:59`;
    updateTodo(todo.id, { todo: msg, dueDate: dueStr, priority, category, attachments, repeat, subtasks, description });
    setIsEditing(false);
  };

  const handleEditClick = () => {
    if (todo.completed) return;
    isEditing ? handleSave() : setIsEditing(true);
  };

  const isImageFile = (f) => f.type.startsWith("image/");

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (attachments.length + files.length > MAX_ATTACHMENTS) { e.target.value = ""; return; }
    const next = [];
    for (const file of files) {
      const isImg = isImageFile(file);
      if (file.size > (isImg ? MAX_IMAGE_SIZE : MAX_FILE_SIZE)) continue;
      const data = await new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res({ name: file.name, type: file.type, size: file.size, data: r.result, isImage: isImg });
        r.onerror = rej;
        r.readAsDataURL(file);
      });
      next.push(data);
    }
    setAttachments([...attachments, ...next]);
    e.target.value = "";
  };

  const handleRemoveAttachment = (index) =>
    setAttachments(attachments.filter((_, i) => i !== index));

  const overdue = isOverdue(todo);

  const getCardClass = () => {
    if (todo.completed) return "todo-card state-completed animate-slide-up";
    if (overdue)        return "todo-card state-overdue animate-slide-up";
    if (isPinned)       return "todo-card state-pinned animate-slide-up";
    return "todo-card animate-slide-up";
  };

  const formatDueDate = (ds) => {
    if (!ds) return "";
    return new Date(ds).toLocaleString("en-US", {
      month: "short", day: "numeric", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  const highlightText = (text) => {
    if (!searchQuery?.trim()) return text;
    const q = searchQuery.trim();
    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escaped})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      part.toLowerCase() === q.toLowerCase()
        ? <mark key={i} className="search-mark">{part}</mark>
        : <span key={i}>{part}</span>
    );
  };

  const renderDescription = (md) => {
    if (!md) return null;
    return md.split("\n").map((line, i) => {
      const parsed = line
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/`(.*?)`/g, "<code>$1</code>");
      return <p key={i} dangerouslySetInnerHTML={{ __html: parsed || "<br/>" }} />;
    });
  };

  const completedSubtasks = (todo.subtasks || []).filter(s => s.completed).length;
  const totalSubtasks     = (todo.subtasks || []).length;

  return (
    <div className={getCardClass()} id={`todo-${todo.id}`}>

      {/* Pin strip */}
      {isPinned && !todo.completed && (
        <div className="card-pin-strip">
          <span>📌</span> Pinned
        </div>
      )}

      {/* ── Main row ── */}
      <div className="card-row">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggleComplete(todo.id)}
          className="todo-checkbox"
          aria-label="Toggle complete"
        />

        <div className="todo-content">
          {/* Badges row */}
          <div className="todo-meta-row">
            <div className="todo-badges">
              {todo.repeat && todo.repeat !== "none" && (
                <span className="badge" title={`Repeats: ${todo.repeat}`}>🔁</span>
              )}
              <span className="badge" title={`Priority: ${priorityConfig[todo.priority || "mid"].label}`}>
                {priorityConfig[todo.priority || "mid"].icon}
              </span>
              <span className="badge" title={`Category: ${categoryConfig[todo.category || "other"].label}`}>
                {categoryConfig[todo.category || "other"].icon}
              </span>
              {project && (
                <span
                  className="task-project-badge"
                  style={{
                    background: project.color + "18",
                    color: project.color,
                    borderColor: project.color + "44",
                  }}
                >
                  <span
                    style={{
                      width: 5, height: 5,
                      borderRadius: "50%",
                      background: project.color,
                      display: "inline-block",
                      flexShrink: 0,
                    }}
                  />
                  {project.name}
                </span>
              )}
            </div>

            {/* Subtask progress badge */}
            {totalSubtasks > 0 && !isEditing && (
              <span className="subtask-progress-badge" title={`${completedSubtasks}/${totalSubtasks} subtasks`}>
                {completedSubtasks}/{totalSubtasks}
              </span>
            )}
          </div>

          {/* Task text or edit input */}
          {isEditing ? (
            <input
              type="text"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              className="todo-edit-input"
              autoFocus
              onKeyDown={e => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") setIsEditing(false);
              }}
            />
          ) : (
            <div className={`todo-text ${todo.completed ? "completed" : ""}`}>
              {highlightText(todo.todo)}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="card-actions">
          {todo.description && !isEditing && (
            <button
              className={`card-btn ${showNotes ? "edit-active" : ""}`}
              onClick={() => setShowNotes(!showNotes)}
              title={showNotes ? "Hide notes" : "Show notes"}
              aria-label={showNotes ? "Hide notes" : "Show notes"}
              aria-pressed={showNotes}
            >📝</button>
          )}

          <button
            className={`card-btn ${showTags ? "edit-active" : ""}`}
            onClick={() => setShowTags(!showTags)}
            title="Manage tags"
            aria-label="Manage tags"
            aria-pressed={showTags}
          >🏷️</button>

          <button
            className="card-btn"
            onClick={() => setActivePomodoroId(todo.id)}
            title="Start Pomodoro timer"
            aria-label="Start Pomodoro timer"
          >⏱️</button>

          <button
            className={`card-btn ${isPinned ? "pin-active" : ""}`}
            onClick={() => togglePin(todo.id)}
            title={isPinned ? "Unpin task" : "Pin task"}
            aria-label={isPinned ? "Unpin" : "Pin"}
          >
            <svg width="13" height="13" viewBox="0 0 24 24"
              fill={isPinned ? "currentColor" : "none"}
              stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </button>

          <div className="card-actions-divider" />

          <button
            className={`card-btn ${isEditing ? "edit-active" : ""}`}
            onClick={handleEditClick}
            disabled={todo.completed}
            title={isEditing ? "Save changes" : "Edit task"}
          >
            {isEditing ? (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            )}
          </button>

          <button
            className="card-btn delete-btn"
            onClick={() => deleteTodo(todo.id)}
            title="Delete task"
            aria-label="Delete this task"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6M14 11v6"/>
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── Edit Section ── */}
      {isEditing && (
        <div className="card-edit-section">
          <div className="card-edit-row">
            <div className="card-edit-field">
              <label className="card-edit-label">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="card-edit-input"
              />
            </div>
            <div className="card-edit-field">
              <label className="card-edit-label">Time</label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="card-edit-input"
              />
            </div>
            <div className="card-edit-field">
              <label className="card-edit-label">Repeat</label>
              <select
                value={repeat}
                onChange={(e) => setRepeat(e.target.value)}
                className="card-edit-input"
              >
                <option value="none">No Repeat</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          <div className="card-edit-groups">
            <div className="card-edit-group-block">
              <label className="card-edit-label">Priority</label>
              <div className="card-ctrl-group">
                {["low", "mid", "high"].map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={`card-ctrl-btn ${priority === p ? "active-p" : ""}`}
                    onClick={() => setPriority(p)}
                  >
                    {priorityConfig[p].icon} {priorityConfig[p].label}
                  </button>
                ))}
              </div>
            </div>

            <div className="card-edit-group-block">
              <label className="card-edit-label">Category</label>
              <div className="card-ctrl-group">
                {["finance", "study", "work", "other"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`card-ctrl-btn ${category === cat ? "active-c" : ""}`}
                    onClick={() => setCategory(cat)}
                  >
                    {categoryConfig[cat].icon} {categoryConfig[cat].label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Subtasks */}
          <div className="card-subtasks-edit">
            <label className="card-edit-label">Sub-tasks</label>
            <div className="subtask-add-row">
              <input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                placeholder="Add a sub-task…"
                className="card-edit-input"
                style={{ flex: 1 }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (newSubtask.trim()) {
                      setSubtasks([...subtasks, { id: Date.now(), text: newSubtask.trim(), completed: false }]);
                      setNewSubtask("");
                    }
                  }
                }}
              />
              <button
                type="button"
                className="card-ctrl-btn active-c"
                onClick={() => {
                  if (newSubtask.trim()) {
                    setSubtasks([...subtasks, { id: Date.now(), text: newSubtask.trim(), completed: false }]);
                    setNewSubtask("");
                  }
                }}
              >
                + Add
              </button>
            </div>
            {subtasks.map((st) => (
              <div key={st.id} className="subtask-edit-row">
                <input
                  type="checkbox"
                  checked={st.completed}
                  onChange={() =>
                    setSubtasks(subtasks.map(s =>
                      s.id === st.id ? { ...s, completed: !s.completed } : s
                    ))
                  }
                />
                <input
                  type="text"
                  value={st.text}
                  onChange={(e) =>
                    setSubtasks(subtasks.map(s =>
                      s.id === st.id ? { ...s, text: e.target.value } : s
                    ))
                  }
                  className="card-edit-input"
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => setSubtasks(subtasks.filter(s => s.id !== st.id))}
                  className="card-btn delete-btn"
                >×</button>
              </div>
            ))}
          </div>

          <TodoItemAttachmentsEdit
            attachments={attachments}
            isDark={isDark}
            maxAttachments={MAX_ATTACHMENTS}
            imageInputRef={imageInputRef}
            fileInputRef={fileInputRef}
            onFileSelect={handleFileSelect}
            onRemoveAttachment={handleRemoveAttachment}
          />

          <div className="card-edit-field">
            <label className="card-edit-label">Notes (Markdown)</label>
            <textarea
              className="md-editor"
              placeholder="Use **bold**, *italic*, `code`…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* ── Attachments View ── */}
      {!isEditing && attachments.length > 0 && (
        <TodoItemAttachmentsView attachments={attachments} isDark={isDark} />
      )}

      {/* ── Subtasks View ── */}
      {!isEditing && todo.subtasks && todo.subtasks.length > 0 && (
        <div className="card-subtasks-view">
          {todo.subtasks.map(st => (
            <div key={st.id} className="subtask-row" style={{ opacity: st.completed ? 0.5 : 1 }}>
              <input
                type="checkbox"
                checked={st.completed}
                onChange={() => {
                  const newSubtasks = todo.subtasks.map(s =>
                    s.id === st.id ? { ...s, completed: !s.completed } : s
                  );
                  updateTodo(todo.id, { subtasks: newSubtasks });
                }}
              />
              <span
                style={{
                  fontSize: "0.82rem",
                  textDecoration: st.completed ? "line-through" : "none",
                  color: "var(--text-secondary)",
                }}
              >
                {st.text}
              </span>
            </div>
          ))}
          {totalSubtasks > 0 && (
            <div className="subtask-progress-bar">
              <div
                className="subtask-progress-fill"
                style={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }}
              />
            </div>
          )}
        </div>
      )}

      {/* ── Notes View ── */}
      {!isEditing && showNotes && todo.description && (
        <div className="md-viewer animate-fade-in">
          {renderDescription(todo.description)}
        </div>
      )}

      {/* ── Footer row: due date + tags ── */}
      {!isEditing && (todo.dueDate || (todo.tags || []).length > 0) && (
        <div className="card-footer-row">
          {todo.dueDate && (
            <div className={`card-due ${overdue && !todo.completed ? "card-due-overdue" : ""}`}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              {formatDueDate(todo.dueDate)}
              {overdue && !todo.completed && (
                <span className="overdue-badge">Overdue</span>
              )}
            </div>
          )}

          {(todo.tags || []).length > 0 && (
            <div className="card-tags-row">
              {(todo.tags || []).map(tag => (
                <span key={tag} className="card-tag">#{tag}</span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Tags editor ── */}
      {showTags && (
        <div className="card-tags-editor">
          <div className="card-tags-list">
            {(todo.tags || []).map(tag => (
              <span key={tag} className="card-tag editable">
                #{tag}
                <button
                  className="tag-remove-btn"
                  onClick={() => removeTagFromTodo(todo.id, tag)}
                >×</button>
              </span>
            ))}
          </div>
          <div className="card-tags-input-row">
            <input
              className="card-tag-input"
              placeholder="Add a tag…"
              value={newTag}
              onChange={e => setNewTag(e.target.value.replace(/\s/g, ""))}
              onKeyDown={e => {
                if (e.key === "Enter" && newTag.trim()) {
                  addTagToTodo(todo.id, newTag.trim());
                  setNewTag("");
                }
                if (e.key === "Escape") setShowTags(false);
              }}
            />
            <button
              className="card-tag-add-btn"
              onClick={() => {
                if (newTag.trim()) {
                  addTagToTodo(todo.id, newTag.trim());
                  setNewTag("");
                }
              }}
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}