import { useEffect, useRef, useState } from "react";
import { useTodo } from "../Context/todocontext";

export default function FilterBar() {
  const { searchQuery, setSearchQuery, searchInput, setSearchInput } = useTodo();
  const [debouncedInput, setDebouncedInput] = useState("");
  const debounceRef = useRef(null);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedInput(searchInput), 300);
    return () => clearTimeout(debounceRef.current);
  }, [searchInput]);

  const handleSearch  = () => setSearchQuery(debouncedInput.trim());
  const handleClear   = () => { setSearchInput(""); setSearchQuery(""); };
  const handleKeyDown = (e) => { if (e.key === "Enter") handleSearch(); };

  return (
    <div className="filter-bar">
      <div className="search-input-wrap">
        <div className="search-icon-left">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search tasks…"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="search-input"
          aria-label="Search tasks"
        />
        <div className="search-actions">
          {searchQuery && (
            <button type="button" className="search-clear-btn" onClick={handleClear} title="Clear search">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
          <button type="button" className="search-go-btn" onClick={handleSearch} disabled={!debouncedInput.trim()}>
            Search
          </button>
        </div>
      </div>
      {searchQuery && (
        <div style={{ marginTop:"0.5rem" }}>
          <span className="search-active-tag">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            Searching: "{searchQuery}"
          </span>
        </div>
      )}
    </div>
  );
}
