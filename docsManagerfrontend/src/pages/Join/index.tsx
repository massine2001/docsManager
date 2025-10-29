import { useSearchParams, useNavigate } from "react-router-dom";
import { useToast } from "../../hooks/useToast";
import { Toast } from "../../components/Toast";
import { useInvitationValidation } from "./hooks/useInvitationValidation";
import { useJoinForm } from "./hooks/useJoinForm";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import JoinForm from "./components/JoinForm";
import "./style.css";

const JoinPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast, hideToast } = useToast();
  
  const token = searchParams.get("token");

  const { validating, invitationValid, poolName, email } = useInvitationValidation(token);

  const { submitting, handleSubmit } = useJoinForm(token || "");

  if (validating) {
    return <LoadingState />;
  }

  if (!invitationValid) {
    return <ErrorState onGoHome={() => navigate("/")} />;
  }

  return (
    <div className="join-page">
      <JoinForm
        poolName={poolName}
        email={email}
        onSubmit={handleSubmit}
        submitting={submitting}
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

export default JoinPage;
