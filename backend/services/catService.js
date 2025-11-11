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
}

module.exports = new CatService();
