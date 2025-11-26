// Modal del Proceso de Adopción
// Muestra información detallada sobre cómo adoptar un gato

import { useEffect } from 'react';
import './AdoptionProcessModal.css';

interface AdoptionProcessModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AdoptionProcessModal = ({ isOpen, onClose }: AdoptionProcessModalProps) => {
    // Cerrar modal con ESC
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="adoption-modal-overlay" onClick={onClose}>
            <div className="adoption-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="modal-header">
                    <h2>Proceso de Adopción Completo</h2>
                    <p>Todo lo que necesitas saber para darle un hogar a un gato rescatado</p>
                </div>

                <div className="modal-body">
                    {/* Requisitos Previos */}
                    <section className="process-section">
                        <div className="section-icon">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                            </svg>
                        </div>
                        <h3>Requisitos Previos</h3>
                        <div className="requirements-checklist">
                            <div className="checklist-item">
                                <span className="check">✓</span>
                                <div>
                                    <strong>Ser mayor de edad</strong>
                                    <p>Para poder firmar el compromiso de adopción responsable.</p>
                                </div>
                            </div>
                            <div className="checklist-item">
                                <span className="check">✓</span>
                                <div>
                                    <strong>Amor por los animales</strong>
                                    <p>Ganas de darle una segunda oportunidad a un gato rescatado.</p>
                                </div>
                            </div>
                            <div className="checklist-item">
                                <span className="check">✓</span>
                                <div>
                                    <strong>Compromiso de cuidado</strong>
                                    <p>Los gatos pueden vivir 15-20 años. Compromiso de cuidarlo toda su vida.</p>
                                </div>
                            </div>
                            <div className="checklist-item">
                                <span className="check">✓</span>
                                <div>
                                    <strong>Responsabilidad</strong>
                                    <p>Compromiso de proporcionar alimentación, cuidados básicos y cariño.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Proceso Paso a Paso */}
                    <section className="process-section">
                        <div className="section-icon">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
                            </svg>
                        </div>
                        <h3>Proceso Paso a Paso</h3>
                        
                        <div className="timeline">
                            <div className="timeline-item">
                                <div className="timeline-number">1</div>
                                <div className="timeline-content">
                                    <h4>Explora y Elige</h4>
                                    <p>Navega por nuestra galería de gatos disponibles. Filtra por tipo de vivienda, edad y estado de esterilización.</p>
                                    <span className="time-estimate">5-15 minutos</span>
                                </div>
                            </div>

                            <div className="timeline-item">
                                <div className="timeline-number">2</div>
                                <div className="timeline-content">
                                    <h4>Completa la Solicitud</h4>
                                    <p>Llena el formulario de adopción con tus datos personales, información de vivienda y experiencia con mascotas.</p>
                                    <span className="time-estimate">10-20 minutos</span>
                                </div>
                            </div>

                            <div className="timeline-item">
                                <div className="timeline-number">3</div>
                                <div className="timeline-content">
                                    <h4>Revisión y Contacto</h4>
                                    <p>Nuestro equipo revisará tu solicitud y te contactará en 24-48 horas para coordinar la visita.</p>
                                    <span className="time-estimate">1-2 días</span>
                                </div>
                            </div>

                            <div className="timeline-item">
                                <div className="timeline-number">4</div>
                                <div className="timeline-content">
                                    <h4>Visita de Conocimiento</h4>
                                    <p>Agenda una cita para conocer al gato en persona. Observa su personalidad y compatibilidad con tu familia.</p>
                                    <span className="time-estimate">1-2 horas</span>
                                </div>
                            </div>

                            <div className="timeline-item">
                                <div className="timeline-number">5</div>
                                <div className="timeline-content">
                                    <h4>Preparación del Hogar</h4>
                                    <p>Prepara tu casa con los elementos esenciales: arenero, comederos, rascador y espacio seguro.</p>
                                    <span className="time-estimate">2-3 días</span>
                                </div>
                            </div>

                            <div className="timeline-item">
                                <div className="timeline-number">6</div>
                                <div className="timeline-content">
                                    <h4>Firma de Compromiso</h4>
                                    <p>Firma el compromiso de adopción responsable. ¡Totalmente gratuito!</p>
                                    <span className="time-estimate">30 minutos</span>
                                </div>
                            </div>

                            <div className="timeline-item">
                                <div className="timeline-number">7</div>
                                <div className="timeline-content">
                                    <h4>¡Bienvenida a Casa!</h4>
                                    <p>Lleva a tu nuevo compañero a casa. Te daremos consejos para la adaptación inicial.</p>
                                    <span className="time-estimate">Primer día</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Documentos Necesarios */}
                    <section className="process-section">
                        <div className="section-icon">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                            </svg>
                        </div>
                        <h3>Lo Que Necesitas Traer</h3>
                        <div className="documents-grid">
                            <div className="document-card">
                                <span className="doc-icon">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                    </svg>
                                </span>
                                <h4>Identificación</h4>
                                <p>Solo tu cédula de identidad o RUT para el compromiso de adopción.</p>
                            </div>
                            <div className="document-card">
                                <span className="doc-icon">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                    </svg>
                                </span>
                                <h4>Muchas Ganas</h4>
                                <p>Tu amor y compromiso son lo más importante para nosotros.</p>
                            </div>
                            <div className="document-card">
                                <span className="doc-icon">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                    </svg>
                                </span>
                                <h4>Dirección de Contacto</h4>
                                <p>Solo para mantenernos en contacto y hacer seguimiento.</p>
                            </div>
                            <div className="document-card">
                                <span className="doc-icon">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>
                                    </svg>
                                </span>
                                <h4>Teléfono</h4>
                                <p>Para coordinar la entrega y seguimiento post-adopción.</p>
                            </div>
                        </div>
                    </section>

                    {/* Adopción Gratuita */}
                    <section className="process-section">
                        <div className="section-icon">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                        </div>
                        <h3>Adopción 100% Gratuita</h3>
                        <div className="costs-table">
                            <div className="cost-row">
                                <span className="cost-label">Costo de adopción</span>
                                <span className="cost-value free">¡GRATIS!</span>
                            </div>
                            <div className="cost-row">
                                <span className="cost-label">Vacunas básicas</span>
                                <span className="cost-value free">✓ Incluidas</span>
                            </div>
                            <div className="cost-row">
                                <span className="cost-label">Desparasitación inicial</span>
                                <span className="cost-value free">✓ Incluida</span>
                            </div>
                            <div className="cost-note">
                                <strong>Sin fines de lucro:</strong> Somos una organización sin fines de lucro. 
                                La adopción es completamente gratuita. Si deseas, puedes hacer una donación voluntaria para ayudarnos a seguir rescatando más gatos.
                            </div>
                            <div className="cost-disclaimer">
                                <strong>Importante:</strong> Los gastos de esterilización, vacunas de refuerzo y futuros cuidados veterinarios 
                                son responsabilidad del adoptante. Te recomendamos contar con un presupuesto para el cuidado continuo de tu nuevo compañero.
                            </div>
                        </div>
                    </section>

                    {/* Seguimiento Post-Adopción */}
                    <section className="process-section">
                        <div className="section-icon">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
                            </svg>
                        </div>
                        <h3>Seguimiento Post-Adopción</h3>
                        <p>No te dejamos solo después de la adopción:</p>
                        <ul className="support-list">
                            <li>Llamada de seguimiento a la semana</li>
                            <li>Visita opcional al mes de la adopción</li>
                            <li>Asesoría veterinaria por WhatsApp</li>
                            <li>Grupo de apoyo de adoptantes en redes sociales</li>
                            <li>Descuentos en clínicas veterinarias aliadas</li>
                        </ul>
                    </section>

                    {/* Preguntas Frecuentes */}
                    <section className="process-section">
                        <div className="section-icon">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"/>
                            </svg>
                        </div>
                        <h3>Preguntas Frecuentes</h3>
                        <div className="faq-list">
                            <details className="faq-item">
                                <summary>¿Puedo adoptar si tengo otras mascotas?</summary>
                                <p>¡Por supuesto! Te ayudaremos a elegir un gato compatible con tus mascotas actuales. La convivencia exitosa es nuestra prioridad.</p>
                            </details>
                            <details className="faq-item">
                                <summary>¿Puedo devolver al gato si no me adapto?</summary>
                                <p>Nuestro compromiso es de por vida. Si hay problemas, trabajaremos contigo para resolverlos. En casos extremos, recibiremos al gato de vuelta.</p>
                            </details>
                            <details className="faq-item">
                                <summary>¿Los gatos están sanos?</summary>
                                <p>Todos nuestros gatos pasan revisión veterinaria completa, están desparasitados, vacunados y esterilizados.</p>
                            </details>
                            <details className="faq-item">
                                <summary>¿Puedo adoptar si vivo en departamento?</summary>
                                <p>¡Por supuesto! Muchos gatos se adaptan perfectamente a departamentos. Te ayudaremos a elegir el gato ideal para tu espacio.</p>
                            </details>
                        </div>
                    </section>
                </div>

                <div className="modal-footer">
                    <button className="btn-secondary" onClick={onClose}>
                        Cerrar
                    </button>
                    <button 
                        className="btn-primary" 
                        onClick={() => {
                            onClose();
                            document.getElementById('adopt')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                    >
                        Ver Gatos Disponibles
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdoptionProcessModal;
