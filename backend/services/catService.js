// Servicio de gestión de gatos
// Maneja la lógica de negocio para operaciones con gatos

const db = require('../db');

class CatService {
    // Crea una nueva publicación de gato
    async createCat(catData) {
        const { name, description, age, health_status, sterilization_status, photos_url, owner_id, approval_status } = catData;
        
        const photosJson = JSON.stringify(photos_url || []);
        
        const result = await db.query(
            `INSERT INTO cats (name, description, age, health_status, sterilization_status, photos_url, owner_id, approval_status)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING *`,
            [name, description, age, health_status, sterilization_status, photosJson, owner_id, approval_status]
        );
        
        return result.rows[0];
    }

    // Obtiene todos los gatos aprobados y disponibles para adopción
    async getAllAvailableCats() {
        const query = `
            SELECT * FROM cats 
            WHERE adoption_status = 'en_adopcion' 
            AND approval_status = 'aprobado' 
            ORDER BY created_at DESC
        `;
        const result = await db.query(query);
        return result.rows;
    }

    // Obtiene un gato específico por ID (solo si está aprobado)
    async getCatById(catId) {
        const result = await db.query(
            "SELECT * FROM cats WHERE id = $1 AND approval_status = 'aprobado'",
            [catId]
        );
        return result.rows.length > 0 ? result.rows[0] : null;
    }

    // Actualiza el estado de adopción de un gato
    async updateAdoptionStatus(catId, status) {
        const result = await db.query(
            "UPDATE cats SET adoption_status = $1 WHERE id = $2 RETURNING *",
            [status, catId]
        );
        return result.rows[0];
    }

    // Obtiene el estado de esterilización de un gato
    async getCatSterilizationStatus(catId) {
        const result = await db.query(
            "SELECT sterilization_status FROM cats WHERE id = $1",
            [catId]
        );
        return result.rows[0]?.sterilization_status;
    }

    // Actualiza el estado de esterilización de un gato
    async updateSterilizationStatus(catId, status) {
        await db.query(
            "UPDATE cats SET sterilization_status = $1 WHERE id = $2",
            [status, catId]
        );
    }

    // ========== FUNCIONES DE ADMINISTRACIÓN ==========

    // Obtiene TODAS las publicaciones (incluidas las pendientes) para el admin
    async getAllCatsForAdmin() {
        const query = `
            SELECT c.*, u.full_name as owner_name, u.email as owner_email
            FROM cats c
            LEFT JOIN users u ON c.owner_id = u.id
            ORDER BY 
                CASE c.approval_status
                    WHEN 'pendiente' THEN 1
                    WHEN 'aprobado' THEN 2
                    WHEN 'rechazado' THEN 3
                END,
                c.created_at DESC
        `;
        const result = await db.query(query);
        return result.rows;
    }

    // Actualiza el estado de aprobación de un gato
    async updateApprovalStatus(catId, status) {
        const result = await db.query(
            "UPDATE cats SET approval_status = $1 WHERE id = $2 RETURNING *",
            [status, catId]
        );
        return result.rows.length > 0 ? result.rows[0] : null;
    }

    // Obtiene un gato por ID sin restricción de aprobación (para admin)
    async getCatByIdForAdmin(catId) {
        const result = await db.query(
            "SELECT * FROM cats WHERE id = $1",
            [catId]
        );
        return result.rows.length > 0 ? result.rows[0] : null;
    }

    // Actualiza los detalles de un gato (para admin)
    async updateCatDetails(catId, catData) {
        const { name, description, age, health_status, sterilization_status } = catData;
        
        const result = await db.query(
            `UPDATE cats SET 
                name = $1, 
                description = $2, 
                age = $3, 
                health_status = $4,
                sterilization_status = $5
            WHERE id = $6 
            RETURNING *`,
            [name, description, age, health_status, sterilization_status, catId]
        );
        
        return result.rows.length > 0 ? result.rows[0] : null;
    }

    // Elimina un gato (para admin)
    async deleteCat(catId) {
        const result = await db.query(
            "DELETE FROM cats WHERE id = $1 RETURNING *",
            [catId]
        );
        return result.rows.length > 0 ? result.rows[0] : null;
    }
}

module.exports = new CatService();