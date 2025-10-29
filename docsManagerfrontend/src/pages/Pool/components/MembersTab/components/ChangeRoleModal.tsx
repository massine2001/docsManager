import { useState } from "react";
import type { User } from "../../../../../types/models";

type Props = {
  member: User;
  currentRole: string;
  onChangeRole: (newRole: string) => void;
  onClose: () => void;
  loading?: boolean;
};

export const ChangeRoleModal = ({ member, currentRole, onChangeRole, onClose, loading }: Props) => {
  const [selectedRole, setSelectedRole] = useState(currentRole);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onChangeRole(selectedRole);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">✏️ Modifier le rôle</h2>
          <button
            className="modal-close"
            onClick={onClose}
            title="Fermer"
            type="button"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
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
                  Rôle actuel : <strong>{currentRole}</strong>
                </div>
              </div>
            </div>

            <div className="modal-field">
              <label className="modal-label">Nouveau rôle *</label>
              <div className="modal-radio-group">
                {["Admin", "Moderator", "Member"].map((role) => (
                  <label 
                    key={role} 
                    className={`modal-radio-option ${selectedRole === role ? 'modal-radio-option--active' : ''}`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role}
                      checked={selectedRole === role}
                      onChange={(e) => setSelectedRole(e.target.value)}
                    />
                    <span>{role}</span>
                    {role === currentRole && <span className="modal-radio-current">(actuel)</span>}
                  </label>
                ))}
              </div>
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
              type="submit"
              className="modal-btn modal-btn--primary"
              disabled={selectedRole === currentRole || loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Modification...
                </>
              ) : (
                "Modifier le rôle"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
