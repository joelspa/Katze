// Servicio del módulo educativo
// Maneja la lógica de negocio para artículos educativos

const db = require('../db');

class EducationService {
    // Obtiene todos los artículos educativos con información del autor
    async getAllPosts() {
        const result = await db.query(
            `SELECT 
                ep.*,
                u.full_name as author_name,
                COALESCE(ep.event_date, ep.created_at) as display_date
             FROM educational_posts ep
             LEFT JOIN users u ON ep.author_id = u.id
             ORDER BY COALESCE(ep.event_date, ep.created_at) DESC`
        );
        return result.rows;
    }

    // Obtiene un artículo específico por ID con información del autor
    async getPostById(postId) {
        const result = await db.query(
            `SELECT 
                ep.*,
                u.full_name as author_name,
                COALESCE(ep.event_date, ep.created_at) as display_date
             FROM educational_posts ep
             LEFT JOIN users u ON ep.author_id = u.id
             WHERE ep.id = $1`,
            [postId]
        );
        return result.rows.length > 0 ? result.rows[0] : null;
    }

    // Crea un nuevo artículo educativo
    async createPost(title, content, authorId, eventDate = null) {
        const result = await db.query(
            `INSERT INTO educational_posts (title, content, author_id, event_date)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [title, content, authorId, eventDate]
        );
        
        return result.rows[0];
    }

    // Actualiza un artículo existente
    async updatePost(postId, title, content, eventDate = null) {
        const result = await db.query(
            `UPDATE educational_posts 
             SET title = $1, content = $2, event_date = $3
             WHERE id = $4
             RETURNING *`,
            [title, content, eventDate, postId]
        );
        
        return result.rows.length > 0 ? result.rows[0] : null;
    }

    // Elimina un artículo
    async deletePost(postId) {
        const result = await db.query(
            "DELETE FROM educational_posts WHERE id = $1 RETURNING *",
            [postId]
        );
        
        return result.rows.length > 0;
    }
}

module.exports = new EducationService();
