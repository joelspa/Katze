// Servicio de solicitudes de adopción
// Maneja la lógica de negocio para solicitudes de adopción

const db = require('../db');

class ApplicationService {
    // Crea solicitud de adopción con respuestas del formulario
    async createApplication(applicantId, catId, formResponses) {
        const formResponsesJson = JSON.stringify(formResponses);
        
        const result = await db.query(
            `INSERT INTO adoption_applications (applicant_id, cat_id, form_responses, status)
             VALUES ($1, $2, $3, 'pendiente')
             RETURNING *`,
            [applicantId, catId, formResponsesJson]
        );
        
        return result.rows[0];
    }

    // Guarda los resultados de la evaluación automática de IA
    async saveAIEvaluation(applicationId, evaluation) {
        const result = await db.query(
            `UPDATE adoption_applications 
             SET ai_decision = $1, 
                 ai_score = $2, 
                 ai_auto_reject_reason = $3, 
                 ai_risk_analysis = $4, 
                 ai_evaluated_at = NOW()
             WHERE id = $5
             RETURNING *`,
            [
                evaluation.decision,
                evaluation.score,
                evaluation.auto_reject_reason || null,
                evaluation.risk_analysis,
                applicationId
            ]
        );
        
        return result.rows[0];
    }

    // Rechaza automáticamente una solicitud basado en evaluación de IA
    async autoRejectApplication(applicationId, reason) {
        const result = await db.query(
            `UPDATE adoption_applications 
             SET status = 'rechazada'
             WHERE id = $1
             RETURNING *`,
            [applicationId]
        );
        
        return result.rows[0];
    }

    // Obtiene las solicitudes recibidas por un rescatista
    async getApplicationsByRescuer(rescuerId) {
        const query = `
            SELECT 
                app.*, 
                cat.name as cat_name,
                cat.photos_url as cat_photos,
                u.full_name as applicant_name,
                u.email as applicant_email,
                u.phone as applicant_phone
            FROM adoption_applications app
            JOIN cats cat ON app.cat_id = cat.id
            JOIN users u ON app.applicant_id = u.id
            WHERE cat.owner_id = $1 AND app.status = 'pendiente'
            ORDER BY app.created_at ASC
        `;
        
        const result = await db.query(query, [rescuerId]);
        return result.rows;
    }

    // Obtiene todas las solicitudes (para admin)
    async getAllApplications() {
        const query = `
            SELECT 
                app.*, 
                cat.name as cat_name,
                cat.photos_url as cat_photos,
                u.full_name as applicant_name,
                u.email as applicant_email,
                u.phone as applicant_phone,
                owner.full_name as rescuer_name,
                owner.email as rescuer_email,
                owner.phone as rescuer_phone
            FROM adoption_applications app
            JOIN cats cat ON app.cat_id = cat.id
            JOIN users u ON app.applicant_id = u.id
            LEFT JOIN users owner ON cat.owner_id = owner.id
            WHERE app.status = 'pendiente'
            ORDER BY app.created_at ASC
        `;
        
        const result = await db.query(query);
        return result.rows;
    }

    // Actualiza el estado de una solicitud
    async updateApplicationStatus(applicationId, status) {
        const result = await db.query(
            `UPDATE adoption_applications SET status = $1 WHERE id = $2 RETURNING *`,
            [status, applicationId]
        );
        
        return result.rows.length > 0 ? result.rows[0] : null;
    }

    // Rechaza todas las demás solicitudes pendientes para un gato
    async rejectOtherApplications(catId) {
        await db.query(
            "UPDATE adoption_applications SET status = 'rechazada' WHERE cat_id = $1 AND status = 'pendiente'",
            [catId]
        );
    }

    // Obtiene el ID del gato asociado a una solicitud
    async getCatIdByApplication(applicationId) {
        const result = await db.query(
            "SELECT cat_id FROM adoption_applications WHERE id = $1",
            [applicationId]
        );
        return result.rows[0]?.cat_id;
    }

    // Guarda la evaluación de IA
    async saveAIEvaluation(applicationId, evaluation) {
        const { decision, score, auto_reject_reason, risk_analysis } = evaluation;
        
        await db.query(
            `UPDATE adoption_applications 
             SET ai_decision = $1, ai_score = $2, ai_auto_reject_reason = $3, ai_risk_analysis = $4
             WHERE id = $5`,
            [decision, score, auto_reject_reason, risk_analysis, applicationId]
        );
    }

    // Rechaza automáticamente una solicitud
    async autoRejectApplication(applicationId, reason) {
        await db.query(
            `UPDATE adoption_applications 
             SET status = 'rechazada', ai_auto_reject_reason = $1
             WHERE id = $2`,
            [reason, applicationId]
        );
    }
}

module.exports = new ApplicationService();
