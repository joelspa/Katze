// Página de Educación - Charlas y contenido educativo
// Muestra artículos sobre cuidado responsable de gatos

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

const Education = () => {
    const [posts, setPosts] = useState<EducationalPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
                    <h1>📖 Centro Educativo Katze</h1>
                    <p className="hero-subtitle">
                        Aprende todo sobre el cuidado responsable de gatos. Información verificada 
                        por nuestros rescatistas expertos.
                    </p>
                </div>
            </div>

            {/* Posts Grid */}
            <div className="posts-section">
                <div className="section-header">
                    <h2>Artículos y Charlas</h2>
                    <p>Explora nuestro contenido educativo sobre salud, nutrición, comportamiento y más</p>
                </div>

                {posts.length > 0 ? (
                    <div className="posts-grid">
                        {posts.map((post) => (
                            <article key={post.id} className="education-card">
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
                                
                                <div className="card-header">
                                    <h3>{post.title}</h3>
                                    <div className="card-meta">
                                        <span className="author">
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                                            </svg>
                                            {post.author_name}
                                        </span>
                                        <span className="date">
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                                            </svg>
                                            {formatDate(post.created_at)}
                                        </span>
                                    </div>
                                </div>
                                <div className="card-content">
                                    <p>{post.content}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <span className="empty-icon">📚</span>
                        <p>Aún no hay contenido educativo publicado.</p>
                        <p className="empty-subtitle">Pronto agregaremos artículos y charlas sobre cuidado felino.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Education;
