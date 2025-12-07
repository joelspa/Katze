// Página principal - Home
// Muestra la galería de gatos disponibles para adopción

import { useState, useEffect, useCallback, useMemo } from 'react';
import axios, { isAxiosError } from 'axios';
import { Link } from 'react-router-dom';
import CatCard, { type Cat } from '../components/CatCard';
import CatCarousel from '../components/CatCarousel';
import AdoptionProcessModal from '../components/AdoptionProcessModal';
import Footer from '../components/Footer';
import './Home.css';

const Home = () => {
    const [cats, setCats] = useState<Cat[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Estados para los filtros
    const [filters, setFilters] = useState({
        sterilization_status: 'todos',
        age: 'todos',
        living_space: 'todos'
    });

    // Función para hacer scroll al inicio cuando se cambian los filtros desde categorías
    const scrollToSection = useCallback((sectionId: string, filterUpdate: any) => {
        setFilters(prev => ({ ...prev, ...filterUpdate }));
        setTimeout(() => {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    }, []);

    // Scroll al inicio cuando se carga la página
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Carga la lista de gatos con filtros aplicados
    const fetchCats = useCallback(async () => {
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
    }, [filters]);

    useEffect(() => {
        fetchCats();
    }, [fetchCats]); // Re-ejecutar cuando cambien los filtros



    return (
        <div className="home-container">
            {/* HERO PANEL - Portada Panel de Control */}
            <header className="hero-panel">
                <div className="container-hero">
                    
                    {/* IZQUIERDA: Contenido Principal + Buscador */}
                    <div className="hero-content">
                        <h1>
                            Salva una vida,<br />
                            <span className="text-teal">Gana un amigo.</span>
                        </h1>
                        <p className="hero-description">
                            Cientos de gatos rescatados esperan por ti. Dinos dónde vives y te mostraremos quién encaja contigo.
                        </p>
                        
                        <div className="search-box">
                            <label className="search-label">¿Dónde vivirás con él?</label>
                            <div className="filter-buttons">
                                <button 
                                    className={`btn-filter ${filters.living_space === 'departamento' ? 'active' : ''}`}
                                    onClick={() => scrollToSection('catalog-section', { living_space: 'departamento' })}
                                >
                                    <svg viewBox="0 0 24 24" fill="currentColor" style={{width: '16px', height: '16px', marginRight: '6px', verticalAlign: 'middle'}}>
                                        <path d="M17 11V3H7v4H3v14h8v-4h2v4h8V11h-4zM7 19H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm4 4H9v-2h2v2zm0-4H9V9h2v2zm0-4H9V5h2v2zm4 8h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm4 12h-2v-2h2v2zm0-4h-2v-2h2v2z"/>
                                    </svg>
                                    Departamento
                                </button>
                                <button 
                                    className={`btn-filter ${filters.living_space === 'casa_grande' ? 'active' : ''}`}
                                    onClick={() => scrollToSection('catalog-section', { living_space: 'casa_grande' })}
                                >
                                    <svg viewBox="0 0 24 24" fill="currentColor" style={{width: '16px', height: '16px', marginRight: '6px', verticalAlign: 'middle'}}>
                                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                                    </svg>
                                    Casa Grande
                                </button>
                                <button 
                                    className={`btn-filter ${filters.living_space === 'todos' ? 'active' : ''}`}
                                    onClick={() => scrollToSection('catalog-section', { living_space: 'todos' })}
                                >
                                    <svg viewBox="0 0 24 24" fill="currentColor" style={{width: '16px', height: '16px', marginRight: '6px', verticalAlign: 'middle'}}>
                                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                    </svg>
                                    Ver Todos
                                </button>
                            </div>
                            <a 
                                href="#catalog-section" 
                                className="btn-action"
                                onClick={(e) => {
                                    e.preventDefault();
                                    scrollToSection('catalog-section', {});
                                }}
                            >
                                Ver Gatos Disponibles ↓
                            </a>
                        </div>
                    </div>

                    {/* DERECHA: Tarjeta de Requisitos (Glass Card) */}
                    <div className="hero-requirements">
                        <div className="glass-card">
                            <h3>
                                <svg viewBox="0 0 24 24" fill="currentColor" style={{width: '20px', height: '20px', marginRight: '8px', verticalAlign: 'middle'}}>
                                    <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                                </svg>
                                Requisitos Básicos
                            </h3>
                            <ul className="req-list">
                                <li>
                                    <span className="icon">
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 6c1.11 0 2-.9 2-2 0-.38-.1-.73-.29-1.03L12 0l-1.71 2.97c-.19.3-.29.65-.29 1.03 0 1.1.9 2 2 2zm4.6 9.99l-1.07-1.07-1.08 1.07c-1.3 1.3-3.58 1.31-4.89 0l-1.07-1.07-1.09 1.07C6.75 16.64 5.88 17 4.96 17c-.73 0-1.4-.23-1.96-.61V21c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-4.61c-.56.38-1.23.61-1.96.61-.92 0-1.79-.36-2.44-1.01zM18 9h-5V7h-2v2H6c-1.66 0-3 1.34-3 3v1.54c0 1.08.88 1.96 1.96 1.96.52 0 1.02-.2 1.38-.57l2.14-2.13 2.13 2.13c.74.74 2.03.74 2.77 0l2.14-2.13 2.13 2.13c.37.37.86.57 1.38.57 1.08 0 1.96-.88 1.96-1.96V12C21 10.34 19.66 9 18 9z"/>
                                        </svg>
                                    </span>
                                    <div className="req-text">
                                        <strong>Mayor de 18 años</strong>
                                        <small>Responsabilidad legal</small>
                                    </div>
                                </li>
                                <li>
                                    <span className="icon">
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                                        </svg>
                                    </span>
                                    <div className="req-text">
                                        <strong>Hogar Seguro</strong>
                                        <small>Mallas o cerco cerrado</small>
                                    </div>
                                </li>
                                <li>
                                    <span className="icon">
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-1.4c0-2 4-3.1 7-3.1s7 1.1 7 3.1V19z"/>
                                        </svg>
                                    </span>
                                    <div className="req-text">
                                        <strong>Salud</strong>
                                        <small>Compromiso de vacunas</small>
                                    </div>
                                </li>
                                <li>
                                    <span className="icon">
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M9.64 7.64c.23-.5.36-1.05.36-1.64 0-2.21-1.79-4-4-4S2 3.79 2 6s1.79 4 4 4c.59 0 1.14-.13 1.64-.36L10 12l-2.36 2.36C7.14 14.13 6.59 14 6 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4c0-.59-.13-1.14-.36-1.64L12 14l7 7h3v-1L9.64 7.64zM6 8c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm0 12c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm6-7.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM19 3l-6 6 2 2 7-7V3z"/>
                                        </svg>
                                    </span>
                                    <div className="req-text">
                                        <strong>Esterilización</strong>
                                        <small>Compromiso obligatorio</small>
                                    </div>
                                </li>
                            </ul>
                            <button 
                                className="btn-secondary"
                                onClick={() => setIsModalOpen(true)}
                            >
                                Ver proceso completo
                            </button>
                        </div>
                    </div>

                </div>
            </header>


            {/* CATÁLOGO PRINCIPAL CON TABS - Nueva sección compacta */}
            <section id="catalog-section" className="catalog-section">
                <div className="catalog-header">
                    <h2 className="section-title">Nuestros Rescatados</h2>
                    <p className="section-subtitle">Encuentra tu compañero ideal</p>
                </div>

                {/* Sistema de Pestañas */}
                <div className="catalog-tabs">
                    <button 
                        className={`tab-btn ${filters.living_space === 'todos' ? 'active' : ''}`}
                        onClick={() => setFilters(prev => ({ ...prev, living_space: 'todos' }))}
                    >
                        Todos
                    </button>
                    <button 
                        className={`tab-btn ${filters.living_space === 'casa_grande' ? 'active' : ''}`}
                        onClick={() => setFilters(prev => ({ ...prev, living_space: 'casa_grande' }))}
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor" style={{width: '18px', height: '18px', marginRight: '6px', verticalAlign: 'middle'}}>
                            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                        </svg>
                        Casa Grande
                    </button>
                    <button 
                        className={`tab-btn ${filters.living_space === 'departamento' ? 'active' : ''}`}
                        onClick={() => setFilters(prev => ({ ...prev, living_space: 'departamento' }))}
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor" style={{width: '18px', height: '18px', marginRight: '6px', verticalAlign: 'middle'}}>
                            <path d="M17 11V3H7v4H3v14h8v-4h2v4h8V11h-4zM7 19H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm4 4H9v-2h2v2zm0-4H9V9h2v2zm0-4H9V5h2v2zm4 8h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm4 12h-2v-2h2v2zm0-4h-2v-2h2v2z"/>
                        </svg>
                        Departamento
                    </button>
                    <button 
                        className={`tab-btn ${filters.living_space === 'cualquiera' ? 'active' : ''}`}
                        onClick={() => setFilters(prev => ({ ...prev, living_space: 'cualquiera' }))}
                    >
                        ⭐ Cualquier Espacio
                    </button>
                </div>

                {/* Grid de Gatos - Muestra máximo 8 */}
                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Cargando gatitos...</p>
                    </div>
                ) : error ? (
                    <div className="error-container">
                        <p>{error}</p>
                    </div>
                ) : (
                    <div className="catalog-grid">
                        {cats.slice(0, 8).length > 0 ? (
                            cats.slice(0, 8).map((cat) => (
                                <CatCard key={cat.id} cat={cat} />
                            ))
                        ) : (
                            <div className="no-results">
                                <p>No hay gatos disponibles en esta categoría.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Botón Ver Todos */}
                {!loading && !error && cats.length > 8 && (
                    <div className="catalog-footer">
                        <Link 
                            to={`/catalogo${filters.living_space !== 'todos' ? `?living_space=${filters.living_space}` : ''}`} 
                            className="btn-ver-todos"
                        >
                            Ver Todos los Gatos ({cats.length})
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
                            </svg>
                        </Link>
                    </div>
                )}
            </section>

            {/* CINTA INFORMATIVA - Proceso de Adopción Compacto */}
            <section className="process-strip">
                <h3 className="strip-title">Cómo Adoptar en 4 Pasos</h3>
                <div className="process-steps-horizontal">
                    <div className="step-h">
                        <div className="step-number">1</div>
                        <svg className="step-icon-h" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                        <h4>Explora</h4>
                        <p>Conoce a nuestros gatos</p>
                    </div>
                    <div className="step-arrow">→</div>
                    <div className="step-h">
                        <div className="step-number">2</div>
                        <svg className="step-icon-h" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                        <h4>Aplica</h4>
                        <p>Completa la solicitud</p>
                    </div>
                    <div className="step-arrow">→</div>
                    <div className="step-h">
                        <div className="step-number">3</div>
                        <svg className="step-icon-h" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                        </svg>
                        <h4>Conócelo</h4>
                        <p>Visita al gato</p>
                    </div>
                    <div className="step-arrow">→</div>
                    <div className="step-h">
                        <div className="step-number">4</div>
                        <svg className="step-icon-h" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                        </svg>
                        <h4>Adopta</h4>
                        <p>Llévalo a casa</p>
                    </div>
                </div>
                <button className="btn-requisitos" onClick={() => setIsModalOpen(true)}>
                    Requisitos Básicos: Ser mayor de edad y hogar seguro. <strong>Leer más →</strong>
                </button>
            </section>

            {/* Modal de Proceso de Adopción */}
            <AdoptionProcessModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />

            {/* HISTORIAS DE ÉXITO - Horizontal Compacto */}
            <section className="testimonials-section-compact">
                <h2 className="section-title">Historias de Éxito</h2>
                <p className="stories-subtitle">Familias felices que encontraron su compañero perfecto</p>
                
                <div className="testimonials-horizontal">
                    <div className="testimonial-card-h">
                        <img 
                            src="https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1&fm=webp" 
                            alt="Milo el gato"
                            className="testimonial-img-h"
                            loading="lazy"
                        />
                        <div className="testimonial-content-h">
                            <p className="testimonial-text-h">
                                "Milo es tranquilo y cariñoso. ¡El proceso fue tan fácil y transparente!"
                            </p>
                            <div className="testimonial-author-h">
                                <strong>María González</strong> · Adoptó a Milo
                            </div>
                        </div>
                    </div>
                    
                    <div className="testimonial-card-h">
                        <img 
                            src="https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1&fm=webp" 
                            alt="Luna la gata"
                            className="testimonial-img-h"
                            loading="lazy"
                        />
                        <div className="testimonial-content-h">
                            <p className="testimonial-text-h">
                                "Luna es perfecta: juguetona e inteligente. Mis hijos la adoran."
                            </p>
                            <div className="testimonial-author-h">
                                <strong>Juan Pérez</strong> · Adoptó a Luna
                            </div>
                        </div>
                    </div>

                    <div className="testimonial-card-h">
                        <img 
                            src="https://images.pexels.com/photos/1741205/pexels-photo-1741205.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1&fm=webp" 
                            alt="Simón el gato"
                            className="testimonial-img-h"
                            loading="lazy"
                        />
                        <div className="testimonial-content-h">
                            <p className="testimonial-text-h">
                                "Proceso transparente con seguimiento real. ¡100% recomendado!"
                            </p>
                            <div className="testimonial-author-h">
                                <strong>Carla Morales</strong> · Adoptó a Simón
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Can't Adopt Section */}
            <section className="cant-adopt-section">
                <h2 className="cant-adopt-title">¿No Puedes Adoptar? ¡Aún Puedes Ayudar!</h2>
                <p className="cant-adopt-text">
                    Tu apoyo nos ayuda a proporcionar comida, refugio y atención médica para gatos que lo necesitan. 
                    Considera donar, ser voluntario o convertirte en un hogar temporal.
                </p>
                <div className="cant-adopt-buttons">
                    <button className="volunteer-btn">Ser Voluntario</button>
                    <button className="newsletter-btn">Suscríbete al Newsletter</button>
                </div>
            </section>

            {/* Footer con redes sociales */}
            <Footer />
        </div>
    );
};

export default Home;