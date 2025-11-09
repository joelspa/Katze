// backend/controllers/applicationController.js
const db = require("../db");

exports.applyForCat = async (req, res) => {
    // 1. Obtener datos clave
    const applicantId = req.user.id; // ID del adoptante (viene del authMiddleware)
    const { id: catId } = req.params; // ID del gato (viene de la URL)
    const { form_responses } = req.body; // Respuestas del formulario (un objeto JSON)

    // 2. Verificar que el usuario sea un adoptante
    if (req.user.role !== "adoptante") {
        return res
            .status(403)
            .json({ message: "Solo los adoptantes pueden enviar solicitudes." });
    }

    // 3. Verificar que el formulario no esté vacío
    if (!form_responses) {
        return res
            .status(400)
            .json({ message: "El formulario de solicitud no puede estar vacío." });
    }

    // 4. Convertir las respuestas a un string JSON para guardar en la DB
    const formResponsesJson = JSON.stringify(form_responses);

    try {
        // 5. Opcional: Verificar si el gato sigue "en_adopcion"
        const catResult = await db.query(
            "SELECT adoption_status FROM cats WHERE id = $1",
            [catId]
        );
        if (catResult.rows.length === 0) {
            return res.status(404).json({ message: "Gato no encontrado." });
        }
        if (catResult.rows[0].adoption_status !== "en_adopcion") {
            return res
                .status(400)
                .json({ message: "Este gato ya no está en adopción." });
        }

        // 6. Crear la solicitud de adopción
        const newApplication = await db.query(
            `INSERT INTO adoption_applications (applicant_id, cat_id, form_responses, status)
        VALUES ($1, $2, $3, 'pendiente')
        RETURNING *`,
            [applicantId, catId, formResponsesJson]
        );

        res.status(201).json({
            message: "Solicitud enviada con éxito.",
            application: newApplication.rows[0],
        });
    } catch (err) {
        // Manejo de error (ej. si el usuario ya aplicó por este gato, si defines un constraint UNIQUE)
        console.error(err.message);
        res.status(500).send("Error en el servidor");
    }
};
