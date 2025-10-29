import { useState } from "react";
import { useToast } from "../../../../../hooks/useToast";
import { deletePool } from "../../../../../api/poolPageApi";
import type { Pool } from "../../../../../types/models";
import "./DeletePoolModal.css";

interface DeletePoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  pool: Pool;
  onSuccess: () => void;
}

const DeletePoolModal = ({ isOpen, onClose, pool, onSuccess }: DeletePoolModalProps) => {
  const { showSuccess, showError } = useToast();
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  if (!isOpen) return null;

  const isConfirmed = confirmText === pool.name;

  const handleDelete = async () => {
    if (!isConfirmed) return;

    setDeleting(true);

    try {
      await deletePool(pool.id);
      showSuccess("Pool supprimée avec succès");
      onSuccess();
      onClose();
    } catch (error) {
      showError("Erreur lors de la suppression de la pool");
    } finally {
      setDeleting(false);
    }
  };

  const handleClose = () => {
    if (!deleting) {
      setConfirmText("");
      onClose();
    }
  };

  return (
    <div className="delete-pool-modal__overlay" onClick={handleClose}>
      <div
        className="delete-pool-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="delete-pool-modal__header">
          <div className="delete-pool-modal__icon">⚠️</div>
          <h2 className="delete-pool-modal__title">Supprimer la pool</h2>
        </div>

        <div className="delete-pool-modal__content">
          <p className="delete-pool-modal__warning">
            <strong>Attention :</strong> Cette action est irréversible !
          </p>

          <div className="delete-pool-modal__info">
            <p>La suppression de cette pool entraînera :</p>
            <ul className="delete-pool-modal__list">
              <li>❌ La suppression de tous les fichiers</li>
              <li>❌ La suppression de tous les membres</li>
              <li>❌ La perte de toutes les données associées</li>
            </ul>
          </div>

          <div className="delete-pool-modal__confirm-section">
            <label className="delete-pool-modal__label">
              Pour confirmer, tapez le nom de la pool : <strong>{pool.name}</strong>
            </label>
            <input
              type="text"
              className="delete-pool-modal__input"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={`Tapez "${pool.name}"`}
              disabled={deleting}
              autoFocus
            />
          </div>
        </div>

        <div className="delete-pool-modal__actions">
          <button
            type="button"
            className="delete-pool-modal__button delete-pool-modal__button--cancel"
            onClick={handleClose}
            disabled={deleting}
          >
            Annuler
          </button>
          <button
            type="button"
            className="delete-pool-modal__button delete-pool-modal__button--delete"
            onClick={handleDelete}
            disabled={!isConfirmed || deleting}
          >
            {deleting ? (
              <>
                <span className="delete-pool-modal__spinner" />
                Suppression...
              </>
            ) : (
              <>
                🗑️ Supprimer définitivement
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePoolModal;
