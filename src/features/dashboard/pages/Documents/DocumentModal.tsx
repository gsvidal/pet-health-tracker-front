import './DocumentModal.scss';
import { useDocumentModalStore } from '../../../../store/documentModal.store';
import {
  uploadPetDocument as uploadPetDocumentService,
  getPetDocuments,
} from '../../../../services/pet.service';
import { X, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '../../../../components/Button/Button';
import { Select, type SelectOption } from '../../../../components/Select';
import { useTranslation } from 'react-i18next';

export const DocumentModal = () => {
  const { t } = useTranslation();
  const { isOpen, close, petId, mode, documents, current } =
    useDocumentModalStore();

  const [file, setFile] = useState<File | null>(null);
  const [documentCategory, setDocumentCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const documentCategoryOptions: SelectOption[] = [
    { value: 'vaccination', label: t('documents.categories.vaccination') },
    { value: 'vet_visit', label: t('documents.categories.vet_visit') },
    { value: 'lab_result', label: t('documents.categories.lab_result') },
    { value: 'general', label: t('documents.categories.general') },
  ];

  if (!isOpen) return null;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    // Validar tamaño (10MB = 10 * 1024 * 1024 bytes)
    const maxSize = 10 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      toast.error(t('documents.fileTooLarge'));
      event.target.value = '';
      return;
    }

    // Validar formato PDF
    if (selectedFile.type !== 'application/pdf') {
      toast.error(t('documents.invalidFormat'));
      event.target.value = '';
      return;
    }

    // Validar que el PDF tenga contenido (básico: que no esté vacío)
    if (selectedFile.size === 0) {
      toast.error(t('documents.emptyFile'));
      event.target.value = '';
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const dropped = Array.from(event.dataTransfer.files);
    const pdfs = dropped.filter((f) => f.type === 'application/pdf');

    if (pdfs.length === 0) {
      toast.error(t('documents.onlyPdf'));
      return;
    }

    if (pdfs.length > 1) {
      toast.error(t('documents.oneAtATime'));
      return;
    }

    const selectedFile = pdfs[0];

    // Validar tamaño
    const maxSize = 10 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      toast.error(t('documents.fileTooLarge'));
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!petId) return;

    if (!file) {
      toast.error(t('documents.selectFile'));
      return;
    }

    if (!documentCategory) {
      toast.error(t('documents.selectCategoryError'));
      return;
    }

    const toastId = toast.loading(t('documents.uploading'));

    try {
      setLoading(true);

      await uploadPetDocumentService(petId, file, documentCategory);
      const updatedDocuments = await getPetDocuments(petId);

      toast.success(t('documents.uploadSuccess'), { id: toastId });

      // Resetear estado
      setFile(null);
      setDocumentCategory(null);

      // Si hay documentos, abrir en modo view, sino cerrar
      if (updatedDocuments.length > 0) {
        useDocumentModalStore.setState({
          mode: 'view',
          documents: updatedDocuments,
          current: updatedDocuments.length - 1, // Mostrar el último documento subido
        });
      } else {
        close();
      }
    } catch (error) {
      console.error(error);
      toast.error(t('documents.uploadError'), { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getCategoryLabel = (category: string | null | undefined): string => {
    const option = documentCategoryOptions.find(
      (opt) => opt.value === category,
    );
    return option?.label || category || t('documents.noCategory');
  };

  const goPrev = () => {
    useDocumentModalStore.setState({
      current: current === 0 ? documents.length - 1 : current - 1,
    });
  };

  const goNext = () => {
    useDocumentModalStore.setState({
      current: current === documents.length - 1 ? 0 : current + 1,
    });
  };

  const goToDocument = (index: number) => {
    useDocumentModalStore.setState({
      current: index,
    });
  };

  return (
    <div className="document-modal-overlay" onClick={close}>
      <div
        className="document-modal-card"
        data-mode={mode}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="document-modal-close" onClick={close}>
          <X size={20} />
        </button>

        {/* UPLOAD MODE */}
        {mode === 'upload' && (
          <>
            <h2 className="document-modal-title">
              {t('documents.uploadTitle')}
            </h2>

            <p className="document-modal-info">
              {t('documents.maxSize')} • {t('documents.format')} •{' '}
              {t('documents.mustContainText')}
            </p>

            {/* SELECT DE CATEGORÍA */}
            <div className="document-modal-category">
              <Select
                value={documentCategory}
                onChange={setDocumentCategory}
                options={documentCategoryOptions}
                placeholder={t('documents.selectCategory')}
                label={t('documents.categoryLabel')}
              />
            </div>

            {/* DRAG & DROP AREA */}
            <div
              className={`document-dropzone ${isDragging ? 'dragging' : ''} ${
                file ? 'has-file' : ''
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              {file ? (
                <div className="document-preview">
                  <FileText size={48} className="document-preview-icon" />
                  <div className="document-preview-info">
                    <p className="document-preview-name">{file.name}</p>
                    <p className="document-preview-size">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <button
                    className="document-preview-remove"
                    onClick={handleRemoveFile}
                    type="button"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <>
                  <FileText size={48} className="document-dropzone-icon" />
                  <p>{t('documents.dragDrop')}</p>
                  <span>{t('documents.dragDropClick')}</span>

                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileSelect}
                  />
                </>
              )}
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={handleUpload}
              disabled={loading || !file || !documentCategory}
              className="document-modal-submit"
            >
              {loading
                ? t('documents.uploadingText')
                : t('documents.uploadButton')}
            </Button>
          </>
        )}

        {/* VIEW MODE */}
        {mode === 'view' && (
          <>
            {documents.length === 0 ? (
              <div className="document-modal-empty">
                <FileText size={64} className="document-modal-empty-icon" />
                <p>{t('documents.noDocuments')}</p>
              </div>
            ) : (
              <>
                <div className="document-viewer-container">
                  <div className="document-viewer-header">
                    <h3 className="document-viewer-title">
                      {documents[current]?.file_name ||
                        `Documento ${current + 1}`}
                    </h3>
                    <p className="document-viewer-category">
                      {getCategoryLabel(documents[current]?.document_category)}
                    </p>
                  </div>

                  <div className="document-viewer">
                    <button
                      className="document-viewer-arrow left"
                      onClick={goPrev}
                      aria-label="Documento anterior"
                    >
                      <ChevronLeft size={32} />
                    </button>

                    <iframe
                      src={documents[current]?.url}
                      className="document-viewer-iframe"
                      title={`Documento ${current + 1}`}
                    />

                    <button
                      className="document-viewer-arrow right"
                      onClick={goNext}
                      aria-label="Documento siguiente"
                    >
                      <ChevronRight size={32} />
                    </button>

                    {/* Indicadores de posición */}
                    {documents.length > 1 && (
                      <div className="document-viewer-indicators">
                        {documents.map((_, index) => (
                          <button
                            key={index}
                            className={`document-viewer-indicator ${
                              index === current ? 'active' : ''
                            }`}
                            onClick={() => goToDocument(index)}
                            aria-label={`Ir a documento ${index + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="document-viewer-footer">
                    <p className="document-viewer-counter">
                      {current + 1} de {documents.length}
                    </p>
                    <a
                      href={documents[current]?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="document-viewer-download"
                    >
                      <FileText size={16} />
                      {t('documents.openInNewTab')}
                    </a>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};
