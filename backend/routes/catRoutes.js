// Rutas de gestión de gatos
// Maneja publicaciones y consultas de gatos disponibles para adopción

const express = require('express');
const router = express.Router();
const catController = require('../controllers/catController');
const authMiddleware = require('../middleware/authMiddleware');
const moderationMiddleware = require('../middleware/moderationMiddleware');

// Crear nueva publicación de gato (requiere autenticación y moderación)
router.post('/', authMiddleware, moderationMiddleware, catController.createCat);

// Obtener todos los gatos disponibles (público)
router.get('/', catController.getAllCats);

// Obtener detalles de un gato específico (público)
router.get('/:id', catController.getCatById);

// Obtener información de contacto del rescatista (requiere autenticación y solicitud enviada)
router.get('/:id/owner-contact', authMiddleware, catController.getOwnerContact);

module.exports = router;
