// backend/controllers/authController.js
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { email, password, fullName, role } = req.body;

    // 1. Validar que el rol sea uno de los permitidos
    if (!['adoptante', 'rescatista','admin'].includes(role)) {
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

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Buscar al usuario por email
        const userResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userResult.rows.length === 0) {
            return res.status(401).json({ message: "Credenciales inválidas" }); // No digas si fue el email o la pass
        }

        const user = userResult.rows[0];

        // 2. Comparar la contraseña enviada con la guardada (hash)
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }
        // 3. ¡Éxito! Crear el JWT (JSON Web Token)
        // El 'payload' es la info que guardamos en el token.
        const payload = {
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        };

        // Firmamos el token con un 'secreto'. ¡Este secreto debe ser privado!
        // En un proyecto real, esto iría en un archivo .env
        const token = jwt.sign(
            payload,
            "MI_PALABRA_SECRETA_PARA_KATZE", // <-- ¡Crea tu propio secreto!
            { expiresIn: '24h' } // El token expira en 24 horas
        );

        // 4. Enviar el token al cliente
        res.json({
            message: "Login exitoso",
            token: token,
            user: payload.user // Enviamos también los datos del usuario
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error en el servidor");
    }
};