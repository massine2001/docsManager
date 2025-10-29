import { useState } from "react";
import { useToast } from "../../../../hooks/useToast";
import { updateUser } from "../../../../api/userPageApi";
import type { User } from "../../../../types/models";
import './style.css';

interface ProfileInfoProps {
  user: User;
}

const ProfileInfo = ({ user }: ProfileInfoProps) => {
  const { showSuccess, showError } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateUser(user.id, formData);
      showSuccess("Profil mis à jour avec succès !");
      setIsEditing(false);
      
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      showError("Erreur lors de la mise à jour du profil");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
    setIsEditing(false);
  };

  return (
    <div className="profile-info">
      <div className="profile-info-header">
        <h2>Informations personnelles</h2>
        {!isEditing && (
          <button
            className="btn-edit"
            onClick={() => setIsEditing(true)}
          >
            ✏️ Modifier
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="firstName">Prénom</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Nom</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              disabled
              required
            />
          </div>

          <div className="form-group full-width">
            <label>Rôle</label>
            <input
              type="text"
              value={user.role}
              disabled
              className="disabled-input"
            />
            <small className="form-hint">
              Le rôle ne peut pas être modifié
            </small>
          </div>

          <div className="form-group full-width">
            <label>Membre depuis</label>
            <input
              type="text"
              value={user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : 'Date inconnue'}
              disabled
              className="disabled-input"
            />
          </div>
        </div>

        {isEditing && (
          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={handleCancel}
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn-save"
              disabled={loading}
            >
              {loading ? "Enregistrement..." : "💾 Enregistrer"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ProfileInfo;
