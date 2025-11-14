/**
 * Controlador de Solicitudes de Adopción
 * Maneja todas las peticiones HTTP relacionadas con las solicitudes de adopción de gatos.
 * 
 * Responsabilidades:
 * - Crear nuevas solicitudes de adopción
 * - Obtener solicitudes para rescatistas y administradores
 * - Actualizar estado de solicitudes (aprobar/rechazar)
 * - Procesar solicitudes aprobadas (crear tareas de seguimiento, actualizar estado del gato)
 */

const applicationService = require('../services/applicationService');
const catService = require('../services/catService');
const trackingService = require('../services/trackingService');
const Validator = require('../utils/validator');
const ErrorHandler = require('../utils/errorHandler');
const config = require('../config/config');

/**
 * Procesa una solicitud de adopción aprobada.
 * Crea las tareas de seguimiento necesarias y actualiza el estado del gato cuando se aprueba una adopción.
 * 
 * @param {number} applicationId - ID de la solicitud aprobada
 * @param {number} catId - ID del gato adoptado
 * @returns {Promise<void>}
 * @throws {Error} Si falla algún paso del proceso de aprobación
 */
async function processApprovedApplication(applicationId, catId) {
    try {
        console.log('[processApprovedApplication] Starting:', { applicationId, catId });

        // Paso 1: Marcar el gato como adoptado en la base de datos
        try {
            console.log('[processApprovedApplication] Actualizando estado de adopción del gato...');
            await catService.updateAdoptionStatus(catId, config.ADOPTION_STATUS.ADOPTADO);
            console.log('[processApprovedApplication] Gato marcado como adoptado exitosamente');
        } catch (error) {
            console.error('[processApprovedApplication] Error al actualizar estado de adopción:', error);
            throw new Error(`Error al actualizar estado de adopción del gato $1{catId}: $1{error.message}`);
        }

        // Paso 2: Obtener información del gato para determinar tareas de seguimiento del gato para determinar tareas de seguimiento
        let cat, sterilizationStatus;
        try {
            console.log('[processApprovedApplication] Obteniendo información del gato...');
            cat = await catService.getCatById(catId);
            if (!cat) {
                throw new Error(`Gato no encontrado: $1{catId}`);
            }
            sterilizationStatus = cat.sterilization_status?.trim();
            console.log('[processApprovedApplication] Estado de esterilización:', sterilizationStatus);
        } catch (error) {
            console.error('[processApprovedApplication] Error al obtener información del gato:', error);
            throw new Error(`Error al obtener información del gato $1{catId}: $1{error.message}`);
        }

        // Paso 3: Crear tarea de seguimiento de bienestar SOLO para gatos ya esterilizados o no aplicables
        // Los gatos pendientes de esterilización recibirán seguimiento de bienestar después de esterilizarse
        if (sterilizationStatus === 'esterilizado' || sterilizationStatus === 'no_aplica') {
            try {
                console.log('[processApprovedApplication] Creando tarea de seguimiento de bienestar...');
                const dueDateBienestar = trackingService.calculateDueDate(
                    config.TRACKING_PERIODS.BIENESTAR_MONTHS
                );
                await trackingService.createTask(
                    applicationId,
                    'Seguimiento de Bienestar',
                    dueDateBienestar,
                    'Verificar que el gato se haya adaptado bien a su nuevo hogar y esté recibiendo los cuidados necesarios.'
                );
                console.log('[processApprovedApplication] Tarea de bienestar creada exitosamente');
            } catch (error) {
                console.error('[processApprovedApplication] Error al crear tarea de bienestar:', error);
                throw new Error(`Error al crear tarea de bienestar para solicitud $1{applicationId}: $1{error.message}`);
            }
        } else {
            console.log('[processApprovedApplication] Tarea de bienestar no creada aún (esperando esterilización)');
        }

        // Paso 4: Crear tarea de seguimiento de esterilización SOLO si está pendiente
        if (sterilizationStatus === 'pendiente') {
            try {
                console.log('[processApprovedApplication] Creando tarea de seguimiento de esterilización...');
                const dueDateEsterilizacion = trackingService.calculateDueDate(
                    config.TRACKING_PERIODS.ESTERILIZACION_MONTHS
                );
                await trackingService.createTask(
                    applicationId,
                    'Seguimiento de Esterilización',
                    dueDateEsterilizacion,
                    'Verificar que el adoptante haya completado la esterilización del gato y solicitar certificado veterinario.'
                );
                console.log('[processApprovedApplication] Tarea de esterilización creada exitosamente');
            } catch (error) {
                console.error('[processApprovedApplication] Error al crear tarea de esterilización:', error);
                throw new Error(`Error al crear tarea de esterilización para solicitud $1{applicationId}: $1{error.message}`);
            }
        } else if (sterilizationStatus === 'esterilizado') {
            console.log('[processApprovedApplication] Tarea de esterilización no necesaria (gato ya esterilizado)');
        } else if (sterilizationStatus === 'no_aplica') {
            console.log('[processApprovedApplication] Tarea de esterilización no necesaria (no aplica para este gato)');
        }

        // Paso 5: Rechazar otras solicitudes pendientes para el mismo gato automáticamente
        try {
            console.log('[processApprovedApplication] Rechazando otras solicitudes pendientes...');
            await applicationService.rejectOtherApplications(catId);
            console.log('[processApprovedApplication] Otras solicitudes rechazadas exitosamente');
        } catch (error) {
            console.error('[processApprovedApplication] Error al rechazar otras solicitudes:', error);
            throw new Error(`Error al rechazar otras solicitudes para gato $1{catId}: $1{error.message}`);
        }

        console.log('[processApprovedApplication] Proceso completado exitosamente');
    } catch (error) {
        console.error('[processApprovedApplication] ERROR:', error);
        console.error('[processApprovedApplication] Stack trace:', error.stack);
        throw error;
    }
}

/**
 * Clase Controlador de Solicitudes
 */
class ApplicationController {
    /**
     * Crea una nueva solicitud de adopción para un gato específico.
     * Solo usuarios con rol de adoptante pueden enviar solicitudes.
     * 
     * @param {Request} req - Objeto request de Express con datos del usuario y formulario
     * @param {Response} res - Objeto response de Express para enviar la respuesta
     * @returns {Promise<Response>} Respuesta JSON con la solicitud creada o error
     */
    async applyForCat(req, res) {
        try {
            // Verificar que el usuario tenga rol de adoptante
            if (req.user.role !== config.USER_ROLES.ADOPTANTE) {
                return ErrorHandler.forbidden(res, 'Solo los adoptantes pueden enviar solicitudes');
            }

            const applicantId = req.user.id;
            const { id: catId } = req.params;
            const { form_responses } = req.body;

            // Validar que el formulario de adopción no esté vacíode adopción no esté vacío
            if (!form_responses) {
                return ErrorHandler.badRequest(res, 'El formulario de solicitud no puede estar vacío');
            }

            // Verificar que el gato exista y esté disponible para adopción
            const cat = await catService.getCatById(catId);
            if (!cat) {
                return ErrorHandler.notFound(res, 'Gato no encontrado');
            }

            if (cat.adoption_status !== config.ADOPTION_STATUS.EN_ADOPCION) {
                return ErrorHandler.badRequest(res, 'Este gato ya no está en adopción');
            }

            // Crear la solicitud de adopción en la base de datos
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

    /**
     * Obtiene todas las solicitudes pendientes recibidas por un rescatista.
     * Los administradores pueden ver todas las solicitudes, los rescatistas solo las suyas.
     * 
     * @param {Request} req - Objeto request de Express con datos del usuario autenticado
     * @param {Response} res - Objeto response de Express para enviar la respuesta
     * @returns {Promise<Response>} Respuesta JSON con lista de solicitudes o error
     */
    async getReceivedApplications(req, res) {
        try {
            // Verificar que el usuario sea rescatista o administrador
            if (![config.USER_ROLES.RESCATISTA, config.USER_ROLES.ADMIN].includes(req.user.role)) {
                return ErrorHandler.forbidden(res, 'Solo rescatistas y administradores pueden ver solicitudes');
            }

            let applications;
            
            // Si es admin, obtener todas las solicitudes del sistema solicitudes del sistema
            if (req.user.role === config.USER_ROLES.ADMIN) {
                applications = await applicationService.getAllApplications();
            } else {
                // Si es rescatista, obtener solo solicitudes de sus propios gatos
                applications = await applicationService.getApplicationsByRescuer(req.user.id);
            }

            return ErrorHandler.success(res, { applications });

        } catch (error) {
            return ErrorHandler.serverError(res, 'Error al obtener solicitudes', error);
        }
    }

    /**
     * Actualiza el estado de una solicitud de adopción (aprobar o rechazar).
     * Cuando se aprueba, crea automáticamente las tareas de seguimiento y actualiza el estado del gato.
     * 
     * @param {Request} req - Objeto request de Express con ID de solicitud y nuevo estado
     * @param {Response} res - Objeto response de Express para enviar la respuesta
     * @returns {Promise<Response>} Respuesta JSON con solicitud actualizada o error
     */
    async updateApplicationStatus(req, res) {
        try {
            // Validar que el usuario sea rescatista o administrador
            if (![config.USER_ROLES.RESCATISTA, config.USER_ROLES.ADMIN].includes(req.user.role)) {
                return ErrorHandler.forbidden(res);
            }

            const { id: applicationId } = req.params;
            const { status } = req.body;

            console.log('[updateApplicationStatus] Iniciando actualización:', { applicationId, status });

            // Validar que el nuevo estado sea válido (aprobada/rechazada)o estado sea válido (aprobada/rechazada)
            if (!Validator.isValidApplicationStatus(status)) {
                console.log('[updateApplicationStatus] Estado inválido:', status);
                return ErrorHandler.badRequest(res, 'Estado no válido');
            }

            console.log('[updateApplicationStatus] Validación de estado exitosa');

            // Actualizar el estado de la solicitud en la base de datosa solicitud en la base de datos
            const application = await applicationService.updateApplicationStatus(applicationId, status);
            
            if (!application) {
                console.log('[updateApplicationStatus] Solicitud no encontrada:', applicationId);
                return ErrorHandler.notFound(res, 'Solicitud no encontrada');
            }

            console.log('[updateApplicationStatus] Solicitud actualizada:', application.id);

            const catId = application.cat_id;
            console.log('[updateApplicationStatus] ID del gato:', catId);

            // Si la solicitud fue aprobada, procesar la adopción completan completa
            if (status === config.APPLICATION_STATUS.APROBADA) {
                console.log('[updateApplicationStatus] Procesando aprobación de adopción...');
                await processApprovedApplication(applicationId, catId);
                console.log('[updateApplicationStatus] Aprobación procesada exitosamente');
            }

            return ErrorHandler.success(
                res,
                { application },
                `Solicitud $1{status} con éxito. Se crearon las tareas de seguimiento.`
            );

        } catch (error) {
            console.error('[updateApplicationStatus] ERROR:', error);
            console.error('[updateApplicationStatus] Stack trace:', error.stack);
            return ErrorHandler.serverError(res, 'Error al actualizar solicitud', error);
        }
    }
}

module.exports = new ApplicationController();
