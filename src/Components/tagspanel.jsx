import { useTodo } from "../Context/todocontext";


const TAG_COLORS = [
  "#6366f1","#e8621a","#16a34a","#dc2626",
  "#d97706","#0d9488","#7c3aed","#ec4899",
];

const getTagColor = (tag) =>
  TAG_COLORS[tag.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % TAG_COLORS.length];

export default function TagsPanel({ onNavigate }) {
  const { allTags, activeTag, setActiveTag, todos, setTodayFocus, setFilter } = useTodo();

  const getTagCount = (tag) =>
    todos.filter(t => (t.tags || []).includes(tag)).length;

  const handleTagClick = (tag) => {
    const next = activeTag === tag ? null : tag;
    setActiveTag(next);
    if (next) {
      setFilter("all");
      setTodayFocus(false);
    }
    onNavigate?.();
  };

  if (allTags.length === 0) {
    return (
      <div className="tags-empty">
        <span>🏷️</span>
        <span>No tags yet — add tags to tasks</span>
      </div>
    );
  }

  return (
    <div className="tags-panel">
      {allTags.map(tag => {
        const color = getTagColor(tag);
        const isActive = activeTag === tag;
        return (
          <button
            key={tag}
            className={`tag-chip ${isActive ? "active" : ""}`}
            style={{
              "--tag-color": color,
              background: isActive ? color : color + "18",
              color: isActive ? "#fff" : color,
              borderColor: color + "55",
            }}
            onClick={() => handleTagClick(tag)}
          >
            #{tag}
            <span className="tag-count">{getTagCount(tag)}</span>
          </button>
        );
      })}
      {activeTag && (
        <button className="tag-clear-btn" onClick={() => setActiveTag(null)}>
          Clear filter
        </button>
      )}
    </div>
  );
}