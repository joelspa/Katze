// Carrusel de gatos - Muestra un número limitado de gatos con navegación
import { useState } from 'react';
import CatCard, { type Cat } from './CatCard';
import './CatCarousel.css';

interface CatCarouselProps {
    cats: Cat[];
    maxVisible?: number;
}

const CatCarousel = ({ cats, maxVisible = 4 }: CatCarouselProps) => {
    const [startIndex, setStartIndex] = useState(0);

    const visibleCats = cats.slice(startIndex, startIndex + maxVisible);
    const canGoBack = startIndex > 0;
    const canGoForward = startIndex + maxVisible < cats.length;

    const handleNext = () => {
        if (canGoForward) {
            setStartIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (canGoBack) {
            setStartIndex(prev => prev - 1);
        }
    };

    if (cats.length === 0) {
        return null;
    }

    return (
        <div className="carousel-container">
            <button 
                className="carousel-btn prev-btn" 
                onClick={handlePrev}
                disabled={!canGoBack}
                aria-label="Anterior"
            >
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                </svg>
            </button>

            <div className="carousel-track">
                {visibleCats.map((cat) => (
                    <div key={cat.id} className="carousel-item">
                        <CatCard cat={cat} />
                    </div>
                ))}
            </div>

            <button 
                className="carousel-btn next-btn" 
                onClick={handleNext}
                disabled={!canGoForward}
                aria-label="Siguiente"
            >
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
                </svg>
            </button>

            <div className="carousel-indicators">
                {Array.from({ length: Math.ceil(cats.length / maxVisible) }).map((_, idx) => (
                    <button
                        key={idx}
                        className={`indicator ${Math.floor(startIndex / maxVisible) === idx ? 'active' : ''}`}
                        onClick={() => setStartIndex(idx * maxVisible)}
                        aria-label={`Ir a página ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default CatCarousel;
