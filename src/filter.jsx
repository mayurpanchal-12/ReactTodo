import { useState, useEffect, useRef } from 'react';
import { useTodo } from './todocontext';

export default function FilterBar() {
  const {
    searchQuery,
    setSearchQuery,
    searchInput,
    setSearchInput,
    theme,
  } = useTodo();

  const isDark = theme === 'dark';

  const [debouncedInput, setDebouncedInput] = useState('');
  const debounceTimerRef = useRef(null);

  /* ---------- Debounce search input ---------- */
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedInput(searchInput);
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchInput]);

  /* ---------- Handlers ---------- */
  const handleSearch = () => {
    setSearchQuery(debouncedInput.trim());
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="mt-4 space-y-3">
      <div className="relative">
        <input
          type="text"
          placeholder="Search todos... (Press Enter or click 🔍)"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className={`w-full rounded-lg border py-2.5 pl-10 pr-20 outline-none transition-colors duration-150 ${
            isDark
              ? 'border-black/10 bg-white/20 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50'
              : 'border-gray-300 bg-white text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50'
          }`}
        />

        {/* Search Icon */}
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
          <span className="text-lg">🔍</span>
        </div>

        {/* Action Buttons */}
        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              title="Clear search"
              className={`rounded-md p-1.5 transition-all duration-200 hover:scale-110 ${
                isDark
                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                  : 'bg-red-100 text-red-600 hover:bg-red-200'
              }`}
            >
              <span className="text-sm">✕</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleSearch}
            disabled={!debouncedInput.trim()}
            title="Search"
            className={`rounded-md p-1.5 transition-all duration-200 ${
              debouncedInput.trim()
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50 hover:scale-110 hover:bg-blue-600'
                : isDark
                ? 'cursor-not-allowed bg-gray-700 text-gray-500 opacity-50'
                : 'cursor-not-allowed bg-gray-300 text-gray-500 opacity-50'
            }`}
          >
            <span className="text-sm">🔍</span>
          </button>
        </div>

        {/* Search Active Indicator */}
        {searchQuery && (
          <div
            className={`absolute -bottom-6 left-0 flex items-center gap-1 text-xs ${
              isDark ? 'text-blue-400' : 'text-blue-600'
            }`}
          >
            <span>🔎</span>
            <span>Searching: "{searchQuery}"</span>
          </div>
        )}
      </div>
    </div>
  );
}