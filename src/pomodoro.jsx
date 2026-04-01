import { useEffect, useRef, useState } from "react";
import { useTodo } from "./todocontext";

export default function PomodoroTimer() {
  const { activePomodoroId, setActivePomodoroId, todos } = useTodo();
  const [timeLeft, setTimeLeft]   = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode]           = useState("work");
  const isRunningRef = useRef(isRunning);
  const activeTask   = activePomodoroId ? todos.find(t => t.id === activePomodoroId) : null;

  useEffect(() => { isRunningRef.current = isRunning; }, [isRunning]);

  useEffect(() => {
    let timer = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      const nextMode = mode === "work" ? "break" : "work";
      const nextTime = nextMode === "work" ? 25 * 60 : 5 * 60;
      setTimeout(() => { setMode(nextMode); setTimeLeft(nextTime); }, 300);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, mode]);

  const toggleTimer  = () => setIsRunning(p => !p);
  const resetTimer   = () => { setIsRunning(false); setTimeLeft(mode === "work" ? 25 * 60 : 5 * 60); };
  const closePomodoro = () => { setIsRunning(false); setActivePomodoroId(null); };

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const seconds = (timeLeft % 60).toString().padStart(2, "0");
  const progress = ((mode === "work" ? 25 * 60 : 5 * 60) - timeLeft) / (mode === "work" ? 25 * 60 : 5 * 60);

  if (!activePomodoroId && !isRunning) return null;

  return (
    <div className="pomodoro-widget">
      <div className="pomodoro-header">
        <h4>⏱️ Focus Timer</h4>
        <button className="pomodoro-close" onClick={closePomodoro}>×</button>
      </div>

      <div className="pomodoro-task">
        {activeTask
          ? <p>{activeTask.todo}</p>
          : <p style={{ color:"var(--text-muted)", fontStyle:"italic" }}>No task selected</p>
        }
      </div>

      <div className="pomodoro-modes">
        <button className={mode === "work" ? "active" : ""} onClick={() => { setMode("work"); setTimeLeft(25*60); setIsRunning(false); }}>Work</button>
        <button className={mode === "break" ? "active" : ""} onClick={() => { setMode("break"); setTimeLeft(5*60); setIsRunning(false); }}>Break</button>
      </div>

      <div className="pomodoro-time">{minutes}:{seconds}</div>

      {/* Progress bar */}
      <div style={{ padding:"0 0.75rem", marginBottom:"0.5rem" }}>
        <div style={{ height:3, background:"var(--bg-surface-3)", borderRadius:99, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${progress * 100}%`, background:"var(--accent)", borderRadius:99, transition:"width 1s linear" }} />
        </div>
      </div>

      <div className="pomodoro-controls">
        <button className="pomo-play-btn" onClick={toggleTimer}>{isRunning ? "Pause" : "Start"}</button>
        <button className="pomo-reset-btn" onClick={resetTimer}>Reset</button>
      </div>
    </div>
  );
}
