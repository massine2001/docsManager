import { memo } from "react";
import type { File } from "../../../../../types/models";
import { formatDate, getExt } from "../utils/format";

type Props = {
  file: File;
  onClose: () => void;
};

export const DetailsModal = memo(({ file, onClose }: Props) => {
  const ext = getExt(file.name) || "Aucune";

  return (
    <div className="details-modal-overlay" onClick={onClose}>
      <div className="details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="details-modal__header">
          <h2 className="details-modal__title">📋 Détails du fichier</h2>
          <button
            className="details-modal__close"
            onClick={onClose}
            title="Fermer"
          >
            ✕
          </button>
        </div>

        <div className="details-modal__content">
          <div className="details-modal__section">
            <h3 className="details-modal__section-title">📄 Informations générales</h3>
            
            <div className="details-modal__field">
              <span className="details-modal__label">Nom</span>
              <span className="details-modal__value">{file.name}</span>
            </div>

            <div className="details-modal__field">
              <span className="details-modal__label">Extension</span>
              <span className="details-modal__value details-modal__extension">{ext}</span>
            </div>

            {file.description && (
              <div className="details-modal__field">
                <span className="details-modal__label">Description</span>
                <span className="details-modal__value">{file.description}</span>
              </div>
            )}

          </div>

          <div className="details-modal__section">
            <h3 className="details-modal__section-title">👤 Auteur</h3>
            
            {file.userUploader ? (
              <>
                <div className="details-modal__field">
                  <span className="details-modal__label">Nom complet</span>
                  <span className="details-modal__value">
                    {file.userUploader.firstName} {file.userUploader.lastName}
                  </span>
                </div>

                {file.userUploader.email && (
                  <div className="details-modal__field">
                    <span className="details-modal__label">Email</span>
                    <span className="details-modal__value">{file.userUploader.email}</span>
                  </div>
                )}

                {file.userUploader.role && (
                  <div className="details-modal__field">
                    <span className="details-modal__label">Rôle</span>
                    <span className="details-modal__value">{file.userUploader.role}</span>
                  </div>
                )}
              </>
            ) : (
              <div className="details-modal__field">
                <span className="details-modal__value">Information non disponible</span>
              </div>
            )}
          </div>

          <div className="details-modal__section">
            <h3 className="details-modal__section-title">📅 Dates</h3>
            
            <div className="details-modal__field">
              <span className="details-modal__label">Date de création</span>
              <span className="details-modal__value">{formatDate(file.createdAt)}</span>
            </div>

            {file.expirationDate && (
              <div className="details-modal__field">
                <span className="details-modal__label">Date d'expiration</span>
                <span className="details-modal__value details-modal__expiration">
                  {formatDate(file.expirationDate)}
                </span>
              </div>
            )}
          </div>

          {file.pool?.name && (
            <div className="details-modal__section">
              <h3 className="details-modal__section-title">Pool</h3>
              
              <div className="details-modal__field">
                <span className="details-modal__label">Nom</span>
                <span className="details-modal__value">{file.pool.name}</span>
              </div>

              {file.pool.description && (
                <div className="details-modal__field">
                  <span className="details-modal__label">Description</span>
                  <span className="details-modal__value">{file.pool.description}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

DetailsModal.displayName = "DetailsModal";
