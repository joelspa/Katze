// Configuración del pool de conexiones a PostgreSQL
// Gestiona la conexión a la base de datos Katze

const { Pool } = require('pg');
const config = require('./config/config');

// Pool de conexiones a PostgreSQL con parámetros de configuración centralizados
const pool = new Pool(config.DB_CONFIG);

// Exporta función para ejecutar consultas SQL
module.exports = {
    query: (text, params) => pool.query(text, params),
};