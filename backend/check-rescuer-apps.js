const { Pool } = require('pg');
const pool = new Pool({ 
    user: 'postgres', 
    host: 'localhost', 
    database: 'katze', 
    password: 'root', 
    port: 5432 
});

async function checkRescuerApplications() {
    try {
        // Verificar qué rescatista debería ver la solicitud #49
        const appCheck = await pool.query(`
            SELECT 
                app.id,
                app.status,
                app.ai_score,
                app.ai_feedback,
                app.ai_flags,
                cat.id as cat_id,
                cat.name as cat_name,
                cat.owner_id as rescuer_id
            FROM adoption_applications app
            JOIN cats cat ON app.cat_id = cat.id
            WHERE app.id = 49
        `);
        
        console.log('📋 Solicitud #49:');
        console.log(appCheck.rows[0]);
        
        const rescuerId = appCheck.rows[0].rescuer_id;
        
        // Obtener solicitudes como lo haría el backend
        const rescuerApps = await pool.query(`
            SELECT 
                app.id,
                app.applicant_id,
                app.cat_id,
                app.form_responses,
                app.status,
                app.created_at,
                app.ai_score,
                app.ai_feedback,
                app.ai_flags,
                app.ai_evaluated_at,
                cat.name as cat_name,
                cat.photos_url as cat_photos,
                u.full_name as applicant_name,
                u.email as applicant_email,
                u.phone as applicant_phone
            FROM adoption_applications app
            JOIN cats cat ON app.cat_id = cat.id
            JOIN users u ON app.applicant_id = u.id
            WHERE cat.owner_id = $1 
              AND app.status IN ('revision_pendiente', 'pendiente')
            ORDER BY 
              CASE WHEN app.status = 'revision_pendiente' THEN app.ai_score ELSE 0 END DESC,
              app.created_at ASC
        `, [rescuerId]);
        
        console.log(`\n🔍 Solicitudes para rescatista #${rescuerId}:`);
        console.log(`Total: ${rescuerApps.rows.length}`);
        
        rescuerApps.rows.forEach(app => {
            console.log(`\n  ID: ${app.id}`);
            console.log(`  Gato: ${app.cat_name}`);
            console.log(`  Status: ${app.status}`);
            console.log(`  AI Score: ${app.ai_score}`);
            console.log(`  AI Feedback: ${app.ai_feedback}`);
            console.log(`  AI Flags: ${app.ai_flags}`);
        });
        
        await pool.end();
    } catch (error) {
        console.error('❌ Error:', error.message);
        await pool.end();
    }
}

checkRescuerApplications();
