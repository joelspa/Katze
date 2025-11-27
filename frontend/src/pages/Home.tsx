// Página principal - Home
// Muestra la galería de gatos disponibles para adopción

import { useState, useEffect } from 'react';
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
    const scrollToSection = (sectionId: string, filterUpdate: any) => {
        setFilters(prev => ({ ...prev, ...filterUpdate }));
        setTimeout(() => {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    };

    // Scroll al inicio cuando se carga la página
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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
    }, [filters]); // Re-ejecutar cuando cambien los filtros



    return (
        <div className="home-container">
            {/* Living Space Selection - Banner de categorías destacado */}
            <section className="living-space-banner">
                <div className="banner-background">
                    <div className="banner-overlay"></div>
                </div>
                
                <div className="banner-content">
                    <div className="banner-header">
                        <span className="banner-label">
                            <svg className="label-icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8.75 3.75A1.75 1.75 0 0 0 7 5.5v.5h-.5a2.5 2.5 0 0 0-2.45 2.063L4 8.25v8.5c0 1.243.91 2.268 2.096 2.457l.154.018V20a1 1 0 0 0 1 1h1.5a1 1 0 0 0 1-1v-.775h4.5V20a1 1 0 0 0 1 1h1.5a1 1 0 0 0 1-1v-.775c1.287-.179 2.25-1.214 2.25-2.475v-8.5l-.05-.187A2.5 2.5 0 0 0 17.5 6H17v-.5a1.75 1.75 0 0 0-1.75-1.75h-6.5zm0 1.5h6.5a.25.25 0 0 1 .25.25V6h-7v-.75a.25.25 0 0 1 .25-.25zM5.5 7.5h13a1 1 0 0 1 1 1v8.25a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1V8.5a1 1 0 0 1 1-1zm1.5 3a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5zm10 0a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5z"/>
                            </svg>
                            Encuentra tu Compañero Perfecto
                        </span>
                        <h1 className="banner-title">¿Qué Tipo de Hogar Ofreces?</h1>
                        <p className="banner-subtitle">
                            Selecciona tu tipo de vivienda para descubrir los gatos ideales para ti
                        </p>
                    </div>
                    
                    <div className="banner-categories">
                        <div 
                            className={`category-banner ${filters.living_space === 'casa_grande' ? 'active' : ''}`}
                            onClick={() => scrollToSection('adopt', { living_space: 'casa_grande' })}
                        >
                            <div className="category-icon-wrapper">
                                <svg className="category-icon" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                                </svg>
                            </div>
                            <div className="category-info">
                                <h3 className="category-title">Casa Grande</h3>
                                <p className="category-desc">Gatos activos y enérgicos</p>
                                <div className="category-tags">
                                    <span className="tag">Maine Coon</span>
                                    <span className="tag">Ragdoll</span>
                                    <span className="tag">Bengal</span>
                                </div>
                            </div>
                            <div className="category-arrow">→</div>
                        </div>

                        <div 
                            className={`category-banner ${filters.living_space === 'departamento' ? 'active' : ''}`}
                            onClick={() => scrollToSection('adopt', { living_space: 'departamento' })}
                        >
                            <div className="category-icon-wrapper">
                                <svg className="category-icon" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17 11V3H7v4H3v14h8v-4h2v4h8V11h-4zM7 19H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm4 4H9v-2h2v2zm0-4H9V9h2v2zm0-4H9V5h2v2zm4 8h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm4 12h-2v-2h2v2zm0-4h-2v-2h2v2z"/>
                                </svg>
                            </div>
                            <div className="category-info">
                                <h3 className="category-title">Departamento</h3>
                                <p className="category-desc">Gatos tranquilos y cariñosos</p>
                                <div className="category-tags">
                                    <span className="tag">Persa</span>
                                    <span className="tag">British</span>
                                    <span className="tag">Siamés</span>
                                </div>
                            </div>
                            <div className="category-arrow">→</div>
                        </div>

                        <div 
                            className={`category-banner ${filters.living_space === 'cualquiera' ? 'active' : ''}`}
                            onClick={() => scrollToSection('adopt', { living_space: 'cualquiera' })}
                        >
                            <div className="category-icon-wrapper">
                                <svg className="category-icon" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                </svg>
                            </div>
                            <div className="category-info">
                                <h3 className="category-title">Cualquier Espacio</h3>
                                <p className="category-desc">Gatos adaptables y flexibles</p>
                                <div className="category-tags">
                                    <span className="tag">Mestizos</span>
                                    <span className="tag">Versátiles</span>
                                    <span className="tag">Todos</span>
                                </div>
                            </div>
                            <div className="category-arrow">→</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Ready for a Furry Friend Section */}
            <section className="ready-section">
                <div className="ready-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 6v6l4 2"/>
                    </svg>
                </div>
                <h2 className="ready-title">¿Listo para un Nuevo Amigo?</h2>
                <p className="ready-subtitle">
                    Para asegurar que nuestros gatos vayan a hogares seguros y amorosos, 
                    revisa nuestros requisitos clave de adopción antes de aplicar.
                </p>
                
                <div className="requirements-grid">
                    <div className="requirement-item">
                        <div className="requirement-icon">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                            </svg>
                        </div>
                        <h3>Vivienda Estable</h3>
                        <p>Comprobante de domicilio y aprobación del arrendador si arriendas.</p>
                    </div>
                    <div className="requirement-item">
                        <div className="requirement-icon">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                        </div>
                        <h3>Mayoría de Edad</h3>
                        <p>Los adoptantes deben tener 18 años o más.</p>
                    </div>
                    <div className="requirement-item">
                        <div className="requirement-icon">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                        </div>
                        <h3>Ambiente Seguro</h3>
                        <p>Compromiso de proporcionar un espacio seguro en interiores.</p>
                    </div>
                    <div className="requirement-item">
                        <div className="requirement-icon">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19.48 12.35c-.03-.04-6.13-6.09-6.46-6.41-.32-.32-.84-.48-1.35-.48-.51 0-1.03.16-1.35.48l-6.46 6.41c-.63.63-.98 1.47-.98 2.37 0 1.84 1.49 3.33 3.33 3.33 1.01 0 1.92-.45 2.53-1.15L12 13.19l3.26 3.71c.61.7 1.52 1.15 2.53 1.15 1.84 0 3.33-1.49 3.33-3.33 0-.9-.35-1.74-.98-2.37z"/>
                            </svg>
                        </div>
                        <h3>Atención Veterinaria</h3>
                        <p>Capacidad de proporcionar cuidado veterinario rutinario y de emergencia.</p>
                    </div>
                </div>
                
                <button className="learn-more-btn" onClick={() => setIsModalOpen(true)}>
                    Conoce Más Sobre Nuestro Proceso
                </button>
            </section>

            {/* Modal de Proceso de Adopción */}
            <AdoptionProcessModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />

            {/* Meet Our Adorable Cats Section - Agrupados por tipo de vivienda */}
            <section id="adopt" className="adoption-section">
                <h2 className="section-title">Conoce a Nuestros Adorables Gatos</h2>
                <p className="section-subtitle">
                    {filters.living_space === 'todos' 
                        ? 'Todos nuestros gatos rescatados, agrupados por tipo de hogar ideal' 
                        : `Gatos perfectos para ${filters.living_space === 'casa_grande' ? 'Casa Grande' : filters.living_space === 'departamento' ? 'Departamento' : 'Cualquier Espacio'}`
                    }
                </p>

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
                    <>
                        {filters.living_space === 'todos' ? (
                            // Mostrar agrupados por tipo de vivienda
                            <>
                                {/* Grupo Casa Grande */}
                                {cats.filter(cat => cat.living_space_requirement === 'casa_grande').length > 0 && (
                                    <div className="cat-group">
                                        <div className="group-header">
                                            <div className="group-icon">
                                                <svg viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                                                </svg>
                                            </div>
                                            <div className="group-info">
                                                <h3>Gatos para Casa Grande</h3>
                                                <p>Activos y espaciosos - Necesitan espacio para explorar</p>
                                            </div>
                                            <span className="group-count">
                                                {cats.filter(cat => cat.living_space_requirement === 'casa_grande').length} gatos
                                            </span>
                                        </div>
                                        <CatCarousel 
                                            cats={cats.filter(cat => cat.living_space_requirement === 'casa_grande')} 
                                            maxVisible={4}
                                        />
                                        {cats.filter(cat => cat.living_space_requirement === 'casa_grande').length > 4 && (
                                            <div className="view-more-container">
                                                <Link to="/catalogo?living_space=casa_grande" className="view-more-btn">
                                                    Ver Todos ({cats.filter(cat => cat.living_space_requirement === 'casa_grande').length})
                                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
                                                    </svg>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Grupo Departamento */}
                                {cats.filter(cat => cat.living_space_requirement === 'departamento').length > 0 && (
                                    <div className="cat-group">
                                        <div className="group-header">
                                            <div className="group-icon">
                                                <svg viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
                                                </svg>
                                            </div>
                                            <div className="group-info">
                                                <h3>Gatos para Departamento</h3>
                                                <p>Tranquilos y adaptables - Cómodos en espacios pequeños</p>
                                            </div>
                                            <span className="group-count">
                                                {cats.filter(cat => cat.living_space_requirement === 'departamento').length} gatos
                                            </span>
                                        </div>
                                        <CatCarousel 
                                            cats={cats.filter(cat => cat.living_space_requirement === 'departamento')} 
                                            maxVisible={4}
                                        />
                                        {cats.filter(cat => cat.living_space_requirement === 'departamento').length > 4 && (
                                            <div className="view-more-container">
                                                <Link to="/catalogo?living_space=departamento" className="view-more-btn">
                                                    Ver Todos ({cats.filter(cat => cat.living_space_requirement === 'departamento').length})
                                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
                                                    </svg>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Grupo Cualquier Espacio */}
                                {cats.filter(cat => cat.living_space_requirement === 'cualquiera').length > 0 && (
                                    <div className="cat-group">
                                        <div className="group-header">
                                            <div className="group-icon">
                                                <svg viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                                </svg>
                                            </div>
                                            <div className="group-info">
                                                <h3>Gatos para Cualquier Espacio</h3>
                                                <p>Versátiles y flexibles - Se adaptan a cualquier hogar</p>
                                            </div>
                                            <span className="group-count">
                                                {cats.filter(cat => cat.living_space_requirement === 'cualquiera').length} gatos
                                            </span>
                                        </div>
                                        <CatCarousel 
                                            cats={cats.filter(cat => cat.living_space_requirement === 'cualquiera')} 
                                            maxVisible={4}
                                        />
                                        {cats.filter(cat => cat.living_space_requirement === 'cualquiera').length > 4 && (
                                            <div className="view-more-container">
                                                <Link to="/catalogo?living_space=cualquiera" className="view-more-btn">
                                                    Ver Todos ({cats.filter(cat => cat.living_space_requirement === 'cualquiera').length})
                                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
                                                    </svg>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {cats.length === 0 && (
                                    <div className="no-results">
                                        <p>No hay gatos disponibles en este momento.</p>
                                    </div>
                                )}
                            </>
                        ) : (
                            // Mostrar filtrados en una sola galería
                            <div className="cat-gallery">
                                {cats.length > 0 ? (
                                    cats.map((cat) => (
                                        <CatCard key={cat.id} cat={cat} />
                                    ))
                                ) : (
                                    <div className="no-results">
                                        <p>No se encontraron gatos con los filtros actuales.</p>
                                        <button 
                                            onClick={() => setFilters({ sterilization_status: 'todos', age: 'todos', living_space: 'todos' })} 
                                            className="reset-filters-btn"
                                        >
                                            Ver todos los gatos
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </section>

            {/* Your Adoption Journey Section */}
            <section className="journey-section">
                <h2 className="section-title">Tu Proceso de Adopción</h2>
                <p className="journey-subtitle">Nuestro proceso simple está diseñado para encontrar la mejor combinación entre tú y nuestros gatos.</p>
                
                <div className="journey-steps">
                    <div className="journey-step">
                        <div className="step-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                            </svg>
                        </div>
                        <h3>Explora</h3>
                        <p>Conoce los perfiles de todos los maravillosos gatos disponibles para adopción.</p>
                    </div>
                    
                    <div className="journey-step">
                        <div className="step-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                            </svg>
                        </div>
                        <h3>Aplica</h3>
                        <p>Completa una solicitud simple para que conozcamos sobre ti y tu hogar.</p>
                    </div>
                    
                    <div className="journey-step">
                        <div className="step-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                            </svg>
                        </div>
                        <h3>Conócelo</h3>
                        <p>Agenda una visita para conocer a tu potencial nuevo compañero en persona.</p>
                    </div>
                    
                    <div className="journey-step">
                        <div className="step-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                            </svg>
                        </div>
                        <h3>Adopta</h3>
                        <p>Finaliza la adopción y dale la bienvenida a tu nuevo amigo peludo a casa.</p>
                    </div>
                </div>
            </section>

            {/* Testimonios de Adoptantes Section */}
            <section className="testimonials-section">
                <h2 className="section-title">Historias de Éxito: Nuestros Adoptantes Felices</h2>
                <p className="stories-subtitle">Conoce a las familias que encontraron a su compañero perfecto con Katze</p>
                
                <div className="testimonials-grid">
                    <div className="testimonial-card">
                        <div className="testimonial-header">
                            <img 
                                src="https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1" 
                                alt="Milo el gato"
                                className="testimonial-cat-image"
                            />
                            <div className="testimonial-info">
                                <h3 className="adopter-name">María González</h3>
                                <p className="adopted-cat">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="info-icon">
                                        <path d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 10c-2.7 0-5.8 1.29-6 2h12c-.22-.72-3.31-2-6-2zM18 11.09V6.27L10.5 3 3 6.27v4.91c0 4.54 3.2 8.79 7.5 9.82.55-.13 1.08-.32 1.6-.55A5.973 5.973 0 0018 17c0-2.07-1.05-3.89-2.65-4.97A5.99 5.99 0 0118 11.09zM23 17c0 3.31-2.69 6-6 6s-6-2.69-6-6 2.69-6 6-6 6 2.69 6 6zm-8.46 2.65l-.69-.69L15 17.81V15h1v2.44l-1.46 2.21z"/>
                                    </svg>
                                    Adoptó a <strong>Milo</strong>
                                </p>
                                <p className="adoption-date">Febrero 2024</p>
                            </div>
                        </div>
                        <p className="testimonial-text">
                            "Adoptar a Milo cambió completamente mi vida. Vivía sola en un departamento y buscaba compañía. El equipo de Katze me ayudó a encontrar el gato perfecto para mi estilo de vida. Milo es tranquilo, cariñoso y se adaptó súper rápido. ¡El proceso fue tan fácil y transparente!"
                        </p>
                    </div>
                    
                    <div className="testimonial-card">
                        <div className="testimonial-header">
                            <img 
                                src="https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1" 
                                alt="Luna la gata"
                                className="testimonial-cat-image"
                            />
                            <div className="testimonial-info">
                                <h3 className="adopter-name">Juan Pérez</h3>
                                <p className="adopted-cat">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="info-icon">
                                        <path d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 10c-2.7 0-5.8 1.29-6 2h12c-.22-.72-3.31-2-6-2zM18 11.09V6.27L10.5 3 3 6.27v4.91c0 4.54 3.2 8.79 7.5 9.82.55-.13 1.08-.32 1.6-.55A5.973 5.973 0 0018 17c0-2.07-1.05-3.89-2.65-4.97A5.99 5.99 0 0118 11.09zM23 17c0 3.31-2.69 6-6 6s-6-2.69-6-6 2.69-6 6-6 6 2.69 6 6zm-8.46 2.65l-.69-.69L15 17.81V15h1v2.44l-1.46 2.21z"/>
                                    </svg>
                                    Adoptó a <strong>Luna</strong>
                                </p>
                                <p className="adoption-date">Marzo 2024</p>
                            </div>
                        </div>
                        <p className="testimonial-text">
                            "Tengo una casa grande con jardín y buscaba un gato activo. Luna es perfecta: juguetona, aventurera y muy inteligente. Mis hijos la adoran. El seguimiento post-adopción de Katze fue increíble, siempre respondiendo nuestras dudas. ¡100% recomendado!"
                        </p>
                    </div>

                    <div className="testimonial-card">
                        <div className="testimonial-header">
                            <img 
                                src="https://images.pexels.com/photos/1741205/pexels-photo-1741205.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1" 
                                alt="Simón el gato"
                                className="testimonial-cat-image"
                            />
                            <div className="testimonial-info">
                                <h3 className="adopter-name">Carla Morales</h3>
                                <p className="adopted-cat">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="info-icon">
                                        <path d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 10c-2.7 0-5.8 1.29-6 2h12c-.22-.72-3.31-2-6-2zM18 11.09V6.27L10.5 3 3 6.27v4.91c0 4.54 3.2 8.79 7.5 9.82.55-.13 1.08-.32 1.6-.55A5.973 5.973 0 0018 17c0-2.07-1.05-3.89-2.65-4.97A5.99 5.99 0 0118 11.09zM23 17c0 3.31-2.69 6-6 6s-6-2.69-6-6 2.69-6 6-6 6 2.69 6 6zm-8.46 2.65l-.69-.69L15 17.81V15h1v2.44l-1.46 2.21z"/>
                                    </svg>
                                    Adoptó a <strong>Simón</strong>
                                </p>
                                <p className="adoption-date">Enero 2024</p>
                            </div>
                        </div>
                        <p className="testimonial-text">
                            "Como rescatista, conozco la importancia de una buena adopción. Katze superó mis expectativas: proceso transparente, gratuito y con seguimiento real. Simón llegó esterilizado, vacunado y sano. Ahora es parte de mi familia. ¡Gracias por su labor!"
                        </p>
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