// Middleware de autorización de administrador
// Verifica que el usuario autenticado tenga rol de administrador

const config = require('../config/config');

module.exports = function (req, res, next) {
    // Verifica que el usuario esté autenticado y sea administrador
    // Este middleware debe ejecutarse después de authMiddleware
    if (!req.user || req.user.role !== config.USER_ROLES.ADMIN) {
        return res.status(403).json({ message: 'Acción no autorizada. Requiere rol de Administrador.' });
    }

    // Permite continuar si el usuario es administrador
    next();
};