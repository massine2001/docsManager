import { useState } from "react";
import { useToast } from "../../../hooks/useToast";

const BFF_BASE = import.meta.env.VITE_BFF_URL;

export const useJoinForm = (token: string) => {
  const { showError } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      localStorage.setItem("INVITE_TOKEN", token);

      window.location.href = `${BFF_BASE}/oauth2/authorization/spa`;
    } catch (e) {
      setSubmitting(false);
      showError("Redirection d’authentification impossible");
    }
  };

  return { submitting, handleSubmit };
};
