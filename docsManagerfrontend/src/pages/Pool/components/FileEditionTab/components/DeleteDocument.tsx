import { useState, useCallback, useEffect, useRef } from "react";
import DocumentSelector from "./DocumentSelector";
import { useFetch } from "../../../../../hooks/useFetch";
import { useMutation } from "../../../../../hooks/useMutation";
import { useToast } from "../../../../../hooks/useToast";
import { Toast } from "../../../../../components/Toast";
import { fetchFilesByPoolId } from "../../../../../api/poolPageApi";
import { deleteFile } from "../../../../../api/filePageApi";
import '../style.css';

type Props = {
    poolId: number;
    isPublicView?: boolean;
};

const DeleteDocument = ({ poolId, isPublicView = false }: Props) => {
    const { toast, showSuccess, showError, hideToast } = useToast();
    
    const fetcher = useCallback(() => fetchFilesByPoolId(poolId), [poolId]);
    const { data: rawDocuments, loading: loadingDocs, refetch } = useFetch(fetcher);
    
    const documents = Array.isArray(rawDocuments) ? rawDocuments : [];
    
    const [selectedDocId, setSelectedDocId] = useState<number | null>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [docToDelete, setDocToDelete] = useState<any>(null);
    
    const { execute, loading, success, error, reset } = useMutation(
        () => deleteFile(selectedDocId!)
    );

    const successHandledRef = useRef(false);
    
    const showSuccessRef = useRef(showSuccess);
    const showErrorRef = useRef(showError);
    const resetRef = useRef(reset);
    const refetchRef = useRef(refetch);
    const hideToastRef = useRef(hideToast);
    
    useEffect(() => {
        showSuccessRef.current = showSuccess;
        showErrorRef.current = showError;
        resetRef.current = reset;
        refetchRef.current = refetch;
        hideToastRef.current = hideToast;
    });

    const selectedDoc = documents.find(d => d.id === selectedDocId);

    const handleDelete = async () => {
        if (!selectedDocId) return;
        await execute(undefined);
    };

    const handleCancel = () => {
        setShowConfirmation(false);
        setDocToDelete(null);
        reset();
    };
    
    const handleShowConfirmation = () => {
        if (selectedDoc) {
            setDocToDelete(selectedDoc);
            setShowConfirmation(true);
        }
    };
    
    useEffect(() => {
        if (success && !successHandledRef.current) {
            successHandledRef.current = true;
            showSuccessRef.current("Document supprimé avec succès");
            
            const closeTimer = setTimeout(() => {
                setShowConfirmation(false);
                setDocToDelete(null);
                setSelectedDocId(null);
            }, 2000);
            
            const cleanupTimer = setTimeout(() => {
                resetRef.current();
                refetchRef.current();
                hideToastRef.current();
                successHandledRef.current = false;
            }, 2500);
            
            return () => {
                clearTimeout(closeTimer);
                clearTimeout(cleanupTimer);
            };
        }
    }, [success]);

    useEffect(() => {
        if (error) {
            showErrorRef.current("Erreur lors de la suppression du document");
        }
    }, [error]);

    if (loadingDocs) {
        return <div className="document-form__section">Chargement des documents...</div>;
    }

    return (
        <div className="document-form_wrapper">
            {isPublicView && (
                <div style={{ padding: '1rem', background: '#fff3cd', border: '1px solid #ffc107', borderRadius: '6px', marginBottom: '1rem' }}>
                    ⚠️ <strong>Mode démonstration</strong> : La suppression de documents est désactivée.
                </div>
            )}
           
            <DocumentSelector
                documents={documents}
                selectedId={selectedDocId}
                onChange={setSelectedDocId}
                placeholder="Sélectionner un document à supprimer"
            />

            {!selectedDoc && (
                <div className="document-form__empty">
                    <span className="document-form__empty-icon">🗑️</span>
                    <p className="document-form__empty-text">
                        Sélectionnez un document pour le supprimer
                    </p>
                </div>
            )}

            {selectedDoc && !showConfirmation && (
                <div className="delete-document__preview">
                    <h3>Document sélectionné</h3>
                    <div className="delete-document__info">
                        <p><strong>Nom :</strong> {selectedDoc.name}</p>
                        {selectedDoc.description && (
                            <p><strong>Description :</strong> {selectedDoc.description}</p>
                        )}
                        {selectedDoc.expirationDate && (
                            <p><strong>Date d'expiration du document:</strong> {new Date(selectedDoc.expirationDate).toLocaleDateString()}</p>
                        )}
                        <p><strong>Uploadé par :</strong> {selectedDoc.userUploader?.firstName} {selectedDoc.userUploader?.lastName}</p>
                        <p><strong>Date de création :</strong> {new Date(selectedDoc.createdAt).toLocaleDateString()}</p>
                    </div>
                    
                    <div className="document-form__actions">
                        <button 
                            type="button" 
                            onClick={() => setSelectedDocId(null)}
                            className="fileEdition-chip-btn"
                            disabled={isPublicView}
                        >
                            Annuler
                        </button>
                        <button 
                            type="button"
                            onClick={handleShowConfirmation}
                            className="delete-document__btn-danger"
                            disabled={isPublicView}
                            style={isPublicView ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                        >
                            Supprimer
                        </button>
                    </div>
                </div>
            )}

            {showConfirmation && docToDelete && (
                <div className="delete-document__confirmation">
                    <h3>⚠️ Confirmation de suppression</h3>
                    <p>
                        Êtes-vous sûr de vouloir supprimer le document <strong>"{docToDelete.name}"</strong> ?
                    </p>
                    <p className="delete-document__warning">
                        Cette action est irréversible.
                    </p>
                    
                    {error && (
                        <div className="form-error">
                            {error}
                        </div>
                    )}
                    
                    {success && (
                        <div className="form-success">
                            ✓ Document supprimé avec succès !
                        </div>
                    )}
                    
                    <div className="document-form__actions">
                        <button 
                            type="button" 
                            onClick={handleCancel}
                            className="fileEdition-chip-btn"
                            disabled={loading}
                        >
                            Annuler
                        </button>
                        <button 
                            type="button"
                            onClick={handleDelete}
                            className="delete-document__btn-danger"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Suppression...
                                </>
                            ) : (
                                "Confirmer la suppression"
                            )}
                        </button>
                    </div>
                </div>
            )}

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

export default DeleteDocument;