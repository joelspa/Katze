// Panel de seguimiento post-adopción
// Permite a rescatistas gestionar tareas de seguimiento de bienestar y esterilización

import { useState, useEffect } from 'react';
import axios, { isAxiosError } from 'axios';
import { useAuth } from '../context/AuthContext';
import './TrackingDashboard.css';

// Interfaz que define la estructura de una tarea de seguimiento
interface TrackingTask {
    id: number;
    due_date: string;
    status: string;
    task_type: string;
    cat_name: string;
    applicant_name: string;
    owner_name: string;
}

const TrackingDashboard = () => {
    const [tasks, setTasks] = useState<TrackingTask[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { token } = useAuth();

    // Carga las tareas de seguimiento pendientes
    const fetchTasks = async () => {
        if (!token) {
            setError('No se encontró el token de autenticación');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const API_URL = 'http://localhost:5000/api/tracking';
            const response = await axios.get(API_URL, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            // El backend devuelve { success: true, data: { tasks: [...] } }
            const tasksData = response.data.data?.tasks || response.data.tasks || response.data;
            setTasks(tasksData);
            setError(null);
        } catch (error: unknown) {
            let errorMessage = 'Error al cargar las tareas';
            if (isAxiosError(error)) {
                errorMessage = error.response?.data?.message || 'Error del servidor';
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Carga tareas al montar el componente
    useEffect(() => {
        fetchTasks();
    }, [token]);

    // Marca una tarea como completada
    const handleCompleteTask = async (taskId: number, taskType: string) => {
        const notes = prompt("Ingresa las notas de seguimiento:");
        if (notes === null) return;

        let certificateUrl = "";
        if (taskType === 'Seguimiento de Esterilización') {
            certificateUrl = prompt("Ingresa la URL del certificado de esterilización (opcional):") || "";
        }

        try {
            const API_URL = `http://localhost:5000/api/tracking/${taskId}/complete`;
            await axios.put(API_URL,
                {
                    notes: notes,
                    certificate_url: certificateUrl
                },
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            alert('¡Tarea completada con éxito!');
            fetchTasks();

        } catch (error: unknown) {
            alert('Error al completar la tarea.');
            console.error(error);
        }
    };

    // Formatea fechas en español para mejor legibilidad
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (loading) {
        return (
            <div className="dashboard-container">
                <p className="loading-message">Cargando tareas pendientes...</p>
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
            <h1>Panel de Seguimiento</h1>
            <h2>Tareas Pendientes</h2>
            {tasks.length === 0 ? (
                <p>¡Genial! No hay tareas de seguimiento pendientes.</p>
            ) : (
                <div className="tasks-list">
                    {tasks.map((task) => (
                        <div key={task.id} className="task-card">
                            <h3>{task.task_type}</h3>
                            <p><strong>Gato:</strong> {task.cat_name}</p>
                            <p><strong>Adoptante:</strong> {task.applicant_name}</p>
                            <p><strong>Vencimiento:</strong> {formatDate(task.due_date)}</p>
                            <p><strong>Rescatista a cargo:</strong> {task.owner_name}</p>
                            <button
                                className="btn-complete"
                                onClick={() => handleCompleteTask(task.id, task.task_type)}
                            >
                                Completar Tarea
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TrackingDashboard;