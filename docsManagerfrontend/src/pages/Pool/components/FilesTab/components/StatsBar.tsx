type Props = { total: number; hasSearch: boolean };

export const StatsBar = ({ total, hasSearch }: Props) => {
  return (
    <div className="files-tab__stats">
      <span>
        {total} fichier{total > 1 ? "s" : ""}
      </span>
      {hasSearch && <span className="files-tab__stats-filter">Recherche active</span>}
    </div>
  );
};
