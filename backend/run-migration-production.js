/**
 * Script para ejecutar migraciones en producción (Render)
 * Uso: DATABASE_URL="postgresql://..." node backend/run-migration-production.js
 */

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// Verificar que exista DATABASE_URL
if (!process.env.DATABASE_URL) {
    console.error('❌ ERROR: DATABASE_URL no está configurada');
    console.log('\nUso:');
    console.log('  DATABASE_URL="postgresql://user:pass@host/db" node backend/run-migration-production.js');
    process.exit(1);
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function runMigrationsProduction() {
    try {
        console.log('🚀 Conectando a base de datos de producción...');
        console.log(`📍 Host: ${new URL(process.env.DATABASE_URL).host}\n`);
        
        // Test de conexión
        await pool.query('SELECT NOW()');
        console.log('✅ Conexión exitosa\n');
        
        console.log('🔄 Ejecutando migraciones...\n');
        
        const migrationsDir = path.join(__dirname, 'migrations');
        const migrationFiles = fs.readdirSync(migrationsDir)
            .filter(file => file.endsWith('.sql'))
            .sort();
        
        for (const file of migrationFiles) {
            console.log(`⚙️  Ejecutando: ${file}`);
            const migrationPath = path.join(migrationsDir, file);
            const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
            
            try {
                await pool.query(migrationSQL);
                console.log(`✅ ${file} completada\n`);
            } catch (error) {
                // Si el error es por columna/índice ya existente, continuar
                if (error.code === '42701' || error.code === '42P07' || error.code === '42P16') {
                    console.log(`⚠️  ${file} ya aplicada (saltando)\n`);
                } else if (error.message.includes('ya existe') || error.message.includes('already exists')) {
                    console.log(`⚠️  ${file} elementos ya existen (saltando)\n`);
                } else {
                    console.error(`❌ Error en ${file}:`, error.message);
                    throw error;
                }
            }
        }
        
        console.log('✅ Todas las migraciones completadas exitosamente');
        
        await pool.end();
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Error al ejecutar migraciones:', error.message);
        await pool.end();
        process.exit(1);
    }
}

runMigrationsProduction();
