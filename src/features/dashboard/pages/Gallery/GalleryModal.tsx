import './GalleryModal.scss';
import { useGalleryModalStore } from '../../../../store/gallery.store';
import {
  uploadPetGalleryPhotos,
  deletePetPhoto,
} from '../../../../services/pet.service';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export const GalleryModal = () => {
  const { isOpen, close, mode, photos, current, petId } =
    useGalleryModalStore();

  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleUpload = async () => {
    if (!petId) return;
    setLoading(true);

    await uploadPetGalleryPhotos(petId, files);

    setLoading(false);
    close();
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
    await deletePetPhoto(petId, photos[current].photo_id);
    close();
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

            <div className="gallery-modal-body">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) =>
                  setFiles(Array.from(e.target.files || []).slice(0, 5))
                }
              />

              <button onClick={handleUpload} disabled={loading}>
                {loading ? 'Subiendo...' : 'Subir imágenes'}
              </button>
            </div>
          </>
        )}

        {/* VIEW MODE */}
        {mode === 'view' && (
          <>
            <div className="gallery-container">
              <button className="gallery-arrow left" onClick={goPrev}>
                <ChevronLeft size={32} />
              </button>

              <img
                src={photos[current].url}
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
      </div>
    </div>
  );
};
