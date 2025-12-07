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
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    try {
        await client.connect();
        console.log('✅ Conectado a la base de datos');

        // 1. Leer y ejecutar migraciones
        console.log('\n📋 Ejecutando migraciones...');
        const migrationFiles = [
            'migrations/add_living_space_and_breed.sql',
            'migrations/add_ai_evaluation_columns.sql'
        ];

        for (const file of migrationFiles) {
            const filePath = path.join(__dirname, file);
            if (fs.existsSync(filePath)) {
                console.log(`  → ${file}`);
                const sql = fs.readFileSync(filePath, 'utf8');
                await client.query(sql);
            }
        }

        // 2. Ejecutar seed
        console.log('\n🌱 Ejecutando seed de datos...');
        const seedPath = path.join(__dirname, 'seed.sql');
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
