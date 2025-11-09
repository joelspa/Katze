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

// --- NUEVA FUNCIÓN: VER SOLICITUDES RECIBIDAS ---
exports.getReceivedApplications = async (req, res) => {
    // 1. Asegurarnos que es un rescatista
    if (req.user.role !== 'rescatista') {
        return res.status(403).json({ message: 'Acción no autorizada.' });
    }

    const rescatistaId = req.user.id;

    try {
        // 2. Buscar todas las solicitudes 'pendientes' para los gatos QUE LE PERTENECEN a este rescatista
        const query = `
    SELECT app.*, cat.name as cat_name, u.full_name as applicant_name
    FROM adoption_applications app
    JOIN cats cat ON app.cat_id = cat.id
    JOIN users u ON app.applicant_id = u.id
    WHERE cat.owner_id = $1 AND app.status = 'pendiente'
    ORDER BY app.created_at ASC
    `;
        const applications = await db.query(query, [rescatistaId]);

        res.json(applications.rows);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error en el servidor");
    }
};

// --- NUEVA FUNCIÓN: APROBAR/RECHAZAR SOLICITUD ---
exports.updateApplicationStatus = async (req, res) => {
    // 1. Validar que sea rescatista o admin
    if (!['rescatista', 'admin'].includes(req.user.role)) {
        return res.status(403).json({ message: 'Acción no autorizada.' });
    }

    const { id: applicationId } = req.params; // ID de la solicitud
    const { status } = req.body; // Nuevo estado: 'aprobada' o 'rechazada'

    if (!['aprobada', 'rechazada'].includes(status)) {
        return res.status(400).json({ message: 'Estado no válido.' });
    }

    // --- INICIO DE LÓGICA CRÍTICA ---
    try {
        // 2. Actualizar el estado de la solicitud
        const updatedApp = await db.query(
            `UPDATE adoption_applications SET status = $1 WHERE id = $2 RETURNING *`,
            [status, applicationId]
        );

        if (updatedApp.rows.length === 0) {
            return res.status(404).json({ message: 'Solicitud no encontrada.' });
        }

        const application = updatedApp.rows[0];
        const catId = application.cat_id;

        // 3. ¡LO MÁS IMPORTANTE! Si fue APROBADA:
        if (status === 'aprobada') {

            // 3.a. Marcar el gato como 'adoptado'
            await db.query(
                "UPDATE cats SET adoption_status = 'adoptado' WHERE id = $1",
                [catId]
            );

            // 3.b. Crear la TAREA DE SEGUIMIENTO
            // (Asumimos seguimiento a 4 meses, puedes hacerlo más complejo luego)
            const dueDate = new Date();
            dueDate.setMonth(dueDate.getMonth() + 4);

            await db.query(
                `INSERT INTO tracking_tasks (application_id, task_type, due_date, status)
            VALUES ($1, 'Seguimiento de Esterilización', $2, 'pendiente')`,
                [applicationId, dueDate]
            );

            // 3.c. (Opcional pero recomendado) Rechazar otras solicitudes para el mismo gato
            await db.query(
                "UPDATE adoption_applications SET status = 'rechazada' WHERE cat_id = $1 AND status = 'pendiente'",
                [catId]
            );
        }

        res.json({
            message: `Solicitud ${status} con éxito.`,
            application: application
        });

    } catch (err) {
        console.error(err.message);
        // En un proyecto real, aquí usarías una TRANSACCIÓN de base de datos
        // para asegurar que todas las acciones (3a, 3b, 3c) fallen o tengan éxito juntas.
        res.status(500).send("Error en el servidor");
    }
};
