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



    // Obtiene las solicitudes recibidas por un rescatista (solo pending_review, ordenadas por score)
    async getApplicationsByRescuer(rescuerId) {
        const query = `
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
        `;
        
        const result = await db.query(query, [rescuerId]);
        return result.rows;
    }

    // Obtiene todas las solicitudes (para admin) - prioriza pending_review ordenadas por score
    async getAllApplications() {
        const query = `
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
                u.phone as applicant_phone,
                owner.full_name as rescuer_name,
                owner.email as rescuer_email,
                owner.phone as rescuer_phone
            FROM adoption_applications app
            JOIN cats cat ON app.cat_id = cat.id
            JOIN users u ON app.applicant_id = u.id
            LEFT JOIN users owner ON cat.owner_id = owner.id
            WHERE app.status IN ('revision_pendiente', 'pendiente', 'procesando')
            ORDER BY 
              CASE 
                WHEN app.status = 'revision_pendiente' THEN 1
                WHEN app.status = 'procesando' THEN 2
                ELSE 3
              END,
              app.ai_score DESC NULLS LAST,
              app.created_at ASC
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


}

module.exports = new ApplicationService();
