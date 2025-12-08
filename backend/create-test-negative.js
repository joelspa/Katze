const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'katze',
    password: 'root',
    port: 5432
});

async function createTestApplication() {
    try {
        // Crear solicitud de prueba con datos negativos
        const result = await pool.query(`
            INSERT INTO adoption_applications (cat_id, applicant_id, status, form_responses)
            VALUES (
                1,
                1,
                'procesando',
                $1
            )
            RETURNING id
        `, [JSON.stringify({
            whyAdopt: 'Quiero un gato porque se ven bonitos',
            hasExperience: false,
            hasSpace: false,
            hasTime: false,
            livingSpace: 'apartamento',
            hasOtherPets: false,
            acceptsSterilization: false,  // NO acepta esterilización
            acceptsFollowUp: true
        })]);
        
        console.log(`✅ Solicitud de prueba creada con ID: ${result.rows[0].id}`);
        console.log('Esta solicitud NO acepta esterilización');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

createTestApplication();
