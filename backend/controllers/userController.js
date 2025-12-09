// Controlador de gestión de usuarios
// Gestiona las peticiones HTTP para administración de usuarios (solo admin)

const userService = require('../services/userService');
const datasetService = require('../services/datasetService');
const csvDatasetService = require('../services/csvDatasetService');
const ErrorHandler = require('../utils/errorHandler');
const config = require('../config/config');
const Validator = require('../utils/validator');

class UserController {
    /**
     * Obtener perfil del usuario autenticado
     * Cualquier usuario puede ver su propio perfil
     */
    async getProfile(req, res) {
        try {
            const userId = req.user.id;
            const user = await userService.getUserById(userId);

            if (!user) {
                return ErrorHandler.notFound(res, 'Usuario no encontrado');
            }

            return ErrorHandler.success(res, { user });

        } catch (error) {
            console.error('[getProfile] Error:', error.message, error.stack);
            return ErrorHandler.serverError(res, 'Error al obtener perfil', error);
        }
    }

    /**
     * Actualizar perfil del usuario autenticado
     * Permite actualizar: full_name, phone, email
     */
    async updateProfile(req, res) {
        try {
            const userId = req.user.id;
            const { full_name, phone, email } = req.body;

            // Validar que al menos un campo esté presente
            if (!full_name && !phone && !email) {
                return ErrorHandler.badRequest(res, 'Debe proporcionar al menos un campo para actualizar');
            }

            // Validar email si se proporciona
            if (email && !Validator.isValidEmail(email)) {
                return ErrorHandler.badRequest(res, 'Email inválido');
            }

            // Si se está cambiando el email, verificar que no exista
            if (email) {
                const emailExists = await userService.isEmailTaken(email, userId);
                if (emailExists) {
                    return ErrorHandler.badRequest(res, 'El email ya está en uso');
                }
            }

            const updatedUser = await userService.updateProfile(userId, { full_name, phone, email });
            
            
            datasetService.updateUsersDataset().catch(err => 
                console.error('Error updating dataset:', err.message)
            );
            csvDatasetService.updateUsersDataset().catch(() => {});
            
            return ErrorHandler.success(res, { user: updatedUser }, 'Perfil actualizado exitosamente');

        } catch (error) {
            console.error('[updateProfile] Error:', error.message, error.stack);
            return ErrorHandler.serverError(res, 'Error al actualizar perfil', error);
        }
    }

    // GET /api/users - Obtener todos los usuarios
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
            
            
            datasetService.updateUsersDataset().catch(err => 
                console.error('Error updating dataset:', err.message)
            );
            csvDatasetService.updateUsersDataset().catch(() => {});
            
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

    // POST /api/admin/users - Crear un nuevo usuario (solo admin)
    async createUser(req, res) {
        try {
            if (req.user.role !== config.USER_ROLES.ADMIN) {
                return ErrorHandler.forbidden(res, 'Solo los administradores pueden crear usuarios');
            }

            const { email, password, fullName, role, phone } = req.body;

            // Validaciones
            if (!email || !password || !fullName || !role) {
                return ErrorHandler.badRequest(res, 'Email, contraseña, nombre completo y rol son requeridos');
            }

            if (!Validator.isValidEmail(email)) {
                return ErrorHandler.badRequest(res, 'Email inválido');
            }

            if (!Validator.isValidPassword(password)) {
                return ErrorHandler.badRequest(res, 'La contraseña debe tener al menos 6 caracteres');
            }

            if (!Validator.isValidRole(role)) {
                return ErrorHandler.badRequest(res, 'Rol inválido');
            }

            // Verificar si el email ya existe
            const emailExists = await userService.isEmailTaken(email);
            if (emailExists) {
                return ErrorHandler.badRequest(res, 'El email ya está registrado');
            }

            // Importar bcrypt para hashear la contraseña
            const bcrypt = require('bcrypt');
            const passwordHash = await bcrypt.hash(password, 10);

            // Crear el usuario
            const newUser = await userService.createUser(email, passwordHash, fullName, role, phone || null);
            
            
            datasetService.updateUsersDataset().catch(err => 
                console.error('Error updating dataset:', err.message)
            );
            csvDatasetService.updateUsersDataset().catch(() => {});
            
            return ErrorHandler.created(res, newUser, 'Usuario creado exitosamente');

        } catch (error) {
            console.error('[createUser] Error:', error.message, error.stack);
            return ErrorHandler.serverError(res, 'Error al crear usuario', error);
        }
    }
}

module.exports = new UserController();
