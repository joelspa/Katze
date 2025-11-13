// Controlador de historias de rescate
// Gestiona las peticiones HTTP relacionadas con historias

const storyService = require('../services/storyService');
const Validator = require('../utils/validator');
const ErrorHandler = require('../utils/errorHandler');

class StoryController {
    // Obtiene todas las historias (acceso público)
    async getAllStories(req, res) {
        try {
            const stories = await storyService.getAllStories();
            return ErrorHandler.success(res, { stories });

        } catch (error) {
            return ErrorHandler.serverError(res, 'Error al obtener historias', error);
        }
    }

    // Obtiene una historia específica por ID (acceso público)
    async getStoryById(req, res) {
        try {
            const { id } = req.params;

            const story = await storyService.getStoryById(id);
            
            if (!story) {
                return ErrorHandler.notFound(res, 'Historia no encontrada');
            }

            return ErrorHandler.success(res, { story });

        } catch (error) {
            return ErrorHandler.serverError(res, 'Error al obtener historia', error);
        }
    }

    // Crea una nueva historia (solo rescatistas y admin)
    async createStory(req, res) {
        try {
            const { title, content, event_date } = req.body;
            const authorId = req.user.id;

            // Valida los datos de la historia
            const validation = Validator.validateEducationalPost(title, content);
            if (!validation.isValid) {
                return ErrorHandler.badRequest(res, validation.errors.join(', '));
            }

            const newStory = await storyService.createStory(title, content, authorId, event_date);

            return ErrorHandler.created(res, { story: newStory }, 'Historia creada exitosamente');

        } catch (error) {
            return ErrorHandler.serverError(res, 'Error al crear historia', error);
        }
    }

    // Actualiza una historia existente (solo rescatistas y admin)
    async updateStory(req, res) {
        try {
            const { id } = req.params;
            const { title, content, event_date } = req.body;

            // Valida los datos de la historia
            const validation = Validator.validateEducationalPost(title, content);
            if (!validation.isValid) {
                return ErrorHandler.badRequest(res, validation.errors.join(', '));
            }

            const updatedStory = await storyService.updateStory(id, title, content, event_date);

            if (!updatedStory) {
                return ErrorHandler.notFound(res, 'Historia no encontrada');
            }

            return ErrorHandler.success(res, { story: updatedStory }, 'Historia actualizada');

        } catch (error) {
            return ErrorHandler.serverError(res, 'Error al actualizar historia', error);
        }
    }

    // Elimina una historia (solo rescatistas y admin)
    async deleteStory(req, res) {
        try {
            const { id } = req.params;

            const deleted = await storyService.deleteStory(id);

            if (!deleted) {
                return ErrorHandler.notFound(res, 'Historia no encontrada');
            }

            return ErrorHandler.success(res, null, 'Historia eliminada');

        } catch (error) {
            return ErrorHandler.serverError(res, 'Error al eliminar historia', error);
        }
    }
}

module.exports = new StoryController();
