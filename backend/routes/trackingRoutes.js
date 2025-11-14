// Rutas de seguimiento post-adopción
// Gestiona tareas de seguimiento de bienestar y esterilización

const express = require('express');
const router = express.Router();
const trackingController = require('../controllers/trackingController');
const authMiddleware = require('../middleware/authMiddleware');

// Obtener todas las tareas de seguimiento pendientes
router.get('/', authMiddleware, trackingController.getPendingTasks);

// Marcar una tarea como completada (con certificado opcional desde Firebase)
router.put('/:id/complete', authMiddleware, trackingController.completeTask);

module.exports = router;
