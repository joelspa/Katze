// backend/controllers/catController.js
const db = require('../db');

exports.createCat = async (req, res) => {
    // 1. Verificar que el usuario sea un rescatista (gracias al middleware)
    if (req.user.role !== 'rescatista') {
        return res.status(403).json({ message: 'Acción no autorizada. Solo rescatistas pueden publicar.' });
    }

    // 2. Obtener los datos del gato del body
    const {
        name,
        description,
        age,
        health_status,
        sterilization_status,
        photos_url // Esto debería ser un array ['url1', 'url2']
    } = req.body;

    // 3. Obtener el ID del dueño (el rescatista que está logueado)
    const ownerId = req.user.id;

    // 4. Validar datos
    if (!name || !sterilization_status) {
        return res.status(400).json({ message: 'Nombre y estado de esterilización son requeridos.' });
    }

    // --- ⬇️ AQUÍ ESTÁ LA SOLUCIÓN ⬇️ ---

    // Convertimos el array (o undefined) en un string JSON.
    // Si 'photos_url' no se envía, lo guardamos como un array JSON vacío '[]'.
    const photosJson = JSON.stringify(photos_url || []);

    // --- ⬆️ FIN DE LA SOLUCIÓN ⬆️ ---

    // 5. Insertar en la base de datos
    try {
        const newCat = await db.query(
            `INSERT INTO cats (name, description, age, health_status, sterilization_status, photos_url, owner_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`,
            // Pasamos 'photosJson' en lugar de 'photos_url'
            [name, description, age, health_status, sterilization_status, photosJson, ownerId]
        );

        res.status(201).json({
            message: "Gato publicado con éxito.",
            cat: newCat.rows[0]
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error en el servidor");
    }
};

// --- NUEVA FUNCIÓN: OBTENER TODOS LOS GATOS ---
exports.getAllCats = async (req, res) => {
    try {
        // 1. Buscamos solo los gatos que están "en_adopcion"
        const cats = await db.query(
            `SELECT * FROM cats WHERE adoption_status = 'en_adopcion' ORDER BY created_at DESC`
        );

        // 2. Opcional: Si quieres mostrar el nombre del rescatista (más avanzado)
        // Podrías hacer un JOIN con la tabla 'users'
        // Por ahora, devolvemos los gatos tal cual.

        res.json(cats.rows);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error en el servidor");
    }
};

// --- NUEVA FUNCIÓN: OBTENER UN GATO POR ID ---
exports.getCatById = async (req, res) => {
    try {
        const { id } = req.params; // Obtenemos el ID desde la URL (ej. /api/cats/5)

        const cat = await db.query("SELECT * FROM cats WHERE id = $1", [id]);

        if (cat.rows.length === 0) {
            return res.status(404).json({ message: "Gato no encontrado" });
        }

        res.json(cat.rows[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error en el servidor");
    }
};