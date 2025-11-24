// Servicio de seguimiento post-adopción
// Maneja la lógica de negocio para tareas de seguimiento

const db = require('../db');

class TrackingService {
    // Crea tarea de seguimiento post-adopción
    async createTask(applicationId, taskType, dueDate, description = null) {
        const result = await db.query(
            `INSERT INTO tracking_tasks (application_id, task_type, due_date, status, description)
             VALUES ($1, $2, $3, 'pendiente', $4)
             RETURNING *`,
            [applicationId, taskType, dueDate, description]
        );
        
        return result.rows[0];
    }

    // Lista tareas pendientes (filtradas por rescatista o todas si es admin)
    async getPendingTasks(userId, isAdmin) {
        // Primero, marcar tareas atrasadas
        await db.query("SELECT mark_overdue_tasks()");

        let query = `
            SELECT *
            FROM v_tracking_tasks_details
            WHERE (status = 'pendiente' OR status = 'atrasada')
        `;

        const params = [];
        
        if (!isAdmin) {
            query += " AND owner_id = $1";
            params.push(userId);
        }

        query += " ORDER BY due_date ASC";

        const result = await db.query(query, params);
        return result.rows;
    }

    // Completa tarea con notas y certificado opcional
    async completeTask(taskId, notes, certificateUrl) {
        const result = await db.query(
            `UPDATE tracking_tasks 
             SET status = 'completada', notes = $1, certificate_url = $2, updated_at = CURRENT_TIMESTAMP
             WHERE id = $3
             RETURNING *`,
            [notes, certificateUrl, taskId]
        );
        
        return result.rows.length > 0 ? result.rows[0] : null;
    }

    // Obtiene ID del gato de una tarea vía la solicitud
    async getCatIdByTask(taskId) {
        const result = await db.query(`
            SELECT c.id FROM cats c
            JOIN adoption_applications a ON c.id = a.cat_id
            JOIN tracking_tasks t ON a.id = t.application_id
            WHERE t.id = $1
        `, [taskId]);
        
        return result.rows[0]?.id;
    }

    // Calcula la fecha de vencimiento basada en la fecha actual y meses a agregar
    calculateDueDate(monthsToAdd) {
        const dueDate = new Date();
        dueDate.setMonth(dueDate.getMonth() + monthsToAdd);
        return dueDate;
    }

    // Actualiza el certificado de una tarea
    async uploadCertificate(taskId, certificateUrl) {
        const result = await db.query(
            `UPDATE tracking_tasks 
             SET certificate_url = $1, updated_at = CURRENT_TIMESTAMP
             WHERE id = $2
             RETURNING *`,
            [certificateUrl, taskId]
        );
        
        return result.rows.length > 0 ? result.rows[0] : null;
    }

    // Verifica que una tarea pertenezca a un rescatista
    async taskBelongsToRescuer(taskId, rescuerId) {
        const result = await db.query(`
            SELECT EXISTS(
                SELECT 1 FROM tracking_tasks tt
                JOIN adoption_applications aa ON tt.application_id = aa.id
                JOIN cats c ON aa.cat_id = c.id
                WHERE tt.id = $1 AND c.owner_id = $2
            ) as belongs
        `, [taskId, rescuerId]);
        
        return result.rows[0]?.belongs || false;
    }
}

module.exports = new TrackingService();
