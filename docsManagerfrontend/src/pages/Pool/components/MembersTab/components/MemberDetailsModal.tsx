import { memo } from "react";
import type { User } from "../../../../../types/models";

type Props = {
  member: User;
  role?: string;
  onClose: () => void;
};

export const MemberDetailsModal = memo(({ member, role, onClose }: Props) => {
  return (
    <div className="member-details-overlay" onClick={onClose}>
      <div className="member-details" onClick={(e) => e.stopPropagation()}>
        <div className="member-details__header">
          <h2 className="member-details__title">👤 Profil du membre</h2>
          <button
            className="member-details__close"
            onClick={onClose}
            title="Fermer"
          >
            ✕
          </button>
        </div>

        <div className="member-details__content">
          <div className="member-details__avatar-section">
            <div className="member-details__avatar-large">
              {member.firstName.charAt(0)}{member.lastName.charAt(0)}
            </div>
            <h3 className="member-details__name">
              {member.firstName} {member.lastName}
            </h3>
            {role && (
              <span className="member-details__role-badge">{role}</span>
            )}
          </div>

          <div className="member-details__section">
            <h3 className="member-details__section-title">Informations de contact</h3>
            
            <div className="member-details__field">
              <span className="member-details__label">Email</span>
              <span className="member-details__value">{member.email}</span>
            </div>
          </div>

          {role && (
            <div className="member-details__section">
              <h3 className="member-details__section-title">Dans cette pool</h3>
              
              <div className="member-details__field">
                <span className="member-details__label">Rôle dans la pool</span>
                <span className="member-details__value">{role}</span>
              </div>
            </div>
          )}

          {member.createdAt && (
            <div className="member-details__section">
              <h3 className="member-details__section-title">Dates</h3>
              
              <div className="member-details__field">
                <span className="member-details__label">Membre depuis</span>
                <span className="member-details__value">
                  {new Date(member.createdAt).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

MemberDetailsModal.displayName = "MemberDetailsModal";
