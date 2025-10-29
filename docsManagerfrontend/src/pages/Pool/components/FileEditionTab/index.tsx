import React, { useState } from "react";
import ModeSelector, { type EditionMode } from "./components/ModeSelector";
import AddDocument from "./components/AddDocument";
import DeleteDocument from "./components/DeleteDocument";
import ModifyDocument from "./components/ModifyDocument";

type Props = {
    poolId: number;
    isPublicView?: boolean;
};

const FileEditionTab = ({ poolId, isPublicView = false }: Props) => {
    const [mode, setMode] = useState<EditionMode>("add");

    return (
        <React.Fragment>
            {isPublicView && (
                <div style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '8px',
                    padding: '1rem 1.5rem',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    color: 'white',
                    boxShadow: '0 2px 8px rgba(102, 126, 234, 0.2)'
                }}>
                    <span style={{ fontSize: '2rem' }}>🎯</span>
                    <div>
                        <strong style={{ display: 'block', fontSize: '1.125rem', marginBottom: '0.25rem' }}>Mode démonstration</strong>
                        <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.95, lineHeight: 1.4 }}>
                            Les fonctions d'édition de documents sont désactivées en mode public.
                        </p>
                    </div>
                </div>
            )}
            <ModeSelector mode={mode} onModeChange={setMode} isPublicView={isPublicView} />  
            {mode === "add" && <AddDocument poolId={poolId} isPublicView={isPublicView} />}
            {mode === "edit" && <ModifyDocument poolId={poolId} isPublicView={isPublicView} />}
            {mode === "delete" && <DeleteDocument poolId={poolId} isPublicView={isPublicView} />}
        </React.Fragment>
    )
}

export default FileEditionTab;