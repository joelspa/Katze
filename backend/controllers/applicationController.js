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
            // Verifica que el usuario sea rescatista o admin
            if (![config.USER_ROLES.RESCATISTA, config.USER_ROLES.ADMIN].includes(req.user.role)) {
                return ErrorHandler.forbidden(res, 'Solo rescatistas y administradores pueden ver solicitudes');
            }

            let applications;
            
            // Si es admin, obtiene todas las solicitudes
            if (req.user.role === config.USER_ROLES.ADMIN) {
                applications = await applicationService.getAllApplications();
            } else {
                // Si es rescatista, solo sus solicitudes
                applications = await applicationService.getApplicationsByRescuer(req.user.id);
            }

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

            console.log('🔍 UPDATE STATUS - Inicio:', { applicationId, status });

            // Valida el nuevo estado
            if (!Validator.isValidApplicationStatus(status)) {
                console.log('❌ Estado no válido:', status);
                return ErrorHandler.badRequest(res, 'Estado no válido');
            }

            console.log('✅ Validación de estado pasada');

            // Actualiza el estado de la solicitud
            const application = await applicationService.updateApplicationStatus(applicationId, status);
            
            if (!application) {
                console.log('❌ Solicitud no encontrada:', applicationId);
                return ErrorHandler.notFound(res, 'Solicitud no encontrada');
            }

            console.log('✅ Solicitud actualizada:', application.id);

            const catId = application.cat_id;
            console.log('📋 Cat ID:', catId);

            // Si la solicitud fue aprobada, procesa la adopción
            if (status === config.APPLICATION_STATUS.APROBADA) {
                console.log('🐱 Procesando aprobación...');
                await this._processApprovedApplication(applicationId, catId);
                console.log('✅ Aprobación procesada correctamente');
            }

            return ErrorHandler.success(
                res,
                { application },
                `Solicitud ${status} con éxito. Se crearon las tareas de seguimiento.`
            );

        } catch (error) {
            console.error('💥 ERROR en updateApplicationStatus:', error);
            console.error('Stack trace:', error.stack);
            return ErrorHandler.serverError(res, 'Error al actualizar solicitud', error);
        }
    }

    // Procesa una solicitud aprobada (método privado)
    async _processApprovedApplication(applicationId, catId) {
        try {
            console.log('🔧 _processApprovedApplication - Inicio:', { applicationId, catId });

            // 1. Marca el gato como adoptado
            console.log('1️⃣ Actualizando estado de adopción del gato...');
            await catService.updateAdoptionStatus(catId, config.ADOPTION_STATUS.ADOPTADO);
            console.log('✅ Gato marcado como adoptado');

            // 2. Obtiene información del gato
            console.log('2️⃣ Obteniendo información del gato...');
            const cat = await catService.getCatById(catId);
            const sterilizationStatus = cat?.sterilization_status;
            console.log('Estado esterilización:', sterilizationStatus);

            // 3. Crea tarea de seguimiento de bienestar SOLO para gatos ya esterilizados o no aplicables
            // Los gatos pendientes de esterilización recibirán seguimiento después de esterilizarse
            if (sterilizationStatus === 'esterilizado' || sterilizationStatus === 'no_aplica') {
                console.log('3️⃣ Creando tarea de seguimiento de bienestar...');
                const dueDateBienestar = trackingService.calculateDueDate(
                    config.TRACKING_PERIODS.BIENESTAR_MONTHS
                );
                await trackingService.createTask(
                    applicationId,
                    'Seguimiento de Bienestar',
                    dueDateBienestar,
                    'Verificar que el gato se haya adaptado bien a su nuevo hogar y esté recibiendo los cuidados necesarios.'
                );
                console.log('✅ Tarea de bienestar creada');
            } else {
                console.log('⏭️ No se crea tarea de bienestar aún (esperando esterilización)');
            }

            // 4. Crea tarea de esterilización SOLO si está pendiente
            if (sterilizationStatus === 'pendiente') {
                console.log('4️⃣ Creando tarea de seguimiento de esterilización...');
                const dueDateEsterilizacion = trackingService.calculateDueDate(
                    config.TRACKING_PERIODS.ESTERILIZACION_MONTHS
                );
                await trackingService.createTask(
                    applicationId,
                    'Seguimiento de Esterilización',
                    dueDateEsterilizacion,
                    'Verificar que el adoptante haya completado la esterilización del gato y solicitar certificado veterinario.'
                );
                console.log('✅ Tarea de esterilización creada (plazo: 4 meses)');
            } else if (sterilizationStatus === 'esterilizado') {
                console.log('⏭️ No se crea tarea de esterilización (gato ya esterilizado)');
            } else if (sterilizationStatus === 'no_aplica') {
                console.log('⏭️ No se crea tarea de esterilización (no aplica para este gato)');
            }

            // 5. Rechaza otras solicitudes pendientes para el mismo gato
            console.log('5️⃣ Rechazando otras solicitudes pendientes...');
            await applicationService.rejectOtherApplications(catId);
            console.log('✅ Otras solicitudes rechazadas');

            console.log('✅ _processApprovedApplication - Completado exitosamente');
        } catch (error) {
            console.error('💥 ERROR en _processApprovedApplication:', error);
            console.error('Stack trace:', error.stack);
            throw error; // Re-lanza el error para que lo capture el try-catch del método padre
        }
    }
}

module.exports = new ApplicationController();