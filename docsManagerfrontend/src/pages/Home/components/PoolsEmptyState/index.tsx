import "./style.css";

interface EmptyStateProps {
  onCreatePool: () => void;
}

const EmptyState = ({ onCreatePool }: EmptyStateProps) => {
  return (
    <div className="pool-empty-state">
      <div className="pool-empty-state__icon">📁</div>
      <h2 className="pool-empty-state__title">Aucune pool pour le moment</h2>
      <p className="pool-empty-state__description">
        Créez votre première pool pour commencer à collaborer et partager des
        fichiers avec votre équipe.
      </p>
      <button
        className="pool-empty-state__button"
        onClick={onCreatePool}
      >
        ✨ Créer ma première pool
      </button>

      <div className="pool-empty-state__features">
        <div className="pool-empty-state__feature">
          <span className="pool-empty-state__feature-icon">👥</span>
          <span className="pool-empty-state__feature-text">
            Invitez des membres
          </span>
        </div>
        <div className="pool-empty-state__feature">
          <span className="pool-empty-state__feature-icon">📄</span>
          <span className="pool-empty-state__feature-text">
            Partagez des fichiers
          </span>
        </div>
        <div className="pool-empty-state__feature">
          <span className="pool-empty-state__feature-icon">🔒</span>
          <span className="pool-empty-state__feature-text">
            Gérez les accès
          </span>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
