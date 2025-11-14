// Controlador de estadísticas
// Gestiona las peticiones HTTP para el dashboard de estadísticas

const statisticsService = require('../services/statisticsService');
const ErrorHandler = require('../utils/errorHandler');
const config = require('../config/config');

class StatisticsController {
    // Obtiene todas las estadísticas del dashboard
    async getStatistics(req, res) {
        try {
            // Valida que el usuario sea rescatista o administrador
            if (![config.USER_ROLES.RESCATISTA, config.USER_ROLES.ADMIN].includes(req.user.role)) {
                return ErrorHandler.forbidden(res, 'Solo rescatistas y administradores pueden ver estadísticas');
            }

            // Obtener estadísticas generales
            const generalStats = await statisticsService.getGeneralStatistics();

            // Obtener gatos con más tiempo sin adoptar (prioridad)
            const oldestCats = await statisticsService.getOldestCatsInAdoption(0);

            // Obtener tendencias de adopción
            const adoptionTrends = await statisticsService.getAdoptionTrends();

            return ErrorHandler.success(res, {
                general: generalStats,
                oldestCats: oldestCats,
                adoptionTrends: adoptionTrends
            });

        } catch (error) {
            return ErrorHandler.serverError(res, 'Error al obtener estadísticas', error);
        }
    }
}

module.exports = new StatisticsController();

