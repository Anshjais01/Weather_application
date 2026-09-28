import { useState, useEffect, useRef, useCallback } from 'react';
import { searchCities } from '../services/weatherApi';

/**
 * SearchBar – City search with live autocomplete suggestions.
 *
 * Debounces the user's input by 350ms, then calls the OWM Geocoding API
 * to fetch matching cities. Clicking a suggestion triggers `onSearch`.
 */
export default function SearchBar({ onSearch, isLoading }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);

  const wrapperRef = useRef(null);
  const debounceRef = useRef(null);

  /* ── Debounced city search ───────────────── */
  const fetchSuggestions = useCallback(async (text) => {
    if (text.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchCities(text, 5);
      setSuggestions(results);
      setShowDropdown(results.length > 0);
    } catch {
      setSuggestions([]);
      setShowDropdown(false);
    } finally {
      setIsSearching(false);
    }
  }, []);

  /* ── Handle input change with debounce ──── */
  function handleChange(e) {
    const value = e.target.value;
    setQuery(value);
    setActiveIndex(-1);

    // Clear previous debounce
    if (debounceRef.current) clearTimeout(debounceRef.current);

    // Debounce API call by 350ms
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 350);
  }

  /* ── Select a suggestion ────────────────── */
  function selectSuggestion(suggestion) {
    setQuery('');
    setSuggestions([]);
    setShowDropdown(false);
    setActiveIndex(-1);
    onSearch(suggestion.name);
  }

  /* ── Form submit (manual search) ────────── */
  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    // If a suggestion is highlighted, use it
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      selectSuggestion(suggestions[activeIndex]);
      return;
    }

    // Otherwise search by typed text
    setQuery('');
    setSuggestions([]);
    setShowDropdown(false);
    onSearch(trimmed);
  }

  /* ── Keyboard navigation ────────────────── */
  function handleKeyDown(e) {
    if (!showDropdown || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
      setActiveIndex(-1);
    }
  }

  /* ── Close dropdown on outside click ────── */
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* ── Cleanup debounce on unmount ─────────── */
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div className="search-bar-wrapper" ref={wrapperRef}>
      <form className="search-bar" onSubmit={handleSubmit} id="search-bar">
        <div className={`search-input-wrapper ${isFocused ? 'focused' : ''}`}>
          <svg
            className="search-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>

          <input
            id="city-search-input"
            type="text"
            placeholder="Search any city worldwide…"
            value={query}
            onChange={handleChange}
            onFocus={() => {
              setIsFocused(true);
              if (suggestions.length > 0) setShowDropdown(true);
            }}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            autoComplete="off"
            spellCheck="false"
            role="combobox"
            aria-expanded={showDropdown}
            aria-autocomplete="list"
            aria-controls="search-suggestions"
            aria-activedescendant={activeIndex >= 0 ? `suggestion-${activeIndex}` : undefined}
          />

          {/* Inline loading dot for suggestions */}
          {isSearching && (
            <span className="search-typing-indicator">
              <span /><span /><span />
            </span>
          )}

          {query && !isSearching && (
            <button
              type="button"
              className="search-clear"
              onClick={() => {
                setQuery('');
                setSuggestions([]);
                setShowDropdown(false);
              }}
              aria-label="Clear search"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}

          <button
            id="search-submit-btn"
            type="submit"
            disabled={isLoading || !query.trim()}
            className="search-btn"
          >
            {isLoading ? <span className="search-btn-loading" /> : 'Search'}
          </button>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showDropdown && (
        <ul className="search-suggestions" id="search-suggestions" role="listbox">
          {suggestions.map((item, index) => (
            <li
              key={`${item.name}-${item.country}-${item.lat}`}
              id={`suggestion-${index}`}
              className={`suggestion-item ${index === activeIndex ? 'active' : ''}`}
              role="option"
              aria-selected={index === activeIndex}
              onMouseDown={() => selectSuggestion(item)}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <svg className="suggestion-pin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <div className="suggestion-text">
                <span className="suggestion-city">{item.name}</span>
                <span className="suggestion-detail">
                  {item.state ? `${item.state}, ` : ''}{item.country}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
