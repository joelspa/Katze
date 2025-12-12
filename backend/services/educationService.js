// Servicio del módulo educativo
// Maneja la lógica de negocio para artículos educativos

const db = require('../config/db');

class EducationService {
    // Lista todos los posts educativos con info del autor
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

    // Busca un post por ID con info del autor
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

    // Crea post educativo con tipo, categoría e imagen
    async createPost(title, content, authorId, eventDate = null, contentType = 'articulo', category = 'general', imageUrl = null) {
        const result = await db.query(
            `INSERT INTO educational_posts (title, content, author_id, event_date, content_type, category, image_url)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [title, content, authorId, eventDate, contentType, category, imageUrl]
        );

        return result.rows[0];
    }

    // Actualiza post existente con campos opcionales
    async updatePost(postId, title, content, eventDate = null, contentType = null, category = null, imageUrl = null, createdAt = null) {
        // Construir query dinámico solo con campos que se envían
        let query = 'UPDATE educational_posts SET title = $1, content = $2';
        const params = [title, content];
        let paramIndex = 3;

        if (eventDate !== undefined) {
            query += `, event_date = $${paramIndex}`;
            params.push(eventDate);
            paramIndex++;
        }

        if (contentType) {
            query += `, content_type = $${paramIndex}`;
            params.push(contentType);
            paramIndex++;
        }

        if (category) {
            query += `, category = $${paramIndex}`;
            params.push(category);
            paramIndex++;
        }

        if (imageUrl !== undefined) {
            query += `, image_url = $${paramIndex}`;
            params.push(imageUrl);
            paramIndex++;
        }

        if (createdAt !== undefined) {
            query += `, created_at = $${paramIndex}`;
            params.push(createdAt);
            paramIndex++;
        }

        query += ` WHERE id = $${paramIndex} RETURNING *`;
        params.push(postId);

        const result = await db.query(query, params);

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
