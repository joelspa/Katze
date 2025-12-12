// Utilidades de validación para formularios
// Contiene funciones reutilizables para validar diferentes tipos de datos

export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

/**
 * Valida que un campo no esté vacío
 */
export const validateRequired = (value: string, fieldName: string = "Campo"): ValidationResult => {
    const trimmedValue = value?.trim() || '';
    if (trimmedValue.length === 0) {
        return {
            isValid: false,
            error: `${fieldName} es requerido`
        };
    }
    return { isValid: true };
};

/**
 * Valida formato de email
 */
export const validateEmail = (email: string): ValidationResult => {
    const trimmedEmail = email?.trim() || '';
    
    if (trimmedEmail.length === 0) {
        return {
            isValid: false,
            error: 'El email es requerido'
        };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
        return {
            isValid: false,
            error: 'Ingresa un email válido (ejemplo: usuario@correo.com)'
        };
    }
    
    return { isValid: true };
};

/**
 * Valida formato de teléfono (solo números, 7-15 dígitos)
 */
export const validatePhone = (phone: string): ValidationResult => {
    const trimmedPhone = phone?.trim() || '';
    
    if (trimmedPhone.length === 0) {
        return {
            isValid: false,
            error: 'El teléfono es requerido'
        };
    }
    
    // Remover espacios, guiones y paréntesis
    const cleanPhone = trimmedPhone.replace(/[\s\-()]/g, '');
    
    // Validar que solo contenga números
    const phoneRegex = /^\d+$/;
    if (!phoneRegex.test(cleanPhone)) {
        return {
            isValid: false,
            error: 'El teléfono solo debe contener números'
        };
    }
    
    // Validar longitud (7-15 dígitos)
    if (cleanPhone.length < 7 || cleanPhone.length > 15) {
        return {
            isValid: false,
            error: 'El teléfono debe tener entre 7 y 15 dígitos'
        };
    }
    
    return { isValid: true };
};

/**
 * Valida longitud mínima de texto
 */
export const validateMinLength = (
    value: string, 
    minLength: number, 
    fieldName: string = "Campo"
): ValidationResult => {
    const trimmedValue = value?.trim() || '';
    
    if (trimmedValue.length === 0) {
        return {
            isValid: false,
            error: `${fieldName} es requerido`
        };
    }
    
    if (trimmedValue.length < minLength) {
        return {
            isValid: false,
            error: `${fieldName} debe tener al menos ${minLength} caracteres (actual: ${trimmedValue.length})`
        };
    }
    
    return { isValid: true };
};

/**
 * Valida longitud máxima de texto
 */
export const validateMaxLength = (
    value: string, 
    maxLength: number, 
    fieldName: string = "Campo"
): ValidationResult => {
    const trimmedValue = value?.trim() || '';
    
    if (trimmedValue.length > maxLength) {
        return {
            isValid: false,
            error: `${fieldName} no debe exceder ${maxLength} caracteres (actual: ${trimmedValue.length})`
        };
    }
    
    return { isValid: true };
};

/**
 * Valida contraseña (mínimo 6 caracteres)
 */
export const validatePassword = (password: string): ValidationResult => {
    if (!password || password.length === 0) {
        return {
            isValid: false,
            error: 'La contraseña es requerida'
        };
    }
    
    if (password.length < 6) {
        return {
            isValid: false,
            error: 'La contraseña debe tener al menos 6 caracteres'
        };
    }
    
    return { isValid: true };
};

/**
 * Valida que un número esté dentro de un rango
 */
export const validateNumberRange = (
    value: number, 
    min: number, 
    max: number, 
    fieldName: string = "Valor"
): ValidationResult => {
    if (isNaN(value)) {
        return {
            isValid: false,
            error: `${fieldName} debe ser un número válido`
        };
    }
    
    if (value < min || value > max) {
        return {
            isValid: false,
            error: `${fieldName} debe estar entre ${min} y ${max}`
        };
    }
    
    return { isValid: true };
};

/**
 * Valida que un valor numérico sea positivo
 */
export const validatePositiveNumber = (value: string, fieldName: string = "Valor"): ValidationResult => {
    const numValue = parseFloat(value);
    
    if (isNaN(numValue)) {
        return {
            isValid: false,
            error: `${fieldName} debe ser un número válido`
        };
    }
    
    if (numValue <= 0) {
        return {
            isValid: false,
            error: `${fieldName} debe ser mayor a 0`
        };
    }
    
    return { isValid: true };
};

/**
 * Valida formato de URL
 */
export const validateURL = (url: string): ValidationResult => {
    const trimmedUrl = url?.trim() || '';
    
    if (trimmedUrl.length === 0) {
        return { isValid: true }; // URL es opcional en muchos casos
    }
    
    try {
        new URL(trimmedUrl);
        return { isValid: true };
    } catch {
        return {
            isValid: false,
            error: 'Ingresa una URL válida (ejemplo: https://ejemplo.com)'
        };
    }
};

/**
 * Valida que un valor sea un número entero
 */
export const validateInteger = (value: string, fieldName: string = "Valor"): ValidationResult => {
    const intValue = parseInt(value, 10);
    
    if (isNaN(intValue) || intValue.toString() !== value.trim()) {
        return {
            isValid: false,
            error: `${fieldName} debe ser un número entero`
        };
    }
    
    return { isValid: true };
};

/**
 * Valida nombre completo (al menos 2 palabras)
 */
export const validateFullName = (name: string): ValidationResult => {
    const trimmedName = name?.trim() || '';
    
    if (trimmedName.length === 0) {
        return {
            isValid: false,
            error: 'El nombre completo es requerido'
        };
    }
    
    const words = trimmedName.split(/\s+/).filter(word => word.length > 0);
    
    if (words.length < 2) {
        return {
            isValid: false,
            error: 'Ingresa tu nombre y apellido'
        };
    }
    
    // Validar que solo contenga letras, espacios y caracteres acentuados
    const nameRegex = /^[a-záéíóúñüA-ZÁÉÍÓÚÑÜ\s]+$/;
    if (!nameRegex.test(trimmedName)) {
        return {
            isValid: false,
            error: 'El nombre solo debe contener letras'
        };
    }
    
    return { isValid: true };
};

/**
 * Valida fecha (no puede ser en el pasado para ciertos casos)
 */
export const validateFutureDate = (dateString: string, fieldName: string = "Fecha"): ValidationResult => {
    if (!dateString) {
        return {
            isValid: false,
            error: `${fieldName} es requerida`
        };
    }
    
    const selectedDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        return {
            isValid: false,
            error: `${fieldName} no puede ser en el pasado`
        };
    }
    
    return { isValid: true };
};

/**
 * Limpia un número de teléfono (remueve espacios, guiones, paréntesis)
 */
export const cleanPhoneNumber = (phone: string): string => {
    return phone.replace(/[\s\-()]/g, '');
};

/**
 * Formatea un teléfono para visualización
 */
export const formatPhoneNumber = (phone: string): string => {
    const cleaned = cleanPhoneNumber(phone);
    
    // Formato para México: (XXX) XXX-XXXX o similar
    if (cleaned.length === 10) {
        return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6)}`;
    }
    
    return phone; // Retornar sin formato si no es de 10 dígitos
};

/**
 * Valida múltiples campos y retorna todos los errores
 */
export interface FieldValidation {
    field: string;
    validator: () => ValidationResult;
}

export const validateMultipleFields = (validations: FieldValidation[]): string[] => {
    const errors: string[] = [];
    
    for (const validation of validations) {
        const result = validation.validator();
        if (!result.isValid && result.error) {
            errors.push(result.error);
        }
    }
    
    return errors;
};

/**
 * Clase helper para manejar errores de validación en formularios
 */
export class FormValidator {
    private errors: Map<string, string> = new Map();
    
    addError(field: string, error: string) {
        this.errors.set(field, error);
    }
    
    clearError(field: string) {
        this.errors.delete(field);
    }
    
    clearAllErrors() {
        this.errors.clear();
    }
    
    getError(field: string): string | undefined {
        return this.errors.get(field);
    }
    
    hasError(field: string): boolean {
        return this.errors.has(field);
    }
    
    hasAnyError(): boolean {
        return this.errors.size > 0;
    }
    
    getAllErrors(): string[] {
        return Array.from(this.errors.values());
    }
    
    getErrorsObject(): Record<string, string> {
        const obj: Record<string, string> = {};
        this.errors.forEach((value, key) => {
            obj[key] = value;
        });
        return obj;
    }
}
