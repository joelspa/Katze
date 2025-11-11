// Controlador de autenticación
// Gestiona las peticiones HTTP relacionadas con autenticación

const authService = require('../services/authService');
const Validator = require('../utils/validator');
const ErrorHandler = require('../utils/errorHandler');

class AuthController {
    // Registra un nuevo usuario en el sistema
    async register(req, res) {
        try {
            const { email, password, fullName, role } = req.body;

            // Validación de rol
            if (!Validator.isValidRole(role)) {
                return ErrorHandler.badRequest(res, 'Rol inválido');
            }

            // Validación de email
            if (!Validator.isValidEmail(email)) {
                return ErrorHandler.badRequest(res, 'Email inválido');
            }

            // Validación de contraseña
            if (!Validator.isValidPassword(password)) {
                return ErrorHandler.badRequest(res, 'La contraseña debe tener al menos 6 caracteres');
            }

            // Verifica si el email ya existe
            const emailExists = await authService.isEmailRegistered(email);
            if (emailExists) {
                return ErrorHandler.badRequest(res, 'El email ya está registrado');
            }

            // Encripta la contraseña
            const passwordHash = await authService.hashPassword(password);

            // Crea el nuevo usuario
            const newUser = await authService.createUser(email, passwordHash, fullName, role);

            return ErrorHandler.created(res, { user: newUser }, 'Usuario registrado con éxito');

        } catch (error) {
            return ErrorHandler.serverError(res, 'Error al registrar usuario', error);
        }
    }

    // Autentica un usuario existente
    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Validación de datos
            if (!email || !password) {
                return ErrorHandler.badRequest(res, 'Email y contraseña son requeridos');
            }

            // Busca el usuario
            const user = await authService.findUserByEmail(email);
            if (!user) {
                return ErrorHandler.unauthorized(res, 'Credenciales inválidas');
            }

            // Verifica la contraseña
            const isPasswordValid = await authService.verifyPassword(password, user.password_hash);
            if (!isPasswordValid) {
                return ErrorHandler.unauthorized(res, 'Credenciales inválidas');
            }

            // Genera el token
            const token = authService.generateToken(user);

            return ErrorHandler.success(res, {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role
                }
            }, 'Login exitoso');

        } catch (error) {
            return ErrorHandler.serverError(res, 'Error al iniciar sesión', error);
        }
    }
}

module.exports = new AuthController();