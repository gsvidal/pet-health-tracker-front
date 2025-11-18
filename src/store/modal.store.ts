import { create } from 'zustand';
import type { ReactNode } from 'react';

type ModalTextVariant = 'default' | 'confirm';

interface ModalState {
  isOpen: boolean;
  title: string | null;
  content: ReactNode | null;
  variant: ModalTextVariant;
  onConfirm: (() => void) | null;
  onCancel: (() => void) | null;
  confirmLabel: string;
  cancelLabel: string;

  // Acciones
  openModal: (config: {
    title?: string;
    content: ReactNode;
    variant?: ModalTextVariant;
    onConfirm?: () => void;
    onCancel?: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
  }) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  title: null,
  content: null,
  variant: 'default',
  onConfirm: null,
  onCancel: null,
  confirmLabel: 'Confirmar',
  cancelLabel: 'Cancelar',

  openModal: ({
    title,
    content,
    variant = 'default',
    onConfirm,
    onCancel,
    confirmLabel = 'Confirmar',
    cancelLabel = 'Cancelar',
  }) => {
    set({
      isOpen: true,
      title: title || null,
      content,
      variant,
      onConfirm: onConfirm || null,
      onCancel: onCancel || null,
      confirmLabel,
      cancelLabel,
    });
  },

  closeModal: () => {
    set({
      isOpen: false,
      title: null,
      content: null,
      variant: 'default',
      onConfirm: null,
      onCancel: null,
      confirmLabel: 'Confirmar',
      cancelLabel: 'Cancelar',
    });
  },
}));
