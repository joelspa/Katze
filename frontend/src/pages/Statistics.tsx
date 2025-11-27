// Dashboard de Estadísticas - Panel de Control para el Proceso de Adopción
// Reimaginado para proporcionar insights accionables y métricas de negocio

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

    // Scroll al inicio cuando se carga la página
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
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

    // Calcular métricas derivadas
    const totalGatos = stats.general.total_adopciones + stats.general.gatos_disponibles;
    const tasaAdopcion = totalGatos > 0
        ? Math.round((stats.general.total_adopciones / totalGatos) * 100)
        : 0;

    const promedioEsperaDias = stats.oldestCats.length > 0
        ? Math.round(stats.oldestCats.reduce((sum, cat) => sum + cat.dias_publicado, 0) / stats.oldestCats.length)
        : 0;

    const urgenciasActivas = stats.general.tareas_vencidas + stats.general.solicitudes_pendientes;

    return (
        <div className="statistics-container">
            <div className="statistics-wrapper">
                {/* Header con resumen ejecutivo */}
                <div className="stats-header">
                    <div className="header-content">
                        <h1>
                            <svg className="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            Dashboard de Operaciones
                        </h1>
                        <p className="stats-subtitle">
                            Panel de control integral para gestión de adopciones
                        </p>
                    </div>
                    <div className="header-summary">
                        <div className="summary-item">
                            <span className="summary-label">Tasa de Éxito</span>
                            <span className="summary-value success">{tasaAdopcion}%</span>
                        </div>
                        <div className="summary-item">
                            <span className="summary-label">Tiempo Promedio</span>
                            <span className="summary-value info">{promedioEsperaDias} días</span>
                        </div>
                        <div className="summary-item">
                            <span className="summary-label">Urgencias</span>
                            <span className={`summary-value ${urgenciasActivas > 0 ? 'warning' : 'success'}`}>
                                {urgenciasActivas}
                            </span>
                        </div>
                    </div>
                </div>

                {/* KPIs Principales - Fila 1 */}
                <div className="kpi-section">
                    <h2 className="section-title">Indicadores Clave de Desempeño</h2>
                    <div className="kpi-grid">
                        <div className="kpi-card featured">
                            <div className="kpi-header">
                                <svg className="kpi-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                <span className="kpi-label">Adopciones Exitosas</span>
                            </div>
                            <div className="kpi-value">{stats.general.total_adopciones}</div>
                            <div className="kpi-footer">
                                <span className="kpi-change positive">+{Math.round(tasaAdopcion)}% de efectividad</span>
                            </div>
                        </div>

                        <div className="kpi-card">
                            <div className="kpi-header">
                                <svg className="kpi-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                                <span className="kpi-label">Inventario Activo</span>
                            </div>
                            <div className="kpi-value">{stats.general.gatos_disponibles}</div>
                            <div className="kpi-footer">
                                <Link to="/" className="kpi-link">Ver catálogo →</Link>
                            </div>
                        </div>

                        <div className="kpi-card">
                            <div className="kpi-header">
                                <svg className="kpi-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                                <span className="kpi-label">En Proceso</span>
                            </div>
                            <div className="kpi-value">{stats.general.solicitudes_pendientes}</div>
                            <div className="kpi-footer">
                                {stats.general.solicitudes_pendientes > 0 ? (
                                    <Link to="/dashboard" className="kpi-link warning">Revisar ahora →</Link>
                                ) : (
                                    <span className="kpi-status success">
                                        <svg className="status-icon" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Al día
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="kpi-card">
                            <div className="kpi-header">
                                <svg className="kpi-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="kpi-label">Tareas Críticas</span>
                            </div>
                            <div className="kpi-value">{stats.general.tareas_vencidas}</div>
                            <div className="kpi-footer">
                                {stats.general.tareas_vencidas > 0 ? (
                                    <Link to="/tracking" className="kpi-link error">Atender urgente →</Link>
                                ) : (
                                    <span className="kpi-status success">
                                        <svg className="status-icon" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Sin pendientes
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Salud del Programa - Fila 2 */}
                <div className="health-section">
                    <h2 className="section-title">Salud del Programa</h2>
                    <div className="health-grid">
                        <div className="health-card">
                            <div className="health-header">
                                <h3>
                                    <svg className="health-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Esterilización
                                </h3>
                                <span className="health-badge success">{stats.general.tasa_esterilizacion}%</span>
                            </div>
                            <div className="health-progress">
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill success"
                                        style={{ width: `${stats.general.tasa_esterilizacion}%` }}
                                    ></div>
                                </div>
                                <div className="progress-stats">
                                    <span>{stats.general.esterilizados} completados</span>
                                    <span>{stats.general.pendientes_esterilizacion} pendientes</span>
                                </div>
                            </div>
                            <p className="health-insight">
                                {stats.general.tasa_esterilizacion >= 80
                                    ? '¡Excelente! Mantén este ritmo.'
                                    : 'Priorizar seguimiento de esterilizaciones.'}
                            </p>
                        </div>

                        <div className="health-card">
                            <div className="health-header">
                                <h3>
                                    <svg className="health-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Tiempo de Espera
                                </h3>
                                <span className={`health-badge ${promedioEsperaDias > 60 ? 'warning' : 'info'}`}>
                                    {promedioEsperaDias} días
                                </span>
                            </div>
                            <div className="health-content">
                                <div className="stat-row">
                                    <span>Promedio actual:</span>
                                    <strong>{promedioEsperaDias} días</strong>
                                </div>
                                <div className="stat-row">
                                    <span>Meta objetivo:</span>
                                    <strong className="success">{'<'} 45 días</strong>
                                </div>
                            </div>
                            <p className="health-insight">
                                {promedioEsperaDias > 60
                                    ? 'Aumentar promoción en redes sociales.'
                                    : 'Tiempo de adopción dentro del rango esperado.'}
                            </p>
                        </div>

                        <div className="health-card">
                            <div className="health-header">
                                <h3>
                                    <svg className="health-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                    Eficiencia Operativa
                                </h3>
                                <span className={`health-badge ${urgenciasActivas === 0 ? 'success' : 'warning'}`}>
                                    {urgenciasActivas === 0 ? 'Óptimo' : 'Atención'}
                                </span>
                            </div>
                            <div className="health-content">
                                <div className="stat-row">
                                    <span>Solicitudes sin revisar:</span>
                                    <strong className={stats.general.solicitudes_pendientes > 5 ? 'warning' : ''}>
                                        {stats.general.solicitudes_pendientes}
                                    </strong>
                                </div>
                                <div className="stat-row">
                                    <span>Tareas atrasadas:</span>
                                    <strong className={stats.general.tareas_vencidas > 0 ? 'error' : 'success'}>
                                        {stats.general.tareas_vencidas}
                                    </strong>
                                </div>
                            </div>
                            <p className="health-insight">
                                {urgenciasActivas === 0
                                    ? 'Todas las operaciones al día.'
                                    : `Resolver ${urgenciasActivas} item(s) pendientes.`}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Pipeline de Adopción */}
                <div className="pipeline-section">
                    <h2 className="section-title">
                        <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Casos Prioritarios para Acción
                    </h2>
                    <p className="section-subtitle">
                        Gatos que requieren atención inmediata para optimizar el proceso de adopción
                    </p>

                    {stats.oldestCats.length === 0 ? (
                        <div className="success-state">
                            <div className="success-icon">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h3>¡Operación Fluida!</h3>
                            <p>Todos los gatos están siendo procesados eficientemente.</p>
                            <p className="success-detail">Tiempo promedio de adopción: {promedioEsperaDias} días</p>
                        </div>
                    ) : (
                        <>
                            <div className="pipeline-summary">
                                <div className="summary-card urgent">
                                    <span className="summary-number">{stats.oldestCats.filter(c => c.dias_publicado > 90).length}</span>
                                    <span className="summary-text">Crítico ({'>'} 90 días)</span>
                                </div>
                                <div className="summary-card high">
                                    <span className="summary-number">{stats.oldestCats.filter(c => c.dias_publicado > 60 && c.dias_publicado <= 90).length}</span>
                                    <span className="summary-text">Alto (60-90 días)</span>
                                </div>
                                <div className="summary-card medium">
                                    <span className="summary-number">{stats.oldestCats.filter(c => c.dias_publicado <= 60).length}</span>
                                    <span className="summary-text">Medio ({'<'} 60 días)</span>
                                </div>
                            </div>

                            <div className="priority-list">
                                {stats.oldestCats.map((cat) => {
                                    const priorityLevel = cat.dias_publicado > 90 ? 'critical' :
                                        cat.dias_publicado > 60 ? 'high' : 'medium';
                                    return (
                                        <div key={cat.id} className={`priority-item ${priorityLevel}`}>
                                            <div className="priority-indicator">
                                                <span className="days-waiting">{Math.floor(cat.dias_publicado)}</span>
                                                <span className="days-label">días</span>
                                            </div>

                                            <div className="priority-image">
                                                {cat.photos_url && cat.photos_url.length > 0 ? (
                                                    <img
                                                        src={cat.photos_url[0]}
                                                        alt={cat.name}
                                                        onError={(e) => {
                                                            e.currentTarget.src = 'https://placehold.co/100x100/e0e0e0/666?text=?';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="image-placeholder">
                                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="priority-info">
                                                <h4>{cat.name}</h4>
                                                <div className="info-tags">
                                                    <span className="tag">{cat.age}</span>
                                                    <span className={`tag ${cat.sterilization_status}`}>
                                                        {cat.sterilization_status === 'esterilizado' ? (
                                                            <>
                                                                <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: '14px', height: '14px', display: 'inline', marginRight: '4px', verticalAlign: 'middle' }}>
                                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                </svg>
                                                                Esterilizado
                                                            </>
                                                        ) : (
                                                            <>
                                                                <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: '14px', height: '14px', display: 'inline', marginRight: '4px', verticalAlign: 'middle' }}>
                                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                                </svg>
                                                                Pendiente
                                                            </>
                                                        )}
                                                    </span>
                                                </div>
                                                <p className="rescuer-info">
                                                    <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: '14px', height: '14px', display: 'inline', marginRight: '4px' }}>
                                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                    </svg>
                                                    {cat.rescatista_name}
                                                </p>
                                            </div>

                                            <div className="priority-actions">
                                                <Link to={`/cats/${cat.id}`} className="action-btn primary">
                                                    Ver Perfil
                                                </Link>
                                                <button
                                                    className="action-btn secondary"
                                                    onClick={() => {
                                                        const url = `${window.location.origin}/cats/${cat.id}`;
                                                        navigator.clipboard.writeText(url);
                                                        alert('Enlace copiado para compartir');
                                                    }}
                                                >
                                                    <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                                    </svg>
                                                    Compartir
                                                </button>
                                            </div>

                                            <div className="priority-recommendation">
                                                {cat.dias_publicado > 90 ? (
                                                    <span className="rec critical">
                                                        <svg className="rec-icon" viewBox="0 0 24 24" fill="currentColor">
                                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                        Campaña urgente en redes sociales
                                                    </span>
                                                ) : cat.dias_publicado > 60 ? (
                                                    <span className="rec high">
                                                        <svg className="rec-icon" viewBox="0 0 24 24" fill="currentColor">
                                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                        Promoción destacada recomendada
                                                    </span>
                                                ) : (
                                                    <span className="rec medium">
                                                        <svg className="rec-icon" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                                        </svg>
                                                        Monitorear progreso
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>

                {/* Acciones Recomendadas */}
                <div className="actions-section">
                    <h2 className="section-title">
                        <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        Plan de Acción Sugerido
                    </h2>
                    <div className="action-cards">
                        {stats.general.tareas_vencidas > 0 && (
                            <div className="action-card urgent">
                                <div className="action-header">
                                    <svg className="action-icon" viewBox="0 0 24 24" fill="currentColor">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <h3>Tareas Vencidas</h3>
                                </div>
                                <p className="action-count">{stats.general.tareas_vencidas} tareas requieren atención inmediata</p>
                                <p className="action-desc">El seguimiento post-adopción es crítico para el bienestar de los gatos.</p>
                                <Link to="/tracking" className="action-button error">
                                    Ir a Seguimiento →
                                </Link>
                            </div>
                        )}

                        {stats.general.solicitudes_pendientes > 0 && (
                            <div className="action-card high">
                                <div className="action-header">
                                    <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                    </svg>
                                    <h3>Solicitudes Pendientes</h3>
                                </div>
                                <p className="action-count">{stats.general.solicitudes_pendientes} familias esperando respuesta</p>
                                <p className="action-desc">Responder rápido aumenta las tasas de adopción exitosa.</p>
                                <Link to="/dashboard" className="action-button warning">
                                    Revisar Solicitudes →
                                </Link>
                            </div>
                        )}

                        {stats.general.pendientes_esterilizacion > 0 && (
                            <div className="action-card medium">
                                <div className="action-header">
                                    <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <h3>Esterilizaciones Pendientes</h3>
                                </div>
                                <p className="action-count">{stats.general.pendientes_esterilizacion} gatos adoptados sin esterilizar</p>
                                <p className="action-desc">Coordinar con adoptantes para completar el proceso.</p>
                                <Link to="/tracking" className="action-button info">
                                    Ver Detalles →
                                </Link>
                            </div>
                        )}

                        {stats.oldestCats.filter(c => c.dias_publicado > 90).length > 0 && (
                            <div className="action-card high">
                                <div className="action-header">
                                    <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                                    </svg>
                                    <h3>Campaña de Difusión</h3>
                                </div>
                                <p className="action-count">
                                    {stats.oldestCats.filter(c => c.dias_publicado > 90).length} gatos necesitan promoción urgente
                                </p>
                                <p className="action-desc">Crear contenido para redes sociales con sus historias.</p>
                                <button className="action-button primary">
                                    Generar Contenido →
                                </button>
                            </div>
                        )}

                        {urgenciasActivas === 0 && stats.general.gatos_disponibles > 0 && (
                            <div className="action-card low">
                                <div className="action-header">
                                    <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                    </svg>
                                    <h3>Optimización Continua</h3>
                                </div>
                                <p className="action-desc">Todo está al día. Considera mejorar la calidad de las fotos y descripciones.</p>
                                <Link to="/" className="action-button success">
                                    Ver Catálogo →
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Statistics;
