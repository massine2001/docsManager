import { useState } from "react";

type Props = {
  message: string;
  poolName: string;
  onMessageChange: (message: string) => void;
  onReset: () => void;
};

const MessageEditor = ({ message, poolName, onMessageChange, onReset }: Props) => {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="invitation-tab__section">
      <div className="invitation-tab__section-header">
        <h3 className="invitation-tab__section-title">✏️ Message d'invitation</h3>
        <div className="invitation-tab__section-actions">
          <button
            className="invitation-tab__btn-link"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? 'Éditer' : 'Prévisualiser'}
          </button>
          <button
            className="invitation-tab__btn-link"
            onClick={onReset}
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {showPreview ? (
        <div className="invitation-tab__preview">
          <div className="invitation-tab__preview-header">
            <strong>Sujet :</strong> Invitation à rejoindre {poolName}
          </div>
          <div className="invitation-tab__preview-body">
            {message.split('\n').map((line, index) => (
              <p key={index}>{line || <br />}</p>
            ))}
          </div>
        </div>
      ) : (
        <textarea
          className="invitation-tab__textarea"
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          rows={15}
          placeholder="Personnalisez votre message d'invitation..."
        />
      )}

      <div className="invitation-tab__hint">
        💡 Le lien d'invitation sera généré automatiquement pour chaque destinataire
      </div>
    </div>
  );
};

export default MessageEditor;
