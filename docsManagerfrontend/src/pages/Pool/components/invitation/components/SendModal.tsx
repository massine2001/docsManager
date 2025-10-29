type Props = {
  isOpen: boolean;
  emailCount: number;
  onClose: () => void;
  onCopyToClipboard: () => void;
  onOpenGmail: () => void;
  onOpenMailClient: () => void;
  onDownloadAsFile: () => void;
};

const SendModal = ({
  isOpen,
  emailCount,
  onClose,
  onCopyToClipboard,
  onOpenGmail,
  onOpenMailClient,
  onDownloadAsFile,
}: Props) => {
  if (!isOpen) return null;

  return (
    <div className="send-modal-overlay" onClick={onClose}>
      <div className="send-modal" onClick={(e) => e.stopPropagation()}>
        <div className="send-modal__header">
          <h3 className="send-modal__title">📤 Comment souhaitez-vous envoyer les invitations ?</h3>
          <button className="send-modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="send-modal__content">
          <p className="send-modal__subtitle">
            {emailCount} invitation(s) prête(s) à être envoyée(s)
          </p>

          <div className="send-modal__options">
            <button className="send-modal__option" onClick={onCopyToClipboard}>
              <div className="send-modal__option-icon">📋</div>
              <div className="send-modal__option-content">
                <h4 className="send-modal__option-title">Copier dans le presse-papier</h4>
                <p className="send-modal__option-desc">
                  Copiez les invitations et collez-les dans votre messagerie préférée
                </p>
                <span className="send-modal__option-badge">Recommandé</span>
              </div>
            </button>

            <button className="send-modal__option" onClick={onOpenGmail}>
              <div className="send-modal__option-icon">✉️</div>
              <div className="send-modal__option-content">
                <h4 className="send-modal__option-title">Ouvrir Gmail Web</h4>
                <p className="send-modal__option-desc">
                  Ouvre Gmail dans votre navigateur avec les messages pré-remplis
                </p>
              </div>
            </button>

            <button className="send-modal__option" onClick={onOpenMailClient}>
              <div className="send-modal__option-icon">💻</div>
              <div className="send-modal__option-content">
                <h4 className="send-modal__option-title">Ouvrir mon client mail</h4>
                <p className="send-modal__option-desc">
                  Utilise votre application de messagerie par défaut (Outlook, Mail, etc.)
                </p>
              </div>
            </button>

            <button className="send-modal__option" onClick={onDownloadAsFile}>
              <div className="send-modal__option-icon">💾</div>
              <div className="send-modal__option-content">
                <h4 className="send-modal__option-title">Télécharger un fichier</h4>
                <p className="send-modal__option-desc">
                  Enregistre les invitations dans un fichier texte pour usage ultérieur
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendModal;
