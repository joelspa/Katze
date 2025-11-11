// Controlador de seguimiento post-adopción
// Gestiona las peticiones HTTP relacionadas con tareas de seguimiento

const trackingService = require('../services/trackingService');
const catService = require('../services/catService');
const ErrorHandler = require('../utils/errorHandler');
const config = require('../config/config');

class TrackingController {
    // Obtiene todas las tareas de seguimiento pendientes o atrasadas
    async getPendingTasks(req, res) {
        try {
            // Valida que el usuario sea rescatista o administrador
            if (![config.USER_ROLES.RESCATISTA, config.USER_ROLES.ADMIN].includes(req.user.role)) {
                return ErrorHandler.forbidden(res);
            }

            const isAdmin = req.user.role === config.USER_ROLES.ADMIN;
            const tasks = await trackingService.getPendingTasks(req.user.id, isAdmin);

            return ErrorHandler.success(res, { tasks });

        } catch (error) {
            return ErrorHandler.serverError(res, 'Error al obtener tareas', error);
        }
    }

    // Marca una tarea de seguimiento como completada
    async completeTask(req, res) {
        try {
            // Valida que el usuario sea rescatista o administrador
            if (![config.USER_ROLES.RESCATISTA, config.USER_ROLES.ADMIN].includes(req.user.role)) {
                return ErrorHandler.forbidden(res);
            }

            const { id: taskId } = req.params;
            const { notes, certificate_url } = req.body;

            // Completa la tarea
            const completedTask = await trackingService.completeTask(taskId, notes, certificate_url);

            if (!completedTask) {
                return ErrorHandler.notFound(res, 'Tarea no encontrada');
            }

            // Si la tarea era de esterilización, actualiza el estado del gato
            if (completedTask.task_type === 'Seguimiento de Esterilización') {
                const catId = await trackingService.getCatIdByTask(taskId);
                if (catId) {
                    await catService.updateSterilizationStatus(catId, 'esterilizado');
                }

                return ErrorHandler.success(
                    res,
                    { task: completedTask },
                    'Tarea de esterilización completada y gato actualizado'
                );
            }

            return ErrorHandler.success(
                res,
                { task: completedTask },
                'Tarea de bienestar completada'
            );

        } catch (error) {
            return ErrorHandler.serverError(res, 'Error al completar tarea', error);
        }
    }
}

module.exports = new TrackingController();