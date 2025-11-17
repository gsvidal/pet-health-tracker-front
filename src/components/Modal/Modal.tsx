import './Modal.scss';
import { useEffect } from 'react';
import { useModalStore } from '../../store/modal.store';
import { X } from 'lucide-react';

export const Modal = () => {
  const { isOpen, content, title, closeModal } = useModalStore();

  // Cerrar con ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeModal();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevenir scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closeModal]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container">
        <div className="modal-header">
          {title && <h2 className="modal-title">{title}</h2>}
          <button
            className="modal-close"
            onClick={closeModal}
            aria-label="Cerrar modal"
          >
            <X size={20} />
          </button>
        </div>
        <div className="modal-content">{content}</div>
      </div>
    </div>
  );
};
