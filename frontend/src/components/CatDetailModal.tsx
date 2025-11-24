// Modal para mostrar detalles completos de un gato
import React from 'react';
import { Link } from 'react-router-dom';
import './CatDetailModal.css';
import type { Cat } from './CatCard';

interface CatDetailModalProps {
    cat: Cat;
    isOpen: boolean;
    onClose: () => void;
}

const CatDetailModal: React.FC<CatDetailModalProps> = ({ cat, isOpen, onClose }) => {
    // Cierra el modal si se hace clic en el overlay
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Previene el scroll del body cuando el modal está abierto
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const imageUrl = cat.photos_url && cat.photos_url.length > 0
        ? cat.photos_url[0]
        : 'https://placehold.co/400x300/e0e0e0/666?text=Sin+Foto';

    return (
        <div className="cat-modal-overlay" onClick={handleOverlayClick}>
            <div className="cat-modal-content">
                <button className="cat-modal-close" onClick={onClose}>
                    <svg viewBox="0 0 20 20" fill="currentColor" style={{width: '24px', height: '24px'}}>
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>

                <div className="cat-modal-body">
                    <div className="cat-modal-image-section">
                        <img
                            src={imageUrl}
                            alt={cat.name}
                            className="cat-modal-image"
                            onError={(e) => {
                                e.currentTarget.src = 'https://placehold.co/400x300/e0e0e0/666?text=Sin+Foto';
                            }}
                        />
                        {cat.photos_url && cat.photos_url.length > 1 && (
                            <div className="cat-modal-gallery-indicator">
                                <svg viewBox="0 0 20 20" fill="currentColor" style={{width: '16px', height: '16px', marginRight: '6px'}}>
                                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                </svg>
                                +{cat.photos_url.length - 1} fotos más
                            </div>
                        )}
                    </div>

                    <div className="cat-modal-info-section">
                        <div className="cat-modal-header">
                            <h2>{cat.name}</h2>
                            <span className="cat-modal-age">{cat.age}</span>
                        </div>

                        <div className="cat-modal-status-badges">
                            <span className={`cat-modal-badge ${cat.sterilization_status}`}>
                                <svg viewBox="0 0 20 20" fill="currentColor" style={{width: '16px', height: '16px', marginRight: '6px'}}>
                                    {cat.sterilization_status === 'esterilizado' ? (
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    ) : (
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                    )}
                                </svg>
                                {cat.sterilization_status === 'esterilizado' ? 'Esterilizado' : 'Pendiente esterilización'}
                            </span>
                            {cat.health_status && (
                                <span className="cat-modal-badge health">
                                    <svg viewBox="0 0 20 20" fill="currentColor" style={{width: '16px', height: '16px', marginRight: '6px'}}>
                                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                    </svg>
                                    {cat.health_status}
                                </span>
                            )}
                        </div>

                        <div className="cat-modal-section">
                            <h3>
                                <svg viewBox="0 0 20 20" fill="currentColor" style={{width: '18px', height: '18px', marginRight: '8px', verticalAlign: 'middle'}}>
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                Descripción
                            </h3>
                            <p>{cat.description || 'Sin descripción disponible.'}</p>
                        </div>

                        {cat.story && (
                            <div className="cat-modal-section">
                                <h3>
                                    <svg viewBox="0 0 20 20" fill="currentColor" style={{width: '18px', height: '18px', marginRight: '8px', verticalAlign: 'middle'}}>
                                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                                    </svg>
                                    Su Historia
                                </h3>
                                <p>{cat.story}</p>
                            </div>
                        )}

                        <div className="cat-modal-actions">
                            <Link to={`/cats/${cat.id}`} className="cat-modal-btn primary">
                                <svg viewBox="0 0 20 20" fill="currentColor" style={{width: '18px', height: '18px', marginRight: '8px'}}>
                                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                </svg>
                                Solicitar Adopción
                            </Link>
                            <button onClick={onClose} className="cat-modal-btn secondary">
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CatDetailModal;
