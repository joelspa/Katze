// Rutas de administración
// Define los endpoints para funciones exclusivas de administradores

const express = require('express');
const router = express.Router();
const catController = require('../controllers/catController');
const userController = require('../controllers/userController');
const applicationController = require('../controllers/applicationController');
const csvDatasetService = require('../services/csvDatasetService');
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

// Elimina un usuario
router.delete('/users/:id', userController.deleteUser);

// Obtiene estadísticas de usuarios por rol
router.get('/users/stats/by-role', userController.getUserStatsByRole);

// ========== GESTIÓN DE SOLICITUDES DE ADOPCIÓN ==========

// Obtiene TODAS las solicitudes de adopción del sistema
router.get('/applications', applicationController.getReceivedApplications);

// ========== GESTIÓN DE DATASETS CSV ==========

// Regenera todos los archivos CSV en Firebase Storage
router.post('/datasets/regenerate', async (req, res) => {
    try {
        console.log('🔄 Admin solicitó regeneración de CSVs...');
        await csvDatasetService.updateAllDatasets();
        
        res.json({
            success: true,
            message: 'Datasets CSV regenerados exitosamente',
            data: {
                files: ['users.csv', 'cats.csv', 'adoption_applications.csv', 'tracking_tasks.csv'],
                location: 'Firebase Storage > datasets/'
            }
        });
    } catch (error) {
        console.error('❌ Error regenerando CSVs:', error);
        res.status(500).json({
            success: false,
            message: 'Error al regenerar datasets',
            error: error.message
        });
    }
});

// Obtiene las URLs de descarga de los CSVs
router.get('/datasets/download-urls', async (req, res) => {
    try {
        const bucketName = 'katze-app.firebasestorage.app';
        const baseUrl = `https://storage.googleapis.com/${bucketName}/datasets`;
        
        const downloadUrls = {
            users: `${baseUrl}/users.csv`,
            cats: `${baseUrl}/cats.csv`,
            applications: `${baseUrl}/adoption_applications.csv`,
            tracking: `${baseUrl}/tracking_tasks.csv`
        };

        res.json({
            success: true,
            message: 'URLs de descarga disponibles',
            data: {
                downloads: downloadUrls,
                note: 'Click derecho > Guardar enlace como... para descargar'
            }
        });
    } catch (error) {
        console.error('❌ Error obteniendo URLs:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener URLs de descarga',
            error: error.message
        });
    }
});

module.exports = router;
