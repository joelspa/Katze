#!/usr/bin/env node

/**
 * Script de verificación de variables de entorno
 * Verifica que todas las variables necesarias estén configuradas
 */

require('dotenv').config();

const REQUIRED_VARS = {
    backend: [
        'PORT',
        'DB_USER',
        'DB_HOST',
        'DB_NAME',
        'DB_PASSWORD',
        'DB_PORT',
        'JWT_SECRET',
        'GEMINI_API_KEY',
        'FIREBASE_PROJECT_ID'
    ],
    frontend: [
        'VITE_API_URL',
        'VITE_FIREBASE_API_KEY',
        'VITE_FIREBASE_AUTH_DOMAIN',
        'VITE_FIREBASE_PROJECT_ID',
        'VITE_FIREBASE_STORAGE_BUCKET',
        'VITE_FIREBASE_MESSAGING_SENDER_ID',
        'VITE_FIREBASE_APP_ID'
    ]
};

const SENSITIVE_PATTERNS = [
    /AIzaSy[A-Za-z0-9_-]{33}/g,  // Firebase API Keys
    /-----BEGIN PRIVATE KEY-----/g, // Private keys
    /sk-[A-Za-z0-9]{48}/g,        // OpenAI-like keys
];

console.log('🔐 Verificando configuración de variables de entorno...\n');

// Determinar el entorno (backend o frontend)
const isBackend = __dirname.includes('backend');
const context = isBackend ? 'backend' : 'frontend';
const requiredVars = REQUIRED_VARS[context];

let missingVars = [];
let emptyVars = [];
let errors = 0;

// Verificar variables requeridas
requiredVars.forEach(varName => {
    if (!process.env[varName]) {
        missingVars.push(varName);
        errors++;
    } else if (process.env[varName].includes('your_') || 
               process.env[varName].includes('tu_') ||
               process.env[varName] === '') {
        emptyVars.push(varName);
        errors++;
    }
});

// Verificar archivo serviceAccountKey.json en backend
if (isBackend) {
    const fs = require('fs');
    const path = require('path');
    const serviceAccountPath = path.join(__dirname, '..', 'config', 'serviceAccountKey.json');
    
    if (!fs.existsSync(serviceAccountPath) && !process.env.FIREBASE_SERVICE_ACCOUNT) {
        console.log('⚠️  ADVERTENCIA: No se encontró serviceAccountKey.json ni FIREBASE_SERVICE_ACCOUNT');
        console.log('   → Para desarrollo local: coloca serviceAccountKey.json en backend/config/');
        console.log('   → Para producción: configura FIREBASE_SERVICE_ACCOUNT en variables de entorno\n');
        errors++;
    }
}

// Mostrar resultados
if (errors === 0) {
    console.log('✅ Todas las variables de entorno están configuradas correctamente');
    console.log(`✅ Contexto: ${context.toUpperCase()}`);
    console.log(`✅ Variables verificadas: ${requiredVars.length}`);
} else {
    console.log(`❌ Se encontraron ${errors} problema(s) en la configuración:\n`);
    
    if (missingVars.length > 0) {
        console.log('📋 Variables faltantes:');
        missingVars.forEach(v => console.log(`   • ${v}`));
        console.log('');
    }
    
    if (emptyVars.length > 0) {
        console.log('⚠️  Variables con valores de ejemplo (necesitan configuración):');
        emptyVars.forEach(v => console.log(`   • ${v}`));
        console.log('');
    }
    
    console.log('💡 Solución:');
    console.log(`   1. Copia el archivo .env.example a .env`);
    console.log(`   2. Edita .env con tus credenciales reales`);
    console.log(`   3. Consulta ENV_SETUP.md para más información\n`);
    
    process.exit(1);
}

// Verificar que no haya credenciales en el código fuente
console.log('\n🔍 Verificando que no haya credenciales expuestas en el código...');

const { execSync } = require('child_process');

try {
    // Buscar patrones sensibles en el código
    SENSITIVE_PATTERNS.forEach(pattern => {
        try {
            const result = execSync(
                `git grep -n "${pattern.source}" -- "*.js" "*.ts" "*.jsx" "*.tsx" "*.json" ":!node_modules" ":!dist" ":!build"`,
                { encoding: 'utf8' }
            );
            
            if (result) {
                console.log('⚠️  ADVERTENCIA: Se encontraron posibles credenciales en el código:');
                console.log(result);
                errors++;
            }
        } catch (e) {
            // No se encontró el patrón (esto es bueno)
        }
    });
    
    if (errors === 0) {
        console.log('✅ No se encontraron credenciales expuestas en el código');
    }
} catch (e) {
    console.log('⚠️  No se pudo verificar credenciales expuestas (git no disponible o no es un repositorio)');
}

console.log('\n✨ Verificación completada\n');
