// Página de Estadísticas - Dashboard para rescatistas y administradores
// Muestra métricas clave y gatos que necesitan prioridad de adopción

import { useState, useEffect } from 'react';
import axios, { isAxiosError } from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './Statistics.css';

interface GeneralStats {
    total_adopciones: number;
    gatos_disponibles: number;
    tasa_esterilizacion: number;
    esterilizados: number;
    pendientes_esterilizacion: number;
    tareas_vencidas: number;
    solicitudes_pendientes: number;
}

interface OldestCat {
    id: number;
    name: string;
    description: string;
    age: string;
    sterilization_status: string;
    photos_url: string[];
    created_at: string;
    dias_publicado: number;
    rescatista_name: string;
}

interface StatisticsData {
    general: GeneralStats;
    oldestCats: OldestCat[];
    adoptionTrends: { mes: string; adopciones: number }[];
}

const Statistics = () => {
    const [stats, setStats] = useState<StatisticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { token } = useAuth();

    useEffect(() => {
        const fetchStatistics = async () => {
            if (!token) {
                setError('No se encontró el token de autenticación');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const API_URL = 'http://localhost:5000/api/statistics';
                const response = await axios.get(API_URL, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                const statsData = response.data.data || response.data;
                setStats(statsData);
                setError(null);
            } catch (error: unknown) {
                let errorMessage = 'Error al cargar estadísticas';
                if (isAxiosError(error)) {
                    errorMessage = error.response?.data?.message || 'Error del servidor';
                }
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, [token]);

    if (loading) {
        return (
            <div className="statistics-container">
                <p className="loading-message">Cargando estadísticas...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="statistics-container">
                <p className="error-message">{error}</p>
            </div>
        );
    }

    if (!stats) {
        return null;
    }

    return (
        <div className="statistics-container">
            <div className="statistics-wrapper">
                <h1>📈 Dashboard de Estadísticas</h1>
                <p className="stats-subtitle">
                    Métricas clave de la plataforma y priorización de adopciones
                </p>

                {/* Métricas principales */}
                <div className="metrics-grid">
                <div className="metric-card primary">
                    <div className="metric-icon">CASA</div>
                    <div className="metric-content">
                        <h3>{stats.general.total_adopciones}</h3>
                        <p>Adopciones Completadas</p>
                    </div>
                </div>

                <div className="metric-card success">
                    <div className="metric-icon">GATOS</div>
                    <div className="metric-content">
                        <h3>{stats.general.gatos_disponibles}</h3>
                        <p>Gatos Disponibles</p>
                    </div>
                </div>

                <div className="metric-card info">
                    <div className="metric-icon">ESTRIL</div>
                    <div className="metric-content">
                        <h3>{stats.general.tasa_esterilizacion}%</h3>
                        <p>Tasa de Esterilización</p>
                        <small>{stats.general.esterilizados}/{stats.general.esterilizados + stats.general.pendientes_esterilizacion} completados</small>
                    </div>
                </div>

                <div className={`metric-card ${stats.general.tareas_vencidas > 0 ? 'warning' : 'success'}`}>
                    <div className="metric-icon">{stats.general.tareas_vencidas > 0 ? 'ALERTA' : 'OK'}</div>
                    <div className="metric-content">
                        <h3>{stats.general.tareas_vencidas}</h3>
                        <p>Tareas Vencidas</p>
                    </div>
                </div>

                <div className="metric-card pending">
                    <div className="metric-icon">SOL</div>
                    <div className="metric-content">
                        <h3>{stats.general.solicitudes_pendientes}</h3>
                        <p>Solicitudes Pendientes</p>
                    </div>
                </div>
                </div>

                {/* Sección de gatos prioritarios */}
                <div className="priority-section">
                <div className="section-header">
                    <h2>Gatos que Necesitan Adopción Prioritaria</h2>
                    <p className="section-subtitle">
                        Estos gatitos llevan más tiempo esperando un hogar. ¡Ayúdalos compartiendo sus perfiles!
                    </p>
                </div>

                {stats.oldestCats.length === 0 ? (
                    <div className="empty-message">
                        <p>¡Excelente! Todos los gatos están siendo adoptados rápidamente.</p>
                    </div>
                ) : (
                    <div className="priority-cats-grid">
                        {stats.oldestCats.map((cat) => (
                            <div key={cat.id} className="priority-cat-card">
                                <div className="priority-badge">
                                    {Math.floor(cat.dias_publicado)} días
                                </div>

                                {cat.photos_url && cat.photos_url.length > 0 ? (
                                    <img 
                                        src={cat.photos_url[0]} 
                                        alt={cat.name}
                                        className="cat-image"
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://placehold.co/300x250/e0e0e0/666?text=Sin+Foto';
                                        }}
                                    />
                                ) : (
                                    <div className="cat-image-placeholder">
                                        <span>GATO</span>
                                    </div>
                                )}

                                <div className="cat-details">
                                    <h3>{cat.name}</h3>
                                    <p className="cat-description">{cat.description}</p>
                                    
                                    <div className="cat-info-grid">
                                        <div className="info-item">
                                            <span className="info-label">Edad:</span>
                                            <span className="info-value">{cat.age}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Esterilización:</span>
                                            <span className={`status-badge ${cat.sterilization_status}`}>
                                                {cat.sterilization_status === 'esterilizado' ? 'Sí' : 
                                                 cat.sterilization_status === 'pendiente' ? 'Pendiente' : 'N/A'}
                                            </span>
                                        </div>
                                        <div className="info-item full-width">
                                            <span className="info-label">Rescatista:</span>
                                            <span className="info-value">{cat.rescatista_name}</span>
                                        </div>
                                    </div>

                                    <Link to={`/cats/${cat.id}`} className="btn-view-cat">
                                        Ver Perfil Completo
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                </div>

                {/* Recomendaciones */}
                <div className="recommendations-section">
                <h3>Recomendaciones</h3>
                <ul className="recommendations-list">
                    {stats.general.tareas_vencidas > 0 && (
                        <li className="recommendation warning">
                            Tienes {stats.general.tareas_vencidas} tareas vencidas. 
                            <Link to="/tracking"> Ir a Seguimiento</Link>
                        </li>
                    )}
                    {stats.general.solicitudes_pendientes > 0 && (
                        <li className="recommendation info">
                            Hay {stats.general.solicitudes_pendientes} solicitudes pendientes de revisión.
                            <Link to="/dashboard"> Ver Solicitudes</Link>
                        </li>
                    )}
                    {stats.oldestCats.length > 0 && (
                        <li className="recommendation priority">
                            {stats.oldestCats.length} gatos necesitan promoción prioritaria. 
                            Comparte sus perfiles en redes sociales.
                        </li>
                    )}
                    {stats.general.pendientes_esterilizacion > 0 && (
                        <li className="recommendation info">
                            {stats.general.pendientes_esterilizacion} gatos adoptados pendientes de esterilización.
                        </li>
                    )}
                </ul>
                </div>
            </div>
        </div>
    );
};

export default Statistics;
