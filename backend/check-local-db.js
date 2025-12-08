// Verificar tablas en base de datos local
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'katze',
    password: 'postgres',
    port: 5432
});

async function checkTables() {
    try {
        const result = await pool.query(`
            SELECT tablename 
            FROM pg_tables 
            WHERE schemaname = 'public' 
            ORDER BY tablename
        `);
        
        console.log('\n📋 Tablas en base de datos local:');
        if (result.rows.length === 0) {
            console.log('   ❌ No hay tablas - Base de datos vacía');
            console.log('\n💡 Ejecuta las migraciones: npm run migrate');
        } else {
            result.rows.forEach(row => {
                console.log(`   - ${row.tablename}`);
            });
        }
        console.log('');
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.log('\n💡 PostgreSQL no está corriendo. Inicia el servicio de PostgreSQL.');
        } else if (error.code === '3D000') {
            console.log('\n💡 La base de datos "katze" no existe. Créala primero:');
            console.log('   CREATE DATABASE katze;');
        }
    } finally {
        await pool.end();
    }
}

checkTables();
