const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const seedProduction = async () => {
    // Configuración para base de datos de producción (Render)
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        console.log('[SEED] Conectando a base de datos de producción...');
        
        const seedPath = path.join(__dirname, 'seed-production.sql');
        const sql = fs.readFileSync(seedPath, 'utf8');

        console.log('[SEED] Ejecutando script de seed de producción...');
        console.log('[SEED] ADVERTENCIA: Esto eliminará todos los datos existentes');

        await pool.query(sql);

        console.log('[SEED SUCCESS] Base de datos poblada exitosamente con datos de demostración');
        console.log('\n=== CREDENCIALES DE ACCESO ===');
        console.log('Todos los usuarios tienen password: 123');
        console.log('\nAdmin:');
        console.log('  - admin@katze.com');
        console.log('\nRescatistas:');
        console.log('  - ana.garcia@katze.com');
        console.log('  - carlos.lopez@katze.com');
        console.log('  - lucia.martinez@katze.com');
        console.log('\nAdoptantes:');
        console.log('  - juan.perez@katze.com');
        console.log('  - sofia.ramirez@katze.com');
        console.log('  - miguel.torres@katze.com');
        console.log('  - valentina.castro@katze.com');
        console.log('  - diego.morales@katze.com');
        console.log('  - daniela.vega@katze.com');
        console.log('  - andres.silva@katze.com');
        console.log('\n=== DATOS INSERTADOS ===');
        console.log('11 usuarios');
        console.log('11 gatos (8 aprobados, 2 pendientes, 1 rechazado)');
        console.log('10 solicitudes de adopción (varios estados)');
        console.log('10 tareas de seguimiento');
        console.log('12 posts educativos');
        
        await pool.end();
        process.exit(0);
    } catch (error) {
        console.error('[SEED ERROR] Error al sembrar la base de datos:', error);
        await pool.end();
        process.exit(1);
    }
};

seedProduction();
