import type { User } from "../../../../../types/models";

type Props = {
  member: User;
  role: string;
  onConfirm: () => void;
  onClose: () => void;
  loading?: boolean;
};

export const RemoveMemberModal = ({ member, role, onConfirm, onClose, loading }: Props) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-content--danger" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header modal-header--danger">
          <h2 className="modal-title">⚠️ Retirer un membre</h2>
          <button
            className="modal-close"
            onClick={onClose}
            title="Fermer"
            type="button"
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-user-preview">
            <div className="modal-user-avatar">
              {member.firstName.charAt(0)}{member.lastName.charAt(0)}
            </div>
            <div className="modal-user-info">
              <div className="modal-user-name">
                {member.firstName} {member.lastName}
              </div>
              <div className="modal-user-email">{member.email}</div>
              <div className="modal-user-current-role">
                Rôle : <strong>{role}</strong>
              </div>
            </div>
          </div>

          <div className="modal-warning">
            <p>
              Êtes-vous sûr de vouloir retirer{" "}
              <strong>{member.firstName} {member.lastName}</strong> de cette pool ?
            </p>
            <p className="modal-warning-text">
              Cette action est irréversible. Le membre perdra l'accès à tous les fichiers et données de la pool.
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            onClick={onClose}
            className="modal-btn modal-btn--secondary"
            disabled={loading}
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="modal-btn modal-btn--danger"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Suppression...
              </>
            ) : (
              "Retirer de la pool"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
