// Rutas de estadísticas
// Define las rutas para el módulo de estadísticas del dashboard

const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/statistics - Obtiene todas las estadísticas (requiere auth)
router.get('/', authMiddleware, statisticsController.getStatistics);

module.exports = router;
