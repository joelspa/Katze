/**
 * Configuración centralizada de la API
 * Usa variables de entorno para adaptarse a desarrollo y producción
 */

// URL base de la API desde variable de entorno
// Aseguramos que no tenga slash final ni termine en /api para evitar duplicados
const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const API_BASE_URL = rawUrl.replace(/\/$/, '').replace(/\/api$/, '');

// Helper para construir URLs de la API
export const getApiUrl = (endpoint: string): string => {
    // Asegurarse de que el endpoint comience con /
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${API_BASE_URL}${normalizedEndpoint}`;
};

// URLs de Redes Sociales
export const SOCIAL_LINKS = {
    instagram: import.meta.env.VITE_INSTAGRAM_URL || '',
    facebook: import.meta.env.VITE_FACEBOOK_URL || '',
    whatsapp: import.meta.env.VITE_WHATSAPP_URL || '',
    whatsappAdoptText: import.meta.env.VITE_WHATSAPP_ADOPT_TEXT || 'Hola,%20me%20interesa%20adoptar%20un%20gato',
    whatsappVolunteerText: import.meta.env.VITE_WHATSAPP_VOLUNTEER_TEXT || 'Hola,%20quiero%20ser%20voluntario',
};

// Funciones helper para construir URLs de WhatsApp con texto
export const getWhatsAppUrl = (text?: string): string => {
    const baseUrl = SOCIAL_LINKS.whatsapp;
    if (!baseUrl) return '';
    return text ? `${baseUrl}?text=${text}` : baseUrl;
};

export const getWhatsAppAdoptUrl = (): string => {
    return getWhatsAppUrl(SOCIAL_LINKS.whatsappAdoptText);
};

export const getWhatsAppVolunteerUrl = (): string => {
    return getWhatsAppUrl(SOCIAL_LINKS.whatsappVolunteerText);
};

// Exportar por defecto para uso común
export default API_BASE_URL;
