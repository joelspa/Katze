// Panel de seguimiento post-adopción
// Permite a rescatistas gestionar tareas de seguimiento de bienestar y esterilización

import { useState, useEffect } from 'react';
import axios, { isAxiosError } from 'axios';
import { useAuth } from '../context/AuthContext';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import './TrackingDashboard.css';

// Interfaz que define la estructura de una tarea de seguimiento
interface TrackingTask {
    id: number;
    due_date: string;
    status: string;
    task_type: string;
    description?: string;
    cat_name: string;
    applicant_name: string;
    applicant_phone?: string;
    owner_name: string;
    sterilization_status?: string;
}

const TrackingDashboard = () => {
    const [tasks, setTasks] = useState<TrackingTask[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [uploadingCertificate, setUploadingCertificate] = useState<number | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
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

        // Si es tarea de esterilización y se seleccionó un archivo, subirlo a Firebase primero
        let certificateUrl = "";
        if (taskType === 'Seguimiento de Esterilización' && selectedFile && uploadingCertificate === taskId) {
            try {
                setUploadProgress(0);

                // Subir archivo a Firebase Storage
                const fileExtension = selectedFile.name.split('.').pop();
                const certificateRef = ref(storage, `certificates/${uuidv4()}.${fileExtension}`);
                
                await uploadBytes(certificateRef, selectedFile);
                certificateUrl = await getDownloadURL(certificateRef);

                setUploadProgress(100);
                alert('Certificado subido correctamente');
            } catch (error: unknown) {
                console.error('Error al subir certificado a Firebase:', error);
                alert('Error al subir certificado. Por favor, intenta de nuevo.');
                return;
            }
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
            setUploadingCertificate(null);
            setSelectedFile(null);
            setUploadProgress(0);
            fetchTasks();

        } catch (error: unknown) {
            alert('Error al completar la tarea.');
            console.error(error);
        }
    };

    // Maneja la selección de archivo para certificado
    const handleFileSelect = (taskId: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validar tipo de archivo
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            alert('Tipo de archivo no permitido. Solo se aceptan PDF, JPG, PNG y WEBP');
            return;
        }

        // Validar tamaño (máx 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            alert('El archivo es demasiado grande. Tamaño máximo: 5MB');
            return;
        }

        setSelectedFile(file);
        setUploadingCertificate(taskId);
        alert(`Archivo seleccionado: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
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
            <div className="dashboard-header">
                <h1>📊 Panel de Seguimiento</h1>
                <div className="search-bar">
                    <span className="search-icon">◎</span>
                    <input 
                        type="text" 
                        className="search-input" 
                        placeholder="Buscar por gato, adoptante o tipo de tarea..."
                    />
                </div>
            </div>

            {tasks.length === 0 ? (
                <p className="no-tasks">✅ ¡Genial! No hay tareas de seguimiento pendientes.</p>
            ) : (
                <div className="tasks-list">
                    {tasks.map((task) => (
                        <div key={task.id} className={`task-card ${task.status === 'atrasada' ? 'overdue' : ''}`}>
                            <div className="task-type-badge badge-sterilization">
                                {task.task_type}
                            </div>
                            
                            <h3>{task.cat_name}</h3>
                            
                            <div className="task-info">
                                <div className="task-info-item">
                                    <span className="task-info-label">Adoptante:</span> {task.applicant_name}
                                </div>
                                {task.sterilization_status && (
                                    <div className="task-info-item">
                                        <span className="task-info-label">Estado:</span>
                                        <span className={`status-badge ${task.sterilization_status}`}>
                                            {task.sterilization_status}
                                        </span>
                                    </div>
                                )}
                            </div>
                            
                            <div className={`due-date ${task.status === 'atrasada' ? 'overdue' : ''}`}>
                                Vence: {formatDate(task.due_date)}
                            </div>
                            
                            <div className="task-details">
                                <p><strong>Gato:</strong> {task.cat_name}</p>
                                {task.sterilization_status && (
                                    <p>
                                        <strong>Estado esterilización:</strong> 
                                        <span className={`status-badge ${task.sterilization_status}`}>
                                            {task.sterilization_status === 'esterilizado' ? 'Esterilizado' : 
                                             task.sterilization_status === 'pendiente' ? 'Pendiente' : 'No aplica'}
                                        </span>
                                    </p>
                                )}
                                <p><strong>Adoptante:</strong> {task.applicant_name}</p>
                                {task.applicant_phone && (
                                    <p><strong>Teléfono:</strong> {task.applicant_phone}</p>
                                )}
                                <p><strong>Vencimiento:</strong> {formatDate(task.due_date)}</p>
                                <p><strong>Rescatista:</strong> {task.owner_name}</p>
                            </div>
                            
                            {/* Sección de subida de certificado para tareas de esterilización */}
                            {task.task_type === 'Seguimiento de Esterilización' && (
                                <div className="certificate-upload-section">
                                    <label className="certificate-label">
                                        Certificado de Esterilización (Opcional)
                                    </label>
                                    <div className="file-upload-container">
                                        <input
                                            type="file"
                                            id={`certificate-${task.id}`}
                                            accept=".pdf,.jpg,.jpeg,.png,.webp"
                                            onChange={(e) => handleFileSelect(task.id, e)}
                                            className="file-input"
                                        />
                                        <label htmlFor={`certificate-${task.id}`} className="file-input-label">
                                            {uploadingCertificate === task.id && selectedFile ? (
                                                <>{selectedFile.name}</>
                                            ) : (
                                                <>Seleccionar archivo (PDF o imagen)</>
                                            )}
                                        </label>
                                        {uploadingCertificate === task.id && uploadProgress > 0 && (
                                            <div className="upload-progress">
                                                <div 
                                                    className="upload-progress-bar" 
                                                    style={{ width: `${uploadProgress}%` }}
                                                />
                                                <span className="upload-progress-text">{uploadProgress}%</span>
                                            </div>
                                        )}
                                    </div>
                                    <small className="file-hint">
                                        Formatos aceptados: PDF, JPG, PNG, WEBP. Tamaño máximo: 5MB
                                    </small>
                                </div>
                            )}
                            
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