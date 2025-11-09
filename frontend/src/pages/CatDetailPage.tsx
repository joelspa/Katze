// frontend/src/pages/CatDetailPage.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Importa useNavigate
import axios, { isAxiosError } from 'axios';
import { type Cat } from '../components/CatCard';
import { useAuth } from '../context/AuthContext'; // 1. Importa el hook de Auth
import AdoptionFormModal from '../components/AdoptionFormModal'; // 2. Importa el Modal
import './CatDetailPage.css';

const CatDetailPage = () => {
    const { id } = useParams();
    const [cat, setCat] = useState<Cat | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false); // 3. Estado para el modal

    const { isAuthenticated, user } = useAuth(); // 4. Obtén el estado de auth
    const navigate = useNavigate(); // 5. Para redirigir

    useEffect(() => {
        // ... (tu useEffect para fetchCat sigue igual) ...
        const fetchCat = async () => {
            try {
                setLoading(true);
                const API_URL = `http://localhost:5000/api/cats/${id}`;
                const response = await axios.get(API_URL);
                setCat(response.data);
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

    // 6. Lógica del botón de adoptar
    const handleAdoptClick = () => {
        if (!isAuthenticated()) {
            // Si no está logueado, llévalo a login
            alert('Debes iniciar sesión para adoptar.');
            navigate('/login');
        } else if (user?.role === 'adoptante') {
            // Si es un adoptante, abre el modal
            setShowModal(true);
        } else if (user?.role === 'rescatista') {
            // Si es un rescatista, no puede adoptar
            alert('Los rescatistas no pueden adoptar gatos.');
        }
    };

    // ... (tus return de loading, error, etc. siguen igual) ...
    if (loading) return <p>Cargando información del gatito...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!cat) return <p>Gato no encontrado.</p>;

    const imageUrl = cat.photos_url && cat.photos_url.length > 0
        ? cat.photos_url[0]
        : 'https://via.placeholder.com/600x400';

    return (
        <> {/* 7. Envuelve todo en un Fragment para el modal */}
            <div className="detail-container">
                <img src={imageUrl} alt={cat.name} className="detail-img" />
                <div className="detail-info">
                    <h1>{cat.name}</h1>
                    <p className="detail-age">Edad: {cat.age}</p>
                    <div className="detail-section">
                        <h3>Descripción</h3>
                        <p>{cat.description}</p>
                    </div>
                    <div className="detail-section">
                        <h3>Salud</h3>
                        <p>{(cat as any).health_status}</p>
                    </div>
                    <div className="detail-section">
                        <h3>Esterilización</h3>
                        <p>{cat.sterilization_status}</p>
                    </div>

                    {/* 8. Conecta el botón a la nueva lógica */}
                    <button className="apply-button" onClick={handleAdoptClick}>
                        ¡Quiero adoptar a {cat.name}!
                    </button>
                </div>
            </div>

            {/* 9. Muestra el modal si showModal es true */}
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