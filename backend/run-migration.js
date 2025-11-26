const fs = require('fs');
const path = require('path');
const db = require('./db');

const runMigration = async () => {
    try {
        const migrationPath = path.join(__dirname, 'migrations', 'add_living_space_and_breed.sql');
        const sql = fs.readFileSync(migrationPath, 'utf8');

        console.log('🔄 Ejecutando migración: add_living_space_and_breed.sql');

        // Ejecutar el script SQL de migración
        await db.query(sql);

        console.log('✅ Migración completada exitosamente');
        console.log('📝 Columnas agregadas:');
        console.log('   - breed (VARCHAR): Raza del gato');
        console.log('   - living_space_requirement (VARCHAR): Tipo de vivienda requerida');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error al ejecutar la migración:', error);
        process.exit(1);
    }
};

runMigration();
