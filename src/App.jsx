
import TodoDownloadDropdown from "./download.jsx";
import FilterBar from "./filter.jsx";
import { TodoProvider, useTodo } from "./todocontext.jsx";
import TodoForm from "./todoform.jsx";
import TodoItem from "./todoitem.jsx";
import { useState , useRef, useEffect} from "react";
function TodoList() {
  const {
    groupedTodos,
    activeCount,
    completedCount,
    overdueCount,
    totalCount,
    filter,
    setFilter,
    theme,
    setTheme,
    categoryFilter,
    setCategoryFilter,
    clearCompleted,
  } = useTodo();

  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const categoryDropdownRef = useRef(null);

  const categoryIcons = {
    finance: "💰",
    study: "📚",
    work: "💼",
    other: "📝",
  };

  const categoryColors = {
    finance: "from-green-500 to-emerald-500",
    study: "from-blue-500 to-indigo-500",
    work: "from-purple-500 to-pink-500",
    other: "from-gray-500 to-slate-500",
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCategorySelect = (category) => {
    if (categoryFilter === category) {
      setCategoryFilter(null); // Toggle off if same category
    } else {
      setCategoryFilter(category);
      setFilter("all"); // Reset status filter to "all"
    }
    setShowCategoryDropdown(false);
  };

  const handleStatusFilter = (statusFilter) => {
    setFilter(statusFilter);
    if (statusFilter !== "all") setCategoryFilter(null); // Clear category filter except 'all'
  };

  const formatDateHeader = (dateString) => {
    if (dateString === "no-date") return "No Date";

    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today - ${date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow - ${date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}`;
    }

    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen py-10 transition-colors duration-300 ${
        isDark
          ? "bg-gradient-to-br from-[#0f172a] via-[#172842] to-[#1e293b]"
          : "bg-gradient-to-br from-gray-50 via-white to-blue-50"
      }`}
    >
      <div
        className={`w-full max-w-4xl mx-auto shadow-2xl rounded-2xl px-6 py-6 backdrop-blur-lg border transition-colors duration-300 ${
          isDark ? "text-white bg-white/5 border-white/10" : "text-gray-800 bg-white/80 border-gray-200"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1
            className={`text-3xl font-extrabold text-center flex-1 tracking-wide bg-gradient-to-r bg-clip-text text-transparent ${
              isDark ? "from-blue-400 to-purple-400" : "from-blue-600 to-purple-600"
            }`}
          >
            Manage Your Todos
          </h1>

          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
              isDark
                ? "bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-400"
                : "bg-gray-800/20 hover:bg-gray-800/30 text-gray-800"
            }`}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <span className="text-2xl">☀️</span> : <span className="text-2xl">🌙</span>}
          </button>
        </div>

        <TodoForm />

        {/* Status Buttons */}
        <div
          className={`text-sm mt-4 flex flex-wrap gap-4 justify-center rounded-lg py-3 px-4 border transition-colors duration-300 ${
            isDark ? "bg-white/5 border-white/10" : "bg-gray-100/50 border-gray-200"
          }`}
        >
          <button
            onClick={() => handleStatusFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
              filter === "all" && !categoryFilter
                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/50"
                : isDark
                ? "bg-white/10 text-white hover:bg-white/20"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            <span className="block text-xs opacity-80 mb-1">Total</span>
            <span className="text-lg font-bold">{totalCount}</span>
          </button>

          <button
            onClick={() => handleStatusFilter("active")}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
              filter === "active" && !categoryFilter
                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/50"
                : isDark
                ? "bg-white/10 text-white hover:bg-white/20"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            <span className="block text-xs opacity-80 mb-1">Active</span>
            <span className="text-lg font-bold">{activeCount}</span>
          </button>

          <button
            onClick={() => handleStatusFilter("completed")}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
              filter === "completed" && !categoryFilter
                ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/50"
                : isDark
                ? "bg-white/10 text-white hover:bg-white/20"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            <span className="block text-xs opacity-80 mb-1">Completed</span>
            <span className="text-lg font-bold">{completedCount}</span>
          </button>

          <button
            onClick={() => handleStatusFilter("overdue")}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
              filter === "overdue" && !categoryFilter
                ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/50"
                : isDark
                ? "bg-white/10 text-red-400 hover:bg-white/20"
                : "bg-white text-red-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            <span className="block text-xs opacity-80 mb-1">Overdue</span>
            <span className="text-lg font-bold">{overdueCount}</span>
          </button>

          {/* Category & Clear Completed */}
          <div className="flex gap-4 items-center">
            <div className="relative" ref={categoryDropdownRef}>
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                  categoryFilter
                    ? `bg-gradient-to-r ${categoryColors[categoryFilter]} text-white shadow-lg`
                    : isDark
                    ? "bg-white/10 text-white hover:bg-white/20"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                <span className="block text-xs opacity-80 mb-1">
                  {categoryFilter ? (
                    <span className="flex items-center gap-1 justify-center">
                      <span>{categoryIcons[categoryFilter]}</span>
                      <span className="capitalize">{categoryFilter}</span>
                    </span>
                  ) : (
                    "Category"
                  )}
                </span>
                <span className="text-lg font-bold">🏷️</span>
              </button>

              {showCategoryDropdown && (
                <div
                  className={`absolute right-0 mt-1 z-50 rounded-md shadow-lg border ${
                    isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                  }`}
                  style={{ minWidth: "150px" }}
                >
                  <div className="p-0.5">
                    <div className="text-[9px] px-2 mb-0.5 opacity-50">Category</div>

                    {Object.keys(categoryIcons).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleCategorySelect(cat)}
                        className={`w-full px-2 py-1 text-[11px] rounded-md flex items-center gap-1 ${
                          categoryFilter === cat
                            ? `bg-gradient-to-r ${categoryColors[cat]} text-white`
                            : isDark
                            ? "hover:bg-gray-700"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <span className="text-sm">{categoryIcons[cat]}</span>
                        <span className="capitalize flex-1 text-left leading-none">{cat}</span>
                        {categoryFilter === cat && <span className="text-[10px]">✓</span>}
                      </button>
                    ))}

                    {categoryFilter && (
                      <button
                        onClick={() => {
                          setCategoryFilter(null);
                          setShowCategoryDropdown(false);
                        }}
                        className={`w-full mt-0.5 px-2 py-1 text-[10px] rounded-md ${
                          isDark ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"
                        }`}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 items-center">
              <button
                onClick={clearCompleted}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                  isDark
                    ? "bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg shadow-red-500/50 hover:shadow-xl"
                    : "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/50 hover:shadow-xl"
                }`}
                title="Clear all completed todos"
              >
                <span className="flex items-center gap-2">
                  <span className="text-lg">🗑️</span>
                  <span className="font-semibold">Clear Completed</span>
                </span>
              </button>
              <TodoDownloadDropdown />
            </div>
          </div>
        </div>

        <FilterBar />

        {/* Todos grouped */}
        <div className="mt-10 space-y-6">
          {groupedTodos.length === 0 ? (
            <p
              className={`text-center text-sm tracking-widest uppercase mt-8 transition-colors duration-300 ${
                isDark ? "text-white/30" : "text-gray-400"
              }`}
            >
              — nothing here yet —
            </p>
          ) : (
            groupedTodos.map((group) => (
              <div key={group.date} className="relative pl-5 transition-colors duration-300">
                <span
                  className={`absolute left-0 top-0 bottom-0 w-[2px] rounded-full ${
                    isDark
                      ? "bg-gradient-to-b from-blue-400/60 via-blue-500/20 to-transparent"
                      : "bg-gradient-to-b from-blue-400 via-blue-200 to-transparent"
                  }`}
                />

                <h2
                  className={`text-[11px] font-semibold tracking-[0.18em] uppercase mb-3 transition-colors duration-300 ${
                    isDark ? "text-blue-400/80" : "text-blue-500"
                  }`}
                >
                  {formatDateHeader(group.date)}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {group.todos.map((todo) => (
                    <TodoItem key={todo.id} todo={todo} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <TodoProvider>
      <TodoList />
    </TodoProvider>
  );
}


