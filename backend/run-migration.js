const fs = require('fs');
const path = require('path');
const pool = require('./db');

async function runMigrations() {
  try {
    console.log('🔄 Ejecutando todas las migraciones...\n');
    
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
        if (error.code === '42701' || error.code === '42P07') {
          console.log(`⚠️  ${file} ya aplicada (saltando)\n`);
        } else {
          throw error;
        }
      }
    }
    
    console.log('✅ Todas las migraciones ejecutadas exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al ejecutar migraciones:', error.message);
    process.exit(1);
  }
}

runMigrations();
