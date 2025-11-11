// Controlador de solicitudes de adopción
// Gestiona las peticiones HTTP relacionadas con solicitudes de adopción

const applicationService = require('../services/applicationService');
const catService = require('../services/catService');
const trackingService = require('../services/trackingService');
const Validator = require('../utils/validator');
const ErrorHandler = require('../utils/errorHandler');
const config = require('../config/config');

class ApplicationController {
    // Crea una nueva solicitud de adopción para un gato específico
    async applyForCat(req, res) {
        try {
            // Verifica que el usuario sea adoptante
            if (req.user.role !== config.USER_ROLES.ADOPTANTE) {
                return ErrorHandler.forbidden(res, 'Solo los adoptantes pueden enviar solicitudes');
            }

            const applicantId = req.user.id;
            const { id: catId } = req.params;
            const { form_responses } = req.body;

            // Valida que el formulario no esté vacío
            if (!form_responses) {
                return ErrorHandler.badRequest(res, 'El formulario de solicitud no puede estar vacío');
            }

            // Verifica que el gato exista y esté disponible
            const cat = await catService.getCatById(catId);
            if (!cat) {
                return ErrorHandler.notFound(res, 'Gato no encontrado');
            }

            if (cat.adoption_status !== config.ADOPTION_STATUS.EN_ADOPCION) {
                return ErrorHandler.badRequest(res, 'Este gato ya no está en adopción');
            }

            // Crea la solicitud
            const newApplication = await applicationService.createApplication(
                applicantId,
                catId,
                form_responses
            );

            return ErrorHandler.created(res, { application: newApplication }, 'Solicitud enviada con éxito');

        } catch (error) {
            return ErrorHandler.serverError(res, 'Error al enviar solicitud', error);
        }
    }

    // Obtiene todas las solicitudes pendientes recibidas por un rescatista
    async getReceivedApplications(req, res) {
        try {
            // Verifica que el usuario sea rescatista
            if (req.user.role !== config.USER_ROLES.RESCATISTA) {
                return ErrorHandler.forbidden(res);
            }

            const applications = await applicationService.getApplicationsByRescuer(req.user.id);

            return ErrorHandler.success(res, { applications });

        } catch (error) {
            return ErrorHandler.serverError(res, 'Error al obtener solicitudes', error);
        }
    }

    // Actualiza el estado de una solicitud (aprobar o rechazar)
    async updateApplicationStatus(req, res) {
        try {
            // Valida que el usuario sea rescatista o administrador
            if (![config.USER_ROLES.RESCATISTA, config.USER_ROLES.ADMIN].includes(req.user.role)) {
                return ErrorHandler.forbidden(res);
            }

            const { id: applicationId } = req.params;
            const { status } = req.body;

            // Valida el nuevo estado
            if (!Validator.isValidApplicationStatus(status)) {
                return ErrorHandler.badRequest(res, 'Estado no válido');
            }

            // Actualiza el estado de la solicitud
            const application = await applicationService.updateApplicationStatus(applicationId, status);
            
            if (!application) {
                return ErrorHandler.notFound(res, 'Solicitud no encontrada');
            }

            const catId = application.cat_id;

            // Si la solicitud fue aprobada, procesa la adopción
            if (status === config.APPLICATION_STATUS.APROBADA) {
                await this._processApprovedApplication(applicationId, catId);
            }

            return ErrorHandler.success(
                res,
                { application },
                `Solicitud ${status} con éxito. Se crearon las tareas de seguimiento.`
            );

        } catch (error) {
            return ErrorHandler.serverError(res, 'Error al actualizar solicitud', error);
        }
    }

    // Procesa una solicitud aprobada (método privado)
    async _processApprovedApplication(applicationId, catId) {
        // Marca el gato como adoptado
        await catService.updateAdoptionStatus(catId, config.ADOPTION_STATUS.ADOPTADO);

        // Obtiene el estado de esterilización del gato
        const sterilizationStatus = await catService.getCatSterilizationStatus(catId);

        // Crea tarea de seguimiento de bienestar (siempre)
        const dueDateBienestar = trackingService.calculateDueDate(
            config.TRACKING_PERIODS.BIENESTAR_MONTHS
        );
        await trackingService.createTask(
            applicationId,
            'Seguimiento de Bienestar',
            dueDateBienestar
        );

        // Crea tarea de esterilización solo si es necesario
        if (sterilizationStatus?.trim() === 'pendiente') {
            const dueDateEsterilizacion = trackingService.calculateDueDate(
                config.TRACKING_PERIODS.ESTERILIZACION_MONTHS
            );
            await trackingService.createTask(
                applicationId,
                'Seguimiento de Esterilización',
                dueDateEsterilizacion
            );
        }

        // Rechaza otras solicitudes pendientes para el mismo gato
        await applicationService.rejectOtherApplications(catId);
    }
}

module.exports = new ApplicationController();