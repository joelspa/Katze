const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'katze',
    password: 'root',
    port: 5432
});

async function checkApplicationStatus() {
    try {
        const result = await pool.query(`
            SELECT id, cat_id, status
            FROM adoption_applications
            WHERE id = 50
        `);
        
        if (result.rows.length > 0) {
            const app = result.rows[0];
            console.log(`✅ Solicitud #50:`);
            console.log(`   Estado actual: ${app.status}`);
        } else {
            console.log('❌ No se encontró la solicitud #50');
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

checkApplicationStatus();
