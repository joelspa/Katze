// Servicio de estadísticas
// Maneja consultas agregadas para el dashboard administrativo

const db = require('../db');

class StatisticsService {
    // Gatos con más días publicados sin adoptar
    async getOldestCatsInAdoption(limit = 10) {
        const result = await db.query(
            `SELECT 
                c.id,
                c.name,
                c.description,
                c.age,
                c.sterilization_status,
                c.photos_url,
                c.created_at,
                EXTRACT(DAY FROM (CURRENT_TIMESTAMP - c.created_at)) as dias_publicado,
                u.full_name as rescatista_name
             FROM cats c
             LEFT JOIN users u ON c.owner_id = u.id
             WHERE c.adoption_status = 'en_adopcion'
               AND c.approval_status = 'aprobado'
             ORDER BY c.created_at ASC
             LIMIT $1`,
            [limit]
        );
        return result.rows;
    }

    // Estadísticas generales: adopciones, esterilización, tareas, etc
    async getGeneralStatistics() {
        // Total de adopciones completadas
        const adoptionsResult = await db.query(
            `SELECT COUNT(*) as total_adopciones
             FROM cats 
             WHERE adoption_status = 'adoptado'`
        );

        // Tasa de esterilización completada (de gatos adoptados)
        const sterilizationResult = await db.query(
            `SELECT 
                COUNT(*) FILTER (WHERE sterilization_status = 'esterilizado') as esterilizados,
                COUNT(*) FILTER (WHERE sterilization_status = 'pendiente') as pendientes,
                COUNT(*) as total
             FROM cats 
             WHERE adoption_status = 'adoptado'`
        );

        // Tareas vencidas
        const overdueTasksResult = await db.query(
            `SELECT COUNT(*) as tareas_vencidas
             FROM tracking_tasks
             WHERE status = 'atrasada'`
        );

        // Gatos en adopción actualmente
        const availableCatsResult = await db.query(
            `SELECT COUNT(*) as gatos_disponibles
             FROM cats
             WHERE adoption_status = 'en_adopcion'
               AND approval_status = 'aprobado'`
        );

        // Solicitudes pendientes
        const pendingApplicationsResult = await db.query(
            `SELECT COUNT(*) as solicitudes_pendientes
             FROM adoption_applications
             WHERE status = 'pendiente'`
        );

        // Calcular tasa de esterilización
        const sterilizationData = sterilizationResult.rows[0];
        const sterilizationRate = sterilizationData.total > 0
            ? Math.round((sterilizationData.esterilizados / sterilizationData.total) * 100)
            : 0;

        return {
            total_adopciones: parseInt(adoptionsResult.rows[0].total_adopciones),
            gatos_disponibles: parseInt(availableCatsResult.rows[0].gatos_disponibles),
            tasa_esterilizacion: sterilizationRate,
            esterilizados: parseInt(sterilizationData.esterilizados),
            pendientes_esterilizacion: parseInt(sterilizationData.pendientes),
            tareas_vencidas: parseInt(overdueTasksResult.rows[0].tareas_vencidas),
            solicitudes_pendientes: parseInt(pendingApplicationsResult.rows[0].solicitudes_pendientes)
        };
    }

    // Obtiene estadísticas de adopciones por mes (últimos 6 meses)
    async getAdoptionTrends() {
        const result = await db.query(
            `SELECT 
                TO_CHAR(created_at, 'YYYY-MM') as mes,
                COUNT(*) as adopciones
             FROM adoption_applications
             WHERE status = 'aprobada'
               AND created_at >= CURRENT_DATE - INTERVAL '6 months'
             GROUP BY TO_CHAR(created_at, 'YYYY-MM')
             ORDER BY mes ASC`
        );
        return result.rows;
    }
}

module.exports = new StatisticsService();
