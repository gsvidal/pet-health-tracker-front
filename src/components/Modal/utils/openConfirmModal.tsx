import type { ReactNode } from 'react';
import { useModalStore } from '../../../store/modal.store';
import { Button } from '../../Button/Button';

type ConfirmModalOptions = {
  title?: string;
  message: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
};

export const openConfirmModal = ({
  title = 'Confirmar acción',
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
}: ConfirmModalOptions) => {
  const closeModal = () => useModalStore.getState().closeModal();

  useModalStore.getState().openModal({
    title,
    content: (
      <div>
        {typeof message === 'string' ? <p>{message}</p> : message}
        <div className="confirm-modal__actions">
          <Button
            variant="outline"
            onClick={() => {
              closeModal();
              onCancel?.();
            }}
          >
            {cancelLabel}
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              closeModal();
              onConfirm();
            }}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    ),
  });
};
