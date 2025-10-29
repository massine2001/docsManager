import { useState } from "react";
import { useToast } from "../../../../hooks/useToast";
import { useAuth } from "../../../../hooks/useAuth";
import { createPool } from "../../../../api/poolPageApi";
import "./style.css";

interface CreatePoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreatePoolModal = ({ isOpen, onClose, onSuccess }: CreatePoolModalProps) => {
  const { showSuccess, showError } = useToast();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

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
      await createPool({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        createdBy: user?.id || 0,
      });

      showSuccess("Pool créée avec succès !");
      setFormData({ name: "", description: "" });
      onSuccess();
      onClose();
    } catch (error) {
      showError("Erreur lors de la création de la pool");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      setFormData({ name: "", description: "" });
      setFormErrors({});
      onClose();
    }
  };

  return (
    <div className="create-pool-modal__overlay" onClick={handleClose}>
      <div
        className="create-pool-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="create-pool-modal__header">
          <h2 className="create-pool-modal__title">📁 Créer une nouvelle pool</h2>
          <button
            className="create-pool-modal__close"
            onClick={handleClose}
            disabled={submitting}
          >
            ✕
          </button>
        </div>

        <form className="create-pool-modal__form" onSubmit={handleSubmit}>
          <div className="create-pool-modal__form-group">
            <label className="create-pool-modal__label">
              Nom de la pool <span className="create-pool-modal__required">*</span>
            </label>
            <input
              type="text"
              className={`create-pool-modal__input ${
                formErrors.name ? "create-pool-modal__input--error" : ""
              }`}
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Ex: Équipe Marketing 2024"
              disabled={submitting}
              autoFocus
            />
            {formErrors.name && (
              <span className="create-pool-modal__error-message">
                {formErrors.name}
              </span>
            )}
          </div>

          <div className="create-pool-modal__form-group">
            <label className="create-pool-modal__label">
              Description (optionnel)
            </label>
            <textarea
              className={`create-pool-modal__textarea ${
                formErrors.description ? "create-pool-modal__input--error" : ""
              }`}
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Décrivez brièvement l'objectif de cette pool..."
              disabled={submitting}
              rows={4}
            />
            {formErrors.description && (
              <span className="create-pool-modal__error-message">
                {formErrors.description}
              </span>
            )}
            <span className="create-pool-modal__helper">
              {formData.description.length}/500 caractères
            </span>
          </div>

          <div className="create-pool-modal__actions">
            <button
              type="button"
              className="create-pool-modal__button create-pool-modal__button--cancel"
              onClick={handleClose}
              disabled={submitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="create-pool-modal__button create-pool-modal__button--submit"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="create-pool-modal__spinner" />
                  Création...
                </>
              ) : (
                "Créer la pool"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePoolModal;
