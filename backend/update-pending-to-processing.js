// Actualizar solicitudes pendientes a procesando
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function updatePendingApplications() {
    try {
        const result = await pool.query(`
            UPDATE adoption_applications 
            SET status = 'procesando' 
            WHERE status = 'pendiente' 
            AND ai_score IS NULL
            RETURNING id, created_at
        `);

        console.log(`\n✅ Solicitudes actualizadas a 'procesando': ${result.rows.length}\n`);
        if (result.rows.length > 0) {
            result.rows.forEach(app => {
                console.log(`   - Solicitud #${app.id} (creada: ${app.created_at})`);
            });
            console.log('\n📋 Estas solicitudes serán evaluadas por el worker\n');
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

updatePendingApplications();
