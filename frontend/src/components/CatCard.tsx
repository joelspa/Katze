// Componente de tarjeta de gato
// Muestra una vista previa de un gato disponible para adopción

import React, { useState } from 'react';
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
}

interface CatCardProps {
    cat: Cat;
}

const CatCard: React.FC<CatCardProps> = ({ cat }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Usa la primera foto o una imagen placeholder si no hay fotos
    const imageUrl = cat.photos_url && cat.photos_url.length > 0
        ? cat.photos_url[0]
        : 'https://placehold.co/300x200/e0e0e0/666?text=Sin+Foto';

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
                <div className="cat-card-image-container">
                    <img
                        src={imageUrl}
                        alt={cat.name}
                        className="cat-card-img"
                        onError={(e) => {
                            e.currentTarget.src = 'https://placehold.co/300x200/e0e0e0/666?text=Sin+Foto';
                        }}
                    />
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
                        <span className="cat-card-age">{cat.age}</span>
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

export default CatCard;