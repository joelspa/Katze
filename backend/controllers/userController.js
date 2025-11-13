// Controlador de gestión de usuarios
// Gestiona las peticiones HTTP para administración de usuarios (solo admin)

const userService = require('../services/userService');
const ErrorHandler = require('../utils/errorHandler');
const config = require('../config/config');

class UserController {
    // GET /api/admin/users - Obtener todos los usuarios
    async getAllUsers(req, res) {
        try {
            // Verificar que el usuario sea administrador
            if (req.user.role !== config.USER_ROLES.ADMIN) {
                return ErrorHandler.forbidden(res, 'Solo los administradores pueden gestionar usuarios');
            }

            const users = await userService.getAllUsers();
            return ErrorHandler.success(res, users);

        } catch (error) {
            console.error('Error en getAllUsers:', error.message, error.stack);
            return ErrorHandler.serverError(res, 'Error al obtener usuarios', error);
        }
    }

    // GET /api/admin/users/:id - Obtener un usuario específico
    async getUserById(req, res) {
        try {
            if (req.user.role !== config.USER_ROLES.ADMIN) {
                return ErrorHandler.forbidden(res, 'Solo los administradores pueden ver detalles de usuarios');
            }

            const { id } = req.params;
            const user = await userService.getUserById(id);

            if (!user) {
                return ErrorHandler.notFound(res, 'Usuario no encontrado');
            }

            return ErrorHandler.success(res, user);

        } catch (error) {
            return ErrorHandler.serverError(res, 'Error al obtener usuario', error);
        }
    }

    // PUT /api/admin/users/:id/role - Actualizar el rol de un usuario
    async updateUserRole(req, res) {
        try {
            if (req.user.role !== config.USER_ROLES.ADMIN) {
                return ErrorHandler.forbidden(res, 'Solo los administradores pueden cambiar roles');
            }

            const { id } = req.params;
            const { role } = req.body;

            if (!role) {
                return ErrorHandler.badRequest(res, 'El rol es requerido');
            }

            // No permitir que el admin cambie su propio rol
            if (parseInt(id) === req.user.userId) {
                return ErrorHandler.badRequest(res, 'No puedes cambiar tu propio rol');
            }

            const updatedUser = await userService.updateUserRole(id, role);
            return ErrorHandler.success(res, updatedUser, 'Rol actualizado correctamente');

        } catch (error) {
            if (error.message.includes('Rol no válido')) {
                return ErrorHandler.badRequest(res, error.message);
            }
            if (error.message.includes('no encontrado')) {
                return ErrorHandler.notFound(res, error.message);
            }
            return ErrorHandler.serverError(res, 'Error al actualizar rol', error);
        }
    }

    // GET /api/admin/users/stats/by-role - Estadísticas de usuarios por rol
    async getUserStatsByRole(req, res) {
        try {
            if (req.user.role !== config.USER_ROLES.ADMIN) {
                return ErrorHandler.forbidden(res, 'Solo los administradores pueden ver estadísticas');
            }

            const stats = await userService.getUserStatsByRole();
            return ErrorHandler.success(res, stats);

        } catch (error) {
            return ErrorHandler.serverError(res, 'Error al obtener estadísticas', error);
        }
    }
}

module.exports = new UserController();
