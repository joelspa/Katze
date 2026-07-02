import { useState, useEffect, useCallback } from 'react';
import axios, { isAxiosError } from 'axios';
import { Link } from 'react-router-dom';
import API_BASE_URL, { getWhatsAppVolunteerUrl } from '../config/api';
import CatCard, { type Cat } from '../components/CatCard';
import SkeletonCard from '../components/SkeletonCard';
import AdoptionProcessModal from '../components/AdoptionProcessModal';
import Footer from '../components/Footer';
import './Home.css';

const SKELETON_COUNT = 8;

const Home = () => {
    const [cats, setCats] = useState<Cat[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        sterilization_status: 'todos',
        age: 'todos',
        living_space: 'todos'
    });

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const fetchCats = useCallback(async () => {
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
    }, [filters]);

    useEffect(() => { fetchCats(); }, [fetchCats]);

    const scrollToCatalog = (e: React.MouseEvent) => {
        e.preventDefault();
        document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div className="home-container">

            {/* HERO */}
            <header className="hero-panel">
                <div className="container-hero">

                    {/* Left — headline + CTA */}
                    <div className="hero-content">
                        <h1>
                            Salva una vida,<br />
                            <span className="text-teal">Gana un amigo.</span>
                        </h1>
                        <p className="hero-description">
                            Cientos de gatos rescatados esperan por ti. Encontrá el compañero ideal para tu hogar y dales una segunda oportunidad.
                        </p>

                        <div className="hero-cta-box">
                            <a
                                href="#catalog-section"
                                className="hero-btn"
                                onClick={scrollToCatalog}
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{width: '20px', height: '20px', flexShrink: 0}}>
                                    <path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z"/>
                                </svg>
                                Ver Gatos Disponibles
                            </a>
                            <p className="hero-cta-hint">Filtrá por tipo de hogar en el catálogo</p>
                        </div>
                    </div>

                    {/* Right — requirements glass card */}
                    <div className="hero-requirements">
                        <div className="glass-card">
                            <h3>
                                <svg viewBox="0 0 24 24" fill="currentColor" style={{width: '20px', height: '20px', marginRight: '8px', verticalAlign: 'middle'}} aria-hidden="true">
                                    <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                                </svg>
                                Requisitos Básicos
                            </h3>
                            <ul className="req-list">
                                <li>
                                    <span className="icon" aria-hidden="true">
                                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 6c1.11 0 2-.9 2-2 0-.38-.1-.73-.29-1.03L12 0l-1.71 2.97c-.19.3-.29.65-.29 1.03 0 1.1.9 2 2 2zm4.6 9.99l-1.07-1.07-1.08 1.07c-1.3 1.3-3.58 1.31-4.89 0l-1.07-1.07-1.09 1.07C6.75 16.64 5.88 17 4.96 17c-.73 0-1.4-.23-1.96-.61V21c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-4.61c-.56.38-1.23.61-1.96.61-.92 0-1.79-.36-2.44-1.01zM18 9h-5V7h-2v2H6c-1.66 0-3 1.34-3 3v1.54c0 1.08.88 1.96 1.96 1.96.52 0 1.02-.2 1.38-.57l2.14-2.13 2.13 2.13c.74.74 2.03.74 2.77 0l2.14-2.13 2.13 2.13c.37.37.86.57 1.38.57 1.08 0 1.96-.88 1.96-1.96V12C21 10.34 19.66 9 18 9z"/></svg>
                                    </span>
                                    <div className="req-text">
                                        <strong>Mayor de 18 años</strong>
                                        <small>Responsabilidad legal</small>
                                    </div>
                                </li>
                                <li>
                                    <span className="icon" aria-hidden="true">
                                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
                                    </span>
                                    <div className="req-text">
                                        <strong>Hogar Seguro</strong>
                                        <small>Mallas o cerco cerrado</small>
                                    </div>
                                </li>
                                <li>
                                    <span className="icon" aria-hidden="true">
                                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-1.4c0-2 4-3.1 7-3.1s7 1.1 7 3.1V19z"/></svg>
                                    </span>
                                    <div className="req-text">
                                        <strong>Responsabilidad</strong>
                                        <small>Compromiso de vacunas</small>
                                    </div>
                                </li>
                                <li>
                                    <span className="icon" aria-hidden="true">
                                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M9.64 7.64c.23-.5.36-1.05.36-1.64 0-2.21-1.79-4-4-4S2 3.79 2 6s1.79 4 4 4c.59 0 1.14-.13 1.64-.36L10 12l-2.36 2.36C7.14 14.13 6.59 14 6 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4c0-.59-.13-1.14-.36-1.64L12 14l7 7h3v-1L9.64 7.64zM6 8c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm0 12c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm6-7.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM19 3l-6 6 2 2 7-7V3z"/></svg>
                                    </span>
                                    <div className="req-text">
                                        <strong>Esterilización</strong>
                                        <small>Compromiso obligatorio</small>
                                    </div>
                                </li>
                            </ul>
                            <button className="btn-secondary" onClick={() => setIsModalOpen(true)}>
                                Ver proceso completo
                            </button>
                        </div>
                    </div>

                </div>
            </header>

            {/* TRUST STATS STRIP */}
            <section className="stats-strip" aria-label="Por qué elegirnos">
                <div className="stats-inner">
                    <div className="stat-item">
                        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M12 3C8.13 3 5 6.13 5 10c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-1.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7z"/>
                        </svg>
                        <span className="stat-number">100+</span>
                        <span className="stat-label">Gatos rescatados</span>
                    </div>
                    <div className="stat-divider" aria-hidden="true" />
                    <div className="stat-item">
                        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        <span className="stat-number">Proceso</span>
                        <span className="stat-label">100% transparente</span>
                    </div>
                    <div className="stat-divider" aria-hidden="true" />
                    <div className="stat-item">
                        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                        <span className="stat-number">Seguimiento</span>
                        <span className="stat-label">Post-adopción garantizado</span>
                    </div>
                </div>
            </section>

            {/* CATALOG WITH TABS */}
            <section id="catalog-section" className="catalog-section">
                <div className="catalog-header">
                    <h2 className="section-title">Nuestros Rescatados</h2>
                    <p className="section-subtitle">Encontrá tu compañero ideal</p>
                </div>

                {/* Filter Tabs */}
                <div className="catalog-tabs" role="tablist" aria-label="Filtrar por tipo de vivienda">
                    <button
                        role="tab"
                        aria-selected={filters.living_space === 'todos'}
                        className={`tab-btn${filters.living_space === 'todos' ? ' active' : ''}`}
                        onClick={() => setFilters(prev => ({ ...prev, living_space: 'todos' }))}
                    >
                        Todos
                    </button>
                    <button
                        role="tab"
                        aria-selected={filters.living_space === 'casa_grande'}
                        className={`tab-btn${filters.living_space === 'casa_grande' ? ' active' : ''}`}
                        onClick={() => setFilters(prev => ({ ...prev, living_space: 'casa_grande' }))}
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor" style={{width: '16px', height: '16px', marginRight: '6px', verticalAlign: 'middle'}} aria-hidden="true">
                            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                        </svg>
                        Casa Grande
                    </button>
                    <button
                        role="tab"
                        aria-selected={filters.living_space === 'departamento'}
                        className={`tab-btn${filters.living_space === 'departamento' ? ' active' : ''}`}
                        onClick={() => setFilters(prev => ({ ...prev, living_space: 'departamento' }))}
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor" style={{width: '16px', height: '16px', marginRight: '6px', verticalAlign: 'middle'}} aria-hidden="true">
                            <path d="M17 11V3H7v4H3v14h8v-4h2v4h8V11h-4zM7 19H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm4 4H9v-2h2v2zm0-4H9V9h2v2zm0-4H9V5h2v2zm4 8h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm4 12h-2v-2h2v2zm0-4h-2v-2h2v2z"/>
                        </svg>
                        Departamento
                    </button>
                    <button
                        role="tab"
                        aria-selected={filters.living_space === 'cualquiera'}
                        className={`tab-btn${filters.living_space === 'cualquiera' ? ' active' : ''}`}
                        onClick={() => setFilters(prev => ({ ...prev, living_space: 'cualquiera' }))}
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor" style={{width: '16px', height: '16px', marginRight: '6px', verticalAlign: 'middle'}} aria-hidden="true">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                        </svg>
                        Cualquier Espacio
                    </button>
                </div>

                {/* Cat grid — skeleton or results */}
                <div className="catalog-grid">
                    {loading ? (
                        Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                            <SkeletonCard key={i} />
                        ))
                    ) : error ? (
                        <div className="error-container" role="alert">
                            <p>{error}</p>
                        </div>
                    ) : cats.slice(0, 8).length > 0 ? (
                        cats.slice(0, 8).map((cat) => (
                            <CatCard key={cat.id} cat={cat} />
                        ))
                    ) : (
                        <div className="no-results">
                            <p>No hay gatos disponibles en esta categoría.</p>
                        </div>
                    )}
                </div>

                {!loading && !error && cats.length > 8 && (
                    <div className="catalog-footer">
                        <Link
                            to={`/catalogo${filters.living_space !== 'todos' ? `?living_space=${filters.living_space}` : ''}`}
                            className="btn-ver-todos"
                        >
                            Ver Todos los Gatos ({cats.length})
                            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
                            </svg>
                        </Link>
                    </div>
                )}
            </section>

            {/* ADOPTION STEPS */}
            <section className="process-strip">
                <h3 className="strip-title">Cómo Adoptar en 4 Pasos</h3>
                <div className="process-steps-horizontal">
                    <div className="step-h">
                        <div className="step-number">1</div>
                        <svg className="step-icon-h" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                        <h4>Explorá</h4>
                        <p>Conocé a nuestros gatos</p>
                    </div>
                    <div className="step-arrow" aria-hidden="true">→</div>
                    <div className="step-h">
                        <div className="step-number">2</div>
                        <svg className="step-icon-h" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                        <h4>Aplicá</h4>
                        <p>Completá la solicitud</p>
                    </div>
                    <div className="step-arrow" aria-hidden="true">→</div>
                    <div className="step-h">
                        <div className="step-number">3</div>
                        <svg className="step-icon-h" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                        </svg>
                        <h4>Conocelo</h4>
                        <p>Visitá al gato</p>
                    </div>
                    <div className="step-arrow" aria-hidden="true">→</div>
                    <div className="step-h">
                        <div className="step-number">4</div>
                        <svg className="step-icon-h" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                        </svg>
                        <h4>Adoptá</h4>
                        <p>Llevalo a casa</p>
                    </div>
                </div>
                <button className="btn-requisitos" onClick={() => setIsModalOpen(true)}>
                    Requisitos: mayor de edad y hogar seguro. <strong>Leer más →</strong>
                </button>
            </section>

            <AdoptionProcessModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            {/* SUCCESS STORIES */}
            <section className="testimonials-section-compact">
                <h2 className="section-title">Historias de Éxito</h2>
                <p className="stories-subtitle">Familias felices que encontraron su compañero perfecto</p>

                <div className="testimonials-horizontal">
                    <div className="testimonial-card-h">
                        <img
                            src="https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1&fm=webp"
                            alt="Milo, un gato naranja adoptado"
                            className="testimonial-img-h"
                            loading="lazy"
                        />
                        <div className="testimonial-content-h">
                            <p className="testimonial-text-h">"Milo es tranquilo y cariñoso. ¡El proceso fue tan fácil y transparente!"</p>
                            <div className="testimonial-author-h"><strong>María González</strong> · Adoptó a Milo</div>
                        </div>
                    </div>

                    <div className="testimonial-card-h">
                        <img
                            src="https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1&fm=webp"
                            alt="Luna, una gata blanca adoptada"
                            className="testimonial-img-h"
                            loading="lazy"
                        />
                        <div className="testimonial-content-h">
                            <p className="testimonial-text-h">"Luna es perfecta: juguetona e inteligente. Mis hijos la adoran."</p>
                            <div className="testimonial-author-h"><strong>Juan Pérez</strong> · Adoptó a Luna</div>
                        </div>
                    </div>

                    <div className="testimonial-card-h">
                        <img
                            src="https://images.pexels.com/photos/1741205/pexels-photo-1741205.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1&fm=webp"
                            alt="Simón, un gato gris adoptado"
                            className="testimonial-img-h"
                            loading="lazy"
                        />
                        <div className="testimonial-content-h">
                            <p className="testimonial-text-h">"Proceso transparente con seguimiento real. ¡100% recomendado!"</p>
                            <div className="testimonial-author-h"><strong>Carla Morales</strong> · Adoptó a Simón</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CAN'T ADOPT */}
            <section className="cant-adopt-section">
                <h2 className="cant-adopt-title">¿No Podés Adoptar? ¡Aún Podés Ayudar!</h2>
                <p className="cant-adopt-text">
                    Tu apoyo nos ayuda a proporcionar comida, refugio y atención médica para gatos que lo necesitan.
                    Considerá donar, ser voluntario o convertirte en un hogar temporal.
                </p>
                <div className="cant-adopt-buttons">
                    {getWhatsAppVolunteerUrl() ? (
                        <a
                            href={getWhatsAppVolunteerUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="volunteer-btn"
                        >
                            Ser Voluntario
                        </a>
                    ) : (
                        <Link to="/register" className="volunteer-btn">
                            Unirme como Rescatista
                        </Link>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;
