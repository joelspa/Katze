// Servicio de gestión de usuarios
// Maneja la lógica de negocio para administración de usuarios

const db = require('../db');

class UserService {
    // Obtener todos los usuarios (solo para admin)
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

    // Obtener un usuario por ID
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

    // Actualizar el rol de un usuario
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
}

module.exports = new UserService();
