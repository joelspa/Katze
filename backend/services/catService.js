// Servicio de gestión de gatos
// Maneja la lógica de negocio para operaciones con gatos

const db = require('../db');

class CatService {
    // Helper: Parsear photos_url de PostgreSQL array a JavaScript array
    _parsePhotosUrl(cat) {
        if (!cat) return cat;
        
        // Si photos_url es un string (formato PostgreSQL {url1,url2})
        if (typeof cat.photos_url === 'string') {
            // Remover llaves y dividir por comas
            const cleaned = cat.photos_url.replace(/^\{|\}$/g, '');
            cat.photos_url = cleaned ? cleaned.split(',') : [];
        }
        
        // Asegurar que sea un array
        if (!Array.isArray(cat.photos_url)) {
            cat.photos_url = [];
        }
        
        return cat;
    }
    // Crea una nueva publicación de gato
    async createCat(catData) {
        const { name, description, age, health_status, sterilization_status, photos_url, owner_id, approval_status, story, breed, living_space_requirement } = catData;
        
        // PostgreSQL maneja arrays nativamente, no necesitamos JSON.stringify
        const photosArray = photos_url || [];
        
        const result = await db.query(
            `INSERT INTO cats (name, description, age, health_status, sterilization_status, photos_url, owner_id, approval_status, story, breed, living_space_requirement)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
             RETURNING *`,
            [name, description, age, health_status, sterilization_status, photosArray, owner_id, approval_status, story, breed || 'Mestizo', living_space_requirement || 'cualquiera']
        );
        
        return this._parsePhotosUrl(result.rows[0]);
    }

    // Obtiene gatos aprobados y disponibles con filtros opcionales (esterilización, edad, tipo de vivienda)
    async getAllAvailableCats(filters = {}) {
        let query = `
            SELECT * FROM cats 
            WHERE adoption_status = 'disponible' 
            AND approval_status = 'aprobado'
        `;
        
        const params = [];
        let paramIndex = 1;

        // Filtro por estado de esterilización
        if (filters.sterilization_status && filters.sterilization_status !== 'todos') {
            query += ` AND sterilization_status = $${paramIndex}`;
            params.push(filters.sterilization_status);
            paramIndex++;
        }

        // Filtro por edad (categorías: cachorro, joven, adulto, senior)
        if (filters.age && filters.age !== 'todos') {
            const ageCategory = filters.age.toLowerCase();
            switch (ageCategory) {
                case 'cachorro':
                    query += ` AND age <= 1`;
                    break;
                case 'joven':
                    query += ` AND age > 1 AND age <= 3`;
                    break;
                case 'adulto':
                    query += ` AND age > 3 AND age <= 7`;
                    break;
                case 'senior':
                    query += ` AND age > 7`;
                    break;
            }
        }

        // Filtro por tipo de vivienda requerida
        if (filters.living_space && filters.living_space !== 'todos') {
            query += ` AND living_space_requirement = $${paramIndex}`;
            params.push(filters.living_space);
            paramIndex++;
        }

        // IMPORTANTE: Ordenar por fecha de creación ascendente (más antiguos primero)
        // Esto da mayor visibilidad y prioridad a los gatos que llevan más tiempo esperando adopción
        // Los gatos publicados hace más tiempo aparecen primero en el catálogo y página principal
        query += ` ORDER BY created_at ASC`;
        
        const result = await db.query(query, params);
        return result.rows.map(cat => this._parsePhotosUrl(cat));
    }

    // Obtiene un gato por ID si está aprobado
    async getCatById(catId) {
        const result = await db.query(
            "SELECT * FROM cats WHERE id = $1 AND approval_status = 'aprobado'",
            [catId]
        );
        return result.rows.length > 0 ? this._parsePhotosUrl(result.rows[0]) : null;
    }

    // Cambia el estado de adopción (en_adopcion, adoptado, etc)
    async updateAdoptionStatus(catId, status) {
        const result = await db.query(
            "UPDATE cats SET adoption_status = $1 WHERE id = $2 RETURNING *",
            [status, catId]
        );
        return this._parsePhotosUrl(result.rows[0]);
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
                c.created_at ASC
        `;
        const result = await db.query(query);
        return result.rows.map(cat => this._parsePhotosUrl(cat));
    }

    // Actualiza el estado de aprobación de un gato
    async updateApprovalStatus(catId, status) {
        const result = await db.query(
            "UPDATE cats SET approval_status = $1 WHERE id = $2 RETURNING *",
            [status, catId]
        );
        return result.rows.length > 0 ? this._parsePhotosUrl(result.rows[0]) : null;
    }

    // Obtiene un gato por ID sin restricción de aprobación (para admin)
    async getCatByIdForAdmin(catId) {
        const result = await db.query(
            "SELECT * FROM cats WHERE id = $1",
            [catId]
        );
        return result.rows.length > 0 ? this._parsePhotosUrl(result.rows[0]) : null;
    }

    // Actualiza los detalles de un gato (para admin)
    async updateCatDetails(catId, catData) {
        const { name, description, age, health_status, sterilization_status, story } = catData;
        
        const result = await db.query(
            `UPDATE cats SET 
                name = $1, 
                description = $2, 
                age = $3, 
                health_status = $4,
                sterilization_status = $5,
                story = $6
            WHERE id = $7 
            RETURNING *`,
            [name, description, age, health_status, sterilization_status, story, catId]
        );
        
        return result.rows.length > 0 ? this._parsePhotosUrl(result.rows[0]) : null;
    }

    // Elimina un gato (para admin)
    async deleteCat(catId) {
        const result = await db.query(
            "DELETE FROM cats WHERE id = $1 RETURNING *",
            [catId]
        );
        return result.rows.length > 0 ? this._parsePhotosUrl(result.rows[0]) : null;
    }

    // Obtiene información de contacto del rescatista si el usuario tiene solicitud
    async getOwnerContactInfo(catId, userId) {
        // Verifica que el usuario tenga una solicitud para este gato
        const applicationCheck = await db.query(
            `SELECT id FROM adoption_applications 
             WHERE cat_id = $1 AND applicant_id = $2`,
            [catId, userId]
        );

        if (applicationCheck.rows.length === 0) {
            return null; // Usuario no tiene solicitud para este gato
        }

        // Obtiene la información de contacto del rescatista
        const result = await db.query(
            `SELECT u.full_name, u.email, u.phone
             FROM cats c
             JOIN users u ON c.owner_id = u.id
             WHERE c.id = $1`,
            [catId]
        );

        return result.rows.length > 0 ? result.rows[0] : null;
    }
}

module.exports = new CatService();