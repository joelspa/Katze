// Controlador de gestión de gatos
// Gestiona las peticiones HTTP relacionadas con gatos

const catService = require('../services/catService');
const datasetService = require('../services/datasetService');
const csvDatasetService = require('../services/csvDatasetService');
const Validator = require('../utils/validator');
const ErrorHandler = require('../utils/errorHandler');
const config = require('../config/config');

class CatController {
    // Crea una nueva publicación de gato (solo rescatistas)
    async createCat(req, res) {
        try {
            // Verifica que el usuario sea rescatista
            if (req.user.role !== config.USER_ROLES.RESCATISTA) {
                return ErrorHandler.forbidden(res, 'Solo rescatistas pueden publicar gatos');
            }

            const { name, description, age, health_status, sterilization_status, photos_url, story, breed, living_space_requirement } = req.body;

            // Validaciones de campos requeridos
            if (!name || name.trim() === '') {
                return ErrorHandler.badRequest(res, 'El nombre del gato es requerido');
            }

            if (!description || description.trim() === '') {
                return ErrorHandler.badRequest(res, 'La descripción es requerida');
            }

            if (!health_status || health_status.trim() === '') {
                return ErrorHandler.badRequest(res, 'El estado de salud es requerido');
            }

            if (!photos_url || (Array.isArray(photos_url) && photos_url.length === 0)) {
                return ErrorHandler.badRequest(res, 'Se requiere al menos una foto');
            }

            // Validar que age sea un número
            if (age === undefined || age === null || isNaN(Number(age))) {
                return ErrorHandler.badRequest(res, 'La edad debe ser un número válido');
            }

            // Validar sterilization_status (permitir también valores que el frontend convierte)
            const validSterilizationStatuses = ['esterilizado', 'no_esterilizado', 'pendiente'];
            if (!sterilization_status || !validSterilizationStatuses.includes(sterilization_status)) {
                console.log(`[WARNING] Estado de esterilización inválido recibido: ${sterilization_status}`);
                return ErrorHandler.badRequest(res, `Estado de esterilización inválido: debe ser uno de ${validSterilizationStatuses.join(', ')}`);
            }

            console.log(`[CREATE CAT] Creando gato: ${name}, Edad: ${age}, Fotos: ${Array.isArray(photos_url) ? photos_url.length : 1}`);

            // Prepara datos del gato (por defecto pendiente de aprobación)
            const catData = {
                name: name.trim(),
                description: description.trim(),
                age: Number(age),
                health_status: health_status.trim(),
                sterilization_status,
                photos_url: Array.isArray(photos_url) ? photos_url : [photos_url],
                story: story || description,
                breed: breed || 'Mestizo',
                living_space_requirement: living_space_requirement || 'cualquiera',
                owner_id: req.user.id,
                approval_status: config.APPROVAL_STATUS.PENDIENTE
            };

            // Crea el gato en la DB
            const newCat = await catService.createCat(catData);

            console.log(`[SUCCESS] Gato #${newCat.id} creado exitosamente por usuario #${req.user.id}`);

            // Actualizar datasets (JSON y CSV) en background
            datasetService.updateCatsDataset().catch(() => {});
            csvDatasetService.updateCatsDataset().catch(() => {});

            return ErrorHandler.created(res, { cat: newCat }, 'Gato enviado para revisión. Un administrador lo aprobará pronto.');

        } catch (error) {
            console.error('[ERROR] Error al crear publicación:', error);
            return ErrorHandler.serverError(res, 'Error al crear publicación', error);
        }
    }

    // Obtiene todos los gatos disponibles para adopción
    async getAllCats(req, res) {
        try {
            // Extraer filtros desde query params
            const filters = {
                sterilization_status: req.query.sterilization_status,
                age: req.query.age,
                living_space: req.query.living_space
            };

            const cats = await catService.getAllAvailableCats(filters);
            return ErrorHandler.success(res, { cats });

        } catch (error) {
            return ErrorHandler.serverError(res, 'Error al obtener gatos', error);
        }
    }

    // Obtiene información detallada de un gato específico
    async getCatById(req, res) {
        try {
            const { id } = req.params;

            const cat = await catService.getCatById(id);

            if (!cat) {
                return ErrorHandler.notFound(res, 'Gato no encontrado o pendiente de aprobación');
            }

            return ErrorHandler.success(res, { cat });

        } catch (error) {
            return ErrorHandler.serverError(res, 'Error al obtener gato', error);
        }
    }

    // ========== FUNCIONES DE ADMINISTRACIÓN ==========

    // Obtiene TODAS las publicaciones (incluidas pendientes) - Solo Admin
    async getAllCatsAdmin(req, res) {
        try {
            // Verifica que el usuario sea admin
            if (req.user.role !== config.USER_ROLES.ADMIN) {
                return ErrorHandler.forbidden(res, 'Solo administradores pueden acceder');
            }

            const cats = await catService.getAllCatsForAdmin();

            return ErrorHandler.success(res, {
                cats,
                summary: {
                    total: cats.length,
                    pendientes: cats.filter(c => c.approval_status === 'pendiente').length,
                    aprobados: cats.filter(c => c.approval_status === 'aprobado').length,
                    rechazados: cats.filter(c => c.approval_status === 'rechazado').length
                }
            }, 'Publicaciones obtenidas con éxito');

        } catch (error) {
            return ErrorHandler.serverError(res, 'Error al obtener publicaciones', error);
        }
    }

    // Actualiza el estado de aprobación de un gato - Solo Admin
    async updateCatApproval(req, res) {
        try {
            // Verifica que el usuario sea admin
            if (req.user.role !== config.USER_ROLES.ADMIN) {
                return ErrorHandler.forbidden(res, 'Solo administradores pueden aprobar publicaciones');
            }

            const { id } = req.params;
            const { status } = req.body;

            // Valida el estado
            const validStatuses = [
                config.APPROVAL_STATUS.APROBADO,
                config.APPROVAL_STATUS.RECHAZADO,
                config.APPROVAL_STATUS.PENDIENTE
            ];
            if (!validStatuses.includes(status)) {
                return ErrorHandler.badRequest(res, `Estado no válido. Debe ser: aprobado, rechazado o pendiente`);
            }

            // Actualiza el estado
            const updatedCat = await catService.updateApprovalStatus(id, status);

            if (!updatedCat) {
                return ErrorHandler.notFound(res, 'Gato no encontrado');
            }

            // Actualizar datasets en background
            datasetService.updateCatsDataset().catch(() => {});
            csvDatasetService.updateCatsDataset().catch(() => {});

            // DISPARAR WEBHOOK A MAKE.COM solo cuando se APRUEBA el gato
            if (status === config.APPROVAL_STATUS.APROBADO) {
                console.log(`[WEBHOOK] Disparando webhook a Make.com para gato #${updatedCat.id}`);
                
                const webhookPayload = {
                    nombre: updatedCat.name,
                    descripcion: updatedCat.description,
                    foto_url: Array.isArray(updatedCat.photos_url) && updatedCat.photos_url.length > 0 
                        ? updatedCat.photos_url[0] 
                        : (typeof updatedCat.photos_url === 'string' ? updatedCat.photos_url : ''),
                    edad: updatedCat.age,
                    raza: updatedCat.breed || 'Mestizo',
                    estado_salud: updatedCat.health_status,
                    esterilizacion: updatedCat.sterilization_status,
                    espacio_requerido: updatedCat.living_space_requirement || 'cualquiera',
                    historia: updatedCat.story || updatedCat.description,
                    fecha_aprobacion: new Date().toLocaleDateString('es-ES'),
                    id_gato: updatedCat.id,
                    enlace_adopcion: `https://katze-nwc0.onrender.com/catalog` // Link directo al catálogo
                };
                
                // Disparamos la petición sin 'await' para que no bloquee la respuesta
                fetch(config.MAKE_WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'User-Agent': 'Katze-App/1.0'
                    },
                    body: JSON.stringify(webhookPayload)
                })
                .then(response => {
                    if (response.ok) {
                        console.log(`[WEBHOOK SUCCESS] Webhook enviado exitosamente para gato #${updatedCat.id}`);
                    } else {
                        console.error(`[WEBHOOK WARNING] Webhook respondió con status ${response.status} para gato #${updatedCat.id}`);
                    }
                })
                .catch(error => {
                    console.error(`[WEBHOOK ERROR] Error enviando webhook para gato #${updatedCat.id}:`, error.message);
                });
            }

            let message;
            if (status === config.APPROVAL_STATUS.APROBADO) {
                message = 'Publicación aprobada con éxito. ¡El gato ya está visible en el catálogo!';
            } else if (status === config.APPROVAL_STATUS.RECHAZADO) {
                message = 'Publicación rechazada';
            } else {
                message = 'Estado actualizado a pendiente';
            }

            return ErrorHandler.success(res, { cat: updatedCat }, message);

        } catch (error) {
            return ErrorHandler.serverError(res, 'Error al actualizar estado de aprobación', error);
        }
    }

    // Obtiene un gato por ID sin restricción - Solo Admin
    async getCatByIdAdmin(req, res) {
        try {
            // Verifica que el usuario sea admin
            if (req.user.role !== config.USER_ROLES.ADMIN) {
                return ErrorHandler.forbidden(res, 'Solo administradores pueden acceder');
            }

            const { id } = req.params;
            const cat = await catService.getCatByIdForAdmin(id);

            if (!cat) {
                return ErrorHandler.notFound(res, 'Gato no encontrado');
            }

            return ErrorHandler.success(res, { cat });

        } catch (error) {
            return ErrorHandler.serverError(res, 'Error al obtener gato', error);
        }
    }

    // Edita los detalles de un gato - Solo Admin
    async editCat(req, res) {
        try {
            // Verifica que el usuario sea admin
            if (req.user.role !== config.USER_ROLES.ADMIN) {
                return ErrorHandler.forbidden(res, 'Solo administradores pueden editar publicaciones');
            }

            const { id } = req.params;
            const { name, description, age, health_status, sterilization_status, story } = req.body;

            // Valida datos básicos
            if (name) {
                const validation = Validator.validateCatData({ name, sterilization_status });
                if (!validation.isValid) {
                    return ErrorHandler.badRequest(res, validation.errors.join(', '));
                }
            }

            // Actualiza el gato
            const updatedCat = await catService.updateCatDetails(id, {
                name,
                description,
                age,
                health_status,
                sterilization_status,
                story
            });

            if (!updatedCat) {
                return ErrorHandler.notFound(res, 'Gato no encontrado');
            }

            return ErrorHandler.success(res, { cat: updatedCat }, 'Gato actualizado con éxito');

        } catch (error) {
            return ErrorHandler.serverError(res, 'Error al actualizar gato', error);
        }
    }

    // Elimina un gato - Solo Admin
    async deleteCat(req, res) {
        try {
            // Verifica que el usuario sea admin
            if (req.user.role !== config.USER_ROLES.ADMIN) {
                return ErrorHandler.forbidden(res, 'Solo administradores pueden eliminar publicaciones');
            }

            const { id } = req.params;
            const deletedCat = await catService.deleteCat(id);

            if (!deletedCat) {
                return ErrorHandler.notFound(res, 'Gato no encontrado');
            }

            return ErrorHandler.success(res, { cat: deletedCat }, 'Gato eliminado con éxito');

        } catch (error) {
            return ErrorHandler.serverError(res, 'Error al eliminar gato', error);
        }
    }

    // Obtiene información de contacto del rescatista de un gato
    async getOwnerContact(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            // Obtiene la información del rescatista
            const ownerContact = await catService.getOwnerContactInfo(id, userId);

            if (!ownerContact) {
                return ErrorHandler.notFound(res, 'No se encontró información de contacto o no tienes permiso');
            }

            return ErrorHandler.success(res, { contact: ownerContact });

        } catch (error) {
            return ErrorHandler.serverError(res, 'Error al obtener información de contacto', error);
        }
    }

    // Obtiene estadísticas completas del dashboard admin
    async getAdminDashboardStats(req, res) {
        try {
            // Verifica que el usuario sea admin
            if (req.user.role !== config.USER_ROLES.ADMIN) {
                return ErrorHandler.forbidden(res, 'Solo administradores pueden acceder');
            }

            const trackingService = require('../services/trackingService');
            
            // Obtener estadísticas de gatos
            const cats = await catService.getAllCatsForAdmin();
            const catStats = {
                total: cats.length,
                pendientes: cats.filter(c => c.approval_status === 'pendiente').length,
                aprobados: cats.filter(c => c.approval_status === 'aprobado').length,
                rechazados: cats.filter(c => c.approval_status === 'rechazado').length
            };
            
            // Obtener estadísticas de tareas de seguimiento
            const trackingStats = await trackingService.getTrackingStats();
            
            return ErrorHandler.success(res, {
                cats: catStats,
                tracking: trackingStats
            });

        } catch (error) {
            return ErrorHandler.serverError(res, 'Error al obtener estadísticas del dashboard', error);
        }
    }
}

module.exports = new CatController();
