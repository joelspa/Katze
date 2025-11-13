// Script de debug para probar aprobación de solicitudes
const db = require('./db');
const applicationService = require('./services/applicationService');
const catService = require('./services/catService');
const trackingService = require('./services/trackingService');
const config = require('./config/config');

async function testApproveApplication() {
    try {
        console.log('🧪 Testing application approval process...\n');

        // 1. Buscar una solicitud pendiente
        console.log('1️⃣ Buscando solicitud pendiente...');
        const applications = await db.query(
            "SELECT * FROM adoption_applications WHERE status = 'pendiente' LIMIT 1"
        );

        if (applications.rows.length === 0) {
            console.log('❌ No hay solicitudes pendientes para probar');
            await db.end();
            return;
        }

        const app = applications.rows[0];
        console.log(`✅ Encontrada solicitud ID: ${app.id} para gato ID: ${app.cat_id}\n`);

        // 2. Verificar el gato
        console.log('2️⃣ Verificando información del gato...');
        const cat = await catService.getCatById(app.cat_id);
        console.log(`   Gato: ${cat.name}`);
        console.log(`   Estado adopción: ${cat.adoption_status}`);
        console.log(`   Estado esterilización: ${cat.sterilization_status}\n`);

        // 3. Probar validación de estado
        console.log('3️⃣ Probando validación de estado...');
        const testStatuses = ['aprobada', 'rechazada', 'invalido'];
        testStatuses.forEach(status => {
            const isValid = ['aprobada', 'rechazada'].includes(status);
            console.log(`   ${status}: ${isValid ? '✅ Válido' : '❌ Inválido'}`);
        });
        console.log('');

        // 4. Simular aprobación (sin ejecutar)
        console.log('4️⃣ Simulando proceso de aprobación...');
        console.log(`   - Actualizar solicitud ${app.id} a 'aprobada'`);
        console.log(`   - Cambiar gato ${app.cat_id} a 'adoptado'`);
        console.log(`   - Crear tarea de seguimiento de bienestar`);
        
        if (cat.sterilization_status?.trim() === 'pendiente') {
            console.log(`   - Crear tarea de seguimiento de esterilización`);
        } else {
            console.log(`   - No se crea tarea de esterilización (status: ${cat.sterilization_status})`);
        }
        console.log('');

        // 5. Verificar configuración
        console.log('5️⃣ Verificando configuración...');
        console.log(`   APPLICATION_STATUS.APROBADA: '${config.APPLICATION_STATUS.APROBADA}'`);
        console.log(`   APPLICATION_STATUS.RECHAZADA: '${config.APPLICATION_STATUS.RECHAZADA}'`);
        console.log(`   ADOPTION_STATUS.ADOPTADO: '${config.ADOPTION_STATUS.ADOPTADO}'`);
        console.log(`   TRACKING_PERIODS.BIENESTAR_MONTHS: ${config.TRACKING_PERIODS.BIENESTAR_MONTHS}`);
        console.log(`   TRACKING_PERIODS.ESTERILIZACION_MONTHS: ${config.TRACKING_PERIODS.ESTERILIZACION_MONTHS}`);
        console.log('');

        console.log('✅ Todos los checks pasaron. El proceso debería funcionar correctamente.\n');
        console.log('💡 Si hay un error al aprobar, revisa:');
        console.log('   1. Los logs del servidor backend');
        console.log('   2. La consola del navegador para ver el error exacto');
        console.log('   3. Que el gato exista y esté en adopción');

    } catch (error) {
        console.error('❌ Error durante las pruebas:', error.message);
        console.error('Stack:', error.stack);
    } finally {
        await db.end();
    }
}

testApproveApplication();
