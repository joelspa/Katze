// Configuración centralizada de la aplicación
// Almacena variables de configuración y constantes

module.exports = {
    // Configuración del servidor
    PORT: process.env.PORT || 5000,
    
    // Configuración de JWT
    JWT_SECRET: process.env.JWT_SECRET || 'MI_PALABRA_SECRETA_PARA_KATZE',
    JWT_EXPIRATION: '24h',
    
    // Configuración de base de datos
    DB_CONFIG: {
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'katze',
        password: process.env.DB_PASSWORD || 'root',
        port: process.env.DB_PORT || 5432,
    },
    
    // Configuración de seguimiento
    TRACKING_PERIODS: {
        BIENESTAR_MONTHS: 1,
        ESTERILIZACION_MONTHS: 4
    },
    
    // Roles de usuario
    USER_ROLES: {
        ADOPTANTE: 'adoptante',
        RESCATISTA: 'rescatista',
        ADMIN: 'admin'
    },
    
    // Estados de adopción
    ADOPTION_STATUS: {
        EN_ADOPCION: 'en_adopcion',
        ADOPTADO: 'adoptado'
    },
    
    // Estados de aprobación
    APPROVAL_STATUS: {
        APROBADO: 'aprobado',
        PENDIENTE: 'pendiente'
    },
    
    // Estados de solicitud
    APPLICATION_STATUS: {
        PENDIENTE: 'pendiente',
        APROBADA: 'aprobada',
        RECHAZADA: 'rechazada'
    }
};
