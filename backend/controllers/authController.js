// Controlador de autenticación
// Gestiona las peticiones HTTP relacionadas con autenticación

const authService = require('../services/authService');
const datasetService = require('../services/datasetService');
const csvDatasetService = require('../services/csvDatasetService');
const Validator = require('../utils/validator');
const ErrorHandler = require('../utils/errorHandler');

class AuthController {
    // Registra un nuevo usuario en el sistema
    async register(req, res) {
        try {
            const { email, password, fullName, role, phone } = req.body;

            // Validación de campos requeridos
            if (!email || !password || !fullName || !role || !phone) {
                return ErrorHandler.badRequest(res, 'Todos los campos son requeridos: email, password, fullName, role, phone');
            }

            // Validar todos los datos del usuario
            const validation = Validator.validateUserRegistration({ 
                email, 
                password, 
                fullName, 
                role, 
                phone 
            });
            
            if (!validation.isValid) {
                return ErrorHandler.badRequest(res, 'Errores de validación:\n' + validation.errors.join('\n'));
            }

            // Validación de rol - solo permitir adoptantes en registro público
            if (role !== 'adoptante') {
                return ErrorHandler.badRequest(res, 'Solo se permite el registro público como adoptante. Los rescatistas deben ser registrados por un administrador.');
            }

            // Verifica si el email ya existe
            const emailExists = await authService.isEmailRegistered(email);
            if (emailExists) {
                return ErrorHandler.badRequest(res, 'El email ya está registrado');
            }

            // Limpiar y sanitizar datos
            const cleanPhone = Validator.cleanPhone(phone);
            const cleanFullName = Validator.sanitizeText(fullName);

            // Encripta la contraseña
            const passwordHash = await authService.hashPassword(password);

            const newUser = await authService.createUser(
                email.trim().toLowerCase(), 
                passwordHash, 
                cleanFullName, 
                role, 
                cleanPhone
            );

            datasetService.updateUsersDataset().catch(() => {});
            csvDatasetService.updateUsersDataset().catch(() => {});

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

            // Validar formato de email
            if (!Validator.isValidEmail(email)) {
                return ErrorHandler.badRequest(res, 'Email inválido');
            }

            // Busca el usuario
            const user = await authService.findUserByEmail(email.trim().toLowerCase());
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
