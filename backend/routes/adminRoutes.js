// Rutas de administración
// Define los endpoints para funciones exclusivas de administradores

const express = require('express');
const router = express.Router();
const catController = require('../controllers/catController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Todas las rutas de admin requieren autenticación y rol de administrador
router.use(authMiddleware);
router.use(adminMiddleware);

// ========== GESTIÓN DE PUBLICACIONES DE GATOS ==========

// Obtiene TODAS las publicaciones (incluidas pendientes)
router.get('/cats', catController.getAllCatsAdmin);

// Obtiene un gato específico sin restricción de aprobación
router.get('/cats/:id', catController.getCatByIdAdmin);

// Actualiza el estado de aprobación (aprobar/rechazar)
router.put('/cats/:id/approval', catController.updateCatApproval);

// Edita los detalles de una publicación
router.put('/cats/:id/edit', catController.editCat);

// Elimina una publicación
router.delete('/cats/:id', catController.deleteCat);

module.exports = router;
