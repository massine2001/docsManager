type Props = {
  searchTerm: string;
  onSearchChange: (v: string) => void;
  roleFilter: string;
  onRoleFilterChange: (role: string) => void;
  totalMembers: number;
};

export const HeaderBar = ({ 
  searchTerm, 
  onSearchChange, 
  roleFilter, 
  onRoleFilterChange, 
  totalMembers,
}: Props) => {
  const roles = ["Tous", "Admin", "Member"];

  return (
    <div className="members-tab__header">
      <input
        type="text"
        className="members-tab__search"
        placeholder="Rechercher un membre..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <div className="members-tab__filters">
        <label className="members-tab__filter-label">Rôle :</label>
        <div className="members-tab__radio-group">
          {roles.map((role) => (
            <label
              key={role}
              className={`members-tab__radio ${roleFilter === role ? "members-tab__radio--active" : ""}`}
            >
              <input
                type="radio"
                name="roleFilter"
                value={role}
                checked={roleFilter === role}
                onChange={() => onRoleFilterChange(role)}
              />
              <span>{role}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="members-tab__stats-inline">
        {totalMembers} membre{totalMembers > 1 ? "s" : ""}
        {searchTerm && <span className="members-tab__stats-badge">🔍</span>}
      </div>

    </div>
  );
};
