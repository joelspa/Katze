// Ver datos de adoption_applications en producción
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function checkData() {
    try {
        const result = await pool.query(`
            SELECT id, status, ai_score, ai_evaluated_at, created_at
            FROM adoption_applications 
            ORDER BY created_at DESC 
            LIMIT 10
        `);

        console.log('\n📋 Últimas 10 solicitudes en producción:\n');
        if (result.rows.length === 0) {
            console.log('   (sin solicitudes)');
        } else {
            result.rows.forEach(app => {
                console.log(`   ID: ${app.id} | Status: ${app.status || 'null'} | AI Score: ${app.ai_score || 'null'} | Evaluated: ${app.ai_evaluated_at || 'null'}`);
            });
        }
        console.log('');
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

checkData();
