// Servicio de solicitudes de adopción
// Maneja la lógica de negocio para solicitudes de adopción

const db = require('../db');

class ApplicationService {
    // Crea una nueva solicitud de adopción
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

    // Obtiene las solicitudes recibidas por un rescatista
    async getApplicationsByRescuer(rescuerId) {
        const query = `
            SELECT app.*, cat.name as cat_name, u.full_name as applicant_name
            FROM adoption_applications app
            JOIN cats cat ON app.cat_id = cat.id
            JOIN users u ON app.applicant_id = u.id
            WHERE cat.owner_id = $1 AND app.status = 'pendiente'
            ORDER BY app.created_at ASC
        `;
        
        const result = await db.query(query, [rescuerId]);
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
