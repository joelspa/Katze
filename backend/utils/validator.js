// Validadores de datos
// Valida y sanitiza datos de entrada según las reglas de negocio

class Validator {
    // Valida que el rol sea uno de los permitidos
    static isValidRole(role) {
        return ['adoptante', 'rescatista', 'admin'].includes(role);
    }

    // Valida que el email tenga formato correcto
    static isValidEmail(email) {
        if (!email || typeof email !== 'string') {
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    }

    // Valida que la contraseña cumpla requisitos mínimos
    static isValidPassword(password) {
        return password && typeof password === 'string' && password.length >= 6;
    }

    // Valida formato de teléfono (solo números, 7-15 dígitos)
    static isValidPhone(phone) {
        if (!phone || typeof phone !== 'string') {
            return false;
        }
        
        // Remover espacios, guiones y paréntesis
        const cleanPhone = phone.trim().replace(/[\s\-()]/g, '');
        
        // Validar que solo contenga números y tenga longitud correcta
        const phoneRegex = /^\d{7,15}$/;
        return phoneRegex.test(cleanPhone);
    }

    // Valida nombre completo (al menos 2 palabras)
    static isValidFullName(name) {
        if (!name || typeof name !== 'string') {
            return false;
        }
        
        const trimmedName = name.trim();
        const words = trimmedName.split(/\s+/).filter(word => word.length > 0);
        
        // Debe tener al menos 2 palabras y solo letras y espacios
        const nameRegex = /^[a-záéíóúñüA-ZÁÉÍÓÚÑÜ\s]+$/;
        return words.length >= 2 && nameRegex.test(trimmedName);
    }

    // Valida longitud mínima de texto
    static validateMinLength(text, minLength, fieldName = 'Campo') {
        if (!text || typeof text !== 'string') {
            return {
                isValid: false,
                error: `${fieldName} es requerido`
            };
        }
        
        const trimmedText = text.trim();
        if (trimmedText.length < minLength) {
            return {
                isValid: false,
                error: `${fieldName} debe tener al menos ${minLength} caracteres`
            };
        }
        
        return { isValid: true };
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

        // Validar descripción mínima
        const descResult = this.validateMinLength(catData.description, 20, 'La descripción');
        if (!descResult.isValid) {
            errors.push(descResult.error);
        }

        // Validar estado de salud
        const healthResult = this.validateMinLength(catData.health_status, 5, 'El estado de salud');
        if (!healthResult.isValid) {
            errors.push(healthResult.error);
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Valida datos de registro de usuario
    static validateUserRegistration(userData) {
        const errors = [];

        // Validar nombre completo
        if (!this.isValidFullName(userData.fullName)) {
            errors.push('El nombre completo debe incluir al menos nombre y apellido (solo letras)');
        }

        // Validar email
        if (!this.isValidEmail(userData.email)) {
            errors.push('El email no tiene un formato válido (ejemplo: usuario@correo.com)');
        }

        // Validar contraseña
        if (!this.isValidPassword(userData.password)) {
            errors.push('La contraseña debe tener al menos 6 caracteres');
        }

        // Validar teléfono
        if (!this.isValidPhone(userData.phone)) {
            errors.push('El teléfono debe contener solo números (entre 7 y 15 dígitos)');
        }

        // Validar rol
        if (!this.isValidRole(userData.role)) {
            errors.push('El rol especificado no es válido');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Valida datos de actualización de perfil
    static validateProfileUpdate(userData) {
        const errors = [];

        // Validar nombre completo
        if (userData.full_name && !this.isValidFullName(userData.full_name)) {
            errors.push('El nombre completo debe incluir al menos nombre y apellido (solo letras)');
        }

        // Validar email
        if (userData.email && !this.isValidEmail(userData.email)) {
            errors.push('El email no tiene un formato válido (ejemplo: usuario@correo.com)');
        }

        // Validar teléfono
        if (userData.phone && !this.isValidPhone(userData.phone)) {
            errors.push('El teléfono debe contener solo números (entre 7 y 15 dígitos)');
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

        const titleResult = this.validateMinLength(title, 5, 'El título');
        if (!titleResult.isValid) {
            errors.push(titleResult.error);
        }

        const contentResult = this.validateMinLength(content, 20, 'El contenido');
        if (!contentResult.isValid) {
            errors.push(contentResult.error);
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Limpia un número de teléfono
    static cleanPhone(phone) {
        if (!phone || typeof phone !== 'string') {
            return '';
        }
        return phone.replace(/[\s\-()]/g, '');
    }

    // Sanitiza texto eliminando espacios extras
    static sanitizeText(text) {
        if (!text || typeof text !== 'string') {
            return '';
        }
        return text.trim().replace(/\s+/g, ' ');
    }
}

module.exports = Validator;
