// backend/db.js
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres', // Reemplaza esto
    host: 'localhost',
    database: 'katze', // O el nombre de tu base de datos
    password: 'root', // Reemplaza esto
    port: 5432,
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};