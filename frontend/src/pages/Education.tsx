// Página de Blog & Recursos - Charlas, artículos y contenido educativo
// Muestra contenido sobre cuidado responsable, salud, adopción y recursos útiles

import { useState, useEffect } from 'react';
import axios, { isAxiosError } from 'axios';
import './Education.css';

interface EducationalPost {
    id: number;
    title: string;
    content: string;
    author_name: string;
    created_at: string;
    image_url?: string;
}

type CategoryType = 'todos' | 'salud' | 'comportamiento' | 'nutricion' | 'adopcion' | 'recursos';

const Education = () => {
    const [posts, setPosts] = useState<EducationalPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<CategoryType>('todos');
    const [searchTerm, setSearchTerm] = useState('');

    // Scroll al inicio cuando se carga la página
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const categories = [
        { id: 'todos', name: 'Todos', icon: (
            <svg viewBox="0 0 20 20" fill="currentColor" className="category-icon-svg">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </svg>
        ) },
        { id: 'salud', name: 'Salud', icon: (
            <svg viewBox="0 0 20 20" fill="currentColor" className="category-icon-svg">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
        ) },
        { id: 'comportamiento', name: 'Comportamiento', icon: (
            <svg viewBox="0 0 20 20" fill="currentColor" className="category-icon-svg">
                <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
            </svg>
        ) },
        { id: 'nutricion', name: 'Nutrición', icon: (
            <svg viewBox="0 0 20 20" fill="currentColor" className="category-icon-svg">
                <path fillRule="evenodd" d="M6 3a1 1 0 011-1h.01a1 1 0 010 2H7a1 1 0 01-1-1zm2 3a1 1 0 00-2 0v1a2 2 0 00-2 2v1a2 2 0 00-2 2v.683a3.7 3.7 0 011.055.485 1.704 1.704 0 001.89 0 3.704 3.704 0 014.11 0 1.704 1.704 0 001.89 0 3.704 3.704 0 014.11 0 1.704 1.704 0 001.89 0A3.7 3.7 0 0118 12.683V12a2 2 0 00-2-2V9a2 2 0 00-2-2V6a1 1 0 10-2 0v1h-1V6a1 1 0 10-2 0v1H8V6zm10 8.868a3.704 3.704 0 01-4.055-.036 1.704 1.704 0 00-1.89 0 3.704 3.704 0 01-4.11 0 1.704 1.704 0 00-1.89 0A3.704 3.704 0 012 14.868V17a1 1 0 001 1h14a1 1 0 001-1v-2.132zM9 3a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm3 0a1 1 0 011-1h.01a1 1 0 110 2H13a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
        ) },
        { id: 'adopcion', name: 'Adopción', icon: (
            <svg viewBox="0 0 20 20" fill="currentColor" className="category-icon-svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ) },
        { id: 'recursos', name: 'Recursos Útiles', icon: (
            <svg viewBox="0 0 20 20" fill="currentColor" className="category-icon-svg">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
        ) },
    ];

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const API_URL = 'http://localhost:5000/api/education';
                const response = await axios.get(API_URL);

                const postsData = response.data.data?.posts || response.data.posts || response.data;
                setPosts(postsData);
                setError(null);
            } catch (error: unknown) {
                let errorMessage = 'Error al cargar el contenido educativo';
                if (isAxiosError(error)) {
                    errorMessage = error.response?.data?.message || 'Error del servidor';
                }
                setError(errorMessage);
                console.error(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Función para categorizar posts automáticamente basado en palabras clave
    const categorizePost = (post: EducationalPost): CategoryType => {
        const text = (post.title + ' ' + post.content).toLowerCase();
        
        if (text.includes('salud') || text.includes('veterinario') || text.includes('vacuna') || 
            text.includes('esteriliza') || text.includes('enfermedad') || text.includes('quimio')) {
            return 'salud';
        }
        if (text.includes('comportamiento') || text.includes('juega') || text.includes('social') || 
            text.includes('agresiv') || text.includes('maullido')) {
            return 'comportamiento';
        }
        if (text.includes('comida') || text.includes('alimenta') || text.includes('nutrici') || 
            text.includes('dieta') || text.includes('peso')) {
            return 'nutricion';
        }
        if (text.includes('adopci') || text.includes('adoptar') || text.includes('hogar') || 
            text.includes('familia')) {
            return 'adopcion';
        }
        if (text.includes('lugar') || text.includes('dónde') || text.includes('dirección') || 
            text.includes('clínica') || text.includes('veterinaria')) {
            return 'recursos';
        }
        
        return 'todos';
    };

    // Filtrar posts por categoría y búsqueda
    const filteredPosts = posts.filter(post => {
        const matchesCategory = selectedCategory === 'todos' || categorizePost(post) === selectedCategory;
        const matchesSearch = searchTerm === '' || 
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.content.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesCategory && matchesSearch;
    });

    if (loading) {
        return (
            <div className="education-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Cargando contenido educativo...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="education-container">
                <div className="error-box">
                    <span className="error-icon">ERROR</span>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="education-container">
            {/* Hero Section */}
            <div className="education-hero">
                <div className="hero-content">
                    <h1>
                        <svg viewBox="0 0 20 20" fill="currentColor" className="hero-icon">
                            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                        </svg>
                        Blog & Recursos Katze
                    </h1>
                    <p className="hero-subtitle">
                        Charlas educativas, guías de cuidado felino, recursos útiles como clínicas veterinarias, 
                        lugares para quimioterapia y todo lo que necesitas saber sobre tus gatos.
                    </p>
                </div>
            </div>

            {/* Search and Categories */}
            <div className="filters-bar">
                <div className="search-box">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="search-icon">
                        <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                    </svg>
                    <input 
                        type="text" 
                        placeholder="Buscar artículos, charlas, recursos..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="categories-bar">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(cat.id as CategoryType)}
                        >
                            {cat.icon}
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Posts Grid */}
            <div className="posts-section">
                <div className="section-header">
                    <h2>
                        {selectedCategory === 'todos' ? 'Todos los Artículos' : 
                         categories.find(c => c.id === selectedCategory)?.name}
                    </h2>
                    <p>
                        {filteredPosts.length} artículo{filteredPosts.length !== 1 ? 's' : ''} 
                        {selectedCategory !== 'todos' && ` en ${categories.find(c => c.id === selectedCategory)?.name}`}
                    </p>
                </div>

                {filteredPosts.length > 0 ? (
                    <div className="posts-grid">
                        {filteredPosts.map((post) => {
                            const postCategory = categorizePost(post);
                            const categoryInfo = categories.find(c => c.id === postCategory);
                            
                            return (
                            <article key={post.id} className="education-card">
                                {/* Badge de categoría */}
                                {categoryInfo && (
                                    <div className="card-category-badge">
                                        {categoryInfo.icon}
                                        {categoryInfo.name}
                                    </div>
                                )}

                                {/* Imagen cuadrada si existe */}
                                {post.image_url && (
                                    <div className="card-image-container">
                                        <img
                                            src={post.image_url}
                                            alt={post.title}
                                            className="card-image"
                                        />
                                    </div>
                                )}

                                <div className="card-body-container">
                                    <div className="card-header">
                                        <h3>{post.title}</h3>
                                        <div className="card-meta">
                                            <span className="author">
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                                                </svg>
                                                {post.author_name}
                                            </span>
                                            <span className="date">
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
                                                </svg>
                                                {formatDate(post.created_at)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="card-content">
                                        <p>{post.content}</p>
                                    </div>
                                </div>
                            </article>
                            );
                        })}
                    </div>
                ) : searchTerm || selectedCategory !== 'todos' ? (
                    <div className="empty-state">
                        <svg className="empty-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                        </svg>
                        <h3>No se encontraron resultados</h3>
                        <p>Intenta ajustar tu búsqueda o selecciona otra categoría.</p>
                        <button 
                            className="reset-btn"
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedCategory('todos');
                            }}
                        >
                            Ver todos los artículos
                        </button>
                    </div>
                ) : (
                    <div className="empty-state">
                        <svg className="empty-icon" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                        </svg>
                        <p>Aún no hay contenido publicado.</p>
                        <p className="empty-subtitle">Pronto agregaremos artículos, charlas y recursos sobre cuidado felino.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Education;
