// frontend/src/pages/RescuerDashboard.tsx
import { useState, useEffect } from 'react';
import axios, { isAxiosError } from 'axios';
import { useAuth } from '../context/AuthContext';
import './RescuerDashboard.css'; // Crearemos este CSS

// Definimos la "forma" de una solicitud (puedes hacerla más detallada)
interface Application {
    id: number;
    cat_name: string;
    applicant_name: string;
    status: string;
    form_responses: any; // El JSON con las respuestas
}

const RescuerDashboard = () => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { token } = useAuth(); // Necesitamos el token para la autorización

    // 1. Función para cargar las solicitudes
    const fetchApplications = async () => {
        try {
            setLoading(true);
            const API_URL = 'http://localhost:5000/api/applications/received';
            const response = await axios.get(API_URL, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setApplications(response.data);
            setError(null);
        } catch (error: unknown) {
            let errorMessage = 'Error al cargar las solicitudes';
            if (isAxiosError(error)) {
                errorMessage = error.response?.data?.message || 'Error del servidor';
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // 2. Cargar las solicitudes cuando la página se monta
    useEffect(() => {
        if (token) {
            fetchApplications();
        }
    }, [token]); // Depende del token

    // 3. Función para aprobar/rechazar
    const handleUpdateStatus = async (appId: number, newStatus: 'aprobada' | 'rechazada') => {
        if (!window.confirm(`¿Estás seguro de que quieres ${newStatus} esta solicitud?`)) {
            return;
        }

        try {
            const API_URL = `http://localhost:5000/api/applications/${appId}/status`;
            await axios.put(API_URL,
                { status: newStatus }, // El body
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            alert(`Solicitud ${newStatus} con éxito.`);
            // Vuelve a cargar la lista para que desaparezca la que acabamos de manejar
            fetchApplications();

        } catch (error: unknown) {
            alert('Error al actualizar la solicitud.');
            console.error(error);
        }
    };

    if (loading) return <p>Cargando panel...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

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