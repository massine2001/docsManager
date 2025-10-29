type Props = {
  onGoHome: () => void;
};

const ErrorState = ({ onGoHome }: Props) => {
  return (
    <div className="join-page">
      <div className="join-page__error">
        <div className="join-page__error-icon">⚠️</div>
        <h2>Invitation invalide</h2>
        <p>Ce lien d'invitation n'est pas valide ou a expiré.</p>
        <button className="join-page__btn" onClick={onGoHome}>
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
};

export default ErrorState;
