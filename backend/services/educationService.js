// Servicio del módulo educativo
// Maneja la lógica de negocio para artículos educativos

const db = require('../db');

class EducationService {
    // Obtiene todos los artículos educativos
    async getAllPosts() {
        const result = await db.query("SELECT * FROM educational_posts ORDER BY created_at DESC");
        return result.rows;
    }

    // Obtiene un artículo específico por ID
    async getPostById(postId) {
        const result = await db.query("SELECT * FROM educational_posts WHERE id = $1", [postId]);
        return result.rows.length > 0 ? result.rows[0] : null;
    }

    // Crea un nuevo artículo educativo
    async createPost(title, content, authorId) {
        const result = await db.query(
            `INSERT INTO educational_posts (title, content, author_id)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [title, content, authorId]
        );
        
        return result.rows[0];
    }

    // Actualiza un artículo existente
    async updatePost(postId, title, content) {
        const result = await db.query(
            `UPDATE educational_posts SET title = $1, content = $2
             WHERE id = $3
             RETURNING *`,
            [title, content, postId]
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
