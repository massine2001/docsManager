import { useState } from "react";

type Props = {
  emailList: string[];
  onAddEmail: (email: string) => void;
  onRemoveEmail: (email: string) => void;
  onClearAll: () => void;
};

const EmailInputSection = ({ emailList, onAddEmail, onRemoveEmail, onClearAll }: Props) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setEmailError("");
  };

  const handleAddEmail = () => {
    if (!email.trim()) {
      setEmailError("Veuillez saisir une adresse email");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Adresse email invalide");
      return;
    }

    if (emailList.includes(email)) {
      setEmailError("Cette adresse a déjà été ajoutée");
      return;
    }

    onAddEmail(email);
    setEmail("");
    setEmailError("");
  };

  return (
    <div className="invitation-tab__section">
      <h3 className="invitation-tab__section-title">📧 Adresses email</h3>
      
      <div className="invitation-tab__email-input-group">
        <div className="invitation-tab__input-wrapper">
          <input
            type="email"
            className={`invitation-tab__input ${emailError ? 'invitation-tab__input--error' : ''}`}
            placeholder="exemple@email.com"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddEmail()}
          />
          {emailError && (
            <span className="invitation-tab__error-message">{emailError}</span>
          )}
        </div>
        
        <button
          className="invitation-tab__btn invitation-tab__btn--primary"
          onClick={handleAddEmail}
          disabled={!email.trim()}
        >
          ➕ Ajouter
        </button>
      </div>

      {emailList.length > 0 && (
        <div className="invitation-tab__email-list">
          <div className="invitation-tab__email-list-header">
            <span>{emailList.length} adresse(s) ajoutée(s)</span>
            <button
              className="invitation-tab__btn-link"
              onClick={onClearAll}
            >
              Tout supprimer
            </button>
          </div>
          
          <div className="invitation-tab__email-chips">
            {emailList.map((email, index) => (
              <div key={index} className="invitation-tab__email-chip">
                <span className="invitation-tab__email-chip-text">{email}</span>
                <button
                  className="invitation-tab__email-chip-remove"
                  onClick={() => onRemoveEmail(email)}
                  title="Retirer"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailInputSection;
