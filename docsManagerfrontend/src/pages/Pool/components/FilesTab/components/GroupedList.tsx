import type { File } from "../../../../../types/models";
import { FileRow } from "./FileRow";

type Props = {
  groups: Record<string, File[]>;
  onPreview: (id: number, name: string) => void;
  onDownload: (id: number, name: string) => void;
  onDetails: (file: File) => void;
  previewingId: number | null;
  downloadingId: number | null;
  isPublicView?: boolean;
};

export const GroupedList = ({ groups, onPreview, onDownload, onDetails, previewingId, downloadingId, isPublicView = false }: Props) => {
  return (
    <>
      {Object.entries(groups).map(([groupName, groupFiles]) => (
        <section key={groupName} className="files-tab__group">
          <h3 className="files-tab__group-title">
            {groupName} <span className="files-tab__group-count">({groupFiles.length})</span>
          </h3>

          <div className="files-tab__list">
            {groupFiles.map((f) => (
              <FileRow
                key={f.id}
                file={f}
                onPreview={onPreview}
                onDownload={onDownload}
                onDetails={onDetails}
                isPreviewing={previewingId === f.id}
                isDownloading={downloadingId === f.id}
                isPublicView={isPublicView}
              />
            ))}
          </div>
        </section>
      ))}
    </>
  );
};
