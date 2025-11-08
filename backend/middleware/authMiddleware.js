// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // 1. Obtener el token del header
    const token = req.header('Authorization');

    // 2. Chequear si no hay token
    if (!token) {
        return res.status(401).json({ message: 'No hay token, permiso denegado' });
    }

    // 3. Verificar el token (el formato es "Bearer TOKEN")
    try {
        const tokenString = token.split(' ')[1]; // Nos quedamos solo con el token

        if (!tokenString) {
            return res.status(401).json({ message: 'Token mal formado' });
        }

        const decoded = jwt.verify(tokenString, 'MI_PALABRA_SECRETA_PARA_KATZE'); // Usa el mismo secreto que en el login

        // 4. Añadir el usuario del payload del token al objeto 'req'
        req.user = decoded.user;
        next(); // ¡Importante! Llama a next() para pasar a la siguiente función (el controlador)
    } catch (err) {
        res.status(401).json({ message: 'Token no es válido' });
    }
};