// Página de Blog & Recursos - Charlas, artículos y contenido educativo
// Muestra contenido sobre cuidado responsable, salud, adopción y recursos útiles

import { useState, useEffect } from 'react';
import axios, { isAxiosError } from 'axios';
import Footer from '../components/Footer';
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

    const categoryIcons: Record<string, JSX.Element> = {
        'todos': (
            <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </svg>
        ),
        'salud': (
            <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
        ),
        'comportamiento': (
            <svg viewBox="0 0 512 512" fill="currentColor" width="18" height="18">
                <path d="M226.5 92.9c14.3 42.9-.3 86.2-32.6 96.8s-70.1-15.6-84.4-58.5s.3-86.2 32.6-96.8s70.1 15.6 84.4 58.5zM100.4 198.6c18.9 32.4 14.3 70.1-10.2 84.1s-59.7-.9-78.5-33.3S-2.7 179.3 21.8 165.3s59.7 .9 78.5 33.3zM69.2 401.2C121.6 259.9 214.7 224 256 224s134.4 35.9 186.8 177.2c3.6 9.7 5.2 20.1 5.2 30.5v1.6c0 25.8-20.9 46.7-46.7 46.7c-11.5 0-22.9-1.4-34-4.2l-88-22c-15.3-3.8-31.3-3.8-46.6 0l-88 22c-11.1 2.8-22.5 4.2-34 4.2C132.9 480 112 459.1 112 433.3v-1.6c0-10.4 1.6-20.8 5.2-30.5zM421.8 282.7c-24.5-14-29.1-51.7-10.2-84.1s54-47.3 78.5-33.3s29.1 51.7 10.2 84.1s-54 47.3-78.5 33.3zM310.1 189.7c-32.3-10.6-46.9-53.9-32.6-96.8s52.1-69.1 84.4-58.5s46.9 53.9 32.6 96.8s-52.1 69.1-84.4 58.5z"/>
            </svg>
        ),
        'nutricion': (
            <svg viewBox="0 0 448 512" fill="currentColor" width="18" height="18">
                <path d="M416 0C400 0 288 32 288 176V288c0 35.3 28.7 64 64 64h32V480c0 17.7 14.3 32 32 32s32-14.3 32-32V352 240 32c0-17.7-14.3-32-32-32zM64 16C64 7.8 57.9 1 49.7 .1S34.2 4.6 32.4 12.5L2.1 148.8C.7 155.1 0 161.5 0 167.9c0 45.9 35.1 83.6 80 87.7V480c0 17.7 14.3 32 32 32s32-14.3 32-32V255.6c44.9-4.1 80-41.8 80-87.7c0-6.4-.7-12.8-2.1-19.1L191.6 12.5c-1.8-8-9.3-13.3-17.4-12.4S160 7.8 160 16V150.2c0 5.4-4.4 9.8-9.8 9.8c-5.1 0-9.3-3.9-9.8-9L127.9 14.6C127.2 6.3 120.3 0 112 0s-15.2 6.3-15.9 14.6L83.7 151c-.5 5.1-4.7 9-9.8 9c-5.4 0-9.8-4.4-9.8-9.8V16zm48.3 152l-.3 0-.3 0 .3-.7 .3 .7z"/>
            </svg>
        ),
        'adopcion': (
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
        ),
        'recursos': (
            <svg viewBox="0 0 384 512" fill="currentColor" width="18" height="18">
                <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/>
            </svg>
        ),
    };

    const categories = [
        { id: 'todos', name: 'Todos' },
        { id: 'salud', name: 'Salud' },
        { id: 'comportamiento', name: 'Comportamiento' },
        { id: 'nutricion', name: 'Nutrición' },
        { id: 'adopcion', name: 'Adopción' },
        { id: 'recursos', name: 'Recursos Útiles' },
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
                            <span className="category-icon">{categoryIcons[cat.id]}</span>
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
                                        <span className="category-icon">{categoryIcons[categoryInfo.id]}</span>
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

            <Footer />
        </div>
    );
};

export default Education;
