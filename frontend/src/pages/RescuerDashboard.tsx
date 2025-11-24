// Panel de control para rescatistas
// Permite visualizar y gestionar solicitudes de adopción recibidas

import { useState, useEffect } from 'react';
import axios, { isAxiosError } from 'axios';
import { useAuth } from '../context/AuthContext';
import './RescuerDashboard.css';

// Interfaz que define la estructura de una solicitud de adopción
interface Application {
    id: number;
    cat_name: string;
    cat_photos?: string[];
    applicant_name: string;
    applicant_email: string;
    applicant_phone?: string;
    status: string;
    form_responses: any;
}

const RescuerDashboard = () => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
    const { token } = useAuth();

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
            const API_URL = 'http://localhost:5000/api/applications/received';
            const response = await axios.get(API_URL, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            console.log('Respuesta recibida:', response.data);
            
            // El backend devuelve { success: true, data: { applications: [...] } }
            const applicationsData = response.data.data?.applications || response.data.applications || response.data;
            console.log('Solicitudes procesadas:', applicationsData);
            setApplications(applicationsData);
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
            const API_URL = `http://localhost:5000/api/applications/${appId}/status`;
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
            {applications.length === 0 ? (
                <div className="empty-state">
                    <svg className="empty-state-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                    <p className="empty-state-text">No tienes solicitudes pendientes.</p>
                </div>
            ) : (
                <div className="applications-grid">
                    {applications.map((app) => (
                        <div 
                            key={app.id} 
                            className="application-card-compact"
                            onClick={() => setSelectedApplication(app)}
                        >
                            {app.cat_photos && app.cat_photos.length > 0 && (
                                <div className="cat-photo-preview">
                                    <img 
                                        src={app.cat_photos[0]} 
                                        alt={app.cat_name}
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://placehold.co/400x300/e0e0e0/666?text=Sin+Foto';
                                        }}
                                    />
                                </div>
                            )}
                            <div className="card-header">
                                <div className="cat-icon">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C10.34 2 9 3.34 9 5c0 .35.07.69.18 1H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-3.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3zm0 2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM8 10h8v2H8v-2zm0 4h8v2H8v-2z"/>
                                    </svg>
                                </div>
                                <h3 className="cat-name">{app.cat_name}</h3>
                            </div>
                            
                            <div className="applicant-preview">
                                <div className="applicant-avatar">
                                    <svg viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="applicant-details">
                                    <p className="applicant-name">{app.applicant_name}</p>
                                    <p className="applicant-email">{app.applicant_email}</p>
                                </div>
                            </div>

                            <div className="card-footer">
                                <span className="status-badge status-pending">
                                    <svg viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                    </svg>
                                    {app.status === 'pendiente' ? 'Pendiente' : app.status}
                                </span>
                                <button className="btn-view-details">
                                    Ver detalles
                                    <svg viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal detallado con overlay */}
            {selectedApplication && (
                <div className="modal-overlay" onClick={() => setSelectedApplication(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button 
                            className="modal-close"
                            onClick={() => setSelectedApplication(null)}
                        >
                            <svg viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>

                        <div className="modal-header">
                            {selectedApplication.cat_photos && selectedApplication.cat_photos.length > 0 ? (
                                <div className="modal-cat-photo">
                                    <img 
                                        src={selectedApplication.cat_photos[0]} 
                                        alt={selectedApplication.cat_name}
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://placehold.co/400x300/e0e0e0/666?text=Sin+Foto';
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className="modal-icon-svg">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C10.34 2 9 3.34 9 5c0 .35.07.69.18 1H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-3.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3zm0 2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM8 10h8v2H8v-2zm0 4h8v2H8v-2z"/>
                                    </svg>
                                </div>
                            )}
                            <h2>Solicitud de Adopción</h2>
                            <p className="modal-subtitle">Gato: <strong>{selectedApplication.cat_name}</strong></p>
                        </div>

                        <div className="modal-body">
                            {/* Información del solicitante */}
                            <section className="modal-section">
                                <h3 className="section-title">
                                    <svg viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                    Información del Solicitante
                                </h3>
                                <div className="info-grid">
                                    <div className="info-item">
                                        <span className="info-label">Nombre completo</span>
                                        <span className="info-value">{selectedApplication.applicant_name}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Email</span>
                                        <a href={`mailto:${selectedApplication.applicant_email}`} className="info-value info-link">
                                            {selectedApplication.applicant_email}
                                        </a>
                                    </div>
                                    {selectedApplication.applicant_phone && (
                                        <div className="info-item">
                                            <span className="info-label">Teléfono</span>
                                            <a href={`tel:${selectedApplication.applicant_phone}`} className="info-value info-link">
                                                {selectedApplication.applicant_phone}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Respuestas del formulario */}
                            <section className="modal-section">
                                <h3 className="section-title">
                                    <svg viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                    </svg>
                                    Respuestas del Formulario
                                </h3>
                                <div className="form-responses-detailed">
                                    {selectedApplication.form_responses && typeof selectedApplication.form_responses === 'object' ? (
                                        Object.entries(selectedApplication.form_responses).map(([key, value]) => (
                                            <div key={key} className="response-item-detailed">
                                                <span className="response-question">{key.replace(/_/g, ' ')}</span>
                                                <span className="response-answer">{String(value)}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <pre className="response-raw">{JSON.stringify(selectedApplication.form_responses, null, 2)}</pre>
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* Acciones */}
                        <div className="modal-footer">
                            <button
                                className="btn-modal btn-reject-modal"
                                onClick={() => {
                                    handleUpdateStatus(selectedApplication.id, 'rechazada');
                                    setSelectedApplication(null);
                                }}
                            >
                                <svg viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                Rechazar
                            </button>
                            <button
                                className="btn-modal btn-approve-modal"
                                onClick={() => {
                                    handleUpdateStatus(selectedApplication.id, 'aprobada');
                                    setSelectedApplication(null);
                                }}
                            >
                                <svg viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Aprobar Solicitud
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RescuerDashboard;