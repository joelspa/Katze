const fs = require('fs');
const path = require('path');
const db = require('./db');

const seedDatabase = async () => {
    try {
        const seedPath = path.join(__dirname, 'seed.sql');
        const sql = fs.readFileSync(seedPath, 'utf8');

        console.log('🌱 Iniciando sembrado de base de datos...');

        // Ejecutar todo el script SQL
        await db.query(sql);

        console.log('✅ Base de datos sembrada exitosamente');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error al sembrar la base de datos:', error);
        process.exit(1);
    }
};

seedDatabase();
