// backend/controllers/educationController.js
const db = require('../db');

// --- PÚBLICO: Obtener todos los artículos ---
// (Para tu app y para que Make.com los lea)
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await db.query("SELECT * FROM educational_posts ORDER BY created_at DESC");
        res.json(posts.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error en el servidor");
    }
};

// --- PÚBLICO: Obtener un artículo ---
exports.getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await db.query("SELECT * FROM educational_posts WHERE id = $1", [id]);

        if (post.rows.length === 0) {
            return res.status(404).json({ message: "Artículo no encontrado" });
        }
        res.json(post.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error en el servidor");
    }
};

// --- ADMIN: Crear un artículo ---
exports.createPost = async (req, res) => {
    const { title, content } = req.body;
    const authorId = req.user.id; // El ID del admin logueado

    if (!title || !content) {
        return res.status(400).json({ message: 'Título y contenido son requeridos.' });
    }

    try {
        const newPost = await db.query(
            `INSERT INTO educational_posts (title, content, author_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
            [title, content, authorId]
        );
        res.status(201).json(newPost.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error en el servidor");
    }
};

// --- ADMIN: Actualizar un artículo ---
exports.updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    try {
        const updatedPost = await db.query(
            `UPDATE educational_posts SET title = $1, content = $2
       WHERE id = $3
       RETURNING *`,
            [title, content, id]
        );

        if (updatedPost.rows.length === 0) {
            return res.status(404).json({ message: "Artículo no encontrado" });
        }
        res.json(updatedPost.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error en el servidor");
    }
};

// --- ADMIN: Borrar un artículo ---
exports.deletePost = async (req, res) => {
    const { id } = req.params;

    try {
        const deleteOp = await db.query("DELETE FROM educational_posts WHERE id = $1 RETURNING *", [id]);

        if (deleteOp.rows.length === 0) {
            return res.status(404).json({ message: "Artículo no encontrado" });
        }
        res.json({ message: "Artículo eliminado con éxito." });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error en el servidor");
    }
};