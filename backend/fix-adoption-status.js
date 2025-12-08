// Actualizar constraint de adoption_status
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'katze',
    password: 'root',
    port: 5432
});

async function updateConstraint() {
    try {
        console.log('1. Eliminando constraint antiguo...');
        await pool.query('ALTER TABLE cats DROP CONSTRAINT IF EXISTS cats_adoption_status_check');
        
        console.log('2. Actualizando datos de gatos...');
        await pool.query(`
            UPDATE cats 
            SET adoption_status = 'disponible' 
            WHERE adoption_status = 'en_adopcion'
        `);
        
        console.log('3. Agregando constraint nuevo...');
        await pool.query(`
            ALTER TABLE cats 
            ADD CONSTRAINT cats_adoption_status_check 
            CHECK (adoption_status IN ('disponible', 'en_proceso', 'adoptado'))
        `);
        
        console.log('✅ Constraint actualizado correctamente\n');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

updateConstraint();
