// Modal personalizado para alertas, confirmaciones e inputs
import React, { useState, useEffect } from 'react';
import './CustomModal.css';

interface CustomModalProps {
    isOpen: boolean;
    onClose: () => void;
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

const CustomModal: React.FC<CustomModalProps> = ({
    isOpen,
    onClose,
    type,
    title,
    message,
    onConfirm,
    onCancel,
    inputPlaceholder = '',
    inputDefaultValue = '',
    confirmText = 'Aceptar',
    cancelText = 'Cancelar'
}) => {
    const [inputValue, setInputValue] = useState(inputDefaultValue);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setInputValue(inputDefaultValue);
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, inputDefaultValue]);

    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            handleCancel();
        }
    };

    const handleConfirm = () => {
        if (onConfirm) {
            if (type === 'prompt') {
                onConfirm(inputValue);
            } else {
                onConfirm();
            }
        }
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else {
            onClose();
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'alert':
                return (
                    <svg viewBox="0 0 20 20" fill="currentColor" className="modal-icon alert-icon">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                );
            case 'confirm':
                return (
                    <svg viewBox="0 0 20 20" fill="currentColor" className="modal-icon confirm-icon">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                );
            case 'prompt':
                return (
                    <svg viewBox="0 0 20 20" fill="currentColor" className="modal-icon prompt-icon">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                );
        }
    };

    return (
        <div className="custom-modal-overlay" onClick={handleOverlayClick}>
            <div className="custom-modal-content">
                <div className="custom-modal-header">
                    {getIcon()}
                    {title && <h3>{title}</h3>}
                </div>
                
                <div className="custom-modal-body">
                    <p>{message}</p>
                    {type === 'prompt' && (
                        <input
                            type="text"
                            className="custom-modal-input"
                            placeholder={inputPlaceholder}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            autoFocus
                        />
                    )}
                </div>

                <div className="custom-modal-footer">
                    {type === 'alert' ? (
                        <button className="custom-modal-btn primary" onClick={handleConfirm}>
                            {confirmText}
                        </button>
                    ) : (
                        <>
                            <button className="custom-modal-btn secondary" onClick={handleCancel}>
                                {cancelText}
                            </button>
                            <button className="custom-modal-btn primary" onClick={handleConfirm}>
                                {confirmText}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomModal;
