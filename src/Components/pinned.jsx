import { useTodo } from "../Context/todocontext";

export default function PinnedPanel({ onNavigate }) {
  const { pinnedTodos, togglePin, setFilter, setActiveTag, setTodayFocus } = useTodo();

  const handlePinnedClick = (todo) => {
    // Clear other filters so the task is visible
    setFilter("all");
    setActiveTag(null);
    setTodayFocus(false);
    onNavigate?.();
    // Scroll to the task after a short delay for view to render
    setTimeout(() => {
      const el = document.getElementById(`todo-${todo.id}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("pinned-highlight-flash");
        setTimeout(() => el.classList.remove("pinned-highlight-flash"), 1200);
      }
    }, 200);
  };

  if (pinnedTodos.length === 0) {
    return (
      <div className="pinned-empty">
        <span>📌</span>
        <span>Pin tasks for quick access</span>
      </div>
    );
  }

  return (
    <div className="pinned-panel">
      {pinnedTodos.map(todo => (
        <div key={todo.id} className="pinned-item">
          <button
            className="pinned-item-btn"
            onClick={() => handlePinnedClick(todo)}
            title={todo.todo}
          >
            <span
              className="pinned-priority-dot"
              style={{
                background: todo.priority === "high" ? "var(--red)"
                  : todo.priority === "low" ? "var(--green)" : "var(--amber)"
              }}
            />
            <span className="pinned-item-text">{todo.todo}</span>
          </button>
          <button
            className="pinned-unpin-btn"
            onClick={() => togglePin(todo.id)}
            title="Unpin"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}