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
                <div className="files-tab__public-banner">
                    <div className="files-tab__public-content">
                        <span className="files-tab__public-icon">🎯</span>
                        <div>
                        <strong>Mode démonstration</strong>
                        <p>Les fonctions d'édition de documents sont désactivées en mode public.</p>
                        </div>
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