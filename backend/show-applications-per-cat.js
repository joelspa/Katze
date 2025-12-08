const { Pool } = require('pg');

const pool = new Pool({
    user: 'katze_88u4_user',
    host: 'dpg-d4qderruibrs73djklg0-a.oregon-postgres.render.com',
    database: 'katze_88u4',
    password: 'KBijdmcP5FMvrxoZ5EXp1X2jDlVBXd8t',
    port: 5432,
    ssl: {
        rejectUnauthorized: false
    }
});

async function showApplicationsPerCat() {
    try {
        const result = await pool.query(`
            SELECT 
                c.name, 
                COUNT(a.id) as solicitudes,
                COUNT(CASE WHEN a.status = 'revision_pendiente' THEN 1 END) as pendientes,
                COUNT(CASE WHEN a.status = 'aprobada' THEN 1 END) as aprobadas,
                COUNT(CASE WHEN a.status = 'rechazada' OR a.status = 'rechazada_automaticamente' THEN 1 END) as rechazadas
            FROM cats c 
            LEFT JOIN adoption_applications a ON c.id = a.cat_id 
            WHERE c.approval_status = 'aprobado'
            GROUP BY c.id, c.name 
            ORDER BY solicitudes DESC
        `);
        
        console.log('\n📊 SOLICITUDES POR GATO:\n');
        console.log('═'.repeat(80));
        
        result.rows.forEach(row => {
            console.log(`\n🐱 ${row.name}:`);
            console.log(`   Total: ${row.solicitudes} solicitudes`);
            if (row.solicitudes > 0) {
                console.log(`   📝 Pendientes: ${row.pendientes}`);
                console.log(`   ✅ Aprobadas: ${row.aprobadas}`);
                console.log(`   ❌ Rechazadas: ${row.rechazadas}`);
            }
        });
        
        const total = await pool.query('SELECT COUNT(*) as total FROM adoption_applications');
        console.log('\n' + '═'.repeat(80));
        console.log(`\n📈 TOTAL: ${total.rows[0].total} solicitudes en la base de datos\n`);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

showApplicationsPerCat();
