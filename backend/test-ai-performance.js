/**
 * Script para medir el tiempo de respuesta del servicio de IA
 */

const aiService = require('./services/aiService');

// Datos de prueba - solicitud buena
const goodApplication = {
    whyAdopt: 'Quiero adoptar a este gato porque siempre he amado a los animales. Tengo una casa grande con jardín seguro donde puede jugar. Trabajo desde casa así que puedo darle toda la atención y cuidados que necesita. He tenido gatos antes y entiendo la responsabilidad que conlleva. Busco un compañero de vida, no un objeto decorativo.',
    acceptsSterilization: true,
    hasExperience: true,
    hasSpace: true,
    hasTime: true,
    livingSpace: 'casa',
    hasOtherPets: false
};

// Datos de prueba - solicitud mala
const badApplication = {
    whyAdopt: 'Quiero tener gatitos para vender y ganar dinero',
    acceptsSterilization: false,
    hasExperience: false,
    hasSpace: false,
    hasTime: false,
    livingSpace: 'apartamento',
    hasOtherPets: false
};

// Datos de prueba - solicitud media
const averageApplication = {
    whyAdopt: 'Me gustaría tener un gato',
    acceptsSterilization: true,
    hasExperience: false,
    hasSpace: true,
    hasTime: true,
    livingSpace: 'apartamento',
    hasOtherPets: false
};

async function measurePerformance() {
    console.log('🧪 Midiendo rendimiento del servicio de IA...\n');

    const tests = [
        { name: 'Solicitud Excelente', data: goodApplication },
        { name: 'Solicitud Problemática', data: badApplication },
        { name: 'Solicitud Promedio', data: averageApplication }
    ];

    const results = [];

    for (const test of tests) {
        console.log(`\n📊 Evaluando: ${test.name}`);
        console.log('─'.repeat(60));
        
        const startTime = Date.now();
        
        try {
            const evaluation = await aiService.analyzeApplication(test.data);
            
            const endTime = Date.now();
            const duration = endTime - startTime;
            
            console.log(`⏱️  Tiempo: ${duration}ms (${(duration/1000).toFixed(2)}s)`);
            console.log(`📈 Score: ${evaluation.score}/100`);
            console.log(`💭 Razón: ${evaluation.short_reason}`);
            console.log(`🏷️  Flags: ${evaluation.flags.join(', ')}`);
            console.log(`✅ Acción: ${evaluation.action}`);
            
            results.push({
                test: test.name,
                duration,
                score: evaluation.score,
                action: evaluation.action
            });
            
        } catch (error) {
            console.error(`❌ Error: ${error.message}`);
            results.push({
                test: test.name,
                duration: -1,
                error: error.message
            });
        }
    }

    // Resumen
    console.log('\n\n📋 RESUMEN DE RENDIMIENTO');
    console.log('═'.repeat(60));
    
    const successfulTests = results.filter(r => r.duration > 0);
    if (successfulTests.length > 0) {
        const avgTime = successfulTests.reduce((sum, r) => sum + r.duration, 0) / successfulTests.length;
        const minTime = Math.min(...successfulTests.map(r => r.duration));
        const maxTime = Math.max(...successfulTests.map(r => r.duration));
        
        console.log(`\n⏱️  Tiempo promedio: ${avgTime.toFixed(0)}ms (${(avgTime/1000).toFixed(2)}s)`);
        console.log(`⚡ Tiempo mínimo: ${minTime}ms (${(minTime/1000).toFixed(2)}s)`);
        console.log(`🐌 Tiempo máximo: ${maxTime}ms (${(maxTime/1000).toFixed(2)}s)`);
        
        console.log('\n💡 Análisis:');
        if (avgTime < 3000) {
            console.log('   ✅ EXCELENTE: Respuestas muy rápidas (< 3s)');
        } else if (avgTime < 5000) {
            console.log('   ✅ BUENO: Respuestas aceptables (3-5s)');
        } else if (avgTime < 10000) {
            console.log('   ⚠️  ACEPTABLE: Un poco lento (5-10s)');
        } else {
            console.log('   ❌ LENTO: Necesita optimización (> 10s)');
        }
    } else {
        console.log('❌ Todas las pruebas fallaron. La API de Gemini no está disponible.');
        console.log('ℹ️  El sistema usa análisis fallback (instantáneo < 100ms)');
    }
    
    console.log('\n');
}

// Ejecutar
measurePerformance().catch(console.error);
