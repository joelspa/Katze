/**
 * Script para crear solicitud de prueba con status 'processing'
 * Para probar el worker de evaluación IA
 */

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function createTestApplication() {
    try {
        console.log('🔄 Creando solicitud de prueba...');
        
        const query = `
            INSERT INTO adoption_applications 
            (cat_id, applicant_id, status, form_responses, created_at)
            VALUES 
            ($1, $2, $3, $4, NOW())
            RETURNING id, status, created_at
        `;
        
        const values = [
            1, // cat_id (Veterano)
            1, // applicant_id (admin como adoptante de prueba)
            'procesando',
            JSON.stringify({
                "¿Qué tipo de vivienda tienes?": "Casa con jardín",
                "¿Estás de acuerdo con esterilizar al gato?": "Sí, completamente de acuerdo",
                "¿Tienes acceso a veterinario?": "Sí, tengo una clínica cerca",
                "¿Has tenido gatos antes?": "Sí, tuve 2 gatos por 10 años",
                "¿Por qué quieres adoptar?": "Quiero darle un hogar amoroso a un gatito que lo necesite",
                "¿Tienes mallas de protección?": "Sí, todas las ventanas tienen mallas",
                "¿Hay niños en casa?": "No",
                "¿Otros animales?": "No"
            })
        ];
        
        const result = await pool.query(query, values);
        
        console.log('✅ Solicitud de prueba creada:');
        console.log('   ID:', result.rows[0].id);
        console.log('   Status:', result.rows[0].status);
        console.log('   Fecha:', result.rows[0].created_at);
        console.log('\n📌 El worker debería procesarla en los próximos 10 segundos...');
        
        await pool.end();
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Error al crear solicitud:', error.message);
        await pool.end();
        process.exit(1);
    }
}

createTestApplication();
