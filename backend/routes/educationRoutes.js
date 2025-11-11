// Rutas del módulo educativo
// Gestiona artículos educativos sobre cuidado de gatos

const express = require('express');
const router = express.Router();
const educationController = require('../controllers/educationController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Obtener todos los artículos (público)
router.get('/', educationController.getAllPosts);

// Obtener un artículo específico (público)
router.get('/:id', educationController.getPostById);

// Crear nuevo artículo (solo administradores)
router.post('/', authMiddleware, adminMiddleware, educationController.createPost);

// Actualizar artículo existente (solo administradores)
router.put('/:id', authMiddleware, adminMiddleware, educationController.updatePost);

// Eliminar artículo (solo administradores)
router.delete('/:id', authMiddleware, adminMiddleware, educationController.deletePost);

module.exports = router;
