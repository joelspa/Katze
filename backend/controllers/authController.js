// backend/controllers/authController.js
const db = require('../db');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
    const { email, password, fullName, role } = req.body;

    // 1. Validar que el rol sea uno de los permitidos
    if (!['adoptante', 'rescatista'].includes(role)) {
        return res.status(400).json({ message: "Rol inválido." });
    }

    try {
        // 2. Verificar si el email ya existe
        const existingUser = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: "El email ya está registrado." });
        }

        // 3. Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // 4. Insertar el nuevo usuario en la DB
        const newUser = await db.query(
            'INSERT INTO users (email, password_hash, full_name, "role") VALUES ($1, $2, $3, $4) RETURNING id, email, "role"',
            [email, passwordHash, fullName, role]
        );

        // 5. Devolver respuesta (en el futuro, aquí generarás un JWT)
        res.status(201).json({
            message: "Usuario registrado con éxito.",
            user: newUser.rows[0]
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error en el servidor");
    }
};