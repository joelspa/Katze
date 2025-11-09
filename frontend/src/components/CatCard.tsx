// frontend/src/components/CatCard.tsx
import React from 'react';
import { Link } from 'react-router-dom'; // Para hacer clic e ir al detalle
import './CatCard.css'; // Crearemos este archivo CSS

// Definimos la "forma" de un gato con TypeScript
// Esto debe coincidir con tu backend
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
    // Tomamos la primera foto, o una por defecto si no hay
    const imageUrl = cat.photos_url && cat.photos_url.length > 0
        ? cat.photos_url[0]
        : 'https://via.placeholder.com/300'; // Una imagen placeholder

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