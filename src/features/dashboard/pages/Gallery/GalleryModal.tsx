import './GalleryModal.scss';
import { useGalleryModalStore } from '../../../../store/gallery.store';
import { useModalStore } from '../../../../store/modal.store';
import {
  uploadPetGalleryPhotos,
  deletePetPhoto,
} from '../../../../services/pet.service';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Button } from '../../../../components/Button/Button';
import { Loader } from '../../../../components/Loader/Loader';
import { useTranslation } from 'react-i18next';

export const GalleryModal = () => {
  const { t } = useTranslation();
  const { isOpen, close, mode, photos, current, petId } =
    useGalleryModalStore();
  const { openModal } = useModalStore();

  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Limpiar archivos y previews cuando:
  // 1. El modal se cierra
  // 2. Cambia el petId (cambiar de mascota)
  // 3. Se abre el modal en modo upload
  useEffect(() => {
    if (!isOpen) {
      // Limpiar cuando se cierra el modal
      // Revocar todas las URLs de preview para liberar memoria
      setPreviewUrls((prev) => {
        prev.forEach((url) => URL.revokeObjectURL(url));
        return [];
      });
      setFiles([]);
      setIsDragging(false);
      return;
    }

    // Limpiar cuando cambia el petId (cambiar de mascota)
    // o cuando se abre en modo upload (resetear el formulario)
    if (mode === 'upload') {
      setPreviewUrls((prev) => {
        prev.forEach((url) => URL.revokeObjectURL(url));
        return [];
      });
      setFiles([]);
      setIsDragging(false);
    }
  }, [isOpen, petId, mode]);

  // Resetear el estado de carga solo cuando se abre el modal o cambia el petId
  useEffect(() => {
    if (mode === 'view' && isOpen) {
      setImageLoading(true);
    }
  }, [isOpen, petId, mode]);

  if (!isOpen) return null;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files || []);
    addFiles(selected);
  };

  const addFiles = (incoming: File[]) => {
    // máximo 5 imágenes
    const limited = [...files, ...incoming].slice(0, 5);

    setFiles(limited);

    const previews = limited.map((file) => URL.createObjectURL(file));
    setPreviewUrls(previews);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const dropped = Array.from(event.dataTransfer.files);
    const images = dropped.filter((f) => f.type.startsWith('image/'));

    addFiles(images);
  };

  const handleUpload = async () => {
    if (!petId) return;

    const toastId = toast.loading(t('gallery.uploading'));
    if (files.length === 0) {
      toast.error(t('gallery.selectAtLeastOne'));
      return;
    }

    if (files.length > 5) {
      toast.error(t('gallery.maxFiveImages'));
      return;
    }
    try {
      setLoading(true);

      await uploadPetGalleryPhotos(petId, files);

      toast.success(t('gallery.uploadSuccess'), { id: toastId });

      // Limpiar archivos y previews después de subir exitosamente
      // Revocar todas las URLs de preview para liberar memoria
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
      setFiles([]);
      setPreviewUrls([]);
      setIsDragging(false);

      close();
    } catch (error) {
      console.error(error);
      toast.error(t('gallery.uploadError'), { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const goPrev = () => {
    useGalleryModalStore.setState({
      current: current === 0 ? photos.length - 1 : current - 1,
    });
  };

  const goNext = () => {
    useGalleryModalStore.setState({
      current: current === photos.length - 1 ? 0 : current + 1,
    });
  };

  const goToSlide = (index: number) => {
    useGalleryModalStore.setState({
      current: index,
    });
  };

  const handleDelete = () => {
    if (!petId) return;

    const photo = photos[current];

    if (!photo?.photo_id) {
      toast.error(t('gallery.deletePhotoError'));
      return;
    }

    openModal({
      title: t('gallery.deleteConfirmTitle'),
      content: t('gallery.deleteConfirmContent'),
      variant: 'confirm',
      confirmLabel: t('gallery.deleteButton'),
      cancelLabel: t('common.cancel'),
      onConfirm: async () => {
        const toastId = toast.loading(t('gallery.deletingImage'));

        try {
          await deletePetPhoto(petId, photo.photo_id);
          toast.success(t('gallery.deletePhotoSuccess'), { id: toastId });
          close();
        } catch (error) {
          console.error(error);
          toast.error(t('gallery.deletePhotoErrorMsg'), { id: toastId });
        }
      },
    });
  };

  return (
    <div className="gallery-modal-overlay" onClick={close}>
      <div className="gallery-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="gallery-modal-close" onClick={close}>
          ✕
        </button>

        {/* UPLOAD MODE */}
        {mode === 'upload' && (
          <>
            <h2 className="gallery-modal-title">{t('gallery.uploadTitle')}</h2>

            {/* DRAG & DROP AREA */}
            <div
              className={`dropzone ${isDragging ? 'dragging' : ''}`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <p>{t('gallery.dragDrop')}</p>
              <span>{t('gallery.dragDropClick')}</span>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                key={`file-input-${petId}-${isOpen}`}
              />
            </div>

            {/* PREVIEW GRID */}
            {previewUrls.length > 0 && (
              <div className="preview-grid">
                {previewUrls.map((src, index) => (
                  <div key={index} className="preview-item">
                    <img src={src} alt="preview" />
                    <button
                      className="preview-remove"
                      onClick={() => {
                        // Revocar la URL del objeto antes de eliminarla
                        URL.revokeObjectURL(previewUrls[index]);
                        const newFiles = files.filter((_, i) => i !== index);
                        const newPreviews = previewUrls.filter(
                          (_, i) => i !== index,
                        );
                        setFiles(newFiles);
                        setPreviewUrls(newPreviews);
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <Button
              variant="primary"
              size="lg"
              onClick={handleUpload}
              disabled={loading || !files.length}
            >
              {loading ? t('gallery.uploadingText') : t('gallery.uploadButton')}
            </Button>
          </>
        )}

        {/* VIEW MODE */}
        {mode === 'view' && (
          <>
            {photos.length === 0 ? (
              <div className="empty-gallery">
                <p>{t('gallery.noPhotos')}</p>
              </div>
            ) : (
              <>
                <div className="gallery-container">
                  {imageLoading && (
                    <div className="gallery-loader">
                      <Loader size="large" text={t('gallery.loadingImage')} />
                    </div>
                  )}
                  <button className="gallery-arrow left" onClick={goPrev}>
                    <ChevronLeft size={32} />
                  </button>

                  <img
                    src={photos[current]?.url}
                    className="gallery-main-image"
                    alt="pet"
                    width="560"
                    height="460"
                    onLoad={() => setImageLoading(false)}
                    onError={() => setImageLoading(false)}
                    style={{ display: imageLoading ? 'none' : 'block' }}
                  />

                  <button className="gallery-arrow right" onClick={goNext}>
                    <ChevronRight size={32} />
                  </button>

                  {/* Indicadores de posición */}
                  {!imageLoading && (
                    <div className="gallery-indicators">
                      {photos.map((_, index) => (
                        <button
                          key={index}
                          className={`gallery-indicator ${
                            index === current ? 'active' : ''
                          }`}
                          onClick={() => goToSlide(index)}
                          aria-label={`Ir a foto ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="button-delete-container">
                  <Button variant="danger" onClick={handleDelete}>
                    {t('gallery.deletePhoto')}
                  </Button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};
