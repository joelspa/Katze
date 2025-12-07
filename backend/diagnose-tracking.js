const pool = require('./db');

async function diagnose() {
  try {
    console.log('🔍 Diagnosticando tabla tracking_tasks...\n');
    
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
    
    // Ver estructura actual
    console.log('📋 Columnas actuales:');
    const columns = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'tracking_tasks'
      ORDER BY ordinal_position
    `);
    columns.rows.forEach(col => {
      console.log(`   - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });
    
    // Ver constraints actuales
    console.log('\n🔒 Constraints actuales:');
    const constraints = await pool.query(`
      SELECT con.conname, pg_get_constraintdef(con.oid) as definition
      FROM pg_constraint con
      JOIN pg_class rel ON rel.oid = con.conrelid
      WHERE rel.relname = 'tracking_tasks'
      AND con.contype = 'c'
    `);
    
    if (constraints.rows.length === 0) {
      console.log('   - No hay check constraints');
    } else {
      constraints.rows.forEach(c => {
        console.log(`   - ${c.conname}`);
        console.log(`     ${c.definition}`);
      });
    }
    
    // Contar registros
    const count = await pool.query('SELECT COUNT(*) as total FROM tracking_tasks');
    console.log(`\n📊 Total de registros: ${count.rows[0].total}`);
    
    if (parseInt(count.rows[0].total) > 0) {
      // Ver valores únicos de task_type
      console.log('\n🏷️  Valores únicos en task_type:');
      const types = await pool.query(`
        SELECT task_type, COUNT(*) as cantidad
        FROM tracking_tasks
        GROUP BY task_type
        ORDER BY cantidad DESC
      `);
      types.rows.forEach(t => {
        console.log(`   - "${t.task_type}": ${t.cantidad} registros`);
      });
      
      // Ver valores únicos de status
      console.log('\n📌 Valores únicos en status:');
      const statuses = await pool.query(`
        SELECT status, COUNT(*) as cantidad
        FROM tracking_tasks
        GROUP BY status
        ORDER BY cantidad DESC
      `);
      statuses.rows.forEach(s => {
        console.log(`   - "${s.status}": ${s.cantidad} registros`);
      });
      
      // Ver algunos registros de ejemplo
      console.log('\n📝 Ejemplos de registros:');
      const samples = await pool.query(`
        SELECT id, task_type, status, due_date
        FROM tracking_tasks
        LIMIT 5
      `);
      samples.rows.forEach(r => {
        console.log(`   ID: ${r.id} | Tipo: "${r.task_type}" | Status: "${r.status}" | Vencimiento: ${r.due_date}`);
      });
    }
    
    console.log('\n✅ Diagnóstico completado');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

diagnose();
