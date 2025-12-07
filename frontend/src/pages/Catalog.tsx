// Página de Catálogo Completo - Muestra todos los gatos con filtros avanzados
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios, { isAxiosError } from 'axios';
import CatCard, { type Cat } from '../components/CatCard';
import Footer from '../components/Footer';
import { API_BASE_URL } from '../config/api';
import './Catalog.css';

const Catalog = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [cats, setCats] = useState<Cat[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Scroll al inicio cuando se carga la página
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Estados para los filtros
    const [filters, setFilters] = useState({
        sterilization_status: searchParams.get('sterilization_status') || 'todos',
        age: searchParams.get('age') || 'todos',
        living_space: searchParams.get('living_space') || 'todos',
        breed: searchParams.get('breed') || 'todos',
    });

    const [searchTerm, setSearchTerm] = useState('');

    // Carga la lista de gatos con filtros aplicados
    useEffect(() => {
        const fetchCats = async () => {
            try {
                setLoading(true);
                const API_URL = `${API_BASE_URL}/api/cats`;

                // Construir query params si hay filtros activos
                const params = new URLSearchParams();
                if (filters.sterilization_status !== 'todos') {
                    params.append('sterilization_status', filters.sterilization_status);
                }
                if (filters.age !== 'todos') {
                    params.append('age', filters.age);
                }
                if (filters.living_space !== 'todos') {
                    params.append('living_space', filters.living_space);
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
    }, [filters]);

    // Actualizar URL cuando cambian los filtros
    useEffect(() => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== 'todos') {
                params.set(key, value);
            }
        });
        setSearchParams(params);
    }, [filters, setSearchParams]);

    const handleFilterChange = (filterName: string, value: string) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
    };

    const resetFilters = () => {
        setFilters({
            sterilization_status: 'todos',
            age: 'todos',
            living_space: 'todos',
            breed: 'todos',
        });
        setSearchTerm('');
    };

    // Filtrar por nombre/búsqueda local
    const filteredCats = cats.filter(cat => {
        if (!searchTerm) return true;
        return cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               cat.description?.toLowerCase().includes(searchTerm.toLowerCase());
    });

    // Filtrar por raza localmente (si el backend no lo hace)
    const finalCats = filters.breed !== 'todos' 
        ? filteredCats.filter(cat => cat.breed === filters.breed)
        : filteredCats;

    // Obtener razas únicas para el filtro
    const uniqueBreeds = Array.from(new Set(cats.map(cat => cat.breed).filter(Boolean)));

    return (
        <div className="catalog-container">
            {/* Header */}
            <div className="catalog-header">
                <h1>Catálogo Completo de Gatos</h1>
                <p className="catalog-subtitle">
                    Explora todos nuestros gatos disponibles para adopción. Usa los filtros para encontrar tu compañero perfecto.
                </p>
            </div>

            {/* Filters Section */}
            <div className="filters-section">
                <div className="filters-header">
                    <h2>
                        <svg viewBox="0 0 24 24" fill="currentColor" style={{width: '24px', height: '24px', marginRight: '8px'}}>
                            <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/>
                        </svg>
                        Filtros
                    </h2>
                    <button className="reset-btn" onClick={resetFilters}>
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                        </svg>
                        Limpiar Filtros
                    </button>
                </div>

                <div className="filters-grid">
                    {/* Buscador */}
                    <div className="filter-group search-group">
                        <label htmlFor="search">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                            </svg>
                            Buscar por nombre
                        </label>
                        <input 
                            id="search"
                            type="text" 
                            placeholder="Ej: Milo, Luna..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Tipo de Vivienda */}
                    <div className="filter-group">
                        <label htmlFor="living_space">Tipo de Vivienda</label>
                        <select 
                            id="living_space"
                            value={filters.living_space} 
                            onChange={(e) => handleFilterChange('living_space', e.target.value)}
                        >
                            <option value="todos">Todos</option>
                            <option value="casa_grande">Casa Grande</option>
                            <option value="departamento">Departamento</option>
                            <option value="cualquiera">Cualquier Espacio</option>
                        </select>
                    </div>

                    {/* Estado de Esterilización */}
                    <div className="filter-group">
                        <label htmlFor="sterilization">Esterilización</label>
                        <select 
                            id="sterilization"
                            value={filters.sterilization_status} 
                            onChange={(e) => handleFilterChange('sterilization_status', e.target.value)}
                        >
                            <option value="todos">Todos</option>
                            <option value="esterilizado">Esterilizado</option>
                            <option value="pendiente">Pendiente</option>
                        </select>
                    </div>

                    {/* Edad */}
                    <div className="filter-group">
                        <label htmlFor="age">Edad</label>
                        <select 
                            id="age"
                            value={filters.age} 
                            onChange={(e) => handleFilterChange('age', e.target.value)}
                        >
                            <option value="todos">Todas las edades</option>
                            <option value="cachorro">Cachorro (0-11 meses)</option>
                            <option value="joven">Joven (1 año)</option>
                            <option value="adulto">Adulto (2-7 años)</option>
                            <option value="senior">Senior (8+ años)</option>
                        </select>
                    </div>

                    {/* Raza */}
                    {uniqueBreeds.length > 0 && (
                        <div className="filter-group">
                            <label htmlFor="breed">Raza</label>
                            <select 
                                id="breed"
                                value={filters.breed} 
                                onChange={(e) => handleFilterChange('breed', e.target.value)}
                            >
                                <option value="todos">Todas las razas</option>
                                {uniqueBreeds.sort().map(breed => (
                                    <option key={breed} value={breed}>{breed}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            </div>

            {/* Results Count */}
            <div className="results-info">
                <p>
                    Mostrando <strong>{finalCats.length}</strong> gato{finalCats.length !== 1 ? 's' : ''} 
                    {finalCats.length !== cats.length && ` de ${cats.length} totales`}
                </p>
            </div>

            {/* Cats Grid */}
            {loading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Cargando gatitos...</p>
                </div>
            ) : error ? (
                <div className="error-container">
                    <p>{error}</p>
                </div>
            ) : finalCats.length > 0 ? (
                <div className="catalog-grid">
                    {finalCats.map((cat) => (
                        <CatCard key={cat.id} cat={cat} />
                    ))}
                </div>
            ) : (
                <div className="no-results">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 6h-8l-2-2H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-1 6h-3v3h-2v-3h-3v-2h3V7h2v3h3v2z"/>
                    </svg>
                    <h3>No se encontraron gatos</h3>
                    <p>Intenta ajustar los filtros o limpiarlos para ver más resultados.</p>
                    <button onClick={resetFilters} className="reset-filters-btn">
                        Ver todos los gatos
                    </button>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default Catalog;
