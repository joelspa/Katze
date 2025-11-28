// Componente de tarjeta de gato
// Muestra una vista previa de un gato disponible para adopción

import React, { useState, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import './CatCard.css';
import CatDetailModal from './CatDetailModal';

// Interfaz que define la estructura de datos de un gato
export interface Cat {
    id: number;
    name: string;
    age: string;
    description: string;
    photos_url: string[];
    sterilization_status: 'esterilizado' | 'pendiente' | 'no_aplica';
    health_status?: string;
    story?: string;
    breed?: string;
    living_space_requirement?: 'casa_grande' | 'departamento' | 'cualquiera';
}

interface CatCardProps {
    cat: Cat;
}

const CatCard: React.FC<CatCardProps> = ({ cat }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    
    // Usa la primera foto o una imagen placeholder si no hay fotos
    const photos = cat.photos_url && cat.photos_url.length > 0
        ? cat.photos_url
        : ['https://placehold.co/300x200/e0e0e0/666?text=Sin+Foto'];
    
    const imageUrl = photos[currentPhotoIndex];
    
    // Distancia mínima de swipe (en px)
    const minSwipeDistance = 50;

    const handlePrevPhoto = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentPhotoIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
    }, [photos.length]);

    const handleNextPhoto = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentPhotoIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
    }, [photos.length]);

    // Manejo de touch para swipe
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
            // Swipe izquierda: siguiente foto
            setCurrentPhotoIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
        } else if (isRightSwipe) {
            // Swipe derecha: foto anterior
            setCurrentPhotoIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
        }
    };

    // Función para obtener la clase CSS según el estado de esterilización
    const getStatusClass = () => {
        switch (cat.sterilization_status) {
            case 'esterilizado':
                return 'status-esterilizado';
            case 'pendiente':
                return 'status-pendiente';
            default:
                return '';
        }
    };

    // Función para obtener el icono y texto según el tipo de vivienda
    const getLivingSpaceInfo = () => {
        switch (cat.living_space_requirement) {
            case 'casa_grande':
                return { icon: <svg viewBox="0 0 24 24" fill="currentColor" style={{width: '16px', height: '16px', display: 'inline', marginRight: '4px', verticalAlign: 'middle'}}><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>, text: 'Casa Grande' };
            case 'departamento':
                return { icon: <svg viewBox="0 0 24 24" fill="currentColor" style={{width: '16px', height: '16px', display: 'inline', marginRight: '4px', verticalAlign: 'middle'}}><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/></svg>, text: 'Departamento' };
            default:
                return { icon: <svg viewBox="0 0 24 24" fill="currentColor" style={{width: '16px', height: '16px', display: 'inline', marginRight: '4px', verticalAlign: 'middle'}}><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>, text: 'Cualquier espacio' };
        }
    };

    // Función para formatear la edad del gato con emoji
    const getAgeDisplay = () => {
        const ageStr = cat.age?.toLowerCase() || '';
        
        if (ageStr.includes('cachorro') || ageStr === 'cachorro') {
            return { text: 'Cachorro', subtitle: '0-11 meses' };
        } else if (ageStr.includes('joven') || ageStr === 'joven') {
            return { text: 'Joven', subtitle: '1 año' };
        } else if (ageStr.includes('adulto') || ageStr === 'adulto') {
            return { text: 'Adulto', subtitle: '2-7 años' };
        } else if (ageStr.includes('senior') || ageStr === 'senior') {
            return { text: 'Senior', subtitle: '8+ años' };
        }
        
        return { text: cat.age || 'Edad desconocida', subtitle: '' };
    };

    const ageDisplay = getAgeDisplay();

    const handleCardClick = () => {
        setIsModalOpen(true);
    };

    const handleLinkClick = (e: React.MouseEvent) => {
        // Evita que el clic en el botón abra el modal
        e.stopPropagation();
    };

    return (
        <>
            <div className="cat-card" onClick={handleCardClick}>
                <div 
                    className="cat-card-image-container"
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    <img
                        src={imageUrl}
                        alt={`${cat.name} - Foto ${currentPhotoIndex + 1}`}
                        className="cat-card-img"
                        onError={(e) => {
                            e.currentTarget.src = 'https://placehold.co/300x200/e0e0e0/666?text=Sin+Foto';
                        }}
                    />
                    
                    {/* Controles de navegación si hay más de una foto */}
                    {photos.length > 1 && (
                        <>
                            <button 
                                className="cat-card-photo-nav cat-card-photo-prev"
                                onClick={handlePrevPhoto}
                                aria-label="Foto anterior"
                            >
                                <svg viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </button>
                            <button 
                                className="cat-card-photo-nav cat-card-photo-next"
                                onClick={handleNextPhoto}
                                aria-label="Foto siguiente"
                            >
                                <svg viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                            </button>
                            
                            {/* Indicadores de foto */}
                            <div className="cat-card-photo-indicators">
                                {photos.map((_, index) => (
                                    <span
                                        key={index}
                                        className={`cat-card-photo-dot ${index === currentPhotoIndex ? 'active' : ''}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentPhotoIndex(index);
                                        }}
                                    />
                                ))}
                            </div>
                            
                            {/* Contador de fotos */}
                            <div className="cat-card-photo-counter">
                                {currentPhotoIndex + 1} / {photos.length}
                            </div>
                        </>
                    )}
                    
                    <span className={`cat-card-badge ${getStatusClass()}`}>
                        <svg viewBox="0 0 20 20" fill="currentColor" style={{width: '14px', height: '14px', display: 'inline', marginRight: '4px'}}>
                            {cat.sterilization_status === 'esterilizado' ? (
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            ) : (
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            )}
                        </svg>
                        {cat.sterilization_status === 'esterilizado' ? 'Esterilizado' : 'Pendiente'}
                    </span>
                </div>
                <div className="cat-card-body">
                    <div className="cat-card-header">
                        <h3 className="cat-card-title">{cat.name}</h3>
                        <div className="cat-card-age-container">
                            <div className="cat-card-age-text">
                                <span className="cat-card-age-main">{ageDisplay.text}</span>
                                {ageDisplay.subtitle && (
                                    <span className="cat-card-age-subtitle">{ageDisplay.subtitle}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Badges de Raza y Tipo de Vivienda */}
                    <div className="cat-card-badges">
                        {cat.breed && (
                            <span className="cat-card-breed-badge">
                                <svg viewBox="0 0 24 24" fill="currentColor" style={{width: '16px', height: '16px', display: 'inline', marginRight: '4px', verticalAlign: 'middle'}}>
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                                </svg>
                                {cat.breed}
                            </span>
                        )}
                        {cat.living_space_requirement && (
                            <span className="cat-card-living-badge">
                                {getLivingSpaceInfo().icon} {getLivingSpaceInfo().text}
                            </span>
                        )}
                    </div>

                    <p className="cat-card-description">
                        {cat.description ? (cat.description.length > 80 ? cat.description.substring(0, 80) + '...' : cat.description) : 'Sin descripción disponible.'}
                    </p>

                    <div className="cat-card-footer">
                        <Link 
                            to={`/cats/${cat.id}`} 
                            className="cat-card-button"
                            onClick={handleLinkClick}
                        >
                            Conocer más
                        </Link>
                    </div>
                </div>
            </div>

            <CatDetailModal 
                cat={cat}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
};

// Memo para evitar re-renders innecesarios
export default memo(CatCard, (prevProps, nextProps) => {
    // Solo re-renderizar si el ID del gato cambia
    return prevProps.cat.id === nextProps.cat.id;
});