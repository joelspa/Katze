#!/usr/bin/env node
/**
 * Script para generar datasets CSV iniciales
 * Ejecutar: node backend/generate-csv-datasets.js
 * 
 * Genera 3 archivos CSV en Firebase Storage:
 * - cats.csv
 * - adoption_applications.csv
 * - tracking_tasks.csv
 */

require('dotenv').config();
const csvDatasetService = require('./services/csvDatasetService');

async function main() {
    console.log('📊 Iniciando generación de datasets CSV...\n');

    try {
        if (!csvDatasetService.isAvailable()) {
            console.error('❌ Firebase Storage no está disponible.');
            console.error('Verifica tu archivo serviceAccountKey.json y las credenciales de Firebase.');
            process.exit(1);
        }

        console.log('✅ Firebase Storage conectado correctamente\n');

        // Generar todos los CSVs
        console.log('🔄 Generando users.csv...');
        const usersUrl = await csvDatasetService.updateUsersDataset();
        if (usersUrl) {
            console.log(`✅ users.csv generado: ${usersUrl}\n`);
        } else {
            console.log('⚠️ users.csv no se pudo generar\n');
        }

        console.log('🔄 Generando cats.csv...');
        const catsUrl = await csvDatasetService.updateCatsDataset();
        if (catsUrl) {
            console.log(`✅ cats.csv generado: ${catsUrl}\n`);
        } else {
            console.log('⚠️ cats.csv no se pudo generar\n');
        }

        console.log('🔄 Generando adoption_applications.csv...');
        const appsUrl = await csvDatasetService.updateApplicationsDataset();
        if (appsUrl) {
            console.log(`✅ adoption_applications.csv generado: ${appsUrl}\n`);
        } else {
            console.log('⚠️ adoption_applications.csv no se pudo generar\n');
        }

        console.log('🔄 Generando tracking_tasks.csv...');
        const trackingUrl = await csvDatasetService.updateTrackingDataset();
        if (trackingUrl) {
            console.log(`✅ tracking_tasks.csv generado: ${trackingUrl}\n`);
        } else {
            console.log('⚠️ tracking_tasks.csv no se pudo generar\n');
        }

        console.log('✅ Generación de CSVs completada!\n');
        console.log('📁 Ubicación: Firebase Storage > datasets/');
        console.log('🔗 Archivos generados:');
        console.log('   - users.csv');
        console.log('   - cats.csv');
        console.log('   - adoption_applications.csv');
        console.log('   - tracking_tasks.csv\n');

        process.exit(0);

    } catch (error) {
        console.error('\n❌ Error durante la generación:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

main();
