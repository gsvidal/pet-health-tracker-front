import './GalleryModal.scss';
import { useGalleryModalStore } from '../../../../store/gallery.store';
import { uploadPetImages } from '../../../../services/pet.service';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export const GalleryModal = () => {
  const { isOpen, close, mode, images, current, petId } =
    useGalleryModalStore();

  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleUpload = async () => {
    if (!petId) return;
    setLoading(true);
    await uploadPetImages(petId, files);
    setLoading(false);
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
          <div className="gallery-container">
            <button
              className="gallery-arrow left"
              onClick={() =>
                useGalleryModalStore.setState({
                  current: current === 0 ? images.length - 1 : current - 1,
                })
              }
            >
              <ChevronLeft size={32} />
            </button>

            <img src={images[current]} className="gallery-main-image" />

            <button
              className="gallery-arrow right"
              onClick={() =>
                useGalleryModalStore.setState({
                  current: current === images.length - 1 ? 0 : current + 1,
                })
              }
            >
              <ChevronRight size={32} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
