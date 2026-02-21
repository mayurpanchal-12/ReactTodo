import { createContext, useContext, useEffect, useState } from 'react';

const TodoContext = createContext();

export const useTodo = () => useContext(TodoContext);

export const TodoProvider = ({ children }) => {
  /* ---------- State ---------- */
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all'); // all | active | completed | overdue
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState('dark'); // dark | light
  const [categoryFilter, setCategoryFilter] = useState(null); // null | finance | study | work | other

  /* ---------- Helpers ---------- */
  const isOverdue = (todo) => {
    if (!todo.dueDate || todo.completed) return false;
    return new Date(todo.dueDate) < new Date();
  };

  const getPriorityOrder = (priority) => {
    const order = { high: 3, mid: 2, low: 1 };
    return order[priority] || 2;
  };

  /* ---------- CRUD ---------- */
  const addTodo = (todo) => {
    setTodos((prev) => [
      ...prev,
      {
        id: Date.now(),
        highlighted: false,
        priority: 'mid',
        category: 'other',
        attachments: [],
        ...todo,
      },
    ]);
  };

  const updateTodo = (id, todo) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...todo } : t))
    );
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleComplete = (id) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const toggleHighlight = (id) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, highlighted: !t.highlighted } : t
      )
    );
  };

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  };

  /* ---------- Persistence ---------- */
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('todos'));

    if (stored && stored.length > 0) {
      const normalizedTodos = stored.map((todo) => ({
        ...todo,
        highlighted: todo.highlighted || false,
        completed: todo.completed || false,
        priority: todo.priority || 'mid',
        category: todo.category || 'other',
        attachments: todo.attachments || [],
      }));

      setTodos(normalizedTodos);
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  /* ---------- Filtering ---------- */
  const filteredTodos = todos.filter((t) => {
    if (searchQuery.trim()) {
      if (!t.todo.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
    }

    if (categoryFilter && t.category !== categoryFilter) return false;

    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    if (filter === 'overdue') return isOverdue(t);

    return true;
  });

  /* ---------- Grouping ---------- */
  const groupTodosByDate = (list) => {
    const groups = {};

    list.forEach((todo) => {
      if (!todo.dueDate) {
        groups['no-date'] = groups['no-date'] || [];
        groups['no-date'].push(todo);
        return;
      }

      const dateKey = new Date(todo.dueDate).toDateString();
      groups[dateKey] = groups[dateKey] || [];
      groups[dateKey].push(todo);
    });

    Object.keys(groups).forEach((key) => {
      groups[key].sort(
        (a, b) =>
          getPriorityOrder(b.priority) -
          getPriorityOrder(a.priority)
      );
    });

    return Object.keys(groups)
      .sort((a, b) => {
        if (a === 'no-date') return 1;
        if (b === 'no-date') return -1;
        return new Date(a) - new Date(b);
      })
      .map((key) => ({
        date: key,
        todos: groups[key],
      }));
  };

  const groupedTodos = groupTodosByDate(filteredTodos);

  /* ---------- Counts ---------- */
  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;
  const overdueCount = todos.filter((t) => isOverdue(t)).length;
  const totalCount = todos.length;

  return (
    <TodoContext.Provider
      value={{
        todos,
        filteredTodos,
        groupedTodos,
        addTodo,
        updateTodo,
        deleteTodo,
        toggleComplete,
        toggleHighlight,
        clearCompleted,
        filter,
        setFilter,
        searchQuery,
        setSearchQuery,
        searchInput,
        setSearchInput,
        activeCount,
        completedCount,
        overdueCount,
        totalCount,
        isOverdue,
        getPriorityOrder,
        theme,
        setTheme,
        categoryFilter,
        setCategoryFilter,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};