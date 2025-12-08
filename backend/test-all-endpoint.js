const axios = require('axios');

async function testAllEndpoint() {
    try {
        console.log('╔════════════════════════════════════════════════════════════╗');
        console.log('║   TEST: Verificación del Endpoint /api/tracking/all       ║');
        console.log('╚════════════════════════════════════════════════════════════╝\n');
        
        console.log('📝 PASO 1: Login como admin...');
        const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
            email: 'admin@katze.com',
            password: 'admin123'
        });
        
        const token = loginResponse.data.token;
        console.log('   ✓ Login exitoso\n');
        
        console.log('📋 PASO 2: Obteniendo TODAS las tareas de seguimiento...');
        const tasksResponse = await axios.get('http://localhost:3000/api/tracking/all', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const tasks = tasksResponse.data.data?.tasks || tasksResponse.data.tasks;
        console.log(`   ✓ Recibidas ${tasks.length} tareas\n`);
        
        console.log('📊 PASO 3: Muestra de las primeras 5 tareas:');
        console.log('─────────────────────────────────────────────────────────────');
        tasks.slice(0, 5).forEach((task, index) => {
            const adoptante = task.applicant_name || '❌ FALTA';
            const rescatista = task.owner_name || '❌ FALTA';
            const statusEmoji = task.status === 'completada' ? '✅' : task.status === 'atrasada' ? '⏰' : '⏳';
            
            console.log(`\n${index + 1}. ${statusEmoji} ${task.task_type}`);
            console.log(`   🐱 Gato:       ${task.cat_name}`);
            console.log(`   👤 Adoptante:  ${adoptante}`);
            console.log(`   🏥 Rescatista: ${rescatista}`);
            console.log(`   📅 Vence:      ${new Date(task.due_date).toLocaleDateString('es-ES')}`);
        });
        console.log('\n─────────────────────────────────────────────────────────────');
        
        console.log('\n🔍 PASO 4: Validación de datos completos:');
        const missingAdoptante = tasks.filter(t => !t.applicant_name);
        const missingRescatista = tasks.filter(t => !t.owner_name);
        
        if (missingAdoptante.length > 0) {
            console.log(`   ❌ ${missingAdoptante.length} tareas SIN applicant_name`);
            console.log('   IDs afectados:', missingAdoptante.map(t => t.id).join(', '));
        } else {
            console.log('   ✅ Todas las tareas tienen applicant_name');
        }
        
        if (missingRescatista.length > 0) {
            console.log(`   ❌ ${missingRescatista.length} tareas SIN owner_name`);
            console.log('   IDs afectados:', missingRescatista.map(t => t.id).join(', '));
        } else {
            console.log('   ✅ Todas las tareas tienen owner_name');
        }
        
        console.log('\n📈 PASO 5: Distribución por estado:');
        const statusCounts = tasks.reduce((acc, task) => {
            acc[task.status] = (acc[task.status] || 0) + 1;
            return acc;
        }, {});
        
        Object.entries(statusCounts).forEach(([status, count]) => {
            const emoji = status === 'completada' ? '✅' : status === 'atrasada' ? '⏰' : '⏳';
            const percentage = ((count / tasks.length) * 100).toFixed(1);
            console.log(`   ${emoji} ${status.padEnd(12)}: ${count.toString().padStart(2)} tareas (${percentage}%)`);
        });
        
        console.log('\n📦 PASO 6: Distribución por tipo de tarea:');
        const typeCounts = tasks.reduce((acc, task) => {
            acc[task.task_type] = (acc[task.task_type] || 0) + 1;
            return acc;
        }, {});
        
        Object.entries(typeCounts).forEach(([type, count]) => {
            const emoji = type.includes('Esterilización') ? '💉' : '🏥';
            console.log(`   ${emoji} ${type}: ${count} tareas`);
        });
        
        console.log('\n╔════════════════════════════════════════════════════════════╗');
        console.log('║              ✅ TEST COMPLETADO EXITOSAMENTE              ║');
        console.log('╚════════════════════════════════════════════════════════════╝');
        console.log('\n💡 El endpoint /api/tracking/all funciona correctamente.');
        console.log('   Ahora verifica el frontend en http://localhost:5173\n');
        
    } catch (error) {
        console.log('\n╔════════════════════════════════════════════════════════════╗');
        console.log('║                    ❌ ERROR EN TEST                        ║');
        console.log('╚════════════════════════════════════════════════════════════╝\n');
        
        if (error.code === 'ECONNREFUSED') {
            console.log('❌ No se puede conectar al servidor backend.');
            console.log('   Asegúrate de que el backend esté corriendo:');
            console.log('   → cd backend');
            console.log('   → npm start\n');
        } else if (error.response?.status === 401) {
            console.log('❌ Error de autenticación (401)');
            console.log('   Las credenciales de admin pueden ser incorrectas.\n');
        } else if (error.response?.status === 403) {
            console.log('❌ Acceso denegado (403)');
            console.log('   El usuario no tiene permisos de administrador.\n');
        } else {
            console.log('❌ Error inesperado:');
            console.log('   Mensaje:', error.message);
            if (error.response?.data) {
                console.log('   Detalles:', JSON.stringify(error.response.data, null, 2));
            }
        }
    }
}

console.log('\n🚀 Iniciando test del endpoint /api/tracking/all...\n');
testAllEndpoint();
