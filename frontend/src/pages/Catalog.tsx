import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios, { isAxiosError } from 'axios';
import CatCard, { type Cat } from '../components/CatCard';
import SkeletonCard from '../components/SkeletonCard';
import Footer from '../components/Footer';
import { API_BASE_URL } from '../config/api';
import './Catalog.css';

const SKELETON_COUNT = 8;

const Catalog = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [cats, setCats] = useState<Cat[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const [filters, setFilters] = useState({
        sterilization_status: searchParams.get('sterilization_status') || 'todos',
        age: searchParams.get('age') || 'todos',
        living_space: searchParams.get('living_space') || 'todos',
        breed: searchParams.get('breed') || 'todos',
    });

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchCats = async () => {
            try {
                setLoading(true);
                const params = new URLSearchParams();
                if (filters.sterilization_status !== 'todos') params.append('sterilization_status', filters.sterilization_status);
                if (filters.age !== 'todos') params.append('age', filters.age);
                if (filters.living_space !== 'todos') params.append('living_space', filters.living_space);

                const url = params.toString()
                    ? `${API_BASE_URL}/api/cats?${params.toString()}`
                    : `${API_BASE_URL}/api/cats`;

                const response = await axios.get(url);
                const catsData = response.data.data?.cats || response.data.cats || response.data;
                setCats(catsData);
                setError(null);
            } catch (err: unknown) {
                const msg = isAxiosError(err)
                    ? err.response?.data?.message || 'Error del servidor'
                    : 'Error al cargar los gatos';
                setError(msg);
            } finally {
                setLoading(false);
            }
        };
        fetchCats();
    }, [filters]);

    useEffect(() => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== 'todos') params.set(key, value);
        });
        setSearchParams(params);
    }, [filters, setSearchParams]);

    const handleFilterChange = (filterName: string, value: string) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
    };

    const resetFilters = () => {
        setFilters({ sterilization_status: 'todos', age: 'todos', living_space: 'todos', breed: 'todos' });
        setSearchTerm('');
    };

    const filteredCats = cats.filter(cat => {
        if (!searchTerm) return true;
        return (
            cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cat.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const finalCats = filters.breed !== 'todos'
        ? filteredCats.filter(cat => cat.breed === filters.breed)
        : filteredCats;

    const uniqueBreeds = Array.from(new Set(cats.map(cat => cat.breed).filter(Boolean)));

    return (
        <div className="catalog-container">
            <div className="catalog-header">
                <h1>Catálogo de Gatos</h1>
                <p className="catalog-subtitle">
                    Explorá todos nuestros gatos disponibles para adopción. Usá los filtros para encontrar tu compañero perfecto.
                </p>
            </div>

            {/* Filters */}
            <div className="filters-section">
                <div className="filters-header">
                    <h2>
                        <svg viewBox="0 0 24 24" fill="currentColor" style={{width: '22px', height: '22px', marginRight: '8px'}} aria-hidden="true">
                            <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/>
                        </svg>
                        Filtros
                    </h2>
                    <button className="reset-btn" onClick={resetFilters} aria-label="Limpiar todos los filtros">
                        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                        </svg>
                        Limpiar Filtros
                    </button>
                </div>

                <div className="filters-grid">
                    <div className="filter-group search-group">
                        <label htmlFor="search">
                            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
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

            {/* Results count */}
            {!loading && !error && (
                <div className="results-info" role="status" aria-live="polite">
                    <p>
                        Mostrando <strong>{finalCats.length}</strong> gato{finalCats.length !== 1 ? 's' : ''}
                        {finalCats.length !== cats.length && ` de ${cats.length} totales`}
                    </p>
                </div>
            )}

            {/* Grid */}
            {loading ? (
                <div className="catalog-grid">
                    {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            ) : error ? (
                <div className="error-container" role="alert">
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
                    {/* Cat-themed empty state icon */}
                    <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" fill="currentColor" aria-hidden="true">
                        <ellipse cx="40" cy="50" rx="24" ry="18" opacity="0.12"/>
                        <polygon points="18,32 23,18 30,34" opacity="0.35"/>
                        <polygon points="50,34 57,18 62,32" opacity="0.35"/>
                        <circle cx="40" cy="40" r="22" opacity="0.18"/>
                        <ellipse cx="32" cy="38" rx="3.5" ry="4.5" opacity="0.7"/>
                        <ellipse cx="48" cy="38" rx="3.5" ry="4.5" opacity="0.7"/>
                        <circle cx="40" cy="44" r="2.5" opacity="0.5"/>
                        <path d="M36 47 Q40 51 44 47" stroke="currentColor" strokeWidth="1.8" fill="none" opacity="0.5"/>
                        <line x1="18" y1="43" x2="35" y2="44" stroke="currentColor" strokeWidth="1.2" opacity="0.35"/>
                        <line x1="18" y1="47" x2="35" y2="46" stroke="currentColor" strokeWidth="1.2" opacity="0.35"/>
                        <line x1="45" y1="44" x2="62" y2="43" stroke="currentColor" strokeWidth="1.2" opacity="0.35"/>
                        <line x1="45" y1="46" x2="62" y2="47" stroke="currentColor" strokeWidth="1.2" opacity="0.35"/>
                        <text x="33" y="25" fontSize="14" fill="currentColor" opacity="0.55" fontFamily="sans-serif">?</text>
                    </svg>
                    <h3>No encontramos gatos</h3>
                    <p>Probá ajustando los filtros o limpialos para ver todas las opciones disponibles.</p>
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
