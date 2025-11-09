// frontend/src/pages/Home.tsx
import { useState, useEffect } from 'react';
import axios, { isAxiosError } from 'axios';
import CatCard, { type Cat } from '../components/CatCard'; // Importa el componente y la interfaz
import './Home.css'; // Crearemos este archivo CSS

const Home = () => {
    // Estado para guardar la lista de gatos
    const [cats, setCats] = useState<Cat[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // useEffect se ejecuta cuando el componente se carga por primera vez
    useEffect(() => {
        const fetchCats = async () => {
            try {
                setLoading(true);
                const API_URL = 'http://localhost:5000/api/cats'; // Tu endpoint público
                const response = await axios.get(API_URL);

                setCats(response.data); // Guarda los gatos en el estado
                setError(null);
            } catch (error: unknown) {
                let errorMessage = 'Error al cargar los gatos';
                if (isAxiosError(error)) {
                    errorMessage = error.response?.data?.message || 'Error del servidor';
                }
                setError(errorMessage);
                console.error(errorMessage);
            } finally {
                setLoading(false); // Termina la carga
            }
        };

        fetchCats(); // Llama a la función
    }, []); // El array vacío [] significa "ejecutar solo una vez"

    // Renderizado condicional
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