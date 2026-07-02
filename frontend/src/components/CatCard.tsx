import React, { useState, useCallback, memo } from 'react';
import './CatCard.css';
import CatDetailModal from './CatDetailModal';

export interface Cat {
    id: number;
    name: string;
    age: string | number;
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

const HouseIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{width: '14px', height: '14px', display: 'inline', marginRight: '4px', verticalAlign: 'middle'}} aria-hidden="true">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
    </svg>
);

const ApartmentIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{width: '14px', height: '14px', display: 'inline', marginRight: '4px', verticalAlign: 'middle'}} aria-hidden="true">
        <path d="M17 11V3H7v4H3v14h8v-4h2v4h8V11h-4zM7 19H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm4 4H9v-2h2v2zm0-4H9V9h2v2zm0-4H9V5h2v2zm4 8h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm4 12h-2v-2h2v2zm0-4h-2v-2h2v2z"/>
    </svg>
);

const StarIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{width: '14px', height: '14px', display: 'inline', marginRight: '4px', verticalAlign: 'middle'}} aria-hidden="true">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
    </svg>
);

const CatCard: React.FC<CatCardProps> = ({ cat }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const photos = cat.photos_url && cat.photos_url.length > 0
        ? cat.photos_url
        : ['https://cdn-icons-png.flaticon.com/512/616/616430.png'];

    const imageUrl = photos[currentPhotoIndex];
    const minSwipeDistance = 50;

    const handlePrevPhoto = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentPhotoIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
    }, [photos.length]);

    const handleNextPhoto = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentPhotoIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
    }, [photos.length]);

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
        if (distance > minSwipeDistance) {
            setCurrentPhotoIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
        } else if (distance < -minSwipeDistance) {
            setCurrentPhotoIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
        }
    };

    const getLivingSpaceInfo = () => {
        switch (cat.living_space_requirement) {
            case 'casa_grande':
                return { icon: <HouseIcon />, text: 'Casa Grande' };
            case 'departamento':
                return { icon: <ApartmentIcon />, text: 'Departamento' };
            default:
                return { icon: <StarIcon />, text: 'Cualquier espacio' };
        }
    };

    const getAgeDisplay = () => {
        const ageStr = String(cat.age || '').toLowerCase();
        if (ageStr.includes('cachorro')) return { text: 'Cachorro', subtitle: '0-11 meses' };
        if (ageStr.includes('joven'))    return { text: 'Joven',    subtitle: '1 año' };
        if (ageStr.includes('adulto'))   return { text: 'Adulto',   subtitle: '2-7 años' };
        if (ageStr.includes('senior'))   return { text: 'Senior',   subtitle: '7+ años' };

        const ageNum = parseInt(ageStr);
        if (!isNaN(ageNum)) {
            if (ageNum < 1)  return { text: 'Cachorro', subtitle: 'Meses' };
            if (ageNum <= 2) return { text: 'Joven',    subtitle: `${ageNum} años` };
            if (ageNum <= 7) return { text: 'Adulto',   subtitle: `${ageNum} años` };
            return { text: 'Senior', subtitle: `${ageNum} años` };
        }

        return { text: String(cat.age), subtitle: 'Edad' };
    };

    const ageDisplay = getAgeDisplay();
    const livingSpace = getLivingSpaceInfo();

    return (
        <>
            <div
                className="cat-card"
                role="button"
                tabIndex={0}
                onClick={() => setIsModalOpen(true)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsModalOpen(true); } }}
            >
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

                    <span className="badge-age">{ageDisplay.text}</span>
                    <span className="badge-status disponible">Disponible</span>

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

                            <div className="cat-card-photo-indicators">
                                {photos.map((_, index) => (
                                    <span
                                        key={index}
                                        className={`cat-card-photo-dot${index === currentPhotoIndex ? ' active' : ''}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentPhotoIndex(index);
                                        }}
                                    />
                                ))}
                            </div>

                            <div className="cat-card-photo-counter">
                                {currentPhotoIndex + 1} / {photos.length}
                            </div>
                        </>
                    )}
                </div>

                <div className="card-body">
                    <div className="card-header">
                        <h3 className="cat-name">{cat.name}</h3>
                        <span className="cat-breed-tag">{cat.breed || 'Mestizo'}</span>
                    </div>

                    <p className="cat-meta">{ageDisplay.text} · {ageDisplay.subtitle}</p>

                    <div className="chips-container">
                        {cat.living_space_requirement && (
                            <span className="chip">
                                {livingSpace.icon}
                                {livingSpace.text}
                            </span>
                        )}
                        {cat.sterilization_status === 'esterilizado' && (
                            <span className="chip chip-green">Esterilizado</span>
                        )}
                        {cat.health_status && (
                            <span className="chip chip-green">Saludable</span>
                        )}
                    </div>

                    <button
                        className="btn-adopt"
                        onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); }}
                    >
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

export default memo(CatCard, (prevProps, nextProps) => prevProps.cat.id === nextProps.cat.id);
