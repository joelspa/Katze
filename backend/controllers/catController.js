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
        // ¡NUEVO! Mostramos solo gatos que estén 'en_adopcion' Y 'aprobados'
        const query = `
    SELECT * FROM cats 
    WHERE adoption_status = 'en_adopcion' 
    AND approval_status = 'aprobado' 
    ORDER BY created_at DESC
    `;
        const cats = await db.query(query);
        res.json(cats.rows);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error en el servidor");
    }
};

// --- NUEVA FUNCIÓN: OBTENER UN GATO POR ID ---
exports.getCatById = async (req, res) => {
    try {
        const { id } = req.params;
        // ¡NUEVO! Solo dejamos ver gatos aprobados
        const cat = await db.query(
            "SELECT * FROM cats WHERE id = $1 AND approval_status = 'aprobado'",
            [id]
        );

        if (cat.rows.length === 0) {
            return res.status(404).json({ message: "Gato no encontrado o pendiente de aprobación" });
        }

        res.json(cat.rows[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error en el servidor");
    }
};

// --- FUNCIÓN ACTUALIZADA: createCat ---
exports.createCat = async (req, res) => {
    if (req.user.role !== 'rescatista') {
        return res.status(403).json({ message: 'Acción no autorizada.' });
    }

    const { name, description, age, health_status, sterilization_status, photos_url } = req.body;
    const ownerId = req.user.id;

    // ¡NUEVO! Obtenemos el estado de aprobación del middleware
    const approval_status = req.approval_status; // 'aprobado' o 'pendiente'

    if (!name || !sterilization_status) {
        return res.status(400).json({ message: 'Nombre y estado de esterilización son requeridos.' });
    }

    const photosJson = JSON.stringify(photos_url || []);

    try {
        const newCat = await db.query(
            // Añadimos la nueva columna 'approval_status'
            `INSERT INTO cats (name, description, age, health_status, sterilization_status, photos_url, owner_id, approval_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
            [name, description, age, health_status, sterilization_status, photosJson, ownerId, approval_status]
        );

        const message = approval_status === 'aprobado'
            ? "Gato publicado con éxito."
            : "Publicación enviada a revisión por posible infracción.";

        res.status(201).json({
            message: message,
            cat: newCat.rows[0]
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error en el servidor");
    }
};