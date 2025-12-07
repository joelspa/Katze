const { Pool } = require('pg');
const pool = new Pool({ 
    user: 'postgres', 
    host: 'localhost', 
    database: 'katze', 
    password: 'root', 
    port: 5432 
});

async function checkData() {
    try {
        // Check users
        const users = await pool.query('SELECT id, email, role FROM users LIMIT 5');
        console.log('👤 Usuarios disponibles:');
        users.rows.forEach(u => console.log(`   ID: ${u.id} - ${u.email} (${u.role})`));
        
        // Check cats
        const cats = await pool.query('SELECT id, name, owner_id FROM cats LIMIT 5');
        console.log('\n🐱 Gatos disponibles:');
        cats.rows.forEach(c => console.log(`   ID: ${c.id} - ${c.name} (owner: ${c.owner_id})`));
        
        await pool.end();
    } catch (error) {
        console.error('❌ Error:', error.message);
        await pool.end();
    }
}

checkData();
