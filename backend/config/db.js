// Configuración del pool de conexiones a PostgreSQL
// Gestiona la conexión a la base de datos Katze

const { Pool } = require('pg');
const config = require('./config');

if (process.env.DATABASE_URL) {
    console.log('Using DATABASE_URL:', process.env.DATABASE_URL);
} else {
    console.log('Using DB_CONFIG:', config.DB_CONFIG);
}

// Determinar si necesitamos SSL (para Render)
const isProduction = process.env.NODE_ENV === 'production' || 
                     (config.DB_CONFIG.host && config.DB_CONFIG.host.includes('render.com'));

const poolConfig = process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      }
    : {
        ...config.DB_CONFIG,
        ssl: isProduction ? { rejectUnauthorized: false } : false
      };

// Pool de conexiones a PostgreSQL
const pool = new Pool(poolConfig);

// Exporta función para ejecutar consultas SQL
module.exports = {
    query: (text, params) => pool.query(text, params),
};