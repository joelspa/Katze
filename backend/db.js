// Configuración del pool de conexiones a PostgreSQL
// Gestiona la conexión a la base de datos Katze

const { Pool } = require('pg');
const config = require('./config/config');

// Pool de conexiones a PostgreSQL
// Prioriza DATABASE_URL (para producción en Render) sobre variables individuales
const pool = process.env.DATABASE_URL
    ? new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      })
    : new Pool(config.DB_CONFIG);

// Exporta función para ejecutar consultas SQL
module.exports = {
    query: (text, params) => pool.query(text, params),
};