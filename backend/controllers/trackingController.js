// backend/controllers/trackingController.js
const db = require('../db');

// --- FUNCIÓN: VER TAREAS PENDIENTES ---
exports.getPendingTasks = async (req, res) => {
    // 1. Asegurarnos que es un rescatista o admin
    if (!['rescatista', 'admin'].includes(req.user.role)) {
        return res.status(403).json({ message: 'Acción no autorizada.' });
    }

    try {
        let query = `
    SELECT 
        t.id, t.due_date, t.status, t.task_type,
        a.id as application_id,
        c.name as cat_name,
        u_applicant.full_name as applicant_name,
        u_owner.full_name as owner_name
    FROM tracking_tasks t
    JOIN adoption_applications a ON t.application_id = a.id
    JOIN cats c ON a.cat_id = c.id
    JOIN users u_applicant ON a.applicant_id = u_applicant.id
    JOIN users u_owner ON c.owner_id = u_owner.id
    WHERE (t.status = 'pendiente' OR t.status = 'atrasada')
    `;

        const params = [];

        // Si es un rescatista, solo ve sus propias tareas
        if (req.user.role === 'rescatista') {
            query += " AND c.owner_id = $1";
            params.push(req.user.id);
        }

        query += " ORDER BY t.due_date ASC";

        const tasks = await db.query(query, params);
        res.json(tasks.rows);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error en el servidor");
    }
};

// --- FUNCIÓN: COMPLETAR UNA TAREA ---
exports.completeTask = async (req, res) => {
    // 1. Asegurarnos que es un rescatista o admin
    if (!['rescatista', 'admin'].includes(req.user.role)) {
        return res.status(403).json({ message: 'Acción no autorizada.' });
    }

    const { id: taskId } = req.params; // ID de la tarea
    const { notes, certificate_url } = req.body; // Datos para cerrar la tarea

    try {
        // (Opcional: Verificar que el rescatista es dueño de esta tarea)
        // ... (lógica de verificación) ...

        // 2. Actualizar la tarea
        const updatedTask = await db.query(
            `UPDATE tracking_tasks 
        SET status = 'completada', notes = $1, certificate_url = $2, updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
        RETURNING *`,
            [notes, certificate_url, taskId]
        );

        if (updatedTask.rows.length === 0) {
            return res.status(404).json({ message: 'Tarea no encontrada.' });
        }

        const completedTask = updatedTask.rows[0];

        // 3. --- LÓGICA DE GATO MEJORADA ---
        // Si la tarea completada era la de esterilización, actualizamos al gato.

        if (completedTask.task_type === 'Seguimiento de Esterilización') {

            // Obtenemos el cat_id a través de la tarea y la solicitud
            const catQuery = await db.query(`
        SELECT c.id FROM cats c
        JOIN adoption_applications a ON c.id = a.cat_id
        WHERE a.id = $1
        `, [completedTask.application_id]);

            const catId = catQuery.rows[0].id;

            // Marcamos al gato como esterilizado
            await db.query(
                "UPDATE cats SET sterilization_status = 'esterilizado' WHERE id = $1",
                [catId]
            );

            res.json({
                message: 'Tarea de esterilización completada y gato actualizado.',
                task: completedTask
            });

        } else {
            // Si era solo una tarea de bienestar, solo reportamos que se completó.
            res.json({
                message: 'Tarea de bienestar completada.',
                task: completedTask
            });
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error en el servidor");
    }
};