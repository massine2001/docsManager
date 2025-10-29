import '../style.css'

export type EditionMode = "add" | "edit" | "delete";

type Props = {
    mode: EditionMode;
    onModeChange: (mode: EditionMode) => void;
    isPublicView?: boolean;
};

const ModeSelector = ({ mode, onModeChange, isPublicView = false }: Props) => {
    const modes: { value: EditionMode; label: string }[] = [
        { value: "add", label: "Ajouter un document" },
        { value: "edit", label: "Modifier un document" },
        { value: "delete", label: "Supprimer un document" },
    ];

    return (
        <div className='fileEdition-chips_layout'>
            {modes.map((m) => (
                <button 
                    key={m.value}
                    className={mode === m.value ? 'fileEdition-chip-btn-active' : 'fileEdition-chip-btn'}
                    onClick={() => onModeChange(m.value)}
                    disabled={isPublicView}
                    style={isPublicView ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                >
                    {m.label}
                </button>
            ))}
        </div>
    )
}

export default ModeSelector;