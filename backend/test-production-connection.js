const { Pool } = require('pg');

// Usar External Database URL (accesible desde fuera de Render)
const DATABASE_URL = 'postgresql://katze_88u4_user:KBijdmcP5FMvrxoZ5EXp1X2jDlVBXd8t@dpg-d4qdqerruibrs73djklg0-a.oregon-postgres.render.com:5432/katze_88u4';

async function testConnection() {
    console.log('🔍 Probando conexión a Render...\n');
    
    const pool = new Pool({
        connectionString: DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 10000
    });
    
    try {
        console.log('Intentando conectar...');
        const client = await pool.connect();
        console.log('Cliente conectado');
        
        const result = await client.query('SELECT NOW(), version()');
        console.log('✅ Conexión exitosa!');
        console.log('📅 Fecha servidor:', result.rows[0].now);
        console.log('📊 Versión PostgreSQL:', result.rows[0].version.split(' ')[0], result.rows[0].version.split(' ')[1]);
        
        client.release();
        
        // Verificar tablas existentes
        const tables = await pool.query(`
            SELECT tablename 
            FROM pg_tables 
            WHERE schemaname = 'public'
            ORDER BY tablename
        `);
        
        console.log(`\n📋 Tablas existentes (${tables.rows.length}):`);
        tables.rows.forEach(t => console.log(`   - ${t.tablename}`));
        
        await pool.end();
    } catch (error) {
        console.error('❌ Error de conexión:', error.message);
        console.error('Código:', error.code);
        await pool.end();
        process.exit(1);
    }
}

testConnection();
