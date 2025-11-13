// Servicio de autenticación
// Maneja la lógica de negocio para autenticación de usuarios

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const config = require('../config/config');

class AuthService {
    // Verifica si un email ya está registrado
    async isEmailRegistered(email) {
        const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        return result.rows.length > 0;
    }

    // Crea un hash seguro de la contraseña
    async hashPassword(password) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }

    // Crea un nuevo usuario en la base de datos
    async createUser(email, passwordHash, fullName, role, phone = null) {
        const result = await db.query(
            'INSERT INTO users (email, password_hash, full_name, "role", phone) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, "role", phone',
            [email, passwordHash, fullName, role, phone]
        );
        return result.rows[0];
    }

    // Busca un usuario por email
    async findUserByEmail(email) {
        const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        return result.rows.length > 0 ? result.rows[0] : null;
    }

    // Verifica si la contraseña coincide con el hash almacenado
    async verifyPassword(password, passwordHash) {
        return await bcrypt.compare(password, passwordHash);
    }

    // Genera un token JWT para el usuario
    generateToken(user) {
        const payload = {
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        };

        return jwt.sign(payload, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRATION });
    }
}

module.exports = new AuthService();
