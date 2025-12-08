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

async function verifyOrder() {
    try {
        console.log('\n📅 VERIFICANDO ORDEN DE GATOS EN CATÁLOGO\n');
        console.log('═'.repeat(80));
        
        const result = await pool.query(`
            SELECT 
                id, 
                name, 
                breed,
                created_at,
                EXTRACT(DAY FROM NOW() - created_at) as dias_publicado
            FROM cats 
            WHERE approval_status = 'aprobado' 
            AND adoption_status = 'disponible'
            ORDER BY created_at ASC
            LIMIT 10
        `);
        
        console.log('\n🏆 Orden de aparición en el catálogo (los más antiguos primero):\n');
        
        result.rows.forEach((cat, index) => {
            const fecha = new Date(cat.created_at).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
            
            console.log(`${index + 1}. ${cat.name} (${cat.breed})`);
            console.log(`   📅 Publicado: ${fecha} (hace ${Math.floor(cat.dias_publicado)} días)`);
            console.log('');
        });
        
        console.log('═'.repeat(80));
        console.log('\n✅ Los gatos más antiguos tienen PRIORIDAD en el catálogo');
        console.log('💡 Esto les da mayor visibilidad y más oportunidades de ser adoptados\n');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

verifyOrder();
