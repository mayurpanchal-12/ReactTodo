import { useState, useRef, useEffect } from 'react';
import { useTodo } from './todocontext';
import { downloadTodoCSV } from './utils/csv';
import { downloadTodoPDF } from './utils/pdf';

export default function TodoDownloadDropdown() {
  const [open, setOpen] = useState(false);
  const { filteredTodos, theme, categoryFilter } = useTodo();

  const isDark = theme === 'dark';
  const isDisabled = categoryFilter !== null;
  const wrapperRef = useRef(null);

  /* ---------- Close on outside click ---------- */
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener('click', handleClickOutside);
    return () =>
      document.removeEventListener('click', handleClickOutside);
  }, []);

  /* ---------- Handlers ---------- */
  const handleCSV = (e) => {
    e.stopPropagation();

    if (filteredTodos.length === 0) {
      alert('No visible todos to download');
      return;
    }

    downloadTodoCSV(filteredTodos);
    setOpen(false);
  };

  const handlePDF = async (e) => {
    e.stopPropagation();

    if (filteredTodos.length === 0) {
      alert('No visible todos to download');
      return;
    }

    const success = await downloadTodoPDF(filteredTodos);
    if (!success) {
      alert('PDF download failed. Check the console for details.');
    }

    setOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        disabled={isDisabled}
        title={
          isDisabled
            ? 'Download disabled when category filter is active'
            : 'Download todos'
        }
        onClick={(e) => {
          if (!isDisabled) {
            e.stopPropagation();
            setOpen((prev) => !prev);
          }
        }}
        className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 transform ${
          isDisabled
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:scale-105 cursor-pointer'
        } ${
          isDisabled
            ? isDark
              ? 'bg-gray-700 text-gray-500'
              : 'bg-gray-300 text-gray-500'
            : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-blue-500/50 hover:shadow-xl'
        }`}
      >
        <span className="flex items-center gap-2">
          <span className="text-lg">💾</span>
          <span className="font-semibold">Download</span>
          <span className="text-sm">⬇</span>
        </span>
      </button>

      {open && !isDisabled && (
        <div
          className={`absolute top-full right-0 mt-2 z-50 min-w-[150px] rounded-lg border shadow-xl backdrop-blur-md transition-all duration-300 ${
            isDark
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          }`}
        >
          <div className="p-2">
            <div
              className={`mb-2 px-2 py-1 text-xs font-semibold ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Export Format
            </div>

            <button
              type="button"
              onClick={handleCSV}
              className={`mb-1 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all ${
                isDark
                  ? 'text-white hover:bg-gray-700'
                  : 'text-gray-800 hover:bg-gray-100'
              }`}
            >
              <span>📄</span>
              <span>CSV</span>
            </button>

            <button
              type="button"
              onClick={handlePDF}
              className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all ${
                isDark
                  ? 'text-white hover:bg-gray-700'
                  : 'text-gray-800 hover:bg-gray-100'
              }`}
            >
              <span>📑</span>
              <span>PDF</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}