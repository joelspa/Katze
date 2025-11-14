// Validadores de datos
// Valida y sanitiza datos de entrada según las reglas de negocio

class Validator {
    // Valida que el rol sea uno de los permitidos
    static isValidRole(role) {
        return ['adoptante', 'rescatista', 'admin'].includes(role);
    }

    // Valida que el email tenga formato correcto
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Valida que la contraseña cumpla requisitos mínimos
    static isValidPassword(password) {
        return password && password.length >= 6;
    }

    // Valida campos requeridos de un gato
    static validateCatData(catData) {
        const errors = [];

        if (!catData.name || catData.name.trim() === '') {
            errors.push('El nombre del gato es requerido');
        }

        if (!catData.sterilization_status) {
            errors.push('El estado de esterilización es requerido');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Valida que el estado de solicitud sea válido
    static isValidApplicationStatus(status) {
        return ['aprobada', 'rechazada'].includes(status);
    }

    // Valida campos requeridos de artículo educativo
    static validateEducationalPost(title, content) {
        const errors = [];

        if (!title || title.trim() === '') {
            errors.push('El título es requerido');
        }

        if (!content || content.trim() === '') {
            errors.push('El contenido es requerido');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

module.exports = Validator;

