/**
 * Worker de Procesamiento de Cola de Solicitudes
 * Procesa solicitudes pendientes con IA de forma asíncrona
 * 
 * Ejecución: node backend/workers/processApplicationQueue.js
 * O usar con node-cron/pm2 para ejecución automática cada X minutos
 */

require('dotenv').config();
const db = require('../db');
const aiService = require('../services/aiService');
const csvDatasetService = require('../services/csvDatasetService');

// Configuración del worker
const CONFIG = {
    BATCH_SIZE: 5, // Procesar de 5 en 5 para no saturar la API
    INTERVAL_MS: 10000, // 10 segundos entre ejecuciones
    MAX_RETRIES: 3 // Reintentos máximos por solicitud
};

class ApplicationQueueWorker {
    constructor() {
        this.isProcessing = false;
        this.processedCount = 0;
        this.errorCount = 0;
    }

    /**
     * Inicia el worker (loop infinito)
     */
    async start() {
        console.log('🚀 Worker de procesamiento iniciado');
        console.log(`⚙️ Procesando ${CONFIG.BATCH_SIZE} solicitudes cada ${CONFIG.INTERVAL_MS/1000}s`);

        // Loop infinito con intervalo
        setInterval(async () => {
            if (!this.isProcessing) {
                await this.processQueue();
            }
        }, CONFIG.INTERVAL_MS);

        // Primera ejecución inmediata
        await this.processQueue();
    }

    /**
     * Procesa el siguiente lote de solicitudes
     */
    async processQueue() {
        this.isProcessing = true;

        try {
            // 1. Obtener solicitudes en estado 'processing'
            const applications = await this.getPendingApplications();

            if (applications.length === 0) {
                console.log('✅ No hay solicitudes pendientes de evaluación');
                this.isProcessing = false;
                return;
            }

            console.log(`\n📋 Procesando ${applications.length} solicitudes...`);

            // 2. Evaluar cada solicitud con la IA
            for (const app of applications) {
                await this.processApplication(app);
            }

            console.log(`\n✨ Lote completado. Total procesado: ${this.processedCount} | Errores: ${this.errorCount}`);

        } catch (error) {
            console.error('❌ Error en processQueue:', error);
        } finally {
            this.isProcessing = false;
        }
    }

    /**
     * Obtiene solicitudes pendientes de la base de datos
     */
    async getPendingApplications() {
        const query = `
            SELECT 
                id,
                form_responses,
                created_at
            FROM adoption_applications
            WHERE status = 'procesando'
            ORDER BY created_at ASC
            LIMIT $1
        `;

        const result = await db.query(query, [CONFIG.BATCH_SIZE]);
        return result.rows;
    }

    /**
     * Procesa una solicitud individual
     */
    async processApplication(app) {
        try {
            console.log(`🔄 Evaluando solicitud #${app.id}...`);

            // Llamar al servicio de IA
            const evaluation = await aiService.analyzeApplication(app.form_responses);

            // Determinar el nuevo estado (mapear a español)
            const newStatus = (evaluation.action === 'AUTO_REJECT' || evaluation.action === 'RECHAZAR_AUTO')
                ? 'rechazada_automaticamente' 
                : 'revision_pendiente';

            // Actualizar en la base de datos
            await this.updateApplicationStatus(app.id, {
                status: newStatus,
                ai_score: evaluation.score,
                ai_feedback: evaluation.short_reason,
                ai_flags: evaluation.flags,
                ai_evaluated_at: new Date(),
                ai_error: null
            });

            const emoji = newStatus === 'rechazada_automaticamente' ? '❌' : '✅';
            console.log(`${emoji} Solicitud #${app.id} -> ${newStatus} (Score: ${evaluation.score})`);

            // Actualizar CSV de aplicaciones en background
            csvDatasetService.updateApplicationsDataset().catch(() => {});

            this.processedCount++;

        } catch (error) {
            console.error(`❌ Error procesando solicitud #${app.id}:`, error.message);
            
            // Marcar como error pero no bloquear
            await this.updateApplicationStatus(app.id, {
                status: 'pending_review', // Fallback seguro
                ai_score: 50,
                ai_feedback: 'Error en evaluación automática. Requiere revisión manual.',
                ai_flags: ['Error de Sistema'],
                ai_evaluated_at: new Date(),
                ai_error: error.message
            });

            // Actualizar CSV incluso en caso de error
            csvDatasetService.updateApplicationsDataset().catch(() => {});

            this.errorCount++;
        }
    }

    /**
     * Actualiza el estado de una solicitud
     */
    async updateApplicationStatus(applicationId, data) {
        const query = `
            UPDATE adoption_applications
            SET 
                status = $1,
                ai_score = $2,
                ai_feedback = $3,
                ai_flags = $4,
                ai_evaluated_at = $5,
                ai_error = $6
            WHERE id = $7
        `;

        await db.query(query, [
            data.status,
            data.ai_score,
            data.ai_feedback,
            data.ai_flags,
            data.ai_evaluated_at,
            data.ai_error,
            applicationId
        ]);
    }

    /**
     * Procesa la cola una sola vez (útil para testing o ejecución manual)
     */
    async runOnce() {
        console.log('🔧 Ejecutando procesamiento único...');
        await this.processQueue();
        console.log('✅ Procesamiento completado.');
        
        // Esperar un poco para que se completen las queries
        setTimeout(() => {
            process.exit(0);
        }, 2000);
    }
}

// Exportar para uso en otros módulos
module.exports = ApplicationQueueWorker;

// Si se ejecuta directamente (node processApplicationQueue.js)
if (require.main === module) {
    const worker = new ApplicationQueueWorker();
    
    // Detectar argumentos de línea de comandos
    const args = process.argv.slice(2);
    
    if (args.includes('--once')) {
        // Ejecución única (útil para cron jobs)
        worker.runOnce();
    } else {
        // Loop infinito (proceso daemon)
        worker.start();
        
        // Manejo de señales para shutdown graceful
        process.on('SIGINT', () => {
            console.log('\n🛑 Worker detenido por usuario');
            process.exit(0);
        });

        process.on('SIGTERM', () => {
            console.log('\n🛑 Worker detenido');
            process.exit(0);
        });
    }
}
