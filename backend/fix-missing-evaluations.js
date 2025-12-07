const db = require('./db');
const geminiService = require('./services/geminiService');
const applicationService = require('./services/applicationService');

// Helper function to infer activity level (copied from controller)
function inferActivityLevel(age, description) {
    const descLower = (description || '').toLowerCase();
    
    if (descLower.includes('tranquilo') || descLower.includes('senior') || age === 'senior') {
        return 'low';
    }
    
    if (descLower.includes('juguet') || descLower.includes('energ') || descLower.includes('activ') || age === 'cachorro') {
        return 'high';
    }
    
    return 'medium';
}

async function fixMissingEvaluations() {
    try {
        console.log('🔍 Buscando solicitudes sin evaluación...');
        
        // Find applications with missing scores
        const query = `
            SELECT 
                app.id, 
                app.form_responses,
                cat.id as cat_id,
                cat.living_space_requirement,
                cat.sterilization_status,
                cat.age,
                cat.description
            FROM adoption_applications app
            JOIN cats cat ON app.cat_id = cat.id
            WHERE app.ai_score IS NULL OR app.ai_decision IS NULL
        `;
        
        const result = await db.query(query);
        const applications = result.rows;
        
        console.log(`📋 Encontradas ${applications.length} solicitudes pendientes de evaluación.`);

        if (applications.length === 0) {
            console.log('✅ No hay solicitudes pendientes.');
            return;
        }

        let processed = 0;
        let errors = 0;

        for (const app of applications) {
            try {
                console.log(`\n🔄 Procesando solicitud #${app.id}...`);
                
                // Construct cat requirements
                const cat_requirements = {
                    needs_nets: app.living_space_requirement === 'casa_grande' || app.living_space_requirement === 'cualquiera',
                    sterilized: app.sterilization_status === 'esterilizado',
                    activity_level: inferActivityLevel(app.age, app.description),
                    living_space: app.living_space_requirement
                };

                // Applicant data
                const applicant_data = app.form_responses;

                // Evaluate
                const evaluation = await geminiService.evaluate_application_risk(
                    cat_requirements,
                    applicant_data
                );

                // Save to DB
                await applicationService.saveAIEvaluation(app.id, evaluation);
                
                // If rejected, update status too (optional, but consistent with controller)
                if (evaluation.decision === 'REJECT') {
                    await applicationService.autoRejectApplication(
                        app.id,
                        evaluation.auto_reject_reason
                    );
                    console.log(`❌ Solicitud #${app.id} RECHAZADA automáticamente.`);
                } else {
                    console.log(`✅ Solicitud #${app.id} evaluada: ${evaluation.decision} (${evaluation.score}/100)`);
                }

                processed++;
                
                // Small delay to be nice to resources
                await new Promise(resolve => setTimeout(resolve, 100));

            } catch (err) {
                console.error(`❌ Error procesando solicitud #${app.id}:`, err.message);
                errors++;
            }
        }

        console.log('\n🎉 Proceso completado.');
        console.log(`✅ Procesadas: ${processed}`);
        console.log(`❌ Errores: ${errors}`);

    } catch (error) {
        console.error('Error fatal:', error);
    } finally {
        // We don't close the pool explicitly because db.js doesn't export it, 
        // but the script will exit when event loop is empty.
        // If db.js keeps connection open, we might need to force exit.
        setTimeout(() => process.exit(0), 1000);
    }
}

fixMissingEvaluations();
