// backend/middleware/adminMiddleware.js

module.exports = function (req, res, next) {
    // Este middleware DEBE correr DESPUÉS de authMiddleware

    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acción no autorizada. Requiere rol de Administrador.' });
    }

    // Si es un admin, pasa al controlador
    next();
};