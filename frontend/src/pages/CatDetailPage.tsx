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
                    
                    {/* Badges de Raza y Tipo de Vivienda */}
                    <div className="detail-badges">
                        {cat.breed && (
                            <span className="detail-badge breed-badge">
                                <svg viewBox="0 0 24 24" fill="currentColor" style={{width: '16px', height: '16px', marginRight: '6px'}}>
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                                </svg>
                                {cat.breed}
                            </span>
                        )}
                        {cat.living_space_requirement && (
                            <span className="detail-badge living-badge">
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
                        <span className={`detail-badge status-badge ${cat.sterilization_status}`}>
                            {cat.sterilization_status === 'esterilizado' ? '✓ Esterilizado' : '⏱ Pendiente esterilización'}
                        </span>
                    </div>
                    
                    {/* Historia de rescate si existe */}
                    {cat.story && (
                        <div className="detail-section story-section">
                            <h3>
                                <svg viewBox="0 0 24 24" fill="currentColor" style={{width: '20px', height: '20px', display: 'inline-block', marginRight: '8px', verticalAlign: 'middle'}}>
                                    <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
                                </svg>
                                Su Historia
                            </h3>
                            <p className="story-content">{cat.story}</p>
                        </div>
                    )}
                    
                    <div className="detail-section">
                        <h3>
                            <svg viewBox="0 0 24 24" fill="currentColor" style={{width: '20px', height: '20px', display: 'inline-block', marginRight: '8px', verticalAlign: 'middle'}}>
                                <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
                            </svg>
                            Descripción
                        </h3>
                        <p>{cat.description}</p>
                    </div>
                    <div className="detail-section">
                        <h3>
                            <svg viewBox="0 0 24 24" fill="currentColor" style={{width: '20px', height: '20px', display: 'inline-block', marginRight: '8px', verticalAlign: 'middle'}}>
                                <path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z"/>
                            </svg>
                            Salud
                        </h3>
                        <p>{cat.health_status || 'No especificado'}</p>
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