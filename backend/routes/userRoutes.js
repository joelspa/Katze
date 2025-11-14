// Rutas de gestión de usuarios
// Define las rutas para administración de usuarios (solo admin) y perfil de usuario

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// GET /api/users/profile - Ver perfil propio (cualquier usuario autenticado)
router.get('/profile', (req, res) => userController.getProfile(req, res));

// PUT /api/users/profile - Actualizar perfil propio (cualquier usuario autenticado)
router.put('/profile', (req, res) => userController.updateProfile(req, res));

// GET /api/users - Obtener todos los usuarios (solo admin)
router.get('/', (req, res) => userController.getAllUsers(req, res));

// GET /api/users/stats/by-role - Estadísticas por rol (solo admin)
router.get('/stats/by-role', (req, res) => userController.getUserStatsByRole(req, res));

// GET /api/users/:id - Obtener un usuario específico (solo admin)
router.get('/:id', (req, res) => userController.getUserById(req, res));

// PUT /api/users/:id/role - Actualizar rol de usuario (solo admin)
router.put('/:id/role', (req, res) => userController.updateUserRole(req, res));

module.exports = router;
