// Hook para manejar modales personalizados (alert, confirm, prompt)
import { useState } from 'react';

interface ModalState {
    isOpen: boolean;
    type: 'alert' | 'confirm' | 'prompt';
    title?: string;
    message: string;
    onConfirm?: (value?: string) => void;
    onCancel?: () => void;
    inputPlaceholder?: string;
    inputDefaultValue?: string;
    confirmText?: string;
    cancelText?: string;
}

export const useModal = () => {
    const [modalState, setModalState] = useState<ModalState>({
        isOpen: false,
        type: 'alert',
        message: '',
    });

    // Cierra el modal actual
    const closeModal = () => {
        setModalState(prev => ({ ...prev, isOpen: false }));
    };

    // Muestra modal de alerta con un solo botón
    const showAlert = (message: string, title?: string) => {
        return new Promise<void>((resolve) => {
            setModalState({
                isOpen: true,
                type: 'alert',
                title,
                message,
                onConfirm: () => {
                    setModalState(prev => ({ ...prev, isOpen: false }));
                    resolve();
                },
            });
        });
    };

    // Muestra modal de confirmación con dos botones
    const showConfirm = (message: string, title?: string) => {
        return new Promise<boolean>((resolve) => {
            setModalState({
                isOpen: true,
                type: 'confirm',
                title,
                message,
                onConfirm: () => {
                    setModalState(prev => ({ ...prev, isOpen: false }));
                    resolve(true);
                },
                onCancel: () => {
                    setModalState(prev => ({ ...prev, isOpen: false }));
                    resolve(false);
                },
                confirmText: 'Confirmar',
                cancelText: 'Cancelar',
            });
        });
    };

    const showPrompt = (message: string, placeholder?: string, defaultValue?: string, title?: string) => {
        return new Promise<string | null>((resolve) => {
            setModalState({
                isOpen: true,
                type: 'prompt',
                title,
                message,
                inputPlaceholder: placeholder,
                inputDefaultValue: defaultValue,
                onConfirm: (value) => {
                    setModalState(prev => ({ ...prev, isOpen: false }));
                    resolve(value || null);
                },
                onCancel: () => {
                    setModalState(prev => ({ ...prev, isOpen: false }));
                    resolve(null);
                },
                confirmText: 'Aceptar',
                cancelText: 'Cancelar',
            });
        });
    };

    return {
        modalState,
        showAlert,
        showConfirm,
        showPrompt,
        closeModal,
    };
};
