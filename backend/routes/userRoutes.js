// Rutas de gestión de usuarios
// Define las rutas para administración de usuarios (solo admin)

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// GET /api/admin/users - Obtener todos los usuarios
router.get('/', userController.getAllUsers);

// GET /api/admin/users/stats/by-role - Estadísticas por rol
router.get('/stats/by-role', userController.getUserStatsByRole);

// GET /api/admin/users/:id - Obtener un usuario específico
router.get('/:id', userController.getUserById);

// PUT /api/admin/users/:id/role - Actualizar rol de usuario
router.put('/:id/role', userController.updateUserRole);

module.exports = router;
