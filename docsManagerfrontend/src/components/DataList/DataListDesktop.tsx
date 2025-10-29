import { useMemo, useState } from "react";
import type { DataItem, DataListProps } from "./types";
import "./style.css";

const deburr = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "");

export function DataListDesktop<T extends DataItem>({
  items,
  loading,
  error,
  selectedId,
  onSelect,
  config,
}: DataListProps<T>) {
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    const q = deburr(search).toLowerCase().trim();
    if (!q) return items ?? [];
    return (items ?? []).filter((item) =>
      deburr(config.getSearchText(item)).toLowerCase().includes(q)
    );
  }, [items, search, config]);

  const {
    title,
    searchPlaceholder,
    actionButtonText,
    onActionClick,
    getDisplayText,
    loadingText = "Chargement…",
    emptyText = "Aucun élément disponible.",
    errorText = "Erreur lors du chargement.",
  } = config;

  return (
    <aside className="data-list data-list--sidebar" aria-busy={loading || undefined}>
      <header className="data-list__header">
        <h2 className="data-list__title">{title}</h2>
        <input
          type="text"
          className="data-list__search"
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={loading}
        />
      </header>

      {loading ? (
        <div className="data-list__empty" role="status">
          <span className="data-list__spinner" aria-hidden="true" /> {loadingText}
        </div>
      ) : error ? (
        <p className="data-list__error" role="alert">
          {errorText}
        </p>
      ) : (items ?? []).length === 0 ? (
        <p className="data-list__empty">{emptyText}</p>
      ) : filteredItems.length === 0 ? (
        <p className="data-list__empty">Aucun résultat pour « {search} ».</p>
      ) : (
        <div className="data-list__content">
          <ul className="data-list__items" role="listbox" aria-label={title}>
            {filteredItems.map((item) => (
              <li
                key={item.id}
                className="data-list__item"
                role="option"
                aria-selected={selectedId === item.id}
              >
                <button
                  type="button"
                  className={`data-list__button ${
                    selectedId === item.id ? "data-list__button--selected" : ""
                  }`}
                  onClick={() => onSelect(item.id)}
                  disabled={loading}
                >
                  {getDisplayText(item)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {actionButtonText && onActionClick && (
        <footer className="data-list__footer">
          <button className="data-list__action" onClick={onActionClick}>
            {actionButtonText}
          </button>
        </footer>
      )}
    </aside>
  );
}
