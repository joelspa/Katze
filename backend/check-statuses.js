const { Pool } = require('pg');
const pool = new Pool({ 
    user: 'postgres', 
    host: 'localhost', 
    database: 'katze', 
    password: 'root', 
    port: 5432 
});

async function checkStatuses() {
    try {
        const result = await pool.query(`
            SELECT DISTINCT status, COUNT(*) as count
            FROM adoption_applications
            GROUP BY status
            ORDER BY count DESC
        `);
        
        console.log('Estados actuales en la base de datos:');
        result.rows.forEach(r => {
            console.log(`  ${r.status}: ${r.count} solicitudes`);
        });
        
        await pool.end();
    } catch (error) {
        console.error('❌ Error:', error.message);
        await pool.end();
    }
}

checkStatuses();
