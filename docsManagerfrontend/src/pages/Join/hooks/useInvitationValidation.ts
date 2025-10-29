import { useState, useEffect } from "react";
import { useToast } from "../../../hooks/useToast";
import { validateInvitationToken } from "../../../api/poolPageApi";

type InvitationData = {
  poolName: string;
  email: string;
};

export const useInvitationValidation = (token: string | null) => {
  const { showError } = useToast();
  const [validating, setValidating] = useState(true);
  const [invitationValid, setInvitationValid] = useState(false);
  const [invitationData, setInvitationData] = useState<InvitationData>({
    poolName: "",
    email: "",
  });

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setInvitationValid(false);
        setValidating(false);
        return;
      }

      try {
        const result = await validateInvitationToken(token);
        
        if (result.valid && result.poolName && result.email) {
          setInvitationValid(true);
          setInvitationData({
            poolName: result.poolName,
            email: result.email,
          });
        } else {
          setInvitationValid(false);
          showError(result.message || "Lien d'invitation invalide");
        }
      } catch (error) {
        setInvitationValid(false);
        showError("Lien d'invitation invalide ou expiré");
      } finally {
        setValidating(false);
      }
    };

    validateToken();
  }, [token, showError]);

  return {
    validating,
    invitationValid,
    poolName: invitationData.poolName,
    email: invitationData.email,
  };
};
