// Componente de tarjeta de gato
// Muestra una vista previa de un gato disponible para adopción

import React from 'react';
import { Link } from 'react-router-dom';
import './CatCard.css';

// Interfaz que define la estructura de datos de un gato
export interface Cat {
    id: number;
    name: string;
    age: string;
    description: string;
    photos_url: string[];
    sterilization_status: 'esterilizado' | 'pendiente' | 'no_aplica';
}

interface CatCardProps {
    cat: Cat;
}

const CatCard: React.FC<CatCardProps> = ({ cat }) => {
    // Usa la primera foto o una imagen placeholder si no hay fotos
    const imageUrl = cat.photos_url && cat.photos_url.length > 0
        ? cat.photos_url[0]
        : 'https://via.placeholder.com/300';

    return (
        <div className="cat-card">
            <img src={imageUrl} alt={cat.name} className="cat-card-img" />
            <div className="cat-card-body">
                <h3 className="cat-card-title">{cat.name}</h3>
                <p className="cat-card-text">Edad: {cat.age}</p>
                <p className="cat-card-text">
                    Esterilización: {cat.sterilization_status}
                </p>
                <Link to={`/cats/${cat.id}`} className="cat-card-button">
                    Ver Detalles
                </Link>
            </div>
        </div>
    );
};

export default CatCard;