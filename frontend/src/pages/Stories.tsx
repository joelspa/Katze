// Página de Historias - Historias de rescate y adopción exitosas
// Muestra historias inspiradoras de la comunidad

import { useState, useEffect } from 'react';
import axios, { isAxiosError } from 'axios';
import './Stories.css';

interface Story {
    id: number;
    title: string;
    content: string;
    author_id: number;
    author_name: string;
    created_at: string;
}

const Stories = () => {
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                setLoading(true);
                const API_URL = 'http://localhost:5000/api/stories';
                const response = await axios.get(API_URL);

                const storiesData = response.data.data?.stories || response.data.stories || response.data;
                setStories(storiesData);
                setError(null);
            } catch (error: unknown) {
                let errorMessage = 'Error al cargar las historias';
                if (isAxiosError(error)) {
                    errorMessage = error.response?.data?.message || 'Error del servidor';
                }
                setError(errorMessage);
                console.error(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchStories();
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
            <div className="stories-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Cargando historias...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="stories-container">
                <div className="error-box">
                    <span className="error-icon">⚠️</span>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="stories-container">
            {/* Hero Section */}
            <div className="stories-hero">
                <div className="hero-content">
                    <h1>💕 Historias de Rescate y Adopción</h1>
                    <p className="hero-subtitle">
                        Lee las historias inspiradoras de gatos rescatados que encontraron un hogar lleno de amor.
                        Cada historia es un recordatorio de por qué la adopción responsable y la esterilización son tan importantes.
                    </p>
                </div>
            </div>

            {/* Destacado sobre esterilización */}
            <div className="importance-banner">
                <div className="banner-icon">🩺</div>
                <div className="banner-text">
                    <h3>La Importancia de la Esterilización</h3>
                    <p>
                        La esterilización es fundamental para controlar la sobrepoblación felina y mejorar la calidad de vida de nuestros gatos.
                        Todas las historias que lees aquí incluyen gatos que fueron o serán esterilizados como parte de su adopción responsable.
                    </p>
                </div>
            </div>

            {/* Stories Grid */}
            <div className="stories-section">
                {stories.length > 0 ? (
                    <div className="stories-grid">
                        {stories.map((story) => (
                            <article key={story.id} className="story-card">
                                <div className="card-header">
                                    <h2>{story.title}</h2>
                                    <div className="card-meta">
                                        <span className="author">
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                                            </svg>
                                            {story.author_name}
                                        </span>
                                        <span className="date">
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                                            </svg>
                                            {formatDate(story.created_at)}
                                        </span>
                                    </div>
                                </div>
                                <div className="card-content">
                                    <p className="story-text">{story.content}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <span className="empty-icon">📖</span>
                        <p>Aún no hay historias publicadas.</p>
                        <p className="empty-subtitle">Pronto compartiremos historias inspiradoras de rescate y adopción.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Stories;
