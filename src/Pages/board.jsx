import { useState } from "react";
import { useTodo } from "../Context/todocontext";
import TodoItem from "./todoitem";

export default function BoardView() {
  const { todos, filter, categoryFilter, searchQuery, updateTaskStatus } = useTodo();
  const [dragOverCol, setDragOverCol] = useState(null);

  const handleDragStart = (e, id) => { e.dataTransfer.setData("taskId", id); };
  const handleDragOver  = (e, colId) => { e.preventDefault(); setDragOverCol(colId); };
  const handleDragLeave = () => setDragOverCol(null);
  const handleDrop      = (e, newStatus) => {
    e.preventDefault();
    const taskId = Number(e.dataTransfer.getData("taskId"));
    if (taskId) updateTaskStatus(taskId, newStatus);
    setDragOverCol(null);
  };

  const filteredTodos = todos.filter(t => {
    if (searchQuery.trim() && !t.todo.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (categoryFilter && t.category !== categoryFilter) return false;
    if (filter === "active")    return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const columns = [
    { id: "todo",        label: "To Do",       accentColor: "var(--indigo)" },
    { id: "in_progress", label: "In Progress", accentColor: "var(--amber)"  },
    { id: "completed",   label: "Done",        accentColor: "var(--green)"  },
  ];

  return (
    <div className="animate-fade-in">
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        {columns.map(col => {
          const colTasks = filteredTodos.filter(t =>
            (t.status || (t.completed ? "completed" : "todo")) === col.id
          );
          const isOver = dragOverCol === col.id;

          return (
            <div
              key={col.id}
              onDragOver={e => handleDragOver(e, col.id)}
              onDragLeave={handleDragLeave}
              onDrop={e => handleDrop(e, col.id)}
              className={`flex flex-col rounded-2xl border min-h-[400px] transition-all duration-150
                ${isOver
                  ? "border-[var(--accent)] shadow-[0_0_0_3px_var(--accent-soft)] scale-[1.01]"
                  : "border-[var(--border)]"}`}
              style={{ background: isOver ? "var(--accent-soft)" : "var(--bg-surface-2)" }}
            >
              {/* Column header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: col.accentColor }} />
                  <span className="text-[0.82rem] font-bold tracking-tight"
                    style={{ color: "var(--text-primary)" }}>
                    {col.label}
                  </span>
                </div>
                <span className="text-[0.68rem] font-mono font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: "var(--bg-surface-3)", color: "var(--text-muted)" }}>
                  {colTasks.length}
                </span>
              </div>

              {/* Column body */}
              <div className="flex flex-col gap-2 p-3 flex-1 overflow-y-auto">
                {colTasks.length === 0 ? (
                  <div className="flex items-center justify-center flex-1 text-[0.78rem] italic"
                    style={{ color: "var(--text-muted)" }}>
                    Drop tasks here
                  </div>
                ) : (
                  colTasks.map(task => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={e => handleDragStart(e, task.id)}
                      className="cursor-grab active:cursor-grabbing active:opacity-60 transition-opacity duration-100"
                    >
                      <TodoItem todo={task} />
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

