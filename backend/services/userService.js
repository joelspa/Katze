// Servicio de gestión de usuarios
// Maneja la lógica de negocio para administración de usuarios

const db = require('../db');

class UserService {
    // Lista todos los usuarios (solo admin)
    async getAllUsers() {
        const query = `
            SELECT 
                id,
                email,
                full_name,
                phone,
                role,
                created_at
            FROM users
            ORDER BY created_at DESC
        `;
        const result = await db.query(query);
        return result.rows;
    }

    // Busca usuario por ID
    async getUserById(userId) {
        const query = `
            SELECT 
                id,
                email,
                full_name,
                phone,
                role,
                created_at
            FROM users
            WHERE id = $1
        `;
        const result = await db.query(query, [userId]);
        return result.rows[0];
    }

    // Cambia el rol de un usuario (adoptante, rescatista, admin)
    async updateUserRole(userId, newRole) {
        // Validar que el rol sea válido
        const validRoles = ['adoptante', 'rescatista', 'admin'];
        if (!validRoles.includes(newRole)) {
            throw new Error('Rol no válido. Debe ser: adoptante, rescatista o admin');
        }

        const query = `
            UPDATE users
            SET role = $1
            WHERE id = $2
            RETURNING id, email, full_name, role
        `;
        const result = await db.query(query, [newRole, userId]);
        
        if (result.rows.length === 0) {
            throw new Error('Usuario no encontrado');
        }

        return result.rows[0];
    }

    // Obtener estadísticas de usuarios por rol
    async getUserStatsByRole() {
        const query = `
            SELECT 
                role,
                COUNT(*) as total
            FROM users
            GROUP BY role
            ORDER BY total DESC
        `;
        const result = await db.query(query);
        return result.rows;
    }

    // Verificar si un usuario existe
    async userExists(userId) {
        const query = 'SELECT EXISTS(SELECT 1 FROM users WHERE id = $1)';
        const result = await db.query(query, [userId]);
        return result.rows[0].exists;
    }

    // Crear un nuevo usuario (solo para admin)
    async createUser(email, passwordHash, fullName, role, phone) {
        const query = `
            INSERT INTO users (email, password_hash, full_name, role, phone)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, email, full_name, role, phone, created_at
        `;
        const result = await db.query(query, [email, passwordHash, fullName, role, phone]);
        return result.rows[0];
    }

    // Verificar si un email ya está registrado (excluyendo un userId específico)
    async isEmailTaken(email, excludeUserId = null) {
        let query = 'SELECT EXISTS(SELECT 1 FROM users WHERE email = $1';
        const params = [email];
        
        if (excludeUserId) {
            query += ' AND id != $2)';
            params.push(excludeUserId);
        } else {
            query += ')';
        }
        
        const result = await db.query(query, params);
        return result.rows[0].exists;
    }

    // Eliminar un usuario (solo para admin)
    async deleteUser(userId) {
        const query = 'DELETE FROM users WHERE id = $1 RETURNING id';
        const result = await db.query(query, [userId]);
        
        if (result.rows.length === 0) {
            throw new Error('Usuario no encontrado');
        }
        
        return result.rows[0];
    }
}

module.exports = new UserService();
