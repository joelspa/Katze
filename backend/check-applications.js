const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'katze',
    password: 'root',
    port: 5432
});

async function checkApplications() {
    try {
        const result = await pool.query(`
            SELECT id, cat_id, status, ai_score, ai_feedback, created_at
            FROM adoption_applications
            ORDER BY id DESC
            LIMIT 5
        `);
        
        console.log('📋 Últimas 5 solicitudes de adopción:\n');
        result.rows.forEach(row => {
            console.log(`ID: ${row.id}`);
            console.log(`  Cat ID: ${row.cat_id}`);
            console.log(`  Status: ${row.status}`);
            console.log(`  AI Score: ${row.ai_score}`);
            console.log(`  AI Feedback: ${row.ai_feedback ? row.ai_feedback.substring(0, 50) + '...' : 'null'}`);
            console.log(`  Creada: ${row.created_at}`);
            console.log('---');
        });
        
        // Contar por estado
        const countResult = await pool.query(`
            SELECT status, COUNT(*) as count
            FROM adoption_applications
            GROUP BY status
            ORDER BY count DESC
        `);
        
        console.log('\n📊 Distribución por estado:');
        countResult.rows.forEach(row => {
            console.log(`  ${row.status}: ${row.count}`);
        });
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

checkApplications();
