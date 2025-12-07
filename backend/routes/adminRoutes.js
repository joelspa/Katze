// Rutas de administración
// Define los endpoints para funciones exclusivas de administradores

const express = require('express');
const router = express.Router();
const catController = require('../controllers/catController');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Todas las rutas de admin requieren autenticación y rol de administrador
router.use(authMiddleware);
router.use(adminMiddleware);

// ========== ESTADÍSTICAS DEL DASHBOARD ==========

// Obtiene estadísticas completas del dashboard admin
router.get('/dashboard/stats', catController.getAdminDashboardStats);

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

// ========== GESTIÓN DE USUARIOS ==========

// Obtiene todos los usuarios
router.get('/users', userController.getAllUsers);

// Crea un nuevo usuario (solo admin puede crear rescatistas)
router.post('/users', userController.createUser);

// Obtiene un usuario específico
router.get('/users/:id', userController.getUserById);

// Actualiza el rol de un usuario
router.put('/users/:id/role', userController.updateUserRole);

// Obtiene estadísticas de usuarios por rol
router.get('/users/stats/by-role', userController.getUserStatsByRole);

// Endpoint de emergencia para ejecutar migraciones
router.post('/run-migrations', async (req, res) => {
    const fs = require('fs');
    const path = require('path');
    const db = require('../db');

    try {
        console.log('🔄 Ejecutando migraciones vía endpoint...');
        const migrationsDir = path.join(__dirname, '../migrations');
        const migrationFiles = fs.readdirSync(migrationsDir)
            .filter(file => file.endsWith('.sql'))
            .sort();
        
        const results = [];

        for (const file of migrationFiles) {
            const migrationPath = path.join(migrationsDir, file);
            const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
            
            try {
                await db.query(migrationSQL);
                results.push({ file, status: 'success' });
            } catch (error) {
                if (error.code === '42701' || error.code === '42P07') {
                    results.push({ file, status: 'skipped (already exists)' });
                } else {
                    results.push({ file, status: 'error', message: error.message });
                }
            }
        }

        res.json({ success: true, results });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
