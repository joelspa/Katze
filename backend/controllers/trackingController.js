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

            // Si la tarea era de esterilización, actualiza el estado del gato y crea tarea de bienestar
            if (completedTask.task_type === 'Seguimiento de Esterilización') {
                const catId = await trackingService.getCatIdByTask(taskId);
                if (catId) {
                    // Actualiza el estado del gato a esterilizado
                    await catService.updateSterilizationStatus(catId, 'esterilizado');
                    
                    // Ahora que está esterilizado, crea la tarea de seguimiento de bienestar
                    const dueDateBienestar = trackingService.calculateDueDate(
                        config.TRACKING_PERIODS.BIENESTAR_MONTHS
                    );
                    await trackingService.createTask(
                        completedTask.application_id,
                        'Seguimiento de Bienestar',
                        dueDateBienestar,
                        'Verificar que el gato se haya adaptado bien después de la esterilización y esté recibiendo los cuidados necesarios.'
                    );
                }

                return ErrorHandler.success(
                    res,
                    { task: completedTask },
                    'Tarea de esterilización completada. Se creó automáticamente la tarea de seguimiento de bienestar.'
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

    // Sube un certificado para una tarea
    async uploadCertificate(req, res) {
        try {
            // Valida que el usuario sea rescatista o administrador
            if (![config.USER_ROLES.RESCATISTA, config.USER_ROLES.ADMIN].includes(req.user.role)) {
                return ErrorHandler.forbidden(res, 'Solo rescatistas y administradores pueden subir certificados');
            }

            const { taskId } = req.params;

            // Verificar que se subió un archivo
            if (!req.file) {
                return ErrorHandler.badRequest(res, 'No se recibió ningún archivo');
            }

            // Si no es admin, verificar que la tarea pertenezca al rescatista
            if (req.user.role !== config.USER_ROLES.ADMIN) {
                const belongs = await trackingService.taskBelongsToRescuer(taskId, req.user.userId);
                if (!belongs) {
                    return ErrorHandler.forbidden(res, 'No tienes permiso para subir certificados a esta tarea');
                }
            }

            // Construir URL del certificado (ruta relativa)
            const certificateUrl = `/uploads/certificates/${req.file.filename}`;

            // Actualizar la tarea con la URL del certificado
            const updatedTask = await trackingService.uploadCertificate(taskId, certificateUrl);

            if (!updatedTask) {
                return ErrorHandler.notFound(res, 'Tarea no encontrada');
            }

            return ErrorHandler.success(
                res,
                {
                    task: updatedTask,
                    file: {
                        filename: req.file.filename,
                        size: req.file.size,
                        mimetype: req.file.mimetype,
                        url: certificateUrl
                    }
                },
                'Certificado subido correctamente'
            );

        } catch (error) {
            return ErrorHandler.serverError(res, 'Error al subir certificado', error);
        }
    }
}

module.exports = new TrackingController();