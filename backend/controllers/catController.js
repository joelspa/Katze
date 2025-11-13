// Controlador de gestión de gatos
// Gestiona las peticiones HTTP relacionadas con gatos

const catService = require('../services/catService');
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

            const { name, description, age, health_status, sterilization_status, photos_url } = req.body;

            // Valida datos del gato
            const validation = Validator.validateCatData({ name, sterilization_status });
            if (!validation.isValid) {
                return ErrorHandler.badRequest(res, validation.errors.join(', '));
            }

            // Prepara datos del gato
            const catData = {
                name,
                description,
                age,
                health_status,
                sterilization_status,
                photos_url,
                owner_id: req.user.id,
                approval_status: req.approval_status // Definido por el middleware de moderación
            };

            // Crea el gato
            const newCat = await catService.createCat(catData);

            const message = catData.approval_status === config.APPROVAL_STATUS.APROBADO
                ? 'Gato publicado con éxito'
                : 'Publicación enviada a revisión por posible infracción';

            return ErrorHandler.created(res, { cat: newCat }, message);

        } catch (error) {
            return ErrorHandler.serverError(res, 'Error al crear publicación', error);
        }
    }

    // Obtiene todos los gatos disponibles para adopción
    async getAllCats(req, res) {
        try {
            const cats = await catService.getAllAvailableCats();
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

            let message;
            if (status === config.APPROVAL_STATUS.APROBADO) {
                message = 'Publicación aprobada con éxito';
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
            const { name, description, age, health_status, sterilization_status } = req.body;

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
                sterilization_status
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
}

module.exports = new CatController();