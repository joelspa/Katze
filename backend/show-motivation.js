const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'katze',
    password: 'root',
    port: 5432
});

async function showMotivation() {
    try {
        const result = await pool.query(`
            SELECT form_responses->>'whyAdopt' as motivation
            FROM adoption_applications 
            WHERE id = 52
        `);
        
        console.log('\n✍️  Motivación completa de solicitud #52:\n');
        console.log(result.rows[0].motivation);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

showMotivation();
