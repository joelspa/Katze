// Rutas de solicitudes de adopción
// Gestiona la creación y administración de solicitudes de adopción

const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const authMiddleware = require('../middleware/authMiddleware');

// Enviar solicitud de adopción para un gato específico (requiere autenticación)
router.post('/cats/:id/adopt', authMiddleware, applicationController.applyForCat);
router.post('/cats/:id/apply', authMiddleware, applicationController.applyForCat);

// Ver solicitudes recibidas (solo rescatistas)
router.get('/received', authMiddleware, applicationController.getReceivedApplications);

// Actualizar estado de una solicitud (aprobar/rechazar)
router.put('/:id/status', authMiddleware, applicationController.updateApplicationStatus);

// Endpoint de mantenimiento para corregir evaluaciones faltantes (Solo Admin)
router.post('/fix-evaluations', authMiddleware, (req, res) => applicationController.fixMissingEvaluations(req, res));

module.exports = router;
