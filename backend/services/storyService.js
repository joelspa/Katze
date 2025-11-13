// Servicio de historias de rescate
// Maneja la lógica de negocio para historias

const db = require('../db');

class StoryService {
    // Obtiene todas las historias con información del autor
    async getAllStories() {
        const result = await db.query(
            `SELECT 
                s.*,
                u.full_name as author_name,
                COALESCE(s.event_date, s.created_at) as display_date
             FROM stories s
             LEFT JOIN users u ON s.author_id = u.id
             ORDER BY COALESCE(s.event_date, s.created_at) DESC`
        );
        return result.rows;
    }

    // Obtiene una historia específica por ID con información del autor
    async getStoryById(storyId) {
        const result = await db.query(
            `SELECT 
                s.*,
                u.full_name as author_name,
                COALESCE(s.event_date, s.created_at) as display_date
             FROM stories s
             LEFT JOIN users u ON s.author_id = u.id
             WHERE s.id = $1`,
            [storyId]
        );
        return result.rows.length > 0 ? result.rows[0] : null;
    }

    // Crea una nueva historia
    async createStory(title, content, authorId, eventDate = null) {
        const result = await db.query(
            `INSERT INTO stories (title, content, author_id, event_date)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [title, content, authorId, eventDate]
        );
        
        return result.rows[0];
    }

    // Actualiza una historia existente
    async updateStory(storyId, title, content, eventDate = null) {
        const result = await db.query(
            `UPDATE stories 
             SET title = $1, content = $2, event_date = $3 
             WHERE id = $4 
             RETURNING *`,
            [title, content, eventDate, storyId]
        );
        
        return result.rows.length > 0 ? result.rows[0] : null;
    }

    // Elimina una historia
    async deleteStory(storyId) {
        const result = await db.query(
            "DELETE FROM stories WHERE id = $1 RETURNING *",
            [storyId]
        );
        
        return result.rows.length > 0;
    }
}

module.exports = new StoryService();
