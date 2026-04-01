import { useEffect, useRef, useState } from "react";
import { useTodo } from "./todocontext";
import { downloadTodoCSV } from "./utils/csv";
import { downloadTodoPDF } from "./utils/pdf";

export default function TodoDownloadDropdown() {
  const [open, setOpen] = useState(false);
  const { filteredTodos, categoryFilter } = useTodo();

  const isDisabled = categoryFilter !== null;
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleCSV = (e) => {
    e.stopPropagation();
    if (!filteredTodos.length) { alert("No visible todos to download"); return; }
    downloadTodoCSV(filteredTodos);
    setOpen(false);
  };

  const handlePDF = async (e) => {
    e.stopPropagation();
    if (!filteredTodos.length) { alert("No visible todos to download"); return; }
    const ok = await downloadTodoPDF(filteredTodos);
    if (!ok) alert("PDF download failed.");
    setOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        className="action-btn primary"
        disabled={isDisabled}
        title={isDisabled ? "Download disabled when category filter is active" : "Export tasks"}
        onClick={(e) => { if (!isDisabled) { e.stopPropagation(); setOpen((p) => !p); } }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        Export
      </button>

      {open && !isDisabled && (
        <div className="dl-dropdown">
          <div className="cat-label" style={{ marginBottom: "0.25rem" }}>Format</div>
          <button className="dl-option" type="button" onClick={handleCSV}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
            CSV Spreadsheet
          </button>
          <button className="dl-option" type="button" onClick={handlePDF}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
            PDF Document
          </button>
        </div>
      )}
    </div>
  );
}
