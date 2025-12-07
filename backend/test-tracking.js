const pool = require('./db');

async function testTracking() {
  try {
    console.log('🧪 Probando el endpoint de tracking...\n');
    
    // Probar la vista
    console.log('1️⃣ Consultando vista v_tracking_tasks_details...');
    const result = await pool.query(`
      SELECT id, task_type, status, cat_name, adoptante_name, rescatista_name
      FROM v_tracking_tasks_details
      WHERE status IN ('pendiente', 'atrasada')
      ORDER BY due_date ASC
      LIMIT 5
    `);
    
    console.log(`   ✅ Vista funciona correctamente (${result.rows.length} tareas encontradas)`);
    
    if (result.rows.length > 0) {
      console.log('\n   📋 Primeras tareas pendientes:');
      result.rows.forEach((task, i) => {
        console.log(`   ${i+1}. [${task.status}] ${task.task_type} - Gato: ${task.cat_name}`);
        console.log(`      Adoptante: ${task.adoptante_name} | Rescatista: ${task.rescatista_name || 'N/A'}`);
      });
    }
    
    // Probar la función
    console.log('\n2️⃣ Ejecutando función mark_overdue_tasks()...');
    await pool.query('SELECT mark_overdue_tasks()');
    console.log('   ✅ Función ejecutada correctamente');
    
    // Ver estadísticas
    console.log('\n3️⃣ Obteniendo estadísticas...');
    const stats = await pool.query(`
      SELECT 
        COUNT(*) FILTER (WHERE status IN ('pendiente', 'atrasada')) as tareas_pendientes,
        COUNT(*) FILTER (WHERE status = 'atrasada') as tareas_vencidas,
        COUNT(*) FILTER (WHERE status = 'completada') as tareas_completadas,
        COUNT(*) FILTER (WHERE task_type = 'Seguimiento de Esterilización' AND status IN ('pendiente', 'atrasada')) as esterilizaciones_pendientes
      FROM tracking_tasks
    `);
    
    const s = stats.rows[0];
    console.log(`   📊 Tareas pendientes: ${s.tareas_pendientes}`);
    console.log(`   ⚠️  Tareas vencidas: ${s.tareas_vencidas}`);
    console.log(`   ✅ Tareas completadas: ${s.tareas_completadas}`);
    console.log(`   💉 Esterilizaciones pendientes: ${s.esterilizaciones_pendientes}`);
    
    console.log('\n🎉 ¡Todo funciona correctamente! El panel de seguimiento está listo.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
    console.error(error);
    process.exit(1);
  }
}

testTracking();
