import { useState, useEffect } from "react";
import { useToast } from "../../../../hooks/useToast";
import { Toast } from "../../../../components/Toast";
import { DEFAULT_EMAIL_TEMPLATE, generateInvitationLink } from "./constants";
import { useSendInvitations } from "./hooks/useSendInvitations";
import EmailInputSection from "./components/EmailInputSection";
import MessageEditor from "./components/MessageEditor";
import SendModal from "./components/SendModal";
import "./style.css";

type Props = {
  poolId: number;
  poolName: string;
  currentUserName: string;
  isPublicView?: boolean;
};

const InvitationTab = ({ poolId, poolName, currentUserName, isPublicView = false }: Props) => {
  const { toast, showSuccess, showError, hideToast } = useToast();
  
  const [emailList, setEmailList] = useState<string[]>([]);
  const [emailMessage, setEmailMessage] = useState("");
  const [showSendModal, setShowSendModal] = useState(false);

  useEffect(() => {
    const initTemplate = async () => {
      try {
        const sampleLink = await generateInvitationLink(poolId, "exemple@email.com");
        setEmailMessage(DEFAULT_EMAIL_TEMPLATE(poolName, currentUserName, sampleLink));
      } catch (error) {
        setEmailMessage(DEFAULT_EMAIL_TEMPLATE(poolName, currentUserName, "https://..."));
      }
    };
    initTemplate();
  }, [poolId, poolName, currentUserName]);

  const { copyToClipboard, openGmail, openMailClient, downloadAsFile } = useSendInvitations({
    poolId,
    poolName,
    emailMessage,
  });

  const handleSendMethod = async (method: () => Promise<boolean> | boolean) => {
    const result = await method();
    if (result) {
      setShowSendModal(false);
      setEmailList([]);
    }
  };

  const handleAddEmail = (email: string) => {
    setEmailList([...emailList, email]);
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setEmailList(emailList.filter(e => e !== emailToRemove));
  };

  const handleResetTemplate = async () => {
    try {
      const sampleLink = await generateInvitationLink(poolId, "exemple@email.com");
      setEmailMessage(DEFAULT_EMAIL_TEMPLATE(poolName, currentUserName, sampleLink));
      showSuccess("Template réinitialisé");
    } catch (error) {
      showError("Erreur lors de la réinitialisation du template");
    }
  };

  const handleSendInvitations = () => {
    if (emailList.length === 0) {
      showError("Veuillez ajouter au moins une adresse email");
      return;
    }
    setShowSendModal(true);
  };

  const handleReset = () => {
    setEmailList([]);
    setEmailMessage(DEFAULT_EMAIL_TEMPLATE(poolName, currentUserName, ""));
  };

  return (
    <div className="invitation-tab">
      {isPublicView && (
        <div className="invitation-tab__public-banner">
          <span style={{ fontSize: '2rem' }}>🎯</span>
          <div>
            <strong>Mode démonstration</strong>
            <p>Les invitations sont désactivées en mode public.</p>
          </div>
        </div>
      )}

      <div className="invitation-tab__header">
        <h2 className="invitation-tab__title">✉️ Inviter des membres</h2>
        <p className="invitation-tab__subtitle">
          Invitez de nouvelles personnes à rejoindre <strong>{poolName}</strong>
        </p>
      </div>

      <div className="invitation-tab__content">
        <EmailInputSection
          emailList={emailList}
          onAddEmail={handleAddEmail}
          onRemoveEmail={handleRemoveEmail}
          onClearAll={() => setEmailList([])}
        />

        <MessageEditor
          message={emailMessage}
          poolName={poolName}
          onMessageChange={setEmailMessage}
          onReset={handleResetTemplate}
        />

        <div className="invitation-tab__actions">
          <button
            className="invitation-tab__btn invitation-tab__btn--secondary"
            onClick={handleReset}
            disabled={isPublicView}
          >
            Annuler
          </button>
          
          <button
            className="invitation-tab__btn invitation-tab__btn--success"
            onClick={handleSendInvitations}
            disabled={emailList.length === 0 || isPublicView}
            style={isPublicView ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
          >
            ✉️ Envoyer {emailList.length > 0 ? `(${emailList.length})` : ''}
          </button>
        </div>


        <div className="invitation-tab__note">
          <strong>ℹ️ Note :</strong> Choisissez la méthode d'envoi qui vous convient le mieux parmi les options proposées.
        </div>
      </div>

      <SendModal
        isOpen={showSendModal}
        emailCount={emailList.length}
        onClose={() => setShowSendModal(false)}
        onCopyToClipboard={() => handleSendMethod(() => copyToClipboard(emailList))}
        onOpenGmail={() => handleSendMethod(() => openGmail(emailList))}
        onOpenMailClient={() => handleSendMethod(() => openMailClient(emailList))}
        onDownloadAsFile={() => handleSendMethod(() => downloadAsFile(emailList))}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>
  );
};

export default InvitationTab;
