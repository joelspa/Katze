require('dotenv').config();
const config = require('./config/config');

// Forzar el uso de la configuración explícita si DATABASE_URL es interna
if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('dpg-') && !process.env.DATABASE_URL.includes('.render.com')) {
    console.log('⚠️  Detectada DATABASE_URL interna. Ignorando para usar configuración explícita...');
    delete process.env.DATABASE_URL;
}

const pool = require('./db');

async function diagnose() {
  try {
    console.log('🔍 Diagnosticando tabla tracking_tasks en PRODUCCIÓN...\n');
    console.log('🔌 Conectando a:', config.DB_CONFIG.host);
    
    // Verificar si la tabla existe
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'tracking_tasks'
      ) as exists
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.log('⚠️  La tabla tracking_tasks no existe');
      process.exit(0);
    }
    
    console.log('✅ Tabla tracking_tasks existe\n');
    
    // Ver valores únicos de task_type
    console.log('\n🏷️  Valores únicos en task_type:');
    const types = await pool.query(`
      SELECT task_type, length(task_type) as len, encode(task_type::bytea, 'hex') as hex, COUNT(*) as cantidad
      FROM tracking_tasks
      GROUP BY task_type
      ORDER BY cantidad DESC
    `);
    types.rows.forEach(t => {
      console.log(`   - "${t.task_type}" (len: ${t.len}, hex: ${t.hex}): ${t.cantidad} registros`);
    });
    
    console.log('\n✅ Diagnóstico completado');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

diagnose();
