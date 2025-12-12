import { X } from 'lucide-react';
import { Button } from '../Button/Button';
import './ModalText.scss';
import { useEffect, useRef } from 'react';

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
  // Guardar el overflow original del body para restaurarlo correctamente
  const originalOverflowRef = useRef<string>('');

  // Manejo del overflow del body (bloquear scroll al abrir modal y restaurar al cerrar)
  useEffect(() => {
    if (isOpen) {
      // Guardar valor actual solo la primera vez que abrimos
      if (!originalOverflowRef.current) {
        originalOverflowRef.current = document.body.style.overflow || '';
      }
      document.body.style.overflow = 'hidden';
    } else {
      // Restaurar cuando el modal se cierra
      document.body.style.overflow = originalOverflowRef.current || '';
    }

    // Cleanup por si el componente se desmonta
    return () => {
      document.body.style.overflow = originalOverflowRef.current || '';
    };
  }, [isOpen]);

  // Cerrar con ESC
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
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
