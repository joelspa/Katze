// Modal para mostrar detalles completos de un gato
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './CatDetailModal.css';
import type { Cat } from './CatCard';

interface CatDetailModalProps {
    cat: Cat;
    isOpen: boolean;
    onClose: () => void;
}

const CatDetailModal: React.FC<CatDetailModalProps> = ({ cat, isOpen, onClose }) => {
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const photos = cat.photos_url && cat.photos_url.length > 0
        ? cat.photos_url
        : ['https://placehold.co/400x300/e0e0e0/666?text=Sin+Foto'];

    const minSwipeDistance = 50;

    // Función para formatear la edad del gato
    const getAgeDisplay = () => {
        const ageStr = String(cat.age || '').toLowerCase();
        
        if (ageStr.includes('cachorro') || ageStr === 'cachorro') {
            return { text: 'Cachorro', subtitle: '0-11 meses' };
        } else if (ageStr.includes('joven') || ageStr === 'joven') {
            return { text: 'Joven', subtitle: '1 año' };
        } else if (ageStr.includes('adulto') || ageStr === 'adulto') {
            return { text: 'Adulto', subtitle: '2-7 años' };
        } else if (ageStr.includes('senior') || ageStr === 'senior') {
            return { text: 'Senior', subtitle: '8+ años' };
        }
        
        // Si es un número, intentar categorizarlo
        const ageNum = parseInt(ageStr);
        if (!isNaN(ageNum)) {
            if (ageNum < 1) return { text: 'Cachorro', subtitle: 'Meses' };
            if (ageNum <= 2) return { text: 'Joven', subtitle: `${ageNum} años` };
            if (ageNum <= 7) return { text: 'Adulto', subtitle: `${ageNum} años` };
            return { text: 'Senior', subtitle: `${ageNum} años` };
        }

        return { text: String(cat.age || 'Edad desconocida'), subtitle: '' };
    };

    const ageDisplay = getAgeDisplay();

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

    // Resetear índice de foto cuando cambia el gato o se cierra el modal
    React.useEffect(() => {
        if (isOpen) {
            setCurrentPhotoIndex(0);
        }
    }, [isOpen, cat.id]);

    // Funciones de navegación del carrusel
    const handlePrevPhoto = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentPhotoIndex((prev) => 
            prev === 0 ? photos.length - 1 : prev - 1
        );
    };

    const handleNextPhoto = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentPhotoIndex((prev) => 
            prev === photos.length - 1 ? 0 : prev + 1
        );
    };

    // Manejo de eventos táctiles para swipe
    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            handleNextPhoto({} as React.MouseEvent);
        } else if (isRightSwipe) {
            handlePrevPhoto({} as React.MouseEvent);
        }
    };

    if (!isOpen) return null;

    const imageUrl = photos[currentPhotoIndex];

    return (
        <div className="cat-modal-overlay" onClick={handleOverlayClick}>
            <div className="cat-modal-content">
                <button className="cat-modal-close" onClick={onClose}>
                    <svg viewBox="0 0 20 20" fill="currentColor" style={{width: '24px', height: '24px'}}>
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>

                <div className="cat-modal-body">
                    <div 
                        className="cat-modal-image-section"
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                    >
                        <img
                            src={imageUrl}
                            alt={`${cat.name} - Foto ${currentPhotoIndex + 1}`}
                            className="cat-modal-image"
                            onError={(e) => {
                                e.currentTarget.src = 'https://placehold.co/400x300/e0e0e0/666?text=Sin+Foto';
                            }}
                        />
                        
                        {photos.length > 1 && (
                            <>
                                {/* Botones de navegación */}
                                <button 
                                    className="cat-modal-photo-nav cat-modal-photo-prev"
                                    onClick={handlePrevPhoto}
                                    aria-label="Foto anterior"
                                >
                                    <svg viewBox="0 0 24 24" fill="currentColor" style={{width: '24px', height: '24px'}}>
                                        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                                    </svg>
                                </button>
                                
                                <button 
                                    className="cat-modal-photo-nav cat-modal-photo-next"
                                    onClick={handleNextPhoto}
                                    aria-label="Foto siguiente"
                                >
                                    <svg viewBox="0 0 24 24" fill="currentColor" style={{width: '24px', height: '24px'}}>
                                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                                    </svg>
                                </button>

                                {/* Indicadores de puntos */}
                                <div className="cat-modal-photo-indicators">
                                    {photos.map((_, index) => (
                                        <button
                                            key={index}
                                            className={`cat-modal-photo-dot ${index === currentPhotoIndex ? 'active' : ''}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setCurrentPhotoIndex(index);
                                            }}
                                            aria-label={`Ir a foto ${index + 1}`}
                                        />
                                    ))}
                                </div>

                                {/* Contador de fotos */}
                                <div className="cat-modal-photo-counter">
                                    {currentPhotoIndex + 1} / {photos.length}
                                </div>
                            </>
                        )}
                    </div>

                    <div className="cat-modal-info-section">
                        <div className="cat-modal-header">
                            <h2>{cat.name}</h2>
                            <div className="cat-modal-age-container">
                                <div className="cat-modal-age-text">
                                    <span className="cat-modal-age-main">{ageDisplay.text}</span>
                                    {ageDisplay.subtitle && (
                                        <span className="cat-modal-age-subtitle">{ageDisplay.subtitle}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="cat-modal-status-badges">
                            {cat.breed && (
                                <span className="cat-modal-badge breed">
                                    <svg viewBox="0 0 24 24" fill="currentColor" style={{width: '16px', height: '16px', marginRight: '6px'}}>
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                                    </svg>
                                    {cat.breed}
                                </span>
                            )}
                            {cat.living_space_requirement && (
                                <span className="cat-modal-badge living-space">
                                    {cat.living_space_requirement === 'casa_grande' ? (
                                        <>
                                            <svg viewBox="0 0 24 24" fill="currentColor" style={{width: '16px', height: '16px', marginRight: '6px'}}>
                                                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                                            </svg>
                                            Casa Grande
                                        </>
                                    ) : cat.living_space_requirement === 'departamento' ? (
                                        <>
                                            <svg viewBox="0 0 24 24" fill="currentColor" style={{width: '16px', height: '16px', marginRight: '6px'}}>
                                                <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
                                            </svg>
                                            Departamento
                                        </>
                                    ) : (
                                        <>
                                            <svg viewBox="0 0 24 24" fill="currentColor" style={{width: '16px', height: '16px', marginRight: '6px'}}>
                                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                            </svg>
                                            Cualquier espacio
                                        </>
                                    )}
                                </span>
                            )}
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
