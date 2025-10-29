import type { File } from "../../../../../types/models";
import '../style.css';

type Props = {
    documents: File[];
    selectedId: number | null;
    onChange: (id: number | null) => void;
    placeholder?: string;
};

const DocumentSelector = ({ documents, selectedId, onChange, placeholder = "Sélectionner un document" }: Props) => {
    return (
        <div className="document-selector">
            <label className="document-selector__label">Document</label>
            <select
                className="document-selector__select"
                value={selectedId ?? ""}
                onChange={(e) => {
                    const value = e.target.value;
                    onChange(value ? Number(value) : null);
                }}
            >
                <option value="">{placeholder}</option>
                {documents.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                        {doc.name} ({doc.userUploader?.firstName} {doc.userUploader?.lastName})
                    </option>
                ))}
            </select>
            
            {documents.length === 0 && (
                <p className="document-selector__empty">Aucun document disponible</p>
            )}
        </div>
    );
};

export default DocumentSelector;