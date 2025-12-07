// Componente de tarjeta de gato
// Muestra una vista previa de un gato disponible para adopción

import React, { useState, useCallback, memo } from 'react';
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
    
    // Usa la primera foto o una silueta de gato elegante si no hay fotos
    const photos = cat.photos_url && cat.photos_url.length > 0
        ? cat.photos_url
        : ['https://cdn-icons-png.flaticon.com/512/616/616430.png'];
    
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

    const handleButtonClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsModalOpen(true);
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
                        fetchPriority="high"
                        loading="eager"
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = 'https://cdn-icons-png.flaticon.com/512/616/616430.png';
                        }}
                    />
                    
                    {/* Controles de navegación si hay más de una foto */}
                    {/* Age badge floating on top-right */}
                    <span className="badge-age">
                        {ageDisplay.text}
                    </span>

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
                    {/* Status badge on image */}
                    <span className="badge-status disponible">Disponible</span>
                    
                    {/* Hover overlay */}
                    <div className="hover-overlay">
                        <span>Ver Perfil Completo</span>
                    </div>
                </div>
                
                <div className="card-body">
                    <div className="card-header">
                        <h3 className="cat-name">{cat.name}</h3>
                        <span className="cat-gender male" title="Macho">♂</span>
                    </div>

                    <p className="cat-meta">{cat.breed || 'Mestizo'} • {ageDisplay.text}</p>

                    {/* Chips compactos */}
                    <div className="chips-container">
                        {cat.living_space_requirement && (
                            <span className="chip">
                                🏡 {getLivingSpaceInfo().text}
                            </span>
                        )}
                        {cat.sterilization_status === 'esterilizado' && (
                            <span className="chip">
                                ✂️ Esterilizado
                            </span>
                        )}
                        {cat.health_status && (
                            <span className="chip">
                                ❤️ Saludable
                            </span>
                        )}
                    </div>
                    
                    <button className="btn-action" onClick={handleButtonClick}>
                        Conocer a {cat.name}
                    </button>
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