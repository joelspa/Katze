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

async function verifyData() {
    try {
        console.log('\n📊 VERIFICACIÓN COMPLETA DE DATOS EN PRODUCCIÓN\n');
        console.log('═'.repeat(70));
        
        // Usuarios
        const users = await pool.query('SELECT role, COUNT(*) as count FROM users GROUP BY role ORDER BY role');
        console.log('\n👥 USUARIOS:');
        users.rows.forEach(row => {
            console.log(`   ${row.role}: ${row.count}`);
        });
        
        // Gatos por estado
        const cats = await pool.query(`
            SELECT approval_status, adoption_status, COUNT(*) as count 
            FROM cats 
            GROUP BY approval_status, adoption_status 
            ORDER BY approval_status, adoption_status
        `);
        console.log('\n🐱 GATOS:');
        cats.rows.forEach(row => {
            console.log(`   ${row.approval_status} + ${row.adoption_status}: ${row.count}`);
        });
        
        // Gatos disponibles para adopción
        const available = await pool.query(`
            SELECT COUNT(*) as count 
            FROM cats 
            WHERE approval_status = 'aprobado' AND adoption_status = 'disponible'
        `);
        console.log(`\n   ✅ Gatos visibles en catálogo: ${available.rows[0].count}`);
        
        // Solicitudes por estado
        const apps = await pool.query('SELECT status, COUNT(*) as count FROM adoption_applications GROUP BY status ORDER BY status');
        console.log('\n📝 SOLICITUDES DE ADOPCIÓN:');
        apps.rows.forEach(row => {
            console.log(`   ${row.status}: ${row.count}`);
        });
        
        // Posts educativos
        const posts = await pool.query('SELECT category, COUNT(*) as count FROM educational_posts GROUP BY category');
        console.log('\n📚 POSTS EDUCATIVOS:');
        posts.rows.forEach(row => {
            console.log(`   ${row.category}: ${row.count}`);
        });
        
        // Tareas de seguimiento
        const tasks = await pool.query('SELECT status, COUNT(*) as count FROM tracking_tasks GROUP BY status');
        console.log('\n✅ TAREAS DE SEGUIMIENTO:');
        tasks.rows.forEach(row => {
            console.log(`   ${row.status}: ${row.count}`);
        });
        
        console.log('\n' + '═'.repeat(70));
        console.log('\n✨ Base de datos de producción lista para demostración\n');
        
        // Mostrar algunos gatos disponibles
        const showcats = await pool.query(`
            SELECT c.name, c.breed, u.full_name as rescatista 
            FROM cats c 
            JOIN users u ON c.owner_id = u.id 
            WHERE c.approval_status = 'aprobado' AND c.adoption_status = 'disponible' 
            LIMIT 5
        `);
        
        console.log('🌟 GATOS DESTACADOS DISPONIBLES:');
        showcats.rows.forEach(cat => {
            console.log(`   • ${cat.name} (${cat.breed}) - rescatado por ${cat.rescatista}`);
        });
        
        console.log('\n');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

verifyData();
