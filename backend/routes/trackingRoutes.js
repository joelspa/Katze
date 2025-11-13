// Rutas de seguimiento post-adopción
// Gestiona tareas de seguimiento de bienestar y esterilización

const express = require('express');
const router = express.Router();
const trackingController = require('../controllers/trackingController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Obtener todas las tareas de seguimiento pendientes
router.get('/', authMiddleware, trackingController.getPendingTasks);

// Subir certificado para una tarea
router.post('/:taskId/upload-certificate', 
    authMiddleware, 
    upload.single('certificate'), 
    trackingController.uploadCertificate
);

// Marcar una tarea como completada
router.put('/:id/complete', authMiddleware, trackingController.completeTask);

module.exports = router;
