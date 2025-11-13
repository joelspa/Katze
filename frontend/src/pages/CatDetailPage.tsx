// Página de detalles de gato
// Muestra información completa de un gato y permite enviar solicitud de adopción

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios, { isAxiosError } from 'axios';
import { type Cat } from '../components/CatCard';
import { useAuth } from '../context/AuthContext';
import AdoptionFormModal from '../components/AdoptionFormModal';
import './CatDetailPage.css';

const CatDetailPage = () => {
    const { id } = useParams();
    const [cat, setCat] = useState<Cat | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);

    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    // Carga información del gato al montar el componente
    useEffect(() => {
        const fetchCat = async () => {
            try {
                setLoading(true);
                const API_URL = `http://localhost:5000/api/cats/${id}`;
                const response = await axios.get(API_URL);
                
                // El backend devuelve { success: true, data: { cat: {...} } }
                const catData = response.data.data?.cat || response.data.cat || response.data;
                setCat(catData);
                setError(null);
            } catch (error: unknown) {
                let errorMessage = 'Error al cargar el gato';
                if (isAxiosError(error)) {
                    errorMessage = error.response?.data?.message || 'Gato no encontrado';
                }
                setError(errorMessage);
                console.error(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCat();
        }
    }, [id]);

    // Maneja el clic en el botón de adoptar según el estado de autenticación y rol
    const handleAdoptClick = () => {
        if (!isAuthenticated()) {
            alert('Debes iniciar sesión para adoptar.');
            navigate('/login');
        } else if (user?.role === 'adoptante') {
            setShowModal(true);
        } else if (user?.role === 'rescatista') {
            alert('Los rescatistas no pueden adoptar gatos.');
        }
    };

    if (loading) {
        return (
            <div className="detail-container">
                <p className="loading-message">Cargando información del gatito...</p>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="detail-container">
                <p className="error-message">{error}</p>
            </div>
        );
    }
    
    if (!cat) {
        return (
            <div className="detail-container">
                <p className="error-message">Gato no encontrado.</p>
            </div>
        );
    }

    const imageUrl = cat.photos_url && cat.photos_url.length > 0
        ? cat.photos_url[0]
        : 'https://placehold.co/600x400/e0e0e0/666?text=Sin+Foto';

    return (
        <>
            <div className="detail-container">
                <img 
                    src={imageUrl} 
                    alt={cat.name} 
                    className="detail-img"
                    onError={(e) => {
                        // Fallback si la imagen falla al cargar
                        e.currentTarget.src = 'https://placehold.co/600x400/e0e0e0/666?text=Sin+Foto';
                    }}
                />
                <div className="detail-info">
                    <h1>{cat.name}</h1>
                    <p className="detail-age">Edad: {cat.age}</p>
                    <div className="detail-section">
                        <h3>Descripción</h3>
                        <p>{cat.description}</p>
                    </div>
                    <div className="detail-section">
                        <h3>Salud</h3>
                        <p>{cat.health_status || 'No especificado'}</p>
                    </div>
                    <div className="detail-section">
                        <h3>Esterilización</h3>
                        <p>{cat.sterilization_status}</p>
                    </div>

                    <button className="apply-button" onClick={handleAdoptClick}>
                        ¡Quiero adoptar a {cat.name}!
                    </button>
                </div>
            </div>

            {/* Modal de formulario de adopción */}
            {showModal && (
                <AdoptionFormModal
                    catId={cat.id.toString()}
                    catName={cat.name}
                    onClose={() => setShowModal(false)}
                />
            )}
        </>
    );
};

export default CatDetailPage;