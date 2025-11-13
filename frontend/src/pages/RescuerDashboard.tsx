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
    applicant_name: string;
    status: string;
    form_responses: any;
}

const RescuerDashboard = () => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
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
        if (!window.confirm(`¿Estás seguro de que quieres ${newStatus} esta solicitud?`)) {
            return;
        }

        try {
            const API_URL = `http://localhost:5000/api/applications/${appId}/status`;
            await axios.put(API_URL,
                { status: newStatus },
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            alert(`Solicitud ${newStatus} con éxito.`);
            fetchApplications();

        } catch (error: unknown) {
            alert('Error al actualizar la solicitud.');
            console.error(error);
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
            <h1>Panel de Rescatista</h1>
            <h2>Solicitudes Pendientes</h2>
            {applications.length === 0 ? (
                <p>No tienes solicitudes pendientes.</p>
            ) : (
                <div className="applications-list">
                    {applications.map((app) => (
                        <div key={app.id} className="application-card">
                            <h3>{app.cat_name}</h3>
                            <p>Solicitante: {app.applicant_name}</p>
                            <p><strong>Respuestas del formulario:</strong></p>
                            <pre>{JSON.stringify(app.form_responses, null, 2)}</pre>
                            <div className="application-actions">
                                <button
                                    className="btn-approve"
                                    onClick={() => handleUpdateStatus(app.id, 'aprobada')}
                                >
                                    Aprobar
                                </button>
                                <button
                                    className="btn-reject"
                                    onClick={() => handleUpdateStatus(app.id, 'rechazada')}
                                >
                                    Rechazar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RescuerDashboard;