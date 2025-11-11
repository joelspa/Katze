// Controlador del módulo educativo
// Gestiona las peticiones HTTP relacionadas con artículos educativos

const educationService = require('../services/educationService');
const Validator = require('../utils/validator');
const ErrorHandler = require('../utils/errorHandler');

class EducationController {
    // Obtiene todos los artículos educativos (acceso público)
    async getAllPosts(req, res) {
        try {
            const posts = await educationService.getAllPosts();
            return ErrorHandler.success(res, { posts });

        } catch (error) {
            return ErrorHandler.serverError(res, 'Error al obtener artículos', error);
        }
    }

    // Obtiene un artículo educativo específico por ID (acceso público)
    async getPostById(req, res) {
        try {
            const { id } = req.params;

            const post = await educationService.getPostById(id);
            
            if (!post) {
                return ErrorHandler.notFound(res, 'Artículo no encontrado');
            }

            return ErrorHandler.success(res, { post });

        } catch (error) {
            return ErrorHandler.serverError(res, 'Error al obtener artículo', error);
        }
    }

    // Crea un nuevo artículo educativo (solo administradores)
    async createPost(req, res) {
        try {
            const { title, content } = req.body;
            const authorId = req.user.id;

            // Valida los datos del artículo
            const validation = Validator.validateEducationalPost(title, content);
            if (!validation.isValid) {
                return ErrorHandler.badRequest(res, validation.errors.join(', '));
            }

            const newPost = await educationService.createPost(title, content, authorId);

            return ErrorHandler.created(res, { post: newPost }, 'Artículo creado exitosamente');

        } catch (error) {
            return ErrorHandler.serverError(res, 'Error al crear artículo', error);
        }
    }

    // Actualiza un artículo educativo existente (solo administradores)
    async updatePost(req, res) {
        try {
            const { id } = req.params;
            const { title, content } = req.body;

            // Valida los datos del artículo
            const validation = Validator.validateEducationalPost(title, content);
            if (!validation.isValid) {
                return ErrorHandler.badRequest(res, validation.errors.join(', '));
            }

            const updatedPost = await educationService.updatePost(id, title, content);
            
            if (!updatedPost) {
                return ErrorHandler.notFound(res, 'Artículo no encontrado');
            }

            return ErrorHandler.success(res, { post: updatedPost }, 'Artículo actualizado exitosamente');

        } catch (error) {
            return ErrorHandler.serverError(res, 'Error al actualizar artículo', error);
        }
    }

    // Elimina un artículo educativo (solo administradores)
    async deletePost(req, res) {
        try {
            const { id } = req.params;

            const deleted = await educationService.deletePost(id);
            
            if (!deleted) {
                return ErrorHandler.notFound(res, 'Artículo no encontrado');
            }

            return ErrorHandler.success(res, null, 'Artículo eliminado con éxito');

        } catch (error) {
            return ErrorHandler.serverError(res, 'Error al eliminar artículo', error);
        }
    }
}

module.exports = new EducationController();