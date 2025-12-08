// Script para listar todas las tablas en producción
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function listTables() {
    try {
        const result = await pool.query(`
            SELECT tablename 
            FROM pg_tables 
            WHERE schemaname = 'public' 
            ORDER BY tablename
        `);
        
        console.log('\n📋 Tablas en producción:');
        if (result.rows.length === 0) {
            console.log('   ❌ No hay tablas');
        } else {
            result.rows.forEach(row => {
                console.log(`   - ${row.tablename}`);
            });
        }
        console.log('');
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

listTables();
