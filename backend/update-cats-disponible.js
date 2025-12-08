// Actualizar estado de gatos a disponible
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'katze',
    password: 'root',
    port: 5432
});

async function updateCatStatus() {
    try {
        const result = await pool.query(`
            UPDATE cats 
            SET adoption_status = 'disponible' 
            WHERE approval_status = 'aprobado' 
            AND adoption_status = 'en_adopcion'
            RETURNING id, name
        `);
        
        console.log(`\n✅ Gatos actualizados a "disponible": ${result.rows.length}\n`);
        result.rows.forEach(cat => {
            console.log(`   - ${cat.name} (ID: ${cat.id})`);
        });
        console.log('');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

updateCatStatus();
