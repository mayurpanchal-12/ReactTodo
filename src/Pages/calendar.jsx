import { useState } from "react";
import { useTodo } from "../Context/todocontext";

export default function CalendarView() {
  const { todos, filter, categoryFilter, searchQuery } = useTodo();
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrev = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNext = () => setCurrentDate(new Date(year, month + 1, 1));
  const handleToday = () => setCurrentDate(new Date());

  const getTasksForDate = (d) => {
    const target = new Date(year, month, d).toDateString();
    return todos.filter(t => {
      if (!t.dueDate) return false;
      if (new Date(t.dueDate).toDateString() !== target) return false;
      if (searchQuery.trim() && !t.todo.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (categoryFilter && t.category !== categoryFilter) return false;
      if (filter === "active")    return !t.completed;
      if (filter === "completed") return t.completed;
      return true;
    });
  };

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(<div key={`e-${i}`} className="calendar-day empty" />);

  for (let d = 1; d <= daysInMonth; d++) {
    const dayTasks = getTasksForDate(d);
    const isToday  = new Date().toDateString() === new Date(year, month, d).toDateString();
    const maxShow  = 3;
    const visible  = dayTasks.slice(0, maxShow);
    const extra    = dayTasks.length - maxShow;

    days.push(
      <div key={`d-${d}`} className={`calendar-day ${isToday ? "today" : ""}`}>
        <div className="day-number">{d}</div>
        <div className="day-tasks">
          {visible.map(task => (
            <div
              key={task.id}
              className={`cal-task-dot p-${task.priority} ${task.completed ? "completed" : ""}`}
              title={task.todo}
            >
              {task.todo}
            </div>
          ))}
          {extra > 0 && <div className="cal-task-dot more">+{extra} more</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="calendar-view animate-fade-in">
      <div className="calendar-header">
        <button className="calendar-nav-btn" onClick={handlePrev}>‹</button>
        <div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
          <h2 className="calendar-month-title">
            {currentDate.toLocaleString("default", { month:"long", year:"numeric" })}
          </h2>
          <button className="action-btn" onClick={handleToday} style={{ fontSize:"0.72rem", padding:"0.3rem 0.6rem" }}>Today</button>
        </div>
        <button className="calendar-nav-btn" onClick={handleNext}>›</button>
      </div>
      <div className="calendar-grid">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(day => (
          <div key={day} className="calendar-day-header">{day}</div>
        ))}
        {days}
      </div>
    </div>
  );
}
