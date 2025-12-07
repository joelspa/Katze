/**
 * Script de despliegue completo a producción
 * Ejecuta migraciones y seed en Render
 */

const { execSync } = require('child_process');
const readline = require('readline');

// Si tienes problemas de conexión, ejecuta esto directamente desde Render Shell
// Ver: INSTRUCCIONES_MIGRACION_RENDER.md
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://katze_88u4_user:KBijdmcP5FMvrxoZ5EXp1X2jDlVBXd8t@dpg-d4qdqerruibrs73djklg0-a.oregon-postgres.render.com:5432/katze_88u4';

async function deploy() {
    console.log('🚀 DESPLIEGUE A PRODUCCIÓN - KATZE\n');
    console.log('Este script ejecutará:\n');
    console.log('  1️⃣  Migraciones de base de datos');
    console.log('  2️⃣  Seed de datos de prueba (ELIMINA DATOS EXISTENTES)\n');
    
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    const step1 = await new Promise(resolve => {
        rl.question('¿Ejecutar migraciones? (s/n): ', resolve);
    });
    
    if (step1.toLowerCase() === 's') {
        console.log('\n📦 Ejecutando migraciones...\n');
        try {
            // Configurar variable de entorno para Windows
            process.env.DATABASE_URL = DATABASE_URL;
            execSync(`node backend/run-migration-production.js`, {
                stdio: 'inherit',
                shell: true,
                env: { ...process.env, DATABASE_URL }
            });
            console.log('\n✅ Migraciones completadas\n');
        } catch (error) {
            console.error('\n❌ Error en migraciones');
            rl.close();
            process.exit(1);
        }
    }
    
    const step2 = await new Promise(resolve => {
        rl.question('¿Ejecutar seed? (ADVERTENCIA: elimina datos) (s/n): ', resolve);
    });
    
    if (step2.toLowerCase() === 's') {
        console.log('\n📦 Ejecutando seed...\n');
        try {
            // Configurar variable de entorno para Windows
            process.env.DATABASE_URL = DATABASE_URL;
            execSync(`node backend/run-seed-production.js`, {
                stdio: 'inherit',
                shell: true,
                env: { ...process.env, DATABASE_URL }
            });
            console.log('\n✅ Seed completado\n');
        } catch (error) {
            console.error('\n❌ Error en seed');
            rl.close();
            process.exit(1);
        }
    }
    
    rl.close();
    console.log('\n✅ Despliegue completado exitosamente\n');
}

deploy().catch(error => {
    console.error('❌ Error:', error.message);
    process.exit(1);
});
