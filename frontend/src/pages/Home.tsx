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

            {/* Filtros de búsqueda */}
            <div className="filters-container">
                <div className="filter-group">
                    <label htmlFor="sterilization-filter">Estado de esterilización:</label>
                    <select 
                        id="sterilization-filter"
                        value={filters.sterilization_status}
                        onChange={(e) => handleFilterChange('sterilization_status', e.target.value)}
                    >
                        <option value="todos">Todos</option>
                        <option value="esterilizado">Esterilizado</option>
                        <option value="no_esterilizado">No esterilizado</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label htmlFor="age-filter">Edad:</label>
                    <select 
                        id="age-filter"
                        value={filters.age}
                        onChange={(e) => handleFilterChange('age', e.target.value)}
                    >
                        <option value="todos">Todas las edades</option>
                        <option value="cachorro">Cachorro (0-6 meses)</option>
                        <option value="joven">Joven (6 meses - 2 años)</option>
                        <option value="adulto">Adulto (2-7 años)</option>
                        <option value="senior">Senior (7+ años)</option>
                    </select>
                </div>
            </div>

            <div className="cat-gallery">
                {cats.length > 0 ? (
                    cats.map((cat) => (
                        <CatCard key={cat.id} cat={cat} />
                    ))
                ) : (
                    <p className="no-results">No se encontraron gatos con los filtros seleccionados.</p>
                )}
            </div>
        </div>
    );
};

export default Home;