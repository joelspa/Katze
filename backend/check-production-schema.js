// Script para verificar el esquema de la base de datos de producción
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function checkSchema() {
    try {
        console.log('🔍 Verificando esquema de producción en Render...\n');

        // 1. Verificar columnas de AI en applications
        console.log('1️⃣ Columnas AI en tabla applications:');
        const columnsResult = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'applications' 
            AND column_name IN ('ai_score', 'ai_feedback', 'ai_flags', 'ai_evaluated_at', 'ai_error')
            ORDER BY column_name
        `);
        
        if (columnsResult.rows.length === 0) {
            console.log('   ❌ NO se encontraron columnas AI - Migraciones no ejecutadas\n');
        } else {
            console.log('   ✅ Columnas encontradas:');
            columnsResult.rows.forEach(col => {
                console.log(`      - ${col.column_name}: ${col.data_type}`);
            });
            console.log('');
        }

        // 2. Verificar constraint de status
        console.log('2️⃣ Constraint de status:');
        const constraintResult = await pool.query(`
            SELECT constraint_name, check_clause
            FROM information_schema.check_constraints
            WHERE constraint_name LIKE '%status%'
        `);
        
        if (constraintResult.rows.length > 0) {
            constraintResult.rows.forEach(con => {
                console.log(`   ${con.constraint_name}:`);
                console.log(`   ${con.check_clause}\n`);
            });
        }

        // 3. Verificar estados actuales
        console.log('3️⃣ Estados actuales en applications:');
        const statusResult = await pool.query(`
            SELECT DISTINCT status, COUNT(*) as count
            FROM applications
            GROUP BY status
            ORDER BY status
        `);
        
        if (statusResult.rows.length > 0) {
            statusResult.rows.forEach(row => {
                console.log(`   ${row.status}: ${row.count} solicitudes`);
            });
        } else {
            console.log('   (sin solicitudes)');
        }
        console.log('');

        // 4. Verificar índices
        console.log('4️⃣ Índices relacionados con AI:');
        const indexResult = await pool.query(`
            SELECT indexname, indexdef
            FROM pg_indexes
            WHERE tablename = 'applications'
            AND (indexname LIKE '%procesando%' OR indexname LIKE '%revision%')
        `);
        
        if (indexResult.rows.length === 0) {
            console.log('   ❌ NO se encontraron índices de AI\n');
        } else {
            indexResult.rows.forEach(idx => {
                console.log(`   ✅ ${idx.indexname}`);
            });
            console.log('');
        }

        console.log('✅ Verificación completada');

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.code) console.error('   Código:', error.code);
    } finally {
        await pool.end();
    }
}

checkSchema();
