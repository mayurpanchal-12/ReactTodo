import { useTodo } from "./todocontext";

export default function TodayFocusBtn({ onNavigate }) {
  const { todayFocus, setTodayFocus, todayCount, setFilter, setActiveTag } = useTodo();

  const handleClick = () => {
    const next = !todayFocus;
    setTodayFocus(next);
    if (next) {
      setFilter("all");       // reset other filters
      setActiveTag(null);     // reset tag filter
    }
    onNavigate?.();           // close sidebar + switch to list view
  };

  return (
    <button
      className={`sidebar-nav-item today-focus-btn ${todayFocus ? "active" : ""}`}
      onClick={handleClick}
    >
      <span className="nav-icon">📅</span>
      Today's Focus
      <span className={`nav-count ${todayCount > 0 ? "count-urgent" : ""}`}>
        {todayCount}
      </span>
    </button>
  );
}