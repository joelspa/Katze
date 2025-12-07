const fs = require('fs');
const path = require('path');
const pool = require('./db');

async function fixTracking() {
  try {
    console.log('🔧 Aplicando corrección para el sistema de seguimiento...\n');
    
    const migrationPath = path.join(__dirname, 'migrations', 'add_tracking_view_and_functions.sql');
    
    if (!fs.existsSync(migrationPath)) {
      console.error('❌ No se encontró el archivo de migración');
      process.exit(1);
    }
    
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📝 Ejecutando migración de seguimiento...');
    await pool.query(migrationSQL);
    
    console.log('✅ Migración aplicada exitosamente\n');
    
    // Verificar que todo funciona
    console.log('🔍 Verificando instalación...');
    
    // Verificar vista
    const viewCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM pg_views 
        WHERE viewname = 'v_tracking_tasks_details'
      ) as exists
    `);
    
    if (viewCheck.rows[0].exists) {
      console.log('✅ Vista v_tracking_tasks_details creada correctamente');
    } else {
      console.log('⚠️  Vista no encontrada');
    }
    
    // Verificar función
    const funcCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM pg_proc 
        WHERE proname = 'mark_overdue_tasks'
      ) as exists
    `);
    
    if (funcCheck.rows[0].exists) {
      console.log('✅ Función mark_overdue_tasks() creada correctamente');
    } else {
      console.log('⚠️  Función no encontrada');
    }
    
    // Verificar columnas
    const columnsCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'tracking_tasks' 
      AND column_name IN ('certificate_url', 'updated_at')
    `);
    
    if (columnsCheck.rows.length === 2) {
      console.log('✅ Columnas certificate_url y updated_at agregadas correctamente');
    } else {
      console.log('⚠️  Algunas columnas pueden estar faltando');
    }
    
    console.log('\n🎉 ¡Sistema de seguimiento corregido exitosamente!');
    console.log('   El panel de seguimiento del admin ahora debería funcionar correctamente.\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al aplicar la corrección:', error.message);
    console.error('\nDetalles del error:', error);
    process.exit(1);
  }
}

fixTracking();
