// Página principal - Home
// Muestra la galería de gatos disponibles para adopción

import { useState, useEffect } from 'react';
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

                setCats(response.data);
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
    if (loading) return <p>Cargando gatitos...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className="home-container">
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