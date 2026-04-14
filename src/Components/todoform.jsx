import { useEffect, useRef, useState } from "react";
import { useTodo } from "../Context/todocontext";

export default function TodoForm() {
  const { addTodo, projects, activeProject } = useTodo();
  const [uploading, setUploading] = useState(false);

  const [text,         setText]         = useState("");
  const [dueDate,      setDueDate]      = useState("");
  const [dueTime,      setDueTime]      = useState("");
  const [priority,     setPriority]     = useState("mid");
  const [category,     setCategory]     = useState("other");
  const [isListening,  setIsListening]  = useState(false);
  const [attachments,  setAttachments]  = useState([]);
  const [repeat,       setRepeat]       = useState("none");
  const [description,  setDescription]  = useState("");
  const [showDesc,     setShowDesc]     = useState(false);
  const [projectId,    setProjectId]    = useState(activeProject || null);
  const [pinned,       setPinned]       = useState(false);
  const [tags,         setTags]         = useState([]);
  const [newTag,       setNewTag]       = useState("");
  const [showTags,     setShowTags]     = useState(false);
  const [subtasks,     setSubtasks]     = useState([]);
  const [newSubtask,   setNewSubtask]   = useState("");
  const [showSubtasks, setShowSubtasks] = useState(false);

  useEffect(() => { setProjectId(activeProject || null); }, [activeProject]);

  const fileInputRef   = useRef(null);
  const imageInputRef  = useRef(null);
  const recognitionRef = useRef(null);

  const MAX_ATTACHMENTS = 5;
  const MAX_IMAGE_SIZE  = 2 * 1024 * 1024;
  const MAX_FILE_SIZE   = 5 * 1024 * 1024;

  const CLOUDINARY_CLOUD_NAME   = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const priorityConfig = {
    low:  { icon: "🟢", label: "Low",    color: "var(--green)"  },
    mid:  { icon: "🟡", label: "Medium", color: "var(--amber)"  },
    high: { icon: "🔴", label: "High",   color: "var(--red)"    },
  };

  const categoryConfig = {
    finance: { icon: "💰", label: "Finance" },
    study:   { icon: "📚", label: "Study"   },
    work:    { icon: "💼", label: "Work"    },
    other:   { icon: "📝", label: "Other"   },
  };

  // ── Voice input ───────────────────────────────────
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SR();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";
      recognitionRef.current.onresult = (e) => {
        const t = Array.from(e.results).map(r => r[0].transcript).join("");
        setText(prev => prev + (prev ? " " : "") + t);
      };
      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend   = () => setIsListening(false);
    }
    return () => {
      if (recognitionRef.current) recognitionRef.current.abort();
    };
  }, []);

  const startListening = () => { if (recognitionRef.current && !isListening) { recognitionRef.current.start(); setIsListening(true); } };
  const stopListening  = () => { if (recognitionRef.current && isListening)  { recognitionRef.current.stop();  setIsListening(false); } };

  const isImageFile    = (f) => f.type.startsWith("image/");
  const formatFileSize = (b) => {
    if (!b) return "0 B";
    const k = 1024, sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(b) / Math.log(k));
    return Math.round((b / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  // ── Cloudinary upload ─────────────────────────────
  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (attachments.length + files.length > MAX_ATTACHMENTS) { e.target.value = ""; return; }
    setUploading(true);
    const next = [];
    for (const file of files) {
      const isImg = isImageFile(file);
      if (file.size > (isImg ? MAX_IMAGE_SIZE : MAX_FILE_SIZE)) continue;
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`,
          { method: "POST", body: formData }
        );
        const data = await res.json();
        if (data.secure_url) {
          next.push({ name: file.name, type: file.type, size: file.size, url: data.secure_url, isImage: isImg });
        }
      } catch (err) {
        console.error("Upload failed for", file.name, err);
      }
    }
    setAttachments(prev => [...prev, ...next]);
    setUploading(false);
    e.target.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    let dueStr = null;
    if (dueDate && dueTime) dueStr = `${dueDate}T${dueTime}`;
    else if (dueDate)       dueStr = `${dueDate}T23:59`;

    addTodo({
      todo: text, completed: false, dueDate: dueStr,
      priority, category, attachments, repeat, description,
      projectId: projectId || null, pinned, tags, subtasks,
    });

    setText(""); setDueDate(""); setDueTime(""); setPriority("mid");
    setCategory("other"); setAttachments([]); setRepeat("none");
    setDescription(""); setShowDesc(false); setPinned(false);
    setTags([]); setNewTag(""); setShowTags(false);
    setSubtasks([]); setNewSubtask(""); setShowSubtasks(false);
    stopListening();
  };

  const addTag = () => {
    const val = newTag.toLowerCase().trim();
    if (val && !tags.includes(val)) setTags([...tags, val]);
    setNewTag("");
  };

  const addSubtask = () => {
    if (newSubtask.trim()) {
      setSubtasks([...subtasks, { id: crypto.randomUUID(), text: newSubtask.trim(), completed: false }]);
      setNewSubtask("");
    }
  };

  const canAttachMore = attachments.length < MAX_ATTACHMENTS;

  return (
    <form onSubmit={handleSubmit} className="todo-form" noValidate>

      {/* ── Row 1: Main input + submit ── */}
      <div className="tf-main-row">
        <div className="tf-input-wrap">
          <input
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="What needs to be done?"
            className="tf-text-input form-input-text"
            aria-label="Task name"
            required
          />
          <button
            type="button"
            className={`tf-voice-btn ${isListening ? "is-listening" : ""}`}
            onClick={isListening ? stopListening : startListening}
            aria-label={isListening ? "Stop voice input" : "Start voice input"}
            aria-pressed={isListening}
            title={isListening ? "Stop voice input" : "Dictate task"}
          >
            {isListening ? (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="22" />
              </svg>
            )}
          </button>
        </div>

        <button type="submit" className="tf-submit-btn" disabled={uploading}>
          {uploading ? (
            "Uploading..."
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Task
            </>
          )}
        </button>
      </div>

      {/* ── Row 2: Date / Time / Repeat / Project ── */}
      <div className="tf-meta-row">
        <div className="tf-field-group">
          <label className="tf-field-label" htmlFor="tf-due-date">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Due date
          </label>
          <input
            id="tf-due-date"
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            className="tf-meta-input"
          />
        </div>

        <div className="tf-field-group">
          <label className="tf-field-label" htmlFor="tf-due-time">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            Time
          </label>
          <input
            id="tf-due-time"
            type="time"
            value={dueTime}
            onChange={e => setDueTime(e.target.value)}
            className="tf-meta-input"
          />
        </div>

        <div className="tf-field-group">
          <label className="tf-field-label" htmlFor="tf-repeat">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
            </svg>
            Repeat
          </label>
          <select
            id="tf-repeat"
            value={repeat}
            onChange={e => setRepeat(e.target.value)}
            className="tf-meta-input tf-select"
          >
            <option value="none">None</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        {projects.length > 0 && (
          <div className="tf-field-group">
            <label className="tf-field-label" htmlFor="tf-project">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
              </svg>
              Project
            </label>
            <select
              id="tf-project"
              value={projectId || ""}
              onChange={e => setProjectId(e.target.value ? Number(e.target.value) : null)}
              className="tf-meta-input tf-select"
            >
              <option value="">No project</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* ── Row 3: Priority / Category / Toggles ── */}
      <div className="tf-controls-row">

        <div className="tf-seg-group" role="group" aria-label="Priority">
          {["low", "mid", "high"].map(p => (
            <button
              key={p}
              type="button"
              className={`tf-seg-btn ${priority === p ? "is-active" : ""}`}
              onClick={() => setPriority(p)}
              aria-pressed={priority === p}
              style={priority === p ? { color: priorityConfig[p].color } : {}}
              title={`Priority: ${priorityConfig[p].label}`}
            >
              {priorityConfig[p].icon}
              <span>{priorityConfig[p].label}</span>
            </button>
          ))}
        </div>

        <div className="tf-divider" aria-hidden="true" />

        <div className="tf-seg-group" role="group" aria-label="Category">
          {["finance", "study", "work", "other"].map(cat => (
            <button
              key={cat}
              type="button"
              className={`tf-seg-btn ${category === cat ? "is-active" : ""}`}
              onClick={() => setCategory(cat)}
              aria-pressed={category === cat}
              title={`Category: ${categoryConfig[cat].label}`}
            >
              {categoryConfig[cat].icon}
              <span>{categoryConfig[cat].label}</span>
            </button>
          ))}
        </div>

        <div className="tf-divider" aria-hidden="true" />

        <div className="tf-toggle-group">
          <button
            type="button"
            className={`tf-toggle-btn ${showDesc ? "is-on" : ""}`}
            onClick={() => setShowDesc(v => !v)}
            aria-pressed={showDesc}
            title="Add notes"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
            Notes
          </button>

          <button
            type="button"
            className={`tf-toggle-btn ${showSubtasks ? "is-on" : ""}`}
            onClick={() => setShowSubtasks(v => !v)}
            aria-pressed={showSubtasks}
            title="Add subtasks"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
            Subtasks
          </button>

          <button
            type="button"
            className={`tf-toggle-btn ${showTags ? "is-on" : ""}`}
            onClick={() => setShowTags(v => !v)}
            aria-pressed={showTags}
            title="Add tags"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
            </svg>
            Tags
            {tags.length > 0 && <span className="tf-badge">{tags.length}</span>}
          </button>

          <button
            type="button"
            className={`tf-toggle-btn ${pinned ? "is-on is-pinned" : ""}`}
            onClick={() => setPinned(v => !v)}
            aria-pressed={pinned}
            title={pinned ? "Remove pin" : "Pin this task"}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill={pinned ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            Pin
          </button>

          <label
            className={`tf-toggle-btn ${!canAttachMore ? "is-disabled" : ""}`}
            title={canAttachMore ? "Attach photo" : "Max attachments reached"}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
            </svg>
            Photo
            {attachments.length > 0 && <span className="tf-badge">{attachments.length}/{MAX_ATTACHMENTS}</span>}
            <input ref={imageInputRef} type="file" accept="image/*" multiple hidden disabled={!canAttachMore} onChange={handleFileSelect} />
          </label>

          <label
            className={`tf-toggle-btn ${!canAttachMore ? "is-disabled" : ""}`}
            title={canAttachMore ? "Attach file" : "Max attachments reached"}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
            </svg>
            File
            <input ref={fileInputRef} type="file" multiple hidden disabled={!canAttachMore} onChange={handleFileSelect} />
          </label>
        </div>
      </div>

      {/* ── Notes ── */}
      {showDesc && (
        <div className="tf-expanded-section">
          <label className="tf-field-label" htmlFor="tf-notes">Notes</label>
          <textarea
            id="tf-notes"
            className="tf-notes-input"
            placeholder="Add details… supports **bold**, *italic*, `code`"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
          />
        </div>
      )}

      {/* ── Tags ── */}
      {showTags && (
        <div className="tf-expanded-section">
          <div className="tf-tags-wrap">
            {tags.map(tag => (
              <span key={tag} className="tf-tag">
                #{tag}
                <button
                  type="button"
                  className="tf-tag-remove"
                  onClick={() => setTags(tags.filter(t => t !== tag))}
                  aria-label={`Remove tag ${tag}`}
                >×</button>
              </span>
            ))}
            <input
              className="tf-tag-input"
              placeholder="Type tag + Enter"
              value={newTag}
              onChange={e => setNewTag(e.target.value.replace(/\s/g, ""))}
              onKeyDown={e => {
                if (e.key === "Enter") { e.preventDefault(); addTag(); }
                if (e.key === "Escape") setShowTags(false);
                if (e.key === "Backspace" && !newTag && tags.length) setTags(tags.slice(0, -1));
              }}
            />
          </div>
        </div>
      )}

      {/* ── Subtasks ── */}
      {showSubtasks && (
        <div className="tf-expanded-section">
          <div className="tf-subtask-add-row">
            <input
              type="text"
              value={newSubtask}
              onChange={e => setNewSubtask(e.target.value)}
              placeholder="Add a subtask…"
              className="tf-subtask-input"
              onKeyDown={e => {
                if (e.key === "Enter") { e.preventDefault(); addSubtask(); }
                if (e.key === "Escape") setShowSubtasks(false);
              }}
            />
            <button type="button" className="tf-subtask-add-btn" onClick={addSubtask}>
              Add
            </button>
          </div>
          {subtasks.length > 0 && (
            <ul className="tf-subtask-list">
              {subtasks.map(st => (
                <li key={st.id} className="tf-subtask-item">
                  <input
                    type="checkbox"
                    checked={st.completed}
                    onChange={() => setSubtasks(subtasks.map(s => s.id === st.id ? { ...s, completed: !s.completed } : s))}
                    className="tf-subtask-check"
                  />
                  <input
                    type="text"
                    value={st.text}
                    onChange={e => setSubtasks(subtasks.map(s => s.id === st.id ? { ...s, text: e.target.value } : s))}
                    className={`tf-subtask-text ${st.completed ? "is-done" : ""}`}
                  />
                  <button
                    type="button"
                    className="tf-subtask-remove"
                    onClick={() => setSubtasks(subtasks.filter(s => s.id !== st.id))}
                    aria-label="Remove subtask"
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* ── Attachment previews ── */}
      {attachments.length > 0 && (
        <div className="tf-attachments">
          {attachments.map((a, i) => (
            <div key={i} className="tf-attachment-thumb">
              {a.isImage ? (
                <img src={a.url} alt={a.name} />
              ) : (
                <div className="tf-attachment-file">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                    <polyline points="13 2 13 9 20 9"/>
                  </svg>
                  <span className="tf-attachment-name">{a.name}</span>
                  <span className="tf-attachment-size">{formatFileSize(a.size)}</span>
                </div>
              )}
              <button
                type="button"
                className="tf-attachment-remove"
                onClick={() => setAttachments(attachments.filter((_, j) => j !== i))}
                aria-label={`Remove ${a.name}`}
              >×</button>
            </div>
          ))}
        </div>
      )}

    </form>
  );
}