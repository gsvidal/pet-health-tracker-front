import { X } from 'lucide-react';
import { Button } from '../Button/Button';
import './ModalText.scss';
import { useEffect } from 'react';

type ModalTextVariant = 'default' | 'confirm';

interface ModalTextProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  content: React.ReactNode;
  variant?: ModalTextVariant;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

export const ModalText = ({
  isOpen,
  onClose,
  title,
  content,
  variant = 'default',
  onConfirm,
  onCancel,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
}: ModalTextProps) => {
  // Cerrar con ESC y manejar scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  const handleCancel = () => {
    onCancel?.();
    onClose();
  };

  return (
    <div
      className={`modal-text-overlay ${isOpen ? 'open' : ''}`}
      onClick={onClose}
    >
      <div
        className="modal-text-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-text-header">
          {title && <h2 className="modal-text-title">{title}</h2>}
          <button
            className="modal-text-close"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            <X size={16} />
          </button>
        </div>
        <div className="modal-text-content">{content}</div>
        {variant === 'confirm' && (
          <div className="modal-text-actions">
            <Button variant="outline" onClick={handleCancel}>
              {cancelLabel}
            </Button>
            <Button variant="primary" onClick={handleConfirm}>
              {confirmLabel}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
