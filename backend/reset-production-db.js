/**
 * Script para resetear la base de datos de PRODUCCIÓN
 * ⚠️  PELIGRO: Esto eliminará TODOS los datos de producción
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Conexión a producción en Render
const pool = new Pool({
    user: 'katze_88u4_user',
    host: 'dpg-d4qderruibrs73djklg0-a.oregon-postgres.render.com',
    database: 'katze_88u4',
    password: 'KBijdmcP5FMvrxoZ5EXp1X2jDlVBXd8t',
    port: 5432,
    ssl: {
        rejectUnauthorized: false
    }
});

async function resetDatabase() {
    try {
        console.log('\n⚠️  ¡ALERTA! Vas a eliminar TODOS los datos de PRODUCCIÓN\n');
        console.log('Base de datos: katze_88u4 @ Render');
        console.log('\nPresiona Ctrl+C para cancelar...\n');
        
        // Esperar 5 segundos para dar tiempo de cancelar
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        console.log('🗑️  Paso 1: Eliminando todas las tablas...\n');
        
        // Eliminar tablas en orden correcto (respetando foreign keys)
        const dropTables = [
            'DROP TABLE IF EXISTS adoption_applications CASCADE',
            'DROP TABLE IF EXISTS cats CASCADE',
            'DROP TABLE IF EXISTS users CASCADE'
        ];
        
        for (const sql of dropTables) {
            console.log(`   Ejecutando: ${sql}`);
            await pool.query(sql);
        }
        
        console.log('\n✅ Tablas eliminadas correctamente\n');
        
        console.log('📋 Paso 2: Recreando schema desde schema.sql...\n');
        
        // Leer y ejecutar schema.sql
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
        
        await pool.query(schemaSQL);
        console.log('✅ Schema recreado correctamente\n');
        
        console.log('🌱 Paso 3: Cargando datos desde seed-production-demo.sql...\n');
        
        // Leer y ejecutar seed-production-demo.sql
        const seedPath = path.join(__dirname, 'seed-production-demo.sql');
        const seedSQL = fs.readFileSync(seedPath, 'utf8');
        
        await pool.query(seedSQL);
        console.log('✅ Seed completo cargado correctamente\n');
        
        // Verificar datos cargados
        console.log('📊 Verificando datos cargados:\n');
        
        const userCount = await pool.query('SELECT COUNT(*) as count FROM users');
        const catCount = await pool.query('SELECT COUNT(*) as count FROM cats');
        const appCount = await pool.query('SELECT COUNT(*) as count FROM adoption_applications');
        
        console.log(`   Usuarios: ${userCount.rows[0].count}`);
        console.log(`   Gatos: ${catCount.rows[0].count}`);
        console.log(`   Solicitudes: ${appCount.rows[0].count}`);
        
        console.log('\n✅ ¡Base de datos de producción reseteada exitosamente!\n');
        
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error('Stack:', error.stack);
    } finally {
        await pool.end();
    }
}

// Ejecutar
resetDatabase();
