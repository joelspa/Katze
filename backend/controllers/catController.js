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
}

module.exports = new CatController();