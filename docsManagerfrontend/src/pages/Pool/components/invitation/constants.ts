import { generateInvitationToken } from "../../../../api/poolPageApi";

export const DEFAULT_EMAIL_TEMPLATE = (poolName: string, senderName: string, invitationLink: string) => `
Bonjour,

${senderName} vous invite à rejoindre la pool "${poolName}" !

🎉 Vous avez été invité(e) à faire partie de notre communauté. Nous serions ravis de vous compter parmi nous.

Pour accepter cette invitation et créer votre compte, cliquez simplement sur le lien ci-dessous :

${invitationLink}

Ce lien vous permettra de :
✓ Créer votre profil
✓ Accéder aux fichiers partagés
✓ Collaborer avec les autres membres

Si vous n'avez pas demandé cette invitation, vous pouvez ignorer cet email.

À très bientôt !

---
L'équipe de ${poolName}
`.trim();

export const generateInvitationLink = async (poolId: number, email: string): Promise<string> => {
  try {
    const response = await generateInvitationToken(poolId, email);
    const baseUrl = window.location.origin;
    return `${baseUrl}/join?token=${response.token}`;
  } catch (error) {
    throw new Error("Impossible de générer le lien d'invitation");
  }
};
