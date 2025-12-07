/**
 * Configuración centralizada de la API
 * Usa variables de entorno para adaptarse a desarrollo y producción
 */

// URL base de la API desde variable de entorno
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Helper para construir URLs de la API
export const getApiUrl = (endpoint: string): string => {
    // Asegurarse de que el endpoint comience con /
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${API_BASE_URL}${normalizedEndpoint}`;
};

// Exportar por defecto para uso común
export default API_BASE_URL;
