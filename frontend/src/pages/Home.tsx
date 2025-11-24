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

    // Estados para los filtros
    const [filters, setFilters] = useState({
        sterilization_status: 'todos',
        age: 'todos'
    });

    // Carga la lista de gatos con filtros aplicados
    useEffect(() => {
        const fetchCats = async () => {
            try {
                setLoading(true);
                const API_URL = 'http://localhost:5000/api/cats';

                // Construir query params si hay filtros activos
                const params = new URLSearchParams();
                if (filters.sterilization_status !== 'todos') {
                    params.append('sterilization_status', filters.sterilization_status);
                }
                if (filters.age !== 'todos') {
                    params.append('age', filters.age);
                }

                const url = params.toString() ? `${API_URL}?${params.toString()}` : API_URL;
                const response = await axios.get(url);

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
    }, [filters]); // Re-ejecutar cuando cambien los filtros

    // Maneja cambios en los filtros
    const handleFilterChange = (filterName: string, value: string) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
    };

    return (
        <div className="home-container">
            {/* Hero Section Premium */}
            <section className="hero-section">
                <div className="hero-content fade-in">
                    <h1 className="hero-title">
                        Encuentra tu compañero <span className="highlight">perfecto</span>
                    </h1>
                    <p className="hero-subtitle">
                        Conectamos corazones con bigotes. Adopta, ama y transforma una vida hoy.
                        Únete a nuestra comunidad de tenencia responsable.
                    </p>
                    <div className="hero-actions">
                        <a href="#adopt" className="btn btn-primary btn-lg">Adoptar ahora</a>
                        <Link to="/education" className="btn btn-outline btn-lg">Aprender más</Link>
                    </div>
                </div>
                <div className="hero-decoration">
                    <div className="blob blob-1"></div>
                    <div className="blob blob-2"></div>
                </div>
            </section>

            {/* Sección de Historias de Éxito - Carrusel */}
            <section className="stories-section slide-in-up">
                <div className="section-header">
                    <h2>
                        <svg viewBox="0 0 20 20" fill="currentColor" style={{width: '24px', height: '24px', marginRight: '8px', verticalAlign: 'middle'}}>
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                        Historias de Éxito
                    </h2>
                    <p>Finales felices que nos inspiran a seguir adelante</p>
                </div>
                <div className="stories-carousel-container">
                    <button 
                        className="carousel-btn prev" 
                        onClick={() => {
                            const container = document.querySelector('.stories-carousel');
                            if (container) {
                                container.scrollBy({ left: -350, behavior: 'smooth' });
                            }
                        }}
                        aria-label="Anterior"
                    >
                        <svg viewBox="0 0 20 20" fill="currentColor" style={{width: '24px', height: '24px'}}>
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <div className="stories-carousel">
                        <div className="story-card">
                            <img 
                                src="https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1" 
                                alt="Luna" 
                                className="story-image"
                            />
                            <div className="story-content">
                                <h3>Luna & Sofía</h3>
                                <p>"Luna llegó a mi vida cuando más la necesitaba. Gracias a Katze por el proceso tan cuidado."</p>
                            </div>
                        </div>
                        <div className="story-card">
                            <img 
                                src="https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1" 
                                alt="Oliver" 
                                className="story-image"
                            />
                            <div className="story-content">
                                <h3>Oliver en su nuevo hogar</h3>
                                <p>"Un gatito esterilizado y sano. La tranquilidad de adoptar con responsabilidad no tiene precio."</p>
                            </div>
                        </div>
                        <div className="story-card">
                            <img 
                                src="https://images.pexels.com/photos/617278/pexels-photo-617278.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1" 
                                alt="Mishi" 
                                className="story-image"
                            />
                            <div className="story-content">
                                <h3>El rescate de Mishi</h3>
                                <p>"De la calle a un sofá calentito. Ver su transformación ha sido el mejor regalo."</p>
                            </div>
                        </div>
                        <div className="story-card">
                            <img 
                                src="https://images.pexels.com/photos/1543793/pexels-photo-1543793.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1" 
                                alt="Simba" 
                                className="story-image"
                            />
                            <div className="story-content">
                                <h3>Simba encontró familia</h3>
                                <p>"Adoptar a Simba fue la mejor decisión. Ahora es el rey de la casa y de nuestros corazones."</p>
                            </div>
                        </div>
                        <div className="story-card">
                            <img 
                                src="https://images.pexels.com/photos/2071873/pexels-photo-2071873.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1" 
                                alt="Nala" 
                                className="story-image"
                            />
                            <div className="story-content">
                                <h3>Nala y su nueva vida</h3>
                                <p>"Estaba en la calle, ahora duerme en mi cama. El amor de un gato rescatado es incondicional."</p>
                            </div>
                        </div>
                        <div className="story-card">
                            <img 
                                src="https://images.pexels.com/photos/416160/pexels-photo-416160.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1" 
                                alt="Felix" 
                                className="story-image"
                            />
                            <div className="story-content">
                                <h3>Felix y su hogar para siempre</h3>
                                <p>"Rescatado de un refugio, ahora es el compañero perfecto. Gracias por existir, Katze."</p>
                            </div>
                        </div>
                    </div>
                    <button 
                        className="carousel-btn next" 
                        onClick={() => {
                            const container = document.querySelector('.stories-carousel');
                            if (container) {
                                container.scrollBy({ left: 350, behavior: 'smooth' });
                            }
                        }}
                        aria-label="Siguiente"
                    >
                        <svg viewBox="0 0 20 20" fill="currentColor" style={{width: '24px', height: '24px'}}>
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </section>

            {/* Sección de Adopción */}
            <section id="adopt" className="adoption-section">
                <div className="section-header">
                    <h2>
                        <svg viewBox="0 0 20 20" fill="currentColor" style={{width: '28px', height: '28px', display: 'inline-block', marginRight: '10px', verticalAlign: 'middle'}}>
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                        Gatos en Adopción
                    </h2>
                    <p>Ellos esperan por una segunda oportunidad</p>
                </div>

                {/* Filtros de búsqueda mejorados */}
                <div className="filters-container glass-panel">
                    <div className="filter-group">
                        <label htmlFor="sterilization-filter">Estado:</label>
                        <select
                            id="sterilization-filter"
                            value={filters.sterilization_status}
                            onChange={(e) => handleFilterChange('sterilization_status', e.target.value)}
                            className="premium-select"
                        >
                            <option value="todos">Todos</option>
                            <option value="esterilizado">Esterilizado</option>
                            <option value="pendiente">Pendiente</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label htmlFor="age-filter">Edad:</label>
                        <select
                            id="age-filter"
                            value={filters.age}
                            onChange={(e) => handleFilterChange('age', e.target.value)}
                            className="premium-select"
                        >
                            <option value="todos">Todas las edades</option>
                            <option value="cachorro">Cachorro (0-6 meses)</option>
                            <option value="joven">Joven (6 meses - 2 años)</option>
                            <option value="adulto">Adulto (2-7 años)</option>
                            <option value="senior">Senior (7+ años)</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Buscando gatitos...</p>
                    </div>
                ) : error ? (
                    <div className="error-container">
                        <p>{error}</p>
                    </div>
                ) : (
                    <div className="cat-gallery">
                        {cats.length > 0 ? (
                            cats.map((cat) => (
                                <CatCard key={cat.id} cat={cat} />
                            ))
                        ) : (
                            <div className="no-results">
                                <p>
                                    <svg viewBox="0 0 20 20" fill="currentColor" style={{width: '24px', height: '24px', display: 'inline-block', marginRight: '8px', verticalAlign: 'middle'}}>
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    No encontramos gatos con esos filtros.
                                </p>
                                <button onClick={() => setFilters({ sterilization_status: 'todos', age: 'todos' })} className="btn btn-link">
                                    Ver todos
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;