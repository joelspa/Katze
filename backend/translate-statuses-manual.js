const { Pool } = require('pg');
const pool = new Pool({ 
    user: 'postgres', 
    host: 'localhost', 
    database: 'katze', 
    password: 'root', 
    port: 5432 
});

async function translateStatuses() {
    try {
        console.log('🔄 Traduciendo estados a español...\n');
        
        // Traducir estados
        await pool.query(`UPDATE adoption_applications SET status = 'procesando' WHERE status = 'processing'`);
        await pool.query(`UPDATE adoption_applications SET status = 'revision_pendiente' WHERE status = 'pending_review'`);
        await pool.query(`UPDATE adoption_applications SET status = 'rechazada_automaticamente' WHERE status = 'auto_rejected'`);
        
        // Verificar resultado
        const result = await pool.query(`
            SELECT DISTINCT status, COUNT(*) as count
            FROM adoption_applications
            GROUP BY status
            ORDER BY count DESC
        `);
        
        console.log('✅ Estados traducidos:\n');
        result.rows.forEach(r => {
            console.log(`  ${r.status}: ${r.count} solicitudes`);
        });
        
        await pool.end();
        console.log('\n✅ Traducción completada');
    } catch (error) {
        console.error('❌ Error:', error.message);
        await pool.end();
    }
}

translateStatuses();
