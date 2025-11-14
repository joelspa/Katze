// Middleware de autenticación
// Verifica el token JWT en las peticiones y extrae información del usuario

const jwt = require('jsonwebtoken');
const config = require('../config/config');

module.exports = function (req, res, next) {
    // Obtiene el token del header Authorization
    const token = req.header('Authorization');

    // Verifica que exista un token en la petición
    if (!token) {
        return res.status(401).json({ message: 'No hay token, permiso denegado' });
    }

    // Extrae y verifica el token (formato esperado: "Bearer TOKEN")
    try {
        const tokenString = token.split(' ')[1];

        if (!tokenString) {
            return res.status(401).json({ message: 'Token mal formado' });
        }

        // Verifica la validez del token usando el secreto de configuración
        const decoded = jwt.verify(tokenString, config.JWT_SECRET);

        // Añade la información del usuario decodificada al objeto request
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token no es válido' });
    }
};
