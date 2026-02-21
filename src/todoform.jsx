import { useState, useRef, useEffect } from "react";
import { useTodo } from "./todocontext";

export default function TodoForm() {
  const [text, setText] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [priority, setPriority] = useState("mid");
  const [category, setCategory] = useState("other");
  const [highlighted, setHighlighted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [attachments, setAttachments] = useState([]);

  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const recognitionRef = useRef(null);

  const { addTodo, theme } = useTodo();
  const isDark = theme === "dark";

  const MAX_ATTACHMENTS = 5;
  const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const priorityIcons = { low: "🟢", mid: "🟡", high: "🔴" };
  const categoryIcons = { finance: "💰", study: "📚", work: "💼", other: "📝" };

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((res) => res[0].transcript)
          .join("");
        setText((prev) => prev + (prev ? " " : "") + transcript);
      };

      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const isImageFile = (file) => file.type.startsWith("image/");

  const formatFileSize = (bytes) => {
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const handleFileSelect = async (e, isImage) => {
    const files = Array.from(e.target.files);
    if (attachments.length + files.length > MAX_ATTACHMENTS) return;

    const newAttachments = [];
    for (const file of files) {
      const isImg = isImageFile(file);
      const maxSize = isImg ? MAX_IMAGE_SIZE : MAX_FILE_SIZE;
      if (file.size > maxSize) continue;

      const reader = new FileReader();
      const data = await new Promise((resolve) => {
        reader.onload = () =>
          resolve({
            name: file.name,
            type: file.type,
            size: file.size,
            data: reader.result,
            isImage: isImg,
          });
        reader.readAsDataURL(file);
      });
      newAttachments.push(data);
    }

    setAttachments((prev) => [...prev, ...newAttachments]);
    e.target.value = "";
  };

  const handleRemoveAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!text.trim() || !dueDate || !dueTime) return;

    addTodo({
      todo: text,
      completed: false,
      dueDate: `${dueDate}T${dueTime}`,
      priority,
      category,
      highlighted,
      attachments,
    });

    setText("");
    setDueDate("");
    setDueTime("");
    setPriority("mid");
    setCategory("other");
    setHighlighted(false);
    setAttachments([]);
    stopListening();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`space-y-4 p-4 backdrop-blur-md rounded-xl border shadow-lg max-w-4xl mx-auto ${
        isDark ? "bg-white/10 border-white/20" : "bg-white border-gray-200"
      }`}
    >
      {/* INPUT ROW */}
      <div className="flex flex-col md:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write Todo..."
            required
            className={`w-full pl-3 pr-10 py-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500 ${
              isDark
                ? "bg-white/90 text-gray-800 border-gray-300"
                : "bg-white text-gray-800 border-gray-300"
            }`}
          />
          <button
            type="button"
            onClick={isListening ? stopListening : startListening}
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            {isListening ? "🎤" : "🎙️"}
          </button>
        </div>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
          className={`px-3 py-2.5 rounded-lg border ${
            isDark
              ? "bg-white/90 text-gray-800 border-gray-300"
              : "bg-white text-gray-800 border-gray-300"
          }`}
        />

        <input
          type="time"
          value={dueTime}
          onChange={(e) => setDueTime(e.target.value)}
          required
          className={`px-3 py-2.5 rounded-lg border ${
            isDark
              ? "bg-white/90 text-gray-800 border-gray-300"
              : "bg-white text-gray-800 border-gray-300"
          }`}
        />
      </div>

      {/* ACTION BAR */}
      <div className="flex flex-wrap gap-3 items-center">
        <button
          type="button"
          onClick={() => setHighlighted(!highlighted)}
          className={`p-2.5 rounded-lg ${
            highlighted
              ? "bg-yellow-400 text-white"
              : isDark
              ? "bg-white/20 text-gray-200"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          ⭐
        </button>

        <div className={`flex rounded-lg p-1 gap-1 ${isDark ? "bg-white/20" : "bg-gray-100"}`}>
          {["low", "mid", "high"].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPriority(p)}
              className={`px-3 py-1.5 rounded-md ${
                priority === p
                  ? "bg-blue-600 text-white"
                  : isDark
                  ? "text-gray-200"
                  : "text-gray-700"
              }`}
            >
              {priorityIcons[p]}
            </button>
          ))}
        </div>

        <div className={`flex items-center gap-1 rounded-lg p-1 ${isDark ? "bg-white/20" : "bg-gray-100"}`}>
          {["finance", "study", "work", "other"].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-md ${
                category === cat
                  ? "bg-purple-600 text-white"
                  : isDark
                  ? "text-gray-200"
                  : "text-gray-700"
              }`}
            >
              {categoryIcons[cat]}
            </button>
          ))}
        </div>

        <div className={`flex items-center gap-1 rounded-lg p-1 ${isDark ? "bg-white/20" : "bg-gray-100"}`}>
          <label className="px-3 py-1.5 cursor-pointer">
            📷
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => handleFileSelect(e, true)}
            />
          </label>

          <label className="px-3 py-1.5 cursor-pointer">
            📎
            <input
              ref={fileInputRef}
              type="file"
              multiple
              hidden
              onChange={(e) => handleFileSelect(e, false)}
            />
          </label>
        </div>

        <div className="ml-auto w-full sm:w-auto">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-2.5 bg-green-600 text-white font-semibold rounded-lg"
          >
            Add Todo
          </button>
        </div>
      </div>

      {/* ATTACHMENTS PREVIEW */}
      {attachments.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {attachments.map((a, i) => (
            <div key={i} className="relative border rounded-lg p-2 text-xs">
              {a.isImage ? (
                <img src={a.data} alt="" className="h-20 w-full object-cover rounded-md" />
              ) : (
                <div>📄 {a.name}</div>
              )}
              <div>{formatFileSize(a.size)}</div>
              <button
                type="button"
                onClick={() => handleRemoveAttachment(i)}
                className="absolute top-1 right-1 text-red-500"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </form>
  );
}