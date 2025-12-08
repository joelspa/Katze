const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'katze',
    password: 'root',
    port: 5432
});

async function resetApplication() {
    try {
        // Resetear solicitud para reprocesar
        await pool.query(`
            UPDATE adoption_applications
            SET 
                status = 'procesando',
                ai_score = NULL,
                ai_feedback = NULL,
                ai_flags = NULL,
                ai_evaluated_at = NULL
            WHERE id = 50
        `);
        
        console.log('✅ Solicitud #50 reseteada a estado "procesando"');
        console.log('Ahora puedes ejecutar el worker para ver el nuevo análisis');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

resetApplication();
