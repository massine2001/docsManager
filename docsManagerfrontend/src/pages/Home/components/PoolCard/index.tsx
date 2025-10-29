import { useNavigate } from "react-router-dom";
import type { Pool } from "../../../../types/models";
import "./style.css";

interface PoolCardProps {
  pool: Pool;
  memberCount?: number;
  fileCount?: number;
  role?: string;
  isPublicView?: boolean; 
}

const PoolCard = ({ pool, memberCount = 0, fileCount = 0, role = "member", isPublicView = false }: PoolCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/pool`);
  };

  const getRoleBadgeClass = () => {
    switch (role.toLowerCase()) {
      case "owner":
        return "pool-card__badge--owner";
      case "admin":
        return "pool-card__badge--admin";
      default:
        return "pool-card__badge--member";
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="pool-card" onClick={handleClick}>
      <div className="pool-card__header">
        <div className="pool-card__icon">📁</div>
        {!isPublicView && (
          <div className={`pool-card__badge ${getRoleBadgeClass()}`}>
            {role}
          </div>
        )}
        {isPublicView && pool.publicAccess && (
          <div className="pool-card__badge pool-card__badge--demo">
            🎯 Démo
          </div>
        )}
      </div>

      <div className="pool-card__content">
        <h3 className="pool-card__title">{pool.name}</h3>
        <p className="pool-card__description">
          {pool.description || "Aucune description"}
        </p>
      </div>

      <div className="pool-card__stats">
        {/* Masquer le nombre de membres en mode public */}
        {!isPublicView && (
          <div className="pool-card__stat">
            <span className="pool-card__stat-icon">👥</span>
            <span className="pool-card__stat-value">{memberCount}</span>
            <span className="pool-card__stat-label">membres</span>
          </div>
        )}
        <div className="pool-card__stat">
          <span className="pool-card__stat-icon">📄</span>
          <span className="pool-card__stat-value">{fileCount}</span>
          <span className="pool-card__stat-label">fichiers</span>
        </div>
      </div>

      <div className="pool-card__footer">
        <span className="pool-card__date">
          Créée le {formatDate(pool.createdAt)}
        </span>
        <button className="pool-card__button">
          {isPublicView ? "Explorer →" : "Accéder →"}
        </button>
      </div>
    </div>
  );
};

export default PoolCard;
