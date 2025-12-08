const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'katze',
    password: 'root',
    port: 5432
});

async function showEvaluations() {
    try {
        const result = await pool.query(`
            SELECT 
                id, 
                ai_score, 
                ai_feedback, 
                ai_flags,
                form_responses->>'whyAdopt' as motivation,
                form_responses->>'reason' as reason
            FROM adoption_applications 
            WHERE id IN (50, 51, 52)
            ORDER BY id
        `);
        
        console.log('\n📊 EVALUACIONES CON NUEVO ANÁLISIS:\n');
        console.log('═'.repeat(80));
        
        result.rows.forEach(row => {
            const motivationText = row.motivation || row.reason || 'No proporcionado';
            
            console.log(`\n🆔 Solicitud #${row.id}`);
            console.log(`📈 Score: ${row.ai_score}/100`);
            console.log(`💭 Feedback: ${row.ai_feedback}`);
            console.log(`🏷️  Flags: ${row.ai_flags.join(', ')}`);
            console.log(`✍️  Motivación: "${motivationText.substring(0, 100)}${motivationText.length > 100 ? '...' : ''}"`);
            console.log('─'.repeat(80));
        });
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

showEvaluations();
