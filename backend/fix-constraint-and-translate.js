const { Pool } = require('pg');
const pool = new Pool({ 
    user: 'postgres', 
    host: 'localhost', 
    database: 'katze', 
    password: 'root', 
    port: 5432 
});

async function fixConstraintAndTranslate() {
    try {
        console.log('🔄 Paso 1: Eliminando constraint antiguo...');
        await pool.query(`ALTER TABLE adoption_applications DROP CONSTRAINT IF EXISTS adoption_applications_status_check`);
        console.log('✅ Constraint eliminado\n');
        
        console.log('🔄 Paso 2: Traduciendo estados...');
        await pool.query(`UPDATE adoption_applications SET status = 'procesando' WHERE status = 'processing'`);
        await pool.query(`UPDATE adoption_applications SET status = 'revision_pendiente' WHERE status = 'pending_review'`);
        await pool.query(`UPDATE adoption_applications SET status = 'rechazada_automaticamente' WHERE status = 'auto_rejected'`);
        console.log('✅ Estados traducidos\n');
        
        console.log('🔄 Paso 3: Creando nuevo constraint en español...');
        await pool.query(`
            ALTER TABLE adoption_applications
            ADD CONSTRAINT adoption_applications_status_check 
            CHECK (status IN ('procesando', 'revision_pendiente', 'rechazada_automaticamente', 'pendiente', 'aprobada', 'rechazada'))
        `);
        console.log('✅ Constraint creado\n');
        
        console.log('🔄 Paso 4: Actualizando default...');
        await pool.query(`ALTER TABLE adoption_applications ALTER COLUMN status SET DEFAULT 'procesando'`);
        console.log('✅ Default actualizado\n');
        
        // Verificar resultado final
        const result = await pool.query(`
            SELECT DISTINCT status, COUNT(*) as count
            FROM adoption_applications
            GROUP BY status
            ORDER BY count DESC
        `);
        
        console.log('📊 Estados finales en la base de datos:\n');
        result.rows.forEach(r => {
            console.log(`  ${r.status}: ${r.count} solicitudes`);
        });
        
        await pool.end();
        console.log('\n✅ Migración a español completada exitosamente');
    } catch (error) {
        console.error('❌ Error:', error.message);
        await pool.end();
    }
}

fixConstraintAndTranslate();
