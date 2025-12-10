import './GalleryModal.scss';
import { useGalleryModalStore } from '../../../../store/gallery.store';
import {
  uploadPetGalleryPhotos,
  deletePetPhoto,
} from '../../../../services/pet.service';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '../../../../components/Button/Button';

export const GalleryModal = () => {
  const { isOpen, close, mode, photos, current, petId } =
    useGalleryModalStore();

  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

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

    const toastId = toast.loading('Subiendo imágenes...');
    if (files.length === 0) {
      toast.error('Selecciona al menos una imagen');
      return;
    }

    if (files.length > 5) {
      toast.error('Máximo 5 imágenes por subida');
      return;
    }
    try {
      setLoading(true);

      await uploadPetGalleryPhotos(petId, files);

      toast.success('Imágenes subidas correctamente 🎉', { id: toastId });

      close();
    } catch (error) {
      console.error(error);
      toast.error('Error al subir las imágenes ❌', { id: toastId });
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

  const handleDelete = async () => {
    if (!petId) return;

    const photo = photos[current];

    if (!photo?.photo_id) {
      toast.error('Esta imagen no tiene un ID válido ❌');
      return;
    }

    const toastId = toast.loading('Eliminando imagen...');

    try {
      await deletePetPhoto(petId, photo.photo_id);
      toast.success('Imagen eliminada correctamente 🗑️', { id: toastId });
      close();
    } catch (error) {
      console.error(error);
      toast.error('No se pudo eliminar la imagen ❌', { id: toastId });
    }
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
            <h2 className="gallery-modal-title">Subir imágenes</h2>

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
              <p>Arrastra tus imágenes aquí</p>
              <span>o haz clic para seleccionarlas</span>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
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
              {loading ? 'Subiendo...' : 'Cargar'}
            </Button>
          </>
        )}

        {/* VIEW MODE */}
        {mode === 'view' && (
          <>
            {photos.length === 0 ? (
              <div className="empty-gallery">
                <p>No hay fotos cargadas 📁</p>
              </div>
            ) : (
              <>
                <div className="gallery-container">
                  <button className="gallery-arrow left" onClick={goPrev}>
                    <ChevronLeft size={32} />
                  </button>

                  <img
                    src={photos[current]?.url}
                    className="gallery-main-image"
                    alt="pet"
                  />

                  <button className="gallery-arrow right" onClick={goNext}>
                    <ChevronRight size={32} />
                  </button>
                </div>

                <button className="delete-btn" onClick={handleDelete}>
                  Eliminar foto
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};
