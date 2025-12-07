/**
 * Script para ejecutar seed en producción (Render)
 * ADVERTENCIA: Esto eliminará todos los datos existentes
 * Uso: DATABASE_URL="postgresql://..." node backend/run-seed-production.js
 */

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const readline = require('readline');

// Verificar que exista DATABASE_URL
if (!process.env.DATABASE_URL) {
    console.error('❌ ERROR: DATABASE_URL no está configurada');
    console.log('\nUso:');
    console.log('  DATABASE_URL="postgresql://user:pass@host/db" node backend/run-seed-production.js');
    process.exit(1);
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function runSeedProduction() {
    try {
        console.log('🚀 Conectando a base de datos de producción...');
        console.log(`📍 Host: ${new URL(process.env.DATABASE_URL).host}\n`);
        
        // Test de conexión
        await pool.query('SELECT NOW()');
        console.log('✅ Conexión exitosa\n');
        
        // Confirmación de seguridad
        console.log('⚠️  ADVERTENCIA: Este script eliminará TODOS los datos existentes en producción');
        console.log('⚠️  Solo continúa si estás seguro de lo que estás haciendo\n');
        
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        const answer = await new Promise(resolve => {
            rl.question('¿Deseas continuar? (escribe "SI ESTOY SEGURO" para confirmar): ', resolve);
        });
        
        rl.close();
        
        if (answer !== 'SI ESTOY SEGURO') {
            console.log('\n❌ Operación cancelada');
            await pool.end();
            process.exit(0);
        }
        
        console.log('\n🔄 Ejecutando seed de producción...\n');
        
        // Leer archivo de seed
        const seedPath = path.join(__dirname, 'seed.sql');
        const seedSQL = fs.readFileSync(seedPath, 'utf8');
        
        // Ejecutar seed
        await pool.query(seedSQL);
        
        console.log('✅ Seed completado exitosamente');
        console.log('\n📊 Datos de prueba creados:');
        
        // Mostrar estadísticas
        const stats = await pool.query(`
            SELECT 
                (SELECT COUNT(*) FROM users) as usuarios,
                (SELECT COUNT(*) FROM cats) as gatos,
                (SELECT COUNT(*) FROM adoption_applications) as solicitudes,
                (SELECT COUNT(*) FROM educational_posts) as posts
        `);
        
        console.log(`   👤 Usuarios: ${stats.rows[0].usuarios}`);
        console.log(`   🐱 Gatos: ${stats.rows[0].gatos}`);
        console.log(`   📋 Solicitudes: ${stats.rows[0].solicitudes}`);
        console.log(`   📰 Posts: ${stats.rows[0].posts}`);
        
        await pool.end();
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Error al ejecutar seed:', error.message);
        await pool.end();
        process.exit(1);
    }
}

runSeedProduction();
