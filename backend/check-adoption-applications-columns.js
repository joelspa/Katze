// Verificar columnas de adoption_applications en producción
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function checkColumns() {
    try {
        console.log('\n🔍 Verificando columnas de adoption_applications...\n');

        const result = await pool.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'adoption_applications'
            ORDER BY ordinal_position
        `);

        if (result.rows.length === 0) {
            console.log('❌ Tabla adoption_applications no encontrada');
        } else {
            console.log('Columnas encontradas:');
            result.rows.forEach(col => {
                const nullable = col.is_nullable === 'YES' ? '(nullable)' : '(NOT NULL)';
                console.log(`   ${col.column_name.padEnd(25)} ${col.data_type.padEnd(20)} ${nullable}`);
            });

            // Verificar si existen las columnas AI
            const aiColumns = ['ai_score', 'ai_feedback', 'ai_flags', 'ai_evaluated_at', 'ai_error'];
            const foundAI = result.rows.filter(col => aiColumns.includes(col.column_name));

            console.log(`\n📊 Columnas AI encontradas: ${foundAI.length}/${aiColumns.length}`);
            if (foundAI.length === aiColumns.length) {
                console.log('✅ Todas las columnas AI están presentes');
            } else {
                console.log('❌ Faltan columnas AI');
                const missing = aiColumns.filter(col => !foundAI.find(f => f.column_name === col));
                console.log('   Faltantes:', missing.join(', '));
            }
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

checkColumns();
