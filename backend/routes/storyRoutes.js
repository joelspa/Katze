// Rutas de historias de rescate
// Gestiona historias inspiradoras de la comunidad

const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');
const authMiddleware = require('../middleware/authMiddleware');
const moderationMiddleware = require('../middleware/moderationMiddleware');

// Obtener todas las historias (público)
router.get('/', storyController.getAllStories);

// Obtener una historia específica (público)
router.get('/:id', storyController.getStoryById);

// Crear nueva historia (rescatistas y admin con moderación)
router.post('/', authMiddleware, moderationMiddleware, storyController.createStory);

// Actualizar historia existente (rescatistas y admin)
router.put('/:id', authMiddleware, storyController.updateStory);

// Eliminar historia (rescatistas y admin)
router.delete('/:id', authMiddleware, storyController.deleteStory);

module.exports = router;
