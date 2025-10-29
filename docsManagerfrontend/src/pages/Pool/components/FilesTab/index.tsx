import { useCallback, useState } from "react";
import { useFetch } from "../../../../hooks/useFetch";
import { fetchFilesByPoolId } from "../../../../api/poolPageApi";
import { fetchPublicPoolFiles, downloadPublicFile, previewPublicFile } from "../../../../api/publicPoolsApi";
import { downloadFile, previewFile } from "../../../../api/filePageApi";
import type { File } from "../../../../types/models";
import "./style.css";
import { GroupedList } from "./components/GroupedList";
import { HeaderBar } from "./components/HeaderBar";
import { PreviewModal } from "./components/PreviewModal";
import { DetailsModal } from "./components/DetailsModal";
import { useFilteredFiles } from "./hooks/useFilteredFiles";
import { useGroupedFiles } from "./hooks/useGroupedFiles";

export type GroupingType = "member" | "extension" | "date";

const FilesTab = ({ poolId, isPublicView = false }: { poolId: number; isPublicView?: boolean }) => {
  const fetcher = useCallback(() => {
    if (isPublicView) return fetchPublicPoolFiles(poolId);
    return fetchFilesByPoolId(poolId);
  }, [poolId, isPublicView]);
  const { data: files, loading, error } = useFetch<File[]>(fetcher);

  const [grouping, setGrouping] = useState<GroupingType>("member");
  const [searchTerm, setSearchTerm] = useState("");

  const [downloading, setDownloading] = useState<number | null>(null);
  const [previewing, setPreviewing] = useState<number | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewFileName, setPreviewFileName] = useState<string>("");
  const [previewContentType, setPreviewContentType] = useState<string>("");

  const [selectedFileForDetails, setSelectedFileForDetails] = useState<File | null>(null);

  const filteredFiles = useFilteredFiles(files ?? undefined, searchTerm);
  const groupedFiles = useGroupedFiles(filteredFiles, grouping);

  const totalCount = filteredFiles.length;

  const handleDownload = useCallback(async (fileId: number, fileName: string) => {
    setDownloading(fileId);
    const result = isPublicView ? await downloadPublicFile(fileId, fileName) : await downloadFile(fileId, fileName);
    setDownloading(null);
    if (!result.success) alert("Erreur lors du téléchargement du fichier");
  }, [isPublicView]);

  const handlePreview = useCallback(async (fileId: number, fileName: string) => {
    setPreviewing(fileId);
    const result = isPublicView ? await previewPublicFile(fileId) : await previewFile(fileId);
    setPreviewing(null);
    if (result.success && result.url) {
      setPreviewUrl(result.url);
      setPreviewFileName(fileName);
      setPreviewContentType(result.contentType || "");
    } else {
      alert("Erreur lors de la prévisualisation du fichier");
    }
  }, [isPublicView]);

  const closePreview = useCallback(() => {
    if (previewUrl) window.URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setPreviewFileName("");
    setPreviewContentType("");
  }, [previewUrl]);

  const handleDetails = useCallback((file: File) => {
    setSelectedFileForDetails(file);
  }, []);

  const closeDetails = useCallback(() => {
    setSelectedFileForDetails(null);
  }, []);

  if (loading) {
    return (
      <div className="files-tab__loading">
        <span className="files-tab__spinner" />
        Chargement des fichiers...
      </div>
    );
  }

  if (error) {
    return <div className="files-tab__error">Erreur lors du chargement des fichiers</div>;
  }

  return (
    <div className="files-tab">
      {isPublicView && (
        <div className="files-tab__public-banner">
          <div className="files-tab__public-content">
            <span className="files-tab__public-icon">🎯</span>
            <div>
              <strong>Mode démonstration</strong>
              <p>Vous consultez un pool public. Connectez-vous pour créer vos propres pools et gérer vos documents.</p>
            </div>
          </div>
        </div>
      )}

      <HeaderBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        grouping={grouping}
        onGroupingChange={setGrouping}
        totalFiles={totalCount}
      />

      <div className="files-tab__content">
        <GroupedList
          groups={groupedFiles}
          onPreview={handlePreview}
          onDownload={handleDownload}
          onDetails={handleDetails}
          previewingId={previewing}
          downloadingId={downloading}
          isPublicView={isPublicView}
        />
      </div>

      {totalCount === 0 && (
        <div className="files-tab__empty">
          {searchTerm ? "Aucun fichier ne correspond à votre recherche" : "Aucun fichier dans cette pool"}
        </div>
      )}

      {previewUrl && (
        <PreviewModal
          fileName={previewFileName}
          contentType={previewContentType}
          url={previewUrl}
          onClose={closePreview}
        />
      )}

      {selectedFileForDetails && (
        <DetailsModal file={selectedFileForDetails} onClose={closeDetails} />
      )}
    </div>
  );
};

export default FilesTab;
