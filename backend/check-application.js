const { Pool } = require('pg');
const pool = new Pool({ 
    user: 'postgres', 
    host: 'localhost', 
    database: 'katze', 
    password: 'root', 
    port: 5432 
});

async function checkApplication() {
    try {
        const result = await pool.query(`
            SELECT 
                id, 
                status, 
                ai_score, 
                ai_feedback, 
                ai_flags,
                ai_evaluated_at,
                form_responses
            FROM adoption_applications 
            WHERE id = 49
        `);
        
        if (result.rows.length === 0) {
            console.log('❌ No se encontró la solicitud #49');
        } else {
            const app = result.rows[0];
            console.log('✅ Solicitud #49 evaluada correctamente:\n');
            console.log('   Status:', app.status);
            console.log('   AI Score:', app.ai_score);
            console.log('   AI Feedback:', app.ai_feedback);
            console.log('   AI Flags:', app.ai_flags);
            console.log('   Evaluada en:', app.ai_evaluated_at);
            console.log('\n   Form Responses:');
            console.log('   ', JSON.stringify(app.form_responses, null, 2));
        }
        
        await pool.end();
    } catch (error) {
        console.error('❌ Error:', error.message);
        await pool.end();
    }
}

checkApplication();
