import { useState, useEffect } from "react";
import { useToast } from "../../../../../hooks/useToast";
import { updatePool } from "../../../../../api/poolPageApi";
import type { Pool } from "../../../../../types/models";
import "./EditPoolModal.css";

interface EditPoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  pool: Pool;
  onSuccess: () => void;
}

const EditPoolModal = ({ isOpen, onClose, pool, onSuccess }: EditPoolModalProps) => {
  const { showSuccess, showError } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: pool.name,
        description: pool.description || "",
      });
      setFormErrors({});
    }
  }, [isOpen, pool]);

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setFormErrors({ ...formErrors, [field]: "" });
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Le nom de la pool est requis";
    } else if (formData.name.length < 3) {
      errors.name = "Le nom doit contenir au moins 3 caractères";
    } else if (formData.name.length > 100) {
      errors.name = "Le nom ne peut pas dépasser 100 caractères";
    }

    if (formData.description.length > 500) {
      errors.description = "La description ne peut pas dépasser 500 caractères";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      await updatePool(pool.id, {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
      });

      showSuccess("Pool modifiée avec succès !");
      onSuccess();
      onClose();
    } catch (error) {
      showError("Erreur lors de la modification de la pool");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      onClose();
    }
  };

  return (
    <div className="edit-pool-modal__overlay" onClick={handleClose}>
      <div
        className="edit-pool-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="edit-pool-modal__header">
          <h2 className="edit-pool-modal__title">⚙️ Modifier la pool</h2>
          <button
            className="edit-pool-modal__close"
            onClick={handleClose}
            disabled={submitting}
          >
            ✕
          </button>
        </div>

        <form className="edit-pool-modal__form" onSubmit={handleSubmit}>
          <div className="edit-pool-modal__form-group">
            <label className="edit-pool-modal__label">
              Nom de la pool <span className="edit-pool-modal__required">*</span>
            </label>
            <input
              type="text"
              className={`edit-pool-modal__input ${
                formErrors.name ? "edit-pool-modal__input--error" : ""
              }`}
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Nom de la pool"
              disabled={submitting}
              autoFocus
            />
            {formErrors.name && (
              <span className="edit-pool-modal__error-message">
                {formErrors.name}
              </span>
            )}
          </div>

          <div className="edit-pool-modal__form-group">
            <label className="edit-pool-modal__label">
              Description (optionnel)
            </label>
            <textarea
              className={`edit-pool-modal__textarea ${
                formErrors.description ? "edit-pool-modal__input--error" : ""
              }`}
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Description de la pool..."
              disabled={submitting}
              rows={4}
            />
            {formErrors.description && (
              <span className="edit-pool-modal__error-message">
                {formErrors.description}
              </span>
            )}
            <span className="edit-pool-modal__helper">
              {formData.description.length}/500 caractères
            </span>
          </div>

          <div className="edit-pool-modal__actions">
            <button
              type="button"
              className="edit-pool-modal__button edit-pool-modal__button--cancel"
              onClick={handleClose}
              disabled={submitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="edit-pool-modal__button edit-pool-modal__button--submit"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="edit-pool-modal__spinner" />
                  Modification...
                </>
              ) : (
                "Enregistrer"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPoolModal;
