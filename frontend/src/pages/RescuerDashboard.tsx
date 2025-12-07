// Panel de control para rescatistas
// Permite visualizar y gestionar solicitudes de adopción recibidas

import { useState, useEffect } from 'react';
import axios, { isAxiosError } from 'axios';
import { useAuth } from '../context/AuthContext';
import { AIBadge, AIScoreBadge } from '../components/AIBadge';
import './RescuerDashboard.css';
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
}

// Interfaz para agrupar solicitudes por gato
interface CatApplicationGroup {
    cat_id: number;
    cat_name: string;
    cat_photos?: string[];
    applications: Application[];
    applicationCount: number;
}

const RescuerDashboard = () => {
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
        <div className="dashboard-container">
            <div className="page-header">
                <svg className="header-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                <h1>Panel de Rescatista</h1>
            </div>
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
                    {groupedApplications.map((catGroup) => (
                        <div 
                            key={catGroup.cat_id} 
                            className="cat-card-group"
                            onClick={() => setSelectedCat(catGroup)}
                        >
                            {catGroup.cat_photos && catGroup.cat_photos.length > 0 && (
                                <div className="cat-photo-preview">
                                    <img 
                                        src={catGroup.cat_photos[0]} 
                                        alt={catGroup.cat_name}
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://placehold.co/400x300/e0e0e0/666?text=Sin+Foto';
                                        }}
                                    />
                                    {catGroup.applicationCount > 1 && (
                                        <div className="application-count-badge">
                                            <svg viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                            </svg>
                                            {catGroup.applicationCount}
                                        </div>
                                    )}
                                </div>
                            )}
                            <div className="card-header">
                                <div className="cat-icon">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C10.34 2 9 3.34 9 5c0 .35.07.69.18 1H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-3.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3zm0 2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"/>
                                    </svg>
                                </div>
                                <h3 className="cat-name">{catGroup.cat_name}</h3>
                            </div>
                            
                            <div className="card-stats">
                                <div className="stat-item">
                                    <svg viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                    <span>{catGroup.applicationCount} {catGroup.applicationCount === 1 ? 'solicitud' : 'solicitudes'}</span>
                                </div>
                                {catGroup.applications.some(app => app.ai_score && app.ai_score >= 70) && (
                                    <div className="stat-item highlight">
                                        <svg viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <span>Candidatos destacados</span>
                                    </div>
                                )}
                            </div>

                            <div className="card-footer">
                                <button className="btn-view-details">
                                    Ver solicitudes
                                    <svg viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal para ver todas las solicitudes de un gato */}
            {selectedCat && !selectedApplication && (
                <div className="modal-overlay" onClick={() => setSelectedCat(null)}>
                    <div className="modal-content modal-cat-applications" onClick={(e) => e.stopPropagation()}>
                        <button 
                            className="modal-close"
                            onClick={() => setSelectedCat(null)}
                        >
                            <svg viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>

                        <div className="modal-header">
                            {selectedCat.cat_photos && selectedCat.cat_photos.length > 0 ? (
                                <div className="modal-cat-photo">
                                    <img 
                                        src={selectedCat.cat_photos[0]} 
                                        alt={selectedCat.cat_name}
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://placehold.co/400x300/e0e0e0/666?text=Sin+Foto';
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className="modal-icon-svg">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C10.34 2 9 3.34 9 5c0 .35.07.69.18 1H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-3.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3z"/>
                                    </svg>
                                </div>
                            )}
                            <h2>Solicitudes para {selectedCat.cat_name}</h2>
                            <p className="modal-subtitle">{selectedCat.applicationCount} {selectedCat.applicationCount === 1 ? 'solicitud pendiente' : 'solicitudes pendientes'}</p>
                        </div>

                        <div className="modal-body">
                            <div className="applications-list">
                                {selectedCat.applications
                                    .sort((a, b) => {
                                        // Ordenar por score descendente
                                        return (b.ai_score || 0) - (a.ai_score || 0);
                                    })
                                    .map((app) => (
                                    <div 
                                        key={app.id}
                                        className={`application-item ${app.ai_score && app.ai_score >= 70 ? 'high-match' : ''}`}
                                    >
                                        <div className="application-item-header">
                                            <div className="applicant-info">
                                                <div className="applicant-avatar-small">
                                                    <svg viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="applicant-name-bold">{app.applicant_name}</p>
                                                    <p className="applicant-email-small">{app.applicant_email}</p>
                                                    
                                                    {/* Status Badge */}
                                                    {app.status === 'procesando' && (
                                                        <span className="status-processing">Evaluando...</span>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="ai-badges">
                                                {/* AI Score Badge */}
                                                {app.ai_score !== null && app.ai_score !== undefined && (
                                                    <AIScoreBadge score={app.ai_score} />
                                                )}
                                            </div>
                                        </div>

                                        {/* AI Flags - Badges de Características */}
                                        {app.ai_flags && app.ai_flags.length > 0 && (
                                            <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                                {app.ai_flags.map((flag, idx) => (
                                                    <AIBadge key={idx} flag={flag} />
                                                ))}
                                            </div>
                                        )}

                                        {/* AI Feedback */}
                                        {app.ai_feedback && (
                                            <div className="ai-feedback-section">
                                                <div className="ai-feedback-title">
                                                    <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: '16px', height: '16px' }}>
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                                    </svg>
                                                    Análisis IA
                                                </div>
                                                <p className="ai-feedback-text">{app.ai_feedback}</p>
                                            </div>
                                        )}

                                        <div className="application-item-actions">
                                            <button 
                                                className="btn-quick-action btn-view btn-view-full"
                                                onClick={() => {
                                                    const index = selectedCat.applications.findIndex(a => a.id === app.id);
                                                    setCurrentAppIndex(index);
                                                    setSelectedApplication(app);
                                                }}
                                            >
                                                Ver detalles completos
                                                <svg viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal detallado de solicitud individual */}
            {selectedApplication && selectedCat && (
                <div className="modal-overlay" onClick={() => setSelectedApplication(null)}>
                    <div className="modal-content modal-detail-enhanced" onClick={(e) => e.stopPropagation()}>
                        <button 
                            className="modal-close"
                            onClick={() => setSelectedApplication(null)}
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
                            {/* Grid de Datos Rápidos (Bento Grid) */}
                            {selectedApplication.form_responses && typeof selectedApplication.form_responses === 'object' && (
                                <section className="quick-data-grid">
                                    {Object.entries(selectedApplication.form_responses).map(([key, value]) => {
                                        const strValue = String(value);
                                        const isShortAnswer = strValue.length < 50;
                                        
                                        if (!isShortAnswer) return null; // Largo texto se maneja después
                                        
                                        // SVG según tipo de pregunta
                                        const getIconSVG = (key: string) => {
                                            const k = key.toLowerCase();
                                            if (k.includes('vivienda') || k.includes('casa')) {
                                                return <svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>;
                                            } else if (k.includes('tiempo') || k.includes('horas')) {
                                                return <svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>;
                                            } else if (k.includes('fondo') || k.includes('emergencia')) {
                                                return <svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>;
                                            } else if (k.includes('conviv') || k.includes('familia')) {
                                                return <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>;
                                            } else if (k.includes('esteri') || k.includes('esteril')) {
                                                return <svg viewBox="0 0 24 24" fill="currentColor"><path d="M9.64 7.64c.23-.5.36-1.05.36-1.64 0-2.21-1.79-4-4-4S2 3.79 2 6s1.79 4 4 4c.59 0 1.14-.13 1.64-.36L10 12l-2.36 2.36C7.14 14.13 6.59 14 6 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4c0-.59-.13-1.14-.36-1.64L12 14l7 7h3v-1L9.64 7.64zM6 8c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm0 12c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm6-7.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM19 3l-6 6 2 2 7-7V3z"/></svg>;
                                            } else if (k.includes('gato') || k.includes('mascota')) {
                                                return <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 8c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0-5C6.48 3 2 7.48 2 13c0 4.95 4.05 9 9 9h4v-2h-4c-3.86 0-7-3.14-7-7 0-4.41 3.59-8 8-8s8 3.59 8 8c0 1.55-.42 3-1.16 4.25l1.67 1.67C21.44 17.07 22 15.11 22 13c0-5.52-4.48-10-10-10z"/></svg>;
                                            } else if (k.includes('jardín') || k.includes('jardin') || k.includes('exterior')) {
                                                return <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.66c.48-.17.98-.31 1.48-.41C19.05 17.74 20 11 20 11c-1 1-1 1-2 1s-1 0-1-1zM5.21 16.95c.41-.41.91-.7 1.45-.84C8.39 15.49 9.4 14.5 10 13c-1.06 1.06-3.5 2.5-4.79 3.95z"/></svg>;
                                            } else if (k.includes('experiencia') || k.includes('previo')) {
                                                return <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>;
                                            }
                                            return <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>;
                                        };
                                        
                                        return (
                                            <div key={key} className="data-card">
                                                <small className="data-label">{key.replace(/_/g, ' ').toUpperCase()}</small>
                                                <div className="data-value">
                                                    <span className="data-icon">{getIconSVG(key)}</span>
                                                    <span>{strValue}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </section>
                            )}

                            {/* Respuestas Largas (Texto Narrativo) */}
                            {selectedApplication.form_responses && typeof selectedApplication.form_responses === 'object' && (
                                <section className="narrative-section">
                                    {Object.entries(selectedApplication.form_responses).map(([key, value]) => {
                                        const strValue = String(value);
                                        const isLongAnswer = strValue.length >= 50;
                                        
                                        if (!isLongAnswer) return null;
                                        
                                        return (
                                            <div key={key} className="narrative-block">
                                                <h4 className="narrative-question">{key.replace(/_/g, ' ')}</h4>
                                                <p className="narrative-answer">{strValue}</p>
                                            </div>
                                        );
                                    })}
                                </section>
                            )}

                            {/* Análisis de IA ya mostrado con badges y feedback arriba */}
                        </div>

                        {/* Acciones */}
                        <div className="modal-footer-enhanced">
                            <button
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