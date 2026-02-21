import { useEffect, useRef, useState } from "react";
import { useTodo } from "./todocontext";
import { TodoItemAttachmentsEdit, TodoItemAttachmentsView } from "./todoitemattachments";

export default function TodoItem({ todo }) {
  const { updateTodo, deleteTodo, toggleComplete, toggleHighlight, isOverdue, theme, searchQuery } = useTodo();
  const isDark = theme === "dark";
  const [isEditing, setIsEditing] = useState(false);
  const [msg, setMsg] = useState(todo.todo);
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [priority, setPriority] = useState(todo.priority || "mid");
  const [category, setCategory] = useState(todo.category || "other");
  const [highlighted, setHighlighted] = useState(todo.highlighted || false);
  const [attachments, setAttachments] = useState(todo.attachments || []);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const MAX_ATTACHMENTS = 5;
  const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const priorityIcons = {
    low: "🟢",
    mid: "🟡",
    high: "🔴"
  };

  const categoryIcons = {
    finance: "💰",
    study: "📚",
    work: "💼",
    other: "📝"
  };

  useEffect(() => {
    setMsg(todo.todo);
    setHighlighted(todo.highlighted || false);
    setPriority(todo.priority || "mid");
    setCategory(todo.category || "other");
    setAttachments(todo.attachments || []);
    if (todo.dueDate) {
      const dateTime = new Date(todo.dueDate);
      setDueDate(dateTime.toISOString().split("T")[0]);
      setDueTime(dateTime.toTimeString().slice(0, 5));
    } else {
      setDueDate("");
      setDueTime("");
    }
  }, [todo]);

  const handleEdit = () => {
    if (!dueDate || !dueTime) {
      alert("Date and time are required!");
      return;
    }
    
    const combinedDateTime = `${dueDate}T${dueTime}`;
    
    updateTodo(todo.id, { 
      ...todo, 
      todo: msg,
      dueDate: combinedDateTime,
      priority: priority,
      category: category,
      highlighted: highlighted,
      attachments: attachments
    });
    setIsEditing(false);
  };

  const isImageFile = (file) => {
    return file.type.startsWith('image/');
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleFileSelect = async (e, isImage) => {
    const files = Array.from(e.target.files);
    
    if (attachments.length + files.length > MAX_ATTACHMENTS) {
      alert(`Maximum ${MAX_ATTACHMENTS} attachments allowed. Please delete some attachments first.`);
      e.target.value = '';
      return;
    }

    const newAttachments = [];

    for (const file of files) {
      const isImg = isImageFile(file);
      const maxSize = isImg ? MAX_IMAGE_SIZE : MAX_FILE_SIZE;
      const maxSizeLabel = isImg ? '2MB' : '5MB';

      if (file.size > maxSize) {
        alert(`${file.name} exceeds the maximum size of ${maxSizeLabel}. Please choose a smaller file.`);
        continue;
      }

      if (isImage && !isImg) {
        alert(`${file.name} is not an image file. Please use the file upload for non-image files.`);
        continue;
      }

      try {
        const reader = new FileReader();
        const attachmentData = await new Promise((resolve, reject) => {
          reader.onload = () => resolve({
            name: file.name,
            type: file.type,
            size: file.size,
            data: reader.result,
            isImage: isImg
          });
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        newAttachments.push(attachmentData);
      } catch (error) {
        console.error('Error reading file:', error);
        alert(`Failed to read ${file.name}. Please try again.`);
      }
    }

    setAttachments([...attachments, ...newAttachments]);
    e.target.value = '';
  };

  const handleRemoveAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleEditClick = () => {
    if (todo.completed) return;
    isEditing ? handleEdit() : setIsEditing(true);
  };

  // Determine background color based on status
  const getBackgroundColor = () => {
    const overdue = isOverdue(todo);
    const hasDueDate = todo.dueDate;
    
    if (todo.completed) {
      if (hasDueDate) {
        const dueDate = new Date(todo.dueDate);
        const now = new Date();
        const completedOnDueDate = 
          dueDate.toDateString() === now.toDateString();
        if (completedOnDueDate) {
          return isDark ? "bg-green-500/30" : "bg-green-100"; // Completed on due date
        }
        return isDark ? "bg-green-400/20" : "bg-green-50"; // Completed but not overdue
      }
      return isDark ? "bg-green-400/20" : "bg-green-50"; // Completed, no due date
    } else if (overdue) {
      return isDark ? "bg-red-500/30" : "bg-red-100"; // Overdue and incomplete
    }
    
    if (highlighted) {
      return isDark ? "bg-yellow-500/20" : "bg-yellow-50"; // Highlighted
    }
    return isDark ? "bg-white/10" : "bg-white"; // Default
  };

  const formatDueDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Highlight search query in text
  const highlightText = (text) => {
    if (!searchQuery || !searchQuery.trim()) {
      return text;
    }

    const query = searchQuery.trim();
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) => {
      // Check if this part matches the query (case-insensitive)
      if (part.toLowerCase() === query.toLowerCase()) {
        return (
          <mark
            key={index}
            className={`${
              isDark
                ? "bg-yellow-400 text-gray-900"
                : "bg-yellow-300 text-gray-900"
            } px-0.5 rounded font-semibold`}
          >
            {part}
          </mark>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className={`flex flex-col gap-2 border rounded-lg p-2 transition-colors duration-300 ${getBackgroundColor()} ${
      isDark ? "border-gray-300" : "border-gray-300"
    }`}>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggleComplete(todo.id)}
          className="cursor-pointer"
        />

        <span className="text-lg" title={`Priority: ${(todo.priority || "mid").charAt(0).toUpperCase() + (todo.priority || "mid").slice(1)}`}>
          {priorityIcons[todo.priority || "mid"]}
        </span>

        <span className="text-lg" title={`Category: ${(todo.category || "other").charAt(0).toUpperCase() + (todo.category || "other").slice(1)}`}>
          {categoryIcons[todo.category || "other"]}
        </span>

        {isEditing ? (
          <input
            type="text"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            className={`flex-1 bg-transparent outline-none transition-colors duration-300 ${
              todo.completed ? "line-through opacity-60" : ""
            } ${
              isDark ? "text-white" : "text-gray-800"
            }`}
          />
        ) : (
          <div className={`flex-1 transition-colors duration-300 ${
            todo.completed ? "line-through opacity-60" : ""
          } ${
            isDark ? "text-white" : "text-gray-800"
          }`}>
            {highlightText(todo.todo)}
          </div>
        )}

        <button
          onClick={() => {
            if (isEditing) {
              setHighlighted(!highlighted);
            } else {
              toggleHighlight(todo.id);
            }
          }}
          className={`px-2 py-1 rounded transition-colors ${
            (isEditing ? highlighted : todo.highlighted)
              ? "bg-yellow-500 text-white"
              : isDark
                ? "bg-gray-500 text-white hover:bg-gray-600"
                : "bg-gray-300 text-gray-700 hover:bg-gray-400"
          }`}
          title="Toggle highlight"
        >
          ⭐
        </button>

        <button 
          onClick={handleEditClick} 
          disabled={todo.completed}
          className={`transition-opacity ${todo.completed ? "opacity-50 cursor-not-allowed" : "hover:opacity-80"}`}
        >
          {isEditing ? "📁" : "✏️"}
        </button>

        <button 
          onClick={() => deleteTodo(todo.id)}
          className="hover:opacity-80 transition-opacity"
        >
          ❌
        </button>
      </div>
      
      {isEditing && (
        <div className="space-y-2 pl-7">
          <div className="flex gap-2">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
              className={`flex-1 border rounded-lg px-2 outline-none duration-150 py-1 text-sm transition-colors ${
                isDark 
                  ? "border-black/10 bg-white/30 text-white" 
                  : "border-gray-300 bg-white text-gray-800"
              }`}
              placeholder="Due Date"
            />
            <input
              type="time"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
              required
              className={`flex-1 border rounded-lg px-2 outline-none duration-150 py-1 text-sm transition-colors ${
                isDark 
                  ? "border-black/10 bg-white/30 text-white" 
                  : "border-gray-300 bg-white text-gray-800"
              }`}
              placeholder="Due Time"
            />
          </div>
          <div className="flex gap-1 flex-wrap">
            {(["low", "mid", "high"]).map((p) => (
              <div key={p} className="relative group flex">
                <button
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`px-2 py-1 rounded text-sm transition-all ${
                    priority === p
                      ? "bg-blue-600 text-white scale-110"
                      : isDark
                        ? "bg-white/20 hover:bg-white/30 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  {priorityIcons[p]} {p}
                </button>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10 bg-gray-800 text-white dark:bg-gray-700">
                  Priority: {p.charAt(0).toUpperCase() + p.slice(1)}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-1 flex-wrap">
            {(["finance", "study", "work", "other"]).map((cat) => (
              <div key={cat} className="relative group flex">
                <button
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-2 py-1 rounded text-sm transition-all flex items-center gap-1 ${
                    category === cat
                      ? "bg-purple-600 text-white scale-110"
                      : isDark
                        ? "bg-white/20 hover:bg-white/30 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  <span>{categoryIcons[cat]}</span>
                  <span className="capitalize">{cat}</span>
                </button>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10 bg-gray-800 text-white dark:bg-gray-700">
                  Category: {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </div>
              </div>
            ))}
          </div>

          {/* Attachment Management in Edit Mode */}
          {isEditing && (
            <TodoItemAttachmentsEdit
              attachments={attachments}
              isDark={isDark}
              maxAttachments={MAX_ATTACHMENTS}
              imageInputRef={imageInputRef}
              fileInputRef={fileInputRef}
              onFileSelect={handleFileSelect}
              onRemoveAttachment={handleRemoveAttachment}
            />
          )}
        </div>
      )}
      
      {/* Display Attachments when not editing */}
      {!isEditing && attachments.length > 0 && (
        <TodoItemAttachmentsView attachments={attachments} isDark={isDark} />
      )}
      
      {!isEditing && todo.dueDate && (
        <div className={`pl-7 text-xs transition-colors duration-300 ${
          isDark ? "opacity-70 text-white" : "opacity-70 text-gray-600"
        }`}>
          Due: {formatDueDate(todo.dueDate)}
        </div>
      )}
    </div>
  );
}
