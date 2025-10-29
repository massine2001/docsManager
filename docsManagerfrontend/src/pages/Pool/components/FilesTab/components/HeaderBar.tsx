import type { GroupingType } from "..";

type Props = {
  searchTerm: string;
  onSearchChange: (v: string) => void;
  grouping: GroupingType;
  onGroupingChange: (g: GroupingType) => void;
  totalFiles: number;
};

export const HeaderBar = ({ searchTerm, onSearchChange, grouping, onGroupingChange, totalFiles }: Props) => {
  return (
    <div className="files-tab__header">
      <input
        type="text"
        className="files-tab__search"
        placeholder="Rechercher un fichier..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <div className="files-tab__filters">
        <label className="files-tab__filter-label">Grouper par :</label>
        <div className="files-tab__radio-group">
          {(["date", "member", "extension"] as GroupingType[]).map((value) => (
            <label
              key={value}
              className={`files-tab__radio ${grouping === value ? "files-tab__radio--active" : ""}`}
            >
              <input
                type="radio"
                name="grouping"
                value={value}
                checked={grouping === value}
                onChange={() => onGroupingChange(value)}
              />
              <span>
                {value === "date" ? "Date" : value === "member" ? "Membre" : "Extension"}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="files-tab__stats-inline">
        {totalFiles} fichier{totalFiles > 1 ? "s" : ""}
        {searchTerm && <span className="files-tab__stats-badge">🔍</span>}
      </div>
    </div>
  );
};
