import { useMemo } from "react";
import { getExt } from "../utils/format";

type Props = {
  fileName: string;
  contentType: string;
  url: string;
  onClose: () => void;
};

export const PreviewModal = ({ fileName, contentType, url, onClose }: Props) => {
  const ext = useMemo(() => getExt(fileName), [fileName]);
  const isImage = contentType.startsWith("image/") || ["jpg","jpeg","png","gif","webp","svg"].includes(ext);
  const isPdf = contentType === "application/pdf" || ext === "pdf";
  const isVideo = contentType.startsWith("video/") || ["mp4","webm","ogg"].includes(ext);
  const isAudio = contentType.startsWith("audio/") || ["mp3","wav","ogg"].includes(ext);
  const isText  = contentType.startsWith("text/")  || ["txt","md","json","xml","csv"].includes(ext);

  const isMobile = useMemo(() => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }, []);

  return (
    <div className="files-tab__preview-modal" onClick={onClose}>
      <div className="files-tab__preview-content" onClick={(e) => e.stopPropagation()}>
        <div className="files-tab__preview-header">
          <h3>{fileName}</h3>
          <button className="files-tab__preview-close" onClick={onClose} title="Fermer">✕</button>
        </div>

        <div className="files-tab__preview-body">
          {isImage && <img src={url} alt={fileName} className="files-tab__preview-image" />}

          {isPdf && !isMobile && (
            <iframe src={`${url}#toolbar=0`} title={fileName} className="files-tab__preview-iframe" />
          )}

          {isPdf && isMobile && (
            <div className="files-tab__preview-mobile-pdf">
              <div className="files-tab__preview-mobile-pdf-icon">📄</div>
              <h4>Prévisualisation PDF non disponible sur mobile</h4>
              <p>Les navigateurs mobiles ont des limitations pour afficher les PDFs intégrés.</p>
              <div className="files-tab__preview-mobile-pdf-actions">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="files-tab__preview-mobile-pdf-button"
                >
                  Ouvrir dans un nouvel onglet
                </a>
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = fileName;
                    link.click();
                  }}
                  className="files-tab__preview-mobile-pdf-button secondary"
                >
                  Télécharger le fichier
                </button>
              </div>
            </div>
          )}

          {isVideo && (
            <video src={url} controls className="files-tab__preview-video">
              Votre navigateur ne supporte pas la lecture de vidéos.
            </video>
          )}

          {isAudio && (
            <div className="files-tab__preview-audio-container">
              <audio src={url} controls className="files-tab__preview-audio">
                Votre navigateur ne supporte pas la lecture audio.
              </audio>
            </div>
          )}

          {isText && <iframe src={url} title={fileName} className="files-tab__preview-iframe" />}

          {!isImage && !isPdf && !isVideo && !isAudio && !isText && (
            <div className="files-tab__preview-unsupported">
              <div className="files-tab__preview-unsupported-icon">📄</div>
              <p>La prévisualisation n'est pas disponible pour ce type de fichier.</p>
              <p className="files-tab__preview-unsupported-hint">
                Téléchargez le fichier pour l'ouvrir avec l'application appropriée.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
