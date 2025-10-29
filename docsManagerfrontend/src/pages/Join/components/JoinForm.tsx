type FormData = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
};

type Props = {
  poolName: string;
  email: string;
  onSubmit: (data: FormData) => Promise<void>;
  submitting: boolean;
};

const JoinForm = ({ poolName, email, onSubmit, submitting }: Props) => {

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ email, firstName: "", lastName: "", phone: "" } as any);
  };

  return (
    <div className="join-page__container">
      <div className="join-page__header">
        <h1 className="join-page__title">🎉 Bienvenue!</h1>
        <p className="join-page__subtitle">
          Vous avez été invité à rejoindre la pool <strong>{poolName}</strong>
        </p>
        <p className="join-page__email">
          Invitation envoyée à : <span>{email}</span>
        </p>
      </div>

      <form className="join-page__form" onSubmit={handleSubmit}>
        <button type="submit" className="join-page__submit" disabled={submitting}>
          {submitting ? (
            <>
              <span className="join-page__spinner" />
              Validation en cours...
            </>
          ) : (
            "Rejoindre la pool"
          )}
        </button>
      </form>
    </div>
  );
};

export default JoinForm;
