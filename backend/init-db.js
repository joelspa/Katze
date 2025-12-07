// Script para inicializar base de datos en producción
// Ejecuta las migraciones y seed automáticamente

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function initDatabase() {
    console.log('🔄 Iniciando configuración de base de datos...');
    
    // Configuración de base de datos
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('✅ Conectado a la base de datos');

        // 1. Crear schema (tablas)
        console.log('\n📐 Creando schema de base de datos...');
        const schemaPath = path.join(__dirname, 'schema.sql');
        if (fs.existsSync(schemaPath)) {
            const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
            await client.query(schemaSQL);
            console.log('  ✅ Tablas creadas');
        }

        // 2. Leer y ejecutar migraciones (si existen)
        console.log('\n📋 Ejecutando migraciones adicionales...');
        const migrationFiles = [
            'migrations/add_living_space_and_breed.sql',
            'migrations/add_ai_evaluation_columns.sql'
        ];

        for (const file of migrationFiles) {
            const filePath = path.join(__dirname, file);
            if (fs.existsSync(filePath)) {
                try {
                    console.log(`  → ${file}`);
                    const sql = fs.readFileSync(filePath, 'utf8');
                    await client.query(sql);
                } catch (err) {
                    console.log(`  ⚠️  ${file}: ${err.message} (puede ser que ya esté aplicada)`);
                }
            }
        }

        // 3. Ejecutar seed
        console.log('\n🌱 Ejecutando seed de datos...');
        // Usar seed.sql principal (ya corregido)
        const seedPath = path.join(__dirname, 'seed.sql');
        
        console.log(`  → Usando: ${path.basename(seedPath)}`);
        const seedSQL = fs.readFileSync(seedPath, 'utf8');
        await client.query(seedSQL);

        console.log('\n✅ Base de datos inicializada correctamente');
        console.log('📊 Datos de prueba cargados');
        console.log('\n🔐 Usuarios de prueba:');
        console.log('   Admin: admin@test.com / 123');
        console.log('   Rescatista: rescatista1@test.com / 123');
        console.log('   Adoptante: adoptante1@test.com / 123');

    } catch (error) {
        console.error('❌ Error al inicializar base de datos:', error);
        process.exit(1);
    } finally {
        await client.end();
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    initDatabase();
}

module.exports = initDatabase;
