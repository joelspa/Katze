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
const firebaseService = require('../services/firebaseService');
const datasetService = require('../services/datasetService');
const csvDatasetService = require('../services/csvDatasetService');
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
        await catService.updateAdoptionStatus(catId, config.ADOPTION_STATUS.ADOPTADO);

        const cat = await catService.getCatById(catId);
        if (!cat) {
            throw new Error(`Gato con ID ${catId} no encontrado`);
        }
        
        const sterilizationStatus = cat.sterilization_status;

        if (sterilizationStatus === 'esterilizado' || sterilizationStatus === 'no_aplica') {
            const dueDateBienestar = trackingService.calculateDueDate(
                config.TRACKING_PERIODS.BIENESTAR_MONTHS
            );
            await trackingService.createTask(
                applicationId,
                'Seguimiento de Bienestar',
                dueDateBienestar,
                'Verificar que el gato se haya adaptado bien a su nuevo hogar y esté recibiendo los cuidados necesarios.'
            );
        }

        if (sterilizationStatus === 'pendiente') {
            const dueDateEsterilizacion = trackingService.calculateDueDate(
                config.TRACKING_PERIODS.ESTERILIZACION_MONTHS
            );
            await trackingService.createTask(
                applicationId,
                'Seguimiento de Esterilización',
                dueDateEsterilizacion,
                'Verificar que el adoptante haya completado la esterilización del gato y solicitar certificado veterinario.'
            );
        }

        await applicationService.rejectOtherApplications(catId);

        // Actualizar CSV de tareas de seguimiento
        csvDatasetService.updateTrackingDataset().catch(() => {});

    } catch (error) {
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

            // Crear la solicitud con estado 'processing' (será evaluada por el worker)
            const newApplication = await applicationService.createApplication(
                applicantId,
                catId,
                form_responses
            );

            console.log(`📨 Nueva solicitud #${newApplication.id} recibida (estado: processing)`);

            // Guardar en Firestore para análisis (no bloqueante)
            try {
                const firestoreData = {
                    application_id: newApplication.id,
                    submission_date: new Date().toISOString(),
                    cat_id: cat.id,
                    cat_name: cat.name,
                    cat_breed: cat.breed,
                    cat_age: cat.age,
                    applicant_id: applicantId,
                    applicant_name: req.user.name,
                    applicant_email: req.user.email,
                    ...form_responses,
                    status: 'processing',
                    rescuer_id: cat.owner_id
                };
                
                await firebaseService.saveApplicationRecord(firestoreData);
                datasetService.updateApplicationsDataset().catch(() => {});
                csvDatasetService.updateApplicationsDataset().catch(() => {});
            } catch (firestoreError) {
                console.error('Error guardando en Firestore:', firestoreError);
            }

            // Respuesta inmediata (no esperamos a la IA)
            return ErrorHandler.created(res, { 
                application: {
                    id: newApplication.id,
                    status: 'processing',
                    created_at: newApplication.created_at
                }
            }, '¡Solicitud recibida! Estamos evaluándola y el rescatista la revisará pronto.')

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

            if (!Validator.isValidApplicationStatus(status)) {
                return ErrorHandler.badRequest(res, 'Estado no válido');
            }

            const application = await applicationService.updateApplicationStatus(applicationId, status);
            
            if (!application) {
                return ErrorHandler.notFound(res, 'Solicitud no encontrada');
            }

            const catId = application.cat_id;

            if (status === config.APPLICATION_STATUS.APROBADA) {
                await processApprovedApplication(applicationId, catId);
            }

            datasetService.updateApplicationsDataset().catch(() => {});
            csvDatasetService.updateApplicationsDataset().catch(() => {});
            
            if (status === config.APPLICATION_STATUS.APROBADA) {
                datasetService.updateCatsDataset().catch(() => {});
                csvDatasetService.updateCatsDataset().catch(() => {});
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


}

module.exports = new ApplicationController();
