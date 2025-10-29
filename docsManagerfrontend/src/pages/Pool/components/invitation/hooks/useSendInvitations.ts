import { useToast } from "../../../../../hooks/useToast";
import { generateInvitationLink } from "../constants";

type InvitationData = {
  email: string;
  link: string;
  message: string;
  subject: string;
};

type UseSendInvitationsProps = {
  poolId: number;
  poolName: string;
  emailMessage: string;
};

export const useSendInvitations = ({ poolId, poolName, emailMessage }: UseSendInvitationsProps) => {
  const { showSuccess, showError } = useToast();

  const prepareInvitations = async (emailList: string[]): Promise<InvitationData[]> => {
    const invitations = await Promise.all(
      emailList.map(async recipientEmail => {
        try {
          const link = await generateInvitationLink(poolId, recipientEmail);
          const message = emailMessage.replace(
            /https?:\/\/[^\s]+/g,
            link
          );
          
          return {
            email: recipientEmail,
            link,
            message,
            subject: `Invitation à rejoindre ${poolName}`
          };
        } catch (error) {
          showError(`Erreur pour ${recipientEmail}: impossible de générer le lien`);
          throw error;
        }
      })
    );
    return invitations;
  };

  const copyToClipboard = async (emailList: string[]): Promise<boolean> => {
    try {
      const invitationsData = await prepareInvitations(emailList);
      
      const summary = invitationsData.map(inv => `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 Destinataire : ${inv.email}
🔗 Lien d'invitation : ${inv.link}

📨 Message à envoyer :
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sujet : ${inv.subject}

${inv.message}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `).join('\n\n');

      await navigator.clipboard.writeText(summary);
      showSuccess(`${emailList.length} invitation(s) copiée(s) ! Collez-les dans votre messagerie préférée`);
      return true;
    } catch (error) {
      showError("Erreur lors de la copie");
      return false;
    }
  };

  const openGmail = async (emailList: string[]): Promise<boolean> => {
    try {
      const invitationsData = await prepareInvitations(emailList);
      
      if (invitationsData.length === 1) {
        const inv = invitationsData[0];
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(inv.email)}&su=${encodeURIComponent(inv.subject)}&body=${encodeURIComponent(inv.message)}`;
        window.open(gmailUrl, '_blank');
        
        showSuccess("Gmail ouvert dans un nouvel onglet");
        return true;
      } else {
        if (confirm(`ℹ️ Vous avez ${invitationsData.length} invitations.\n\nGmail va s'ouvrir dans ${invitationsData.length} onglets différents.\n\nSi vous préférez une méthode plus simple, utilisez "Copier dans le presse-papier".\n\nContinuer avec Gmail ?`)) {
          invitationsData.forEach((inv, index) => {
            setTimeout(() => {
              const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(inv.email)}&su=${encodeURIComponent(inv.subject)}&body=${encodeURIComponent(inv.message)}`;
              window.open(gmailUrl, '_blank');
            }, index * 700);
          });

          showSuccess(`${emailList.length} onglet(s) Gmail ouvert(s)`);
          return true;
        }
        return false;
      }
    } catch (error) {
      showError("Erreur lors de l'ouverture de Gmail");
      return false;
    }
  };

  const openMailClient = async (emailList: string[]): Promise<boolean> => {
    try {
      const invitationsData = await prepareInvitations(emailList);
      
      if (invitationsData.length === 1) {
        const inv = invitationsData[0];
        const mailtoLink = `mailto:${inv.email}?subject=${encodeURIComponent(inv.subject)}&body=${encodeURIComponent(inv.message)}`;
        window.open(mailtoLink, '_blank');
        
        showSuccess("Client mail ouvert");
        return true;
      } else {
        if (confirm(`⚠️ Vous avez ${invitationsData.length} invitations.\n\nLe client mail va s'ouvrir ${invitationsData.length} fois (une par invitation).\n\nPréférez-vous plutôt utiliser l'option "Copier dans le presse-papier" pour plus de facilité ?\n\nCliquez OK pour continuer avec le client mail, ou Annuler pour choisir une autre méthode.`)) {
          invitationsData.forEach((inv, index) => {
            setTimeout(() => {
              const mailtoLink = `mailto:${inv.email}?subject=${encodeURIComponent(inv.subject)}&body=${encodeURIComponent(inv.message)}`;
              window.open(mailtoLink, '_blank');
            }, index * 1500);
          });
          
          showSuccess(`Client mail ouvert ${emailList.length} fois`);
          return true;
        }
        return false;
      }
    } catch (error) {
      showError("Erreur lors de l'ouverture du client mail");
      return false;
    }
  };

  const downloadAsFile = async (emailList: string[]): Promise<boolean> => {
    try {
      const invitationsData = await prepareInvitations(emailList);
      
      const content = invitationsData.map((inv, idx) => `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INVITATION ${idx + 1}/${invitationsData.length}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Destinataire : ${inv.email}
Lien d'invitation : ${inv.link}

Sujet : ${inv.subject}

Message :
${inv.message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `).join('\n\n');

      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invitations-${poolName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      showSuccess(`Fichier téléchargé avec ${emailList.length} invitation(s)`);
      return true;
    } catch (error) {
      showError("Erreur lors du téléchargement");
      return false;
    }
  };

  return {
    copyToClipboard,
    openGmail,
    openMailClient,
    downloadAsFile,
  };
};
