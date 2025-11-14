// Manejador centralizado de errores
// Proporciona respuestas consistentes para diferentes tipos de errores

class ErrorHandler {
    // Error de validación de datos (400)
    static badRequest(res, message) {
        return res.status(400).json({ 
            success: false,
            message 
        });
    }

    // Error de autenticación (401)
    static unauthorized(res, message = 'No autorizado') {
        return res.status(401).json({ 
            success: false,
            message 
        });
    }

    // Error de permisos (403)
    static forbidden(res, message = 'Acción no autorizada') {
        return res.status(403).json({ 
            success: false,
            message 
        });
    }

    // Recurso no encontrado (404)
    static notFound(res, message = 'Recurso no encontrado') {
        return res.status(404).json({ 
            success: false,
            message 
        });
    }

    // Error del servidor (500)
    static serverError(res, message = 'Error en el servidor', error = null) {
        if (error) {
            console.error('Error del servidor:', error);
        }
        return res.status(500).json({ 
            success: false,
            message 
        });
    }

    // Respuesta exitosa (200)
    static success(res, data, message = 'Operación exitosa') {
        return res.status(200).json({
            success: true,
            message,
            data
        });
    }

    // Recurso creado exitosamente (201)
    static created(res, data, message = 'Recurso creado exitosamente') {
        return res.status(201).json({
            success: true,
            message,
            data
        });
    }
}

module.exports = ErrorHandler;

