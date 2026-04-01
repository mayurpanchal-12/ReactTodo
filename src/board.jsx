import { useState } from "react";
import { useTodo } from "./todocontext";
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
    { id: "todo",        label: "To Do",       cls: "board-col-todo",     accentColor: "var(--indigo)" },
    { id: "in_progress", label: "In Progress", cls: "board-col-progress", accentColor: "var(--amber)" },
    { id: "completed",   label: "Done",        cls: "board-col-done",     accentColor: "var(--green)" },
  ];

  return (
    <div className="board-view animate-fade-in">
      <div className="board-grid">
        {columns.map(col => {
          const colTasks = filteredTodos.filter(t => (t.status || (t.completed ? "completed" : "todo")) === col.id);
          return (
            <div
              key={col.id}
              className={`board-column ${col.cls} ${dragOverCol === col.id ? "drag-over" : ""}`}
              onDragOver={e => handleDragOver(e, col.id)}
              onDragLeave={handleDragLeave}
              onDrop={e => handleDrop(e, col.id)}
            >
              <div className="board-column-header">
                <div className="board-col-title">
                  <span className="board-col-accent" />
                  {col.label}
                </div>
                <span className="col-count">{colTasks.length}</span>
              </div>
              <div className="board-column-body">
                {colTasks.length === 0 ? (
                  <div className="empty-zone">Drop tasks here</div>
                ) : (
                  colTasks.map(task => (
                    <div
                      key={task.id}
                      className="board-task-wrap"
                      draggable
                      onDragStart={e => handleDragStart(e, task.id)}
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
