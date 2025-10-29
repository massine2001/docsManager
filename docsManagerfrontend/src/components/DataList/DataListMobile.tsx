import { useMemo, useRef, useState, useEffect } from "react";
import type { DataItem, DataListProps } from "./types";
import "./style.css";

const deburr = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "");

export function DataListMobile<T extends DataItem>({
  items,
  loading,
  error,
  selectedId,
  onSelect,
  config,
}: DataListProps<T>) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const selectedItem = useMemo(
    () => ((items ?? []).find((item) => item.id === selectedId)) ?? null,
    [items, selectedId]
  );

  useEffect(() => {
    if (selectedItem) setQuery(config.getDisplayText(selectedItem));
  }, [selectedItem, config]);

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
        setIsSearching(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [open]);

  const filtered = useMemo(() => {
    const q = deburr(query).toLowerCase().trim();
    if (!q) return items ?? [];
    return (items ?? []).filter((item) =>
      deburr(config.getSearchText(item)).toLowerCase().includes(q)
    );
  }, [items, query, config]);

  const {
    searchPlaceholder,
    loadingText = "Chargement…",
    emptyText = "Aucun élément disponible.",
    errorText = "Erreur lors du chargement.",
    getDisplayText,
  } = config;

  const toggleOpen = () => {
    setOpen(!open);
    setIsSearching(false);
  };

  const startSearch = () => {
    setIsSearching(true);
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const stopSearch = () => {
    setIsSearching(false);
    setQuery("");
    inputRef.current?.blur();
  };

  return (
    <aside aria-busy={loading || undefined}>
      <div className="mselect__combobox" ref={containerRef}>
        <div
          className={`mselect__control ${open ? "is-open" : ""}`}
          role="combobox"
          aria-haspopup="listbox"
          aria-owns="data-options"
          aria-expanded={open}
        >
          <div
            className="mselect__value"
            onClick={toggleOpen}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleOpen();
              }
            }}
          >
            {selectedItem ? getDisplayText(selectedItem) : searchPlaceholder}
          </div>

          <input
            id="data-combobox"
            ref={inputRef}
            type="text"
            className={`mselect__input ${isSearching ? 'is-active' : ''}`}
            placeholder={loading ? loadingText : "Rechercher..."}
            aria-autocomplete="list"
            aria-controls="data-options"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!open) setOpen(true);
            }}
            onFocus={() => {
              if (!open) setOpen(true);
            }}
            onBlur={() => {
              
            }}
            disabled={loading}
            readOnly={!isSearching}
          />

          <div className="mselect__buttons">
            {!isSearching ? (
              <>
                <button
                  type="button"
                  className="mselect__toggle"
                  aria-label={open ? "Fermer la liste" : "Ouvrir la liste"}
                  onClick={toggleOpen}
                  disabled={loading}
                >
                  <span className={`mselect__arrow ${open ? 'is-open' : ''}`}>▼</span>
                </button>

                <button
                  type="button"
                  className="mselect__search-btn"
                  aria-label="Activer la recherche"
                  onClick={startSearch}
                  disabled={loading}
                >
                  🔍
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="mselect__stop-search"
                  aria-label="Arrêter la recherche"
                  onClick={stopSearch}
                >
                  ✕
                </button>
              </>
            )}

            {selectedItem && !isSearching && (
              <button
                type="button"
                className="mselect__clear"
                aria-label="Effacer la sélection"
                onClick={() => {
                  onSelect(null);
                  setQuery("");
                }}
              >
                ×
              </button>
            )}
          </div>
        </div>

        {open && (
          <>
            {loading ? (
              <div className="mselect__status" role="status">
                <span className="mselect__spinner" aria-hidden="true" /> {loadingText}
              </div>
            ) : error ? (
              <p className="mselect__error" role="alert">
                {errorText}
              </p>
            ) : (items ?? []).length === 0 ? (
              <p className="mselect__empty">{emptyText}</p>
            ) : filtered.length === 0 ? (
              <p className="mselect__empty">Aucun résultat pour « {query} ».</p>
            ) : (
              <ul id="data-options" className="mselect__list" role="listbox">
                {filtered.map((item) => (
                  <li
                    key={item.id}
                    role="option"
                    aria-selected={selectedId === item.id}
                    className={`mselect__option ${
                      selectedId === item.id ? "is-selected" : ""
                    }`}
                    onClick={() => {
                      onSelect(item.id);
                      setQuery(getDisplayText(item));
                      setOpen(false);
                      setIsSearching(false);
                    }}
                  >
                    {getDisplayText(item)}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </aside>
  );
}
