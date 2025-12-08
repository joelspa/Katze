// Verificar estados de los gatos
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'katze',
    password: 'root',
    port: 5432
});

async function checkCatStatus() {
    try {
        // Estados generales
        const result = await pool.query(`
            SELECT approval_status, adoption_status, COUNT(*) as count 
            FROM cats 
            GROUP BY approval_status, adoption_status 
            ORDER BY approval_status, adoption_status
        `);
        
        console.log('\n📊 Estados de gatos en la base de datos:\n');
        result.rows.forEach(row => {
            console.log(`   ${row.approval_status || 'null'} + ${row.adoption_status || 'null'}: ${row.count} gatos`);
        });
        
        // Gatos que deberían mostrarse
        const visible = await pool.query(`
            SELECT COUNT(*) as count 
            FROM cats 
            WHERE adoption_status = 'disponible' 
            AND approval_status = 'aprobado'
        `);
        
        console.log(`\n✅ Gatos visibles (aprobado + disponible): ${visible.rows[0].count}\n`);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

checkCatStatus();
