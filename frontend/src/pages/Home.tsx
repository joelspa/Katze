// Página principal - Home
// Muestra la galería de gatos disponibles para adopción

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios, { isAxiosError } from 'axios';
import CatCard, { type Cat } from '../components/CatCard';
import './Home.css';

const Home = () => {
    const [cats, setCats] = useState<Cat[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Carga la lista de gatos al montar el componente
    useEffect(() => {
        const fetchCats = async () => {
            try {
                setLoading(true);
                const API_URL = 'http://localhost:5000/api/cats';
                const response = await axios.get(API_URL);

                // El backend devuelve { success: true, data: { cats: [...] } }
                const catsData = response.data.data?.cats || response.data.cats || response.data;
                setCats(catsData);
                setError(null);
            } catch (error: unknown) {
                let errorMessage = 'Error al cargar los gatos';
                if (isAxiosError(error)) {
                    errorMessage = error.response?.data?.message || 'Error del servidor';
                }
                setError(errorMessage);
                console.error(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchCats();
    }, []);

    // Renderizado condicional según el estado de carga
    if (loading) {
        return (
            <div className="home-container">
                <p className="loading-message">Cargando gatitos...</p>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="home-container">
                <p className="error-message">{error}</p>
            </div>
        );
    }

    return (
        <div className="home-container">
            {/* Banner Educativo */}
            <div className="education-banner">
                <div className="banner-content">
                    <div className="banner-icon">📚</div>
                    <div className="banner-text">
                        <h2>Aprende sobre el cuidado responsable de gatos</h2>
                        <p>
                            Accede a charlas educativas, talleres sobre esterilización, nutrición, 
                            salud felina y más. ¡Conviértete en un adoptante informado!
                        </p>
                    </div>
                    <Link to="/education" className="banner-button">
                        Ver Charlas <span className="arrow">→</span>
                    </Link>
                </div>
            </div>

            <h1>Gatos en Adopción</h1>
            <div className="cat-gallery">
                {cats.length > 0 ? (
                    cats.map((cat) => (
                        <CatCard key={cat.id} cat={cat} />
                    ))
                ) : (
                    <p>No hay gatitos en adopción por el momento.</p>
                )}
            </div>
        </div>
    );
};

export default Home;