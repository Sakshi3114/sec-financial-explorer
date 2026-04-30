import { useState, useRef, useEffect } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useDebounce } from "../../hooks/useDebounce";
import SearchDropdown from "./SearchDropdown";

export default function SearchBar({
  onSelect,
  placeholder = "Search by company name or ticker…",
}) {
  const {
    searchCompanies,
    searchResults,
    searchLoading,
    searchError,
    clearSearch,
  } = useApp();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const debouncedQuery = useDebounce(query, 350);

  // Trigger search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim().length >= 2) {
      searchCompanies(debouncedQuery.trim());
      setOpen(true);
    } else {
      setOpen(false);
      clearSearch();
    }
  }, [debouncedQuery, searchCompanies, clearSearch]);

  // Close on outside click
  useEffect(() => {
    function onDown(e) {
      if (!containerRef.current?.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  function handleSelect(company) {
    setQuery(company.name);
    setOpen(false);
    onSelect?.(company);
  }

  function handleClear() {
    setQuery("");
    setOpen(false);
    clearSearch();
    inputRef.current?.focus();
  }

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Input wrapper */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-dim pointer-events-none">
          {searchLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </span>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim().length >= 2 && setOpen(true)}
          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
          placeholder={placeholder}
          className="input pl-11 pr-10"
          autoComplete="off"
          spellCheck={false}
        />

        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-dim hover:text-ink transition-colors p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <SearchDropdown
          results={searchResults}
          loading={searchLoading}
          error={searchError}
          query={query}
          onSelect={handleSelect}
        />
      )}
    </div>
  );
}
