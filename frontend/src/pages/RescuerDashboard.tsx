// Panel de control para rescatistas
// Permite visualizar y gestionar solicitudes de adopción recibidas

import { useState, useEffect } from 'react';
import axios, { isAxiosError } from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AIBadge, AIScoreBadge } from '../components/AIBadge';
import TrackingDashboard from './TrackingDashboard';
import './RescuerDashboard.css';
import './AdminDashboard.css'; // Reutilizar estilos del admin dashboard
import '../components/AIBadge.css';
import { API_BASE_URL } from '../config/api';

// Interfaz que define la estructura de una solicitud de adopción
interface Application {
    id: number;
    cat_id: number;
    cat_name: string;
    cat_photos?: string[];
    applicant_name: string;
    applicant_email: string;
    applicant_phone?: string;
    status: string; // 'procesando', 'revision_pendiente', 'rechazada_automaticamente', 'pendiente', 'aprobada', 'rechazada'
    form_responses: any;
    ai_score?: number; // 0-100
    ai_feedback?: string; // Explicación corta de la IA
    ai_flags?: string[]; // Etiquetas: Casa Segura, Pro-Esterilización, etc.
    ai_evaluated_at?: string;
    created_at?: string;
}

// Interfaz para agrupar solicitudes por gato
interface CatApplicationGroup {
    cat_id: number;
    cat_name: string;
    cat_photos?: string[];
    applications: Application[];
    applicationCount: number;
}

type TabType = 'applications' | 'tracking';

const RescuerDashboard = () => {
    const [activeTab, setActiveTab] = useState<TabType>('applications');
    const [groupedApplications, setGroupedApplications] = useState<CatApplicationGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCat, setSelectedCat] = useState<CatApplicationGroup | null>(null);
    const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
    const [currentAppIndex, setCurrentAppIndex] = useState(0);
    const { token } = useAuth();

    // Scroll al inicio cuando se carga la página
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Función para agrupar solicitudes por gato
    const groupApplicationsByCat = (apps: Application[]): CatApplicationGroup[] => {
        const grouped = apps.reduce((acc, app) => {
            const catId = app.cat_id || app.cat_name; // Usar cat_id o cat_name como fallback
            
            if (!acc[catId]) {
                acc[catId] = {
                    cat_id: app.cat_id,
                    cat_name: app.cat_name,
                    cat_photos: app.cat_photos,
                    applications: [],
                    applicationCount: 0
                };
            }
            
            acc[catId].applications.push(app);
            acc[catId].applicationCount++;
            
            return acc;
        }, {} as Record<string | number, CatApplicationGroup>);

        // Convertir a array y ordenar por cantidad de solicitudes (más solicitudes primero)
        return Object.values(grouped).sort((a, b) => b.applicationCount - a.applicationCount);
    };

    // Carga las solicitudes de adopción recibidas
    const fetchApplications = async () => {
        if (!token) {
            setError('No se encontró el token de autenticación');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            console.log('Cargando solicitudes con token:', token?.substring(0, 20) + '...');
            const API_URL = `${API_BASE_URL}/api/applications/received`;
            const response = await axios.get(API_URL, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            console.log('Respuesta recibida:', response.data);
            
            // El backend devuelve { success: true, data: { applications: [...] } }
            const applicationsData = response.data.data?.applications || response.data.applications || response.data;
            console.log('Solicitudes procesadas:', applicationsData);
            
            // Debug: Verificar datos de IA en las solicitudes
            applicationsData.forEach((app: Application) => {
                console.log(`Solicitud #${app.id}: status=${app.status}, ai_score=${app.ai_score}, ai_feedback=${app.ai_feedback}, ai_flags=`, app.ai_flags);
            });
            
            // Agrupar solicitudes por gato
            const grouped = groupApplicationsByCat(applicationsData);
            setGroupedApplications(grouped);
            
            setError(null);
        } catch (error: unknown) {
            let errorMessage = 'Error al cargar las solicitudes';
            if (isAxiosError(error)) {
                errorMessage = error.response?.data?.message || 'Error del servidor';
                console.error('Error axios:', error.response?.data);
            }
            console.error('Error completo:', error);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Carga solicitudes al montar el componente
    useEffect(() => {
        console.log('RescuerDashboard montado, token:', token ? 'presente' : 'ausente');
        fetchApplications();
    }, [token]);

    // Actualiza el estado de una solicitud (aprobar o rechazar)
    const handleUpdateStatus = async (appId: number, newStatus: 'aprobada' | 'rechazada') => {
        const action = newStatus === 'aprobada' ? 'aprobar' : 'rechazar';
        if (!window.confirm(`¿Estás seguro de que quieres ${action} esta solicitud?`)) {
            return;
        }

        try {
            const API_URL = `${API_BASE_URL}/api/applications/${appId}/status`;
            const response = await axios.put(API_URL,
                { status: newStatus },
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            alert(response.data.message || `Solicitud ${newStatus} con éxito.`);
            fetchApplications();

        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || error.message;
                alert(`Error al actualizar la solicitud: ${errorMessage}`);
                console.error('Error completo:', error.response?.data);
            } else {
                alert('Error desconocido al actualizar la solicitud.');
                console.error(error);
            }
        }
    };

    if (loading) {
        return (
            <div className="dashboard-container">
                <p className="loading-message">Cargando panel...</p>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="dashboard-container">
                <p className="error-message">{error}</p>
            </div>
        );
    }

    return (
        <div className="admin-layout">
            {/* Sidebar de navegación */}
            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <h1>
                        <svg viewBox="0 0 20 20" fill="currentColor" style={{width: '28px', height: '28px', color: '#3b82f6'}}>
                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Panel Rescatista</span>
                    </h1>
                </div>

                <nav className="admin-nav">
                    <button 
                        type="button"
                        className={`nav-item ${activeTab === 'applications' ? 'active' : ''}`}
                        onClick={() => setActiveTab('applications')}
                    >
                        <svg viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                        </svg>
                        <span>Solicitudes Recibidas</span>
                    </button>
                    <button 
                        type="button"
                        className={`nav-item ${activeTab === 'tracking' ? 'active' : ''}`}
                        onClick={() => setActiveTab('tracking')}
                    >
                        <svg viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span>Seguimiento</span>
                    </button>
                    <Link to="/publish" className="nav-item">
                        <svg viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        <span>Publicar Gato</span>
                    </Link>
                </nav>
            </aside>

            <main className="admin-main-content">
                {activeTab === 'applications' && (
                    <div className="dashboard-container" style={{padding: 0, background: 'transparent', boxShadow: 'none'}}>
                        <div className="section-header">
                            <svg className="section-icon" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                            </svg>
                            <h2>Solicitudes Pendientes</h2>
                        </div>
                        {groupedApplications.length === 0 ? (
                            <div className="empty-state">
                                <svg className="empty-state-icon" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                </svg>
                                <p className="empty-state-text">No tienes solicitudes pendientes.</p>
                            </div>
                        ) : (
                            <div className="applications-grid">
                                {groupedApplications.map((catGroup) => {
                                    const hasTopCandidate = catGroup.applications.some(app => (app.ai_score || 0) >= 90);
                                    
                                    return (
                                        <div 
                                            key={catGroup.cat_id} 
                                            className="cat-summary-card"
                                            onClick={() => setSelectedCat(catGroup)}
                                        >
                                            <div className="cat-image-container">
                                                <img 
                                                    src={catGroup.cat_photos && catGroup.cat_photos.length > 0 ? catGroup.cat_photos[0] : 'https://placehold.co/400x300/e0e0e0/666?text=Sin+Foto'} 
                                                    alt={catGroup.cat_name}
                                                />
                                                <div className="cat-overlay-gradient" />
                                                <div className="cat-info-overlay">
                                                    <h3>{catGroup.cat_name}</h3>
                                                    {/* Placeholder for age/gender if available in future */}
                                                    {/* <p>2 años • Macho</p> */}
                                                </div>
                                            </div>

                                            <div className="cat-card-footer">
                                                <div className="request-count">
                                                    <span className="request-count-label">Solicitudes</span>
                                                    <span className="request-count-number">{catGroup.applicationCount}</span>
                                                </div>

                                                {hasTopCandidate ? (
                                                    <div className="top-match-badge">
                                                        <svg viewBox="0 0 20 20" fill="currentColor" style={{width: '14px', height: '14px'}}>
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                        Top Match
                                                    </div>
                                                ) : (
                                                    <div className="view-list-link">
                                                        Ver lista
                                                        <svg viewBox="0 0 20 20" fill="currentColor" style={{width: '16px', height: '16px'}}>
                                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'tracking' && (
                    <div className="dashboard-container" style={{padding: 0, background: 'transparent', boxShadow: 'none'}}>
                        <TrackingDashboard />
                    </div>
                )}
            </main>

            {/* Modal para ver todas las solicitudes de un gato */}
            {selectedCat && !selectedApplication && (
                <div className="modal-overlay" onClick={() => setSelectedCat(null)}>
                    <div className="modal-content modal-cat-applications" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header-sticky">
                            <h2>Solicitudes para {selectedCat.cat_name}</h2>
                            <button 
                                type="button"
                                className="modal-close-btn"
                                onClick={() => setSelectedCat(null)}
                                style={{background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem'}}
                                aria-label="Cerrar modal"
                            >
                                ×
                            </button>
                        </div>

                        <div className="modal-scroll-body">
                            {selectedCat.applications
                                .sort((a, b) => (b.ai_score || 0) - (a.ai_score || 0))
                                .map((app) => {
                                    // Determine border color based on score
                                    let borderClass = 'border-gray';
                                    if ((app.ai_score || 0) >= 80) borderClass = 'border-green';
                                    else if ((app.ai_score || 0) >= 50) borderClass = 'border-yellow';

                                    return (
                                        <div key={app.id} className={`request-item-card ${borderClass}`}>
                                            <div className="request-header">
                                                <div>
                                                    <h4 className="applicant-name">{app.applicant_name}</h4>
                                                    <span className="request-time">
                                                        {new Date(app.created_at || Date.now()).toLocaleDateString('es-ES', {
                                                            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                                        })}
                                                    </span>
                                                </div>
                                                <div className="score-display">
                                                    <span className="score-number">{app.ai_score || 0}</span>
                                                    <span className="score-label">IA Score</span>
                                                </div>
                                            </div>

                                            {/* Tags */}
                                            {app.ai_flags && app.ai_flags.length > 0 && (
                                                <div className="tags-container">
                                                    {app.ai_flags.map((flag, idx) => {
                                                        let tagClass = '';
                                                        if (flag.includes('Casa') || flag.includes('Veterinario') || flag.includes('Experiencia')) tagClass = 'positive';
                                                        if (flag.includes('Calle') || flag.includes('Riesgo')) tagClass = 'warning';
                                                        
                                                        return (
                                                            <span key={idx} className={`ai-tag ${tagClass}`}>
                                                                {flag}
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            )}

                                            {/* AI Feedback Quote */}
                                            {app.ai_feedback && (
                                                <div className="ai-feedback-quote">
                                                    <span>🤖</span>
                                                    <span>"{app.ai_feedback}"</span>
                                                </div>
                                            )}

                                            {/* Action Buttons */}
                                            <div className="action-buttons">
                                                <button 
                                                    type="button"
                                                    className="btn-approve-sm"
                                                    onClick={() => {
                                                        const index = selectedCat.applications.findIndex(a => a.id === app.id);
                                                        setCurrentAppIndex(index);
                                                        setSelectedApplication(app);
                                                    }}
                                                >
                                                    Revisar y Aprobar
                                                </button>
                                                <button 
                                                    type="button"
                                                    className="btn-reject-sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (confirm('¿Estás seguro de descartar esta solicitud?')) {
                                                            handleUpdateStatus(app.id, 'rechazada');
                                                        }
                                                    }}
                                                >
                                                    Descartar
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal detallado de solicitud individual */}
            {selectedApplication && selectedCat && (
                <div className="modal-overlay" onClick={() => setSelectedApplication(null)}>
                    <div className="modal-content modal-detail-enhanced" onClick={(e) => e.stopPropagation()}>
                        <button 
                            type="button"
                            className="modal-close"
                            onClick={() => setSelectedApplication(null)}
                            aria-label="Cerrar modal"
                        >
                            <svg viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>

                        {/* Header Compacto con Avatar, Score y Acciones */}
                        <div className="modal-header-compact">
                            <div className="applicant-header-left">
                                <div className="applicant-avatar-large">
                                    {selectedApplication.applicant_name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()}
                                </div>
                                <div className="applicant-info-compact">
                                    <h2>{selectedApplication.applicant_name}</h2>
                                    <a href={`mailto:${selectedApplication.applicant_email}`} className="email-link">
                                        {selectedApplication.applicant_email}
                                    </a>
                                    {selectedApplication.applicant_phone && (
                                        <a href={`tel:${selectedApplication.applicant_phone}`} className="phone-link">
                                            📱 {selectedApplication.applicant_phone}
                                        </a>
                                    )}
                                </div>
                            </div>
                            <div className="applicant-header-right">
                                {selectedApplication.ai_score !== null && selectedApplication.ai_score !== undefined && (
                                    <AIScoreBadge score={selectedApplication.ai_score} />
                                )}
                                
                                {/* AI Flags en modal */}
                                {selectedApplication.ai_flags && selectedApplication.ai_flags.length > 0 && (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                                        {selectedApplication.ai_flags.map((flag, idx) => (
                                            <AIBadge key={idx} flag={flag} />
                                        ))}
                                    </div>
                                )}
                                
                                {/* AI Feedback en modal */}
                                {selectedApplication.ai_feedback && (
                                    <div className="ai-feedback-section" style={{ marginTop: '12px' }}>
                                        <div className="ai-feedback-title">
                                            <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: '18px', height: '18px' }}>
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                            </svg>
                                            Análisis de IA
                                        </div>
                                        <p className="ai-feedback-text">{selectedApplication.ai_feedback}</p>
                                    </div>
                                )}
                                <div className="action-buttons-compact">
                                    {selectedApplication.applicant_phone && (
                                        <a href={`https://wa.me/${selectedApplication.applicant_phone.replace(/[^0-9]/g, '')}`} 
                                           target="_blank" 
                                           rel="noopener noreferrer"
                                           className="btn-whatsapp">
                                            WhatsApp
                                        </a>
                                    )}
                                    <a href={`tel:${selectedApplication.applicant_phone || selectedApplication.applicant_email}`} 
                                       className="btn-call">
                                        Llamar
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Navegación entre candidatos */}
                        {selectedCat.applications.length > 1 && (
                            <div className="candidate-navigation">
                                <button 
                                    type="button"
                                    className="nav-btn"
                                    disabled={currentAppIndex === 0}
                                    onClick={() => {
                                        const newIndex = currentAppIndex - 1;
                                        setCurrentAppIndex(newIndex);
                                        setSelectedApplication(selectedCat.applications[newIndex]);
                                    }}
                                >
                                    <svg viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Anterior
                                </button>
                                <span className="nav-indicator">
                                    Candidato {currentAppIndex + 1} de {selectedCat.applications.length} para {selectedApplication.cat_name}
                                </span>
                                <button 
                                    type="button"
                                    className="nav-btn"
                                    disabled={currentAppIndex === selectedCat.applications.length - 1}
                                    onClick={() => {
                                        const newIndex = currentAppIndex + 1;
                                        setCurrentAppIndex(newIndex);
                                        setSelectedApplication(selectedCat.applications[newIndex]);
                                    }}
                                >
                                    Siguiente
                                    <svg viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        )}

                        <div className="modal-body">
                            <div className="application-details-grid">
                                {/* Columna Izquierda: Datos del Solicitante */}
                                <div className="detail-column">
                                    <h4 className="column-header">DATOS DEL SOLICITANTE</h4>
                                    
                                    <div className="detail-group">
                                        <label>NOMBRE</label>
                                        <div className="detail-value">{selectedApplication.applicant_name}</div>
                                    </div>
                                    
                                    <div className="detail-group">
                                        <label>EMAIL</label>
                                        <a href={`mailto:${selectedApplication.applicant_email}`} className="detail-link">
                                            {selectedApplication.applicant_email}
                                        </a>
                                    </div>
                                    
                                    <div className="detail-group">
                                        <label>TELÉFONO</label>
                                        <div className="detail-value">{selectedApplication.applicant_phone || 'No especificado'}</div>
                                    </div>
                                    
                                    {/* Add Age and Occupation if available in form_responses */}
                                    {selectedApplication.form_responses?.age && (
                                        <div className="detail-group">
                                            <label>EDAD</label>
                                            <div className="detail-value">{selectedApplication.form_responses.age} años</div>
                                        </div>
                                    )}
                                    
                                    {selectedApplication.form_responses?.occupation && (
                                        <div className="detail-group">
                                            <label>OCUPACIÓN</label>
                                            <div className="detail-value">{selectedApplication.form_responses.occupation}</div>
                                        </div>
                                    )}
                                </div>

                                {/* Columna Derecha: Perfil del Hogar */}
                                <div className="detail-column">
                                    <h4 className="column-header">PERFIL DEL HOGAR</h4>
                                    
                                    <div className="detail-group">
                                        <label>VIVIENDA</label>
                                        <div className="detail-value">
                                            <span className="badge badge-blue">
                                                {selectedApplication.form_responses?.livingSpace || 'No especificado'}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="detail-group">
                                        <label>MASCOTAS ACTUALES</label>
                                        <div className="detail-value">
                                            <span className="badge badge-neutral">
                                                {selectedApplication.form_responses?.hasOtherPets ? 'TIENE MASCOTAS' : 'NO TIENE MASCOTAS'}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="detail-group">
                                        <label>EXPERIENCIA</label>
                                        <div className="detail-value">
                                            <span className={`badge ${selectedApplication.form_responses?.hasExperience ? 'badge-green' : 'badge-neutral'}`}>
                                                {selectedApplication.form_responses?.hasExperience ? 'TIENE EXPERIENCIA' : 'SIN EXPERIENCIA'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bloque de Razón de Adopción */}
                            <div className="reason-block">
                                <h4 className="reason-header">RAZÓN DE ADOPCIÓN</h4>
                                <p className="reason-text">
                                    "{selectedApplication.form_responses?.whyAdopt || selectedApplication.form_responses?.reason || 'No especificado'}"
                                </p>
                            </div>
                        </div>

                        {/* Acciones */}
                        <div className="modal-footer-enhanced">
                            <button
                                type="button"
                                className="btn-action btn-reject"
                                onClick={() => {
                                    if (confirm('¿Estás seguro de rechazar esta solicitud?')) {
                                        handleUpdateStatus(selectedApplication.id, 'rechazada');
                                        setSelectedApplication(null);
                                        setSelectedCat(null);
                                    }
                                }}
                            >
                                <svg viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                Rechazar Solicitud
                            </button>
                            <button
                                type="button"
                                className="btn-action btn-approve"
                                onClick={() => {
                                    if (confirm(`¿Aprobar adopción de ${selectedApplication.cat_name} para ${selectedApplication.applicant_name}?`)) {
                                        handleUpdateStatus(selectedApplication.id, 'aprobada');
                                        setSelectedApplication(null);
                                        setSelectedCat(null);
                                    }
                                }}
                            >
                                <svg viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Aprobar Adopción
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RescuerDashboard;