import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { db } from '../firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const TodoContext = createContext();
export const useTodo = () => useContext(TodoContext);

export const TodoProvider = ({ children }) => {
  const { user } = useAuth();
  const [loaded, setLoaded] = useState(false);

  const [todos, setTodos]                       = useState([]);
  const [filter, setFilter]                     = useState('all');
  const [searchInput, setSearchInput]           = useState('');
  const [searchQuery, setSearchQuery]           = useState('');
  const [theme, setTheme]                       = useState('light');
  const [categoryFilter, setCategoryFilter]     = useState(null);
  const [activePomodoroId, setActivePomodoroId] = useState(null);
  const [history, setHistory]                   = useState([]);
  const [projects, setProjects]                 = useState([]);
  const [activeProject, setActiveProject]       = useState(null);
  const [pinnedIds, setPinnedIds]               = useState([]);
  const [activeTag, setActiveTag]               = useState(null);
  const [todayFocus, setTodayFocus]             = useState(false);

  const todosRef = useRef(todos);
  useEffect(() => { todosRef.current = todos; }, [todos]);

   const skipNextSave = useRef(false);

  // ── Firestore: load on login ───────────────────────
  useEffect(() => {
    if (!user) {
      // reset everything on logout
      setTodos([]);
      setHistory([]);
      setProjects([]);
      setPinnedIds([]);
      setTheme('dark');
      setLoaded(false);
      return;
    }

    const userDoc = doc(db, 'users', user.uid);
    const unsub = onSnapshot(userDoc, (snap) => {
        skipNextSave.current = true;  

      if (snap.exists()) {
        const data = snap.data();
        if (data.todos) setTodos(data.todos.map(t => ({
          priority: 'mid', category: 'other', attachments: [],
          subtasks: [], repeat: 'none', completedAt: null,
          description: '', projectId: null, tags: [],
          ...t,
          status: t.status || (t.completed ? 'completed' : 'todo'),
        })));
        if (data.history)   setHistory(data.history);
        if (data.projects)  setProjects(data.projects);
        if (data.pinnedIds) setPinnedIds(data.pinnedIds);
        if (data.theme)     setTheme(data.theme);
      }
      setLoaded(true);
    });

   


    return unsub;
  }, [user]);

  // ── Firestore: save on change ──────────────────────
useEffect(() => {
     if (!user || !loaded) return;
     if (skipNextSave.current) { skipNextSave.current = false; return; }
     const userDoc = doc(db, 'users', user.uid);
     const timer = setTimeout(() => {
       setDoc(userDoc, { todos, history, projects, pinnedIds, theme }, { merge: true });
     }, 600);
     return () => clearTimeout(timer);
   }, [todos, history, projects, pinnedIds, theme]);
  // ── Helpers ───────────────────────────────────────
  const isOverdue = (todo) => {
    if (!todo.dueDate || todo.completed) return false;
    return new Date(todo.dueDate) < new Date();
  };
  const getPriorityOrder = (p) => ({ high: 3, mid: 2, low: 1 }[p] || 2);

  const pushHistory = (action, todo) => {
    setHistory(prev => [{
      id: crypto.randomUUID(),

      action, taskName: todo.todo, taskId: todo.id,
      category: todo.category, priority: todo.priority,
      projectId: todo.projectId || null,
      timestamp: new Date().toISOString(),
    }, ...prev].slice(0, 300));
  };

  // ── Projects ──────────────────────────────────────
  const addProject = (name, color) => {
    setProjects(prev => [...prev, { id: crypto.randomUUID(), name, color, createdAt: new Date().toISOString() }]);
  };
  const deleteProject = (id) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    setTodos(prev => prev.map(t => t.projectId === id ? { ...t, projectId: null } : t));
    if (activeProject === id) setActiveProject(null);
  };
  const renameProject = (id, newName) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, name: newName } : p));
  };

  // ── Pins ──────────────────────────────────────────
  const togglePin = (id) => {
    setPinnedIds(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  // ── Tags ──────────────────────────────────────────
  const addTagToTodo = (id, tag) => {
    setTodos(prev => prev.map(t =>
      t.id === id ? { ...t, tags: [...new Set([...(t.tags || []), tag.toLowerCase().trim()])] } : t
    ));
  };
  const removeTagFromTodo = (id, tag) => {
    setTodos(prev => prev.map(t =>
      t.id === id ? { ...t, tags: (t.tags || []).filter(tg => tg !== tag) } : t
    ));
  };

  // ── CRUD ──────────────────────────────────────────
  // const addTodo = (todoData) => {
  //   const newTodo = {
  //     id: crypto.randomUUID(), priority: 'mid', category: 'other',
  //     attachments: [], subtasks: [], repeat: 'none',
  //     completedAt: null, description: '', status: 'todo',
  //     projectId: activeProject || null, tags: [],
  //     ...todoData,
  //   };
  //   setTodos(prev => [...prev, newTodo]);
  //   if (todoData.pinned) {
  //     setPinnedIds(prev => [...prev, newTodo.id]);
  //   }
  //   pushHistory('created', newTodo);
  // };


const addTodo = (todoData) => {
  const newTodo = {
    id: Date.now(), priority: 'mid', category: 'other',
    attachments: [], subtasks: [], repeat: 'none',
    completedAt: null, description: '', status: 'todo',  // ← add this
    projectId: activeProject || null, tags: [],
    ...todoData,
  };}
  const updateTodo = (id, updates) => {
    const original = todosRef.current.find(t => t.id === id);
    setTodos(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    if (original) pushHistory('edited', { ...original, ...updates });
  };

  const deleteTodo = (id) => {
    const todo = todosRef.current.find(t => t.id === id);
    if (todo) pushHistory('deleted', todo);
    setTodos(prev => prev.filter(t => t.id !== id));
    setPinnedIds(prev => prev.filter(p => p !== id));
  };

  // const updateTaskStatus = (id, newStatus) => {
  //   setTodos(prev => {
  //     const todo = prev.find(t => t.id === id);
  //     if (!todo) return prev;
  //     const currentStatus = todo.status || (todo.completed ? 'completed' : 'todo');
  //     if (currentStatus === newStatus) return prev;
  //     const isBecomingComplete = newStatus === 'completed';
  //     let newTodos = prev.map(t => t.id === id ? {
  //       ...t, status: newStatus,
  //       completed: isBecomingComplete,
  //       completedAt: isBecomingComplete ? new Date().toISOString() : null,
  //     } : t);
  //     if (isBecomingComplete && !todo.completed && todo.repeat && todo.repeat !== 'none' && todo.dueDate) {
  //       const nextDate = new Date(todo.dueDate);
  //       if (!isNaN(nextDate)) {
  //         if (todo.repeat === 'daily')   nextDate.setDate(nextDate.getDate() + 1);
  //         if (todo.repeat === 'weekly')  nextDate.setDate(nextDate.getDate() + 7);
  //         if (todo.repeat === 'monthly') nextDate.setMonth(nextDate.getMonth() + 1);
  //         newTodos.push({ ...todo, id: crypto.randomUUID(), completed: false, status: 'todo', completedAt: null, dueDate: nextDate.toISOString().slice(0, 16) });
  //       }
  //     }
  //     if (isBecomingComplete) pushHistory('completed', todo);
  //     return newTodos;
  //   });
  // };

  const updateTaskStatus = (id, newStatus) => {
  setTodos(prev => {
    const todo = prev.find(t => t.id === id);
    if (!todo) return prev;
    const currentStatus = todo.status || (todo.completed ? 'completed' : 'todo');
    if (currentStatus === newStatus) return prev;
    const isBecomingComplete = newStatus === 'completed';
    let newTodos = prev.map(t => t.id === id ? {
      ...t, status: newStatus,
      completed: isBecomingComplete,
      completedAt: isBecomingComplete ? new Date().toISOString() : null,
    } : t);
    if (isBecomingComplete && !todo.completed && todo.repeat && todo.repeat !== 'none' && todo.dueDate) {
      const nextDate = new Date(todo.dueDate);
      if (!isNaN(nextDate)) {
        if (todo.repeat === 'daily')   nextDate.setDate(nextDate.getDate() + 1);
        if (todo.repeat === 'weekly')  nextDate.setDate(nextDate.getDate() + 7);
        if (todo.repeat === 'monthly') nextDate.setMonth(nextDate.getMonth() + 1);
        newTodos.push({ ...todo, id: Date.now() + Math.random(), completed: false, status: 'todo', completedAt: null, dueDate: nextDate.toISOString().slice(0, 16) });
      }
    }
    if (isBecomingComplete) pushHistory('completed', todo);
    return newTodos;
  });
};

  const toggleComplete = (id) => {
    const todo = todosRef.current.find(t => t.id === id);
    if (!todo) return;
    const currentStatus = todo.status || (todo.completed ? 'completed' : 'todo');
    updateTaskStatus(id, currentStatus === 'completed' ? 'todo' : 'completed');
  };

  const clearCompleted = () => {
    const completed = todosRef.current.filter(t => t.completed);
    completed.forEach(t => pushHistory('deleted', t));
    const completedIds = completed.map(t => t.id);
    setTodos(prev => prev.filter(t => !t.completed));
    setPinnedIds(prev => prev.filter(id => !completedIds.includes(id)));
  };

  // ── Filtering ─────────────────────────────────────
  const filteredTodos = todos.filter(t => {
    if (activeProject !== null && t.projectId !== activeProject) return false;
    if (todayFocus) {
      if (!t.dueDate) return false;
      const due = new Date(t.dueDate);
      const today = new Date();
      const isToday = due.toDateString() === today.toDateString();
      const isOverdueTask = due < today && !t.completed;
      if (!isToday && !isOverdueTask) return false;
    }
    if (activeTag && !(t.tags || []).includes(activeTag)) return false;
    if (searchQuery.trim() && !(t.todo || '').toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (categoryFilter && t.category !== categoryFilter) return false;
    if (filter === 'active')    return !t.completed;
    if (filter === 'completed') return t.completed;
    if (filter === 'overdue')   return isOverdue(t);
    return true;
  });

  const groupTodosByDate = (list) => {
    const groups = {};
    list.forEach(todo => {
      const key = todo.dueDate ? new Date(todo.dueDate).toDateString() : 'no-date';
      groups[key] = groups[key] || [];
      groups[key].push(todo);
    });
    Object.keys(groups).forEach(k =>
      groups[k].sort((a, b) => getPriorityOrder(b.priority) - getPriorityOrder(a.priority))
    );
    return Object.keys(groups)
      .sort((a, b) => {
        if (a === 'no-date') return 1; if (b === 'no-date') return -1;
        return new Date(a) - new Date(b);
      })
      .map(date => ({ date, todos: groups[date] }));
  };

  const groupedTodos   = groupTodosByDate(filteredTodos);
  const allTags        = [...new Set(todos.flatMap(t => t.tags || []))].sort();
  const todayCount     = todos.filter(t => {
    if (!t.dueDate) return false;
    const due = new Date(t.dueDate), today = new Date();
    return due.toDateString() === today.toDateString() || (due < today && !t.completed);
  }).length;
  const pinnedTodos    = pinnedIds.map(id => todos.find(t => t.id === id)).filter(Boolean);
  const activeCount    = todos.filter(t => !t.completed && (activeProject === null || t.projectId === activeProject)).length;
  const completedCount = todos.filter(t =>  t.completed && (activeProject === null || t.projectId === activeProject)).length;
  const overdueCount   = todos.filter(t => isOverdue(t) && (activeProject === null || t.projectId === activeProject)).length;
  const totalCount     = todos.filter(t => activeProject === null || t.projectId === activeProject).length;

  return (
    <TodoContext.Provider value={{
      todos, filteredTodos, groupedTodos,
      addTodo, updateTodo, deleteTodo, toggleComplete, updateTaskStatus, clearCompleted,
      filter, setFilter, searchQuery, setSearchQuery, searchInput, setSearchInput,
      activeCount, completedCount, overdueCount, totalCount,
      isOverdue, getPriorityOrder, theme, setTheme,
      categoryFilter, setCategoryFilter,
      activePomodoroId, setActivePomodoroId,
      history, setHistory,
      projects, addProject, deleteProject, renameProject,
      activeProject, setActiveProject,
      pinnedIds, togglePin, pinnedTodos,
      allTags, activeTag, setActiveTag,
      addTagToTodo, removeTagFromTodo,
      todayFocus, setTodayFocus, todayCount,
      loaded
    }}>
      {children}
    </TodoContext.Provider>
  );
}