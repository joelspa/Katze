/**
 * Script para Generar Datasets en Firebase Storage
 * Genera archivos JSON con datos de la plataforma
 * 
 * Uso: node generate-datasets.js
 */

require('dotenv').config();
const admin = require('firebase-admin');
const db = require('./db');

console.log('📊 Generando datasets en Firebase Storage...\n');

// Inicializar Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: 'katze-app',
        storageBucket: 'katze-app.firebasestorage.app'
    });
}

const storage = admin.storage();
const bucket = storage.bucket('katze-app.firebasestorage.app');

/**
 * Guarda un dataset en Firebase Storage
 */
async function saveDataset(filename, data) {
    try {
        const filepath = `datasets/${filename}`;
        const file = bucket.file(filepath);
        const jsonContent = JSON.stringify(data, null, 2);
        
        await file.save(jsonContent, {
            metadata: {
                contentType: 'application/json',
                metadata: {
                    lastUpdated: new Date().toISOString(),
                    recordCount: Array.isArray(data) ? data.length : Object.keys(data).length
                }
            }
        });
        
        return `gs://${bucket.name}/${filepath}`;
    } catch (error) {
        console.error(`Error guardando ${filename}:`, error.message);
        return null;
    }
}

async function generateAllDatasets() {
    try {
        // 1. Users Dataset
        console.log('1. Generando users.json...');
        const usersResult = await db.query(`
            SELECT id, full_name, email, role, phone, created_at
            FROM users
            ORDER BY created_at DESC
        `);
        
        const usersData = {
            generated_at: new Date().toISOString(),
            total_users: usersResult.rows.length,
            users: usersResult.rows
        };
        
        const usersUrl = await saveDataset('users.json', usersData);
        if (usersUrl) {
            console.log(`   ✅ ${usersResult.rows.length} usuarios guardados`);
            console.log(`   📁 ${usersUrl}\n`);
        }

        // 2. Cats Dataset
        console.log('2. Generando cats.json...');
        const catsResult = await db.query(`
            SELECT id, name, breed, age, adoption_status, 
                   sterilization_status, description, living_space_requirement, created_at
            FROM cats
            ORDER BY created_at DESC
        `);
        
        const catsData = {
            generated_at: new Date().toISOString(),
            total_cats: catsResult.rows.length,
            cats: catsResult.rows
        };
        
        const catsUrl = await saveDataset('cats.json', catsData);
        if (catsUrl) {
            console.log(`   ✅ ${catsResult.rows.length} gatos guardados`);
            console.log(`   📁 ${catsUrl}\n`);
        }

        // 3. Applications Dataset
        console.log('3. Generando applications.json...');
        const appsResult = await db.query(`
            SELECT 
                a.id, a.applicant_id, a.cat_id, a.status,
                a.created_at,
                u.full_name as applicant_name,
                c.name as cat_name
            FROM adoption_applications a
            LEFT JOIN users u ON a.applicant_id = u.id
            LEFT JOIN cats c ON a.cat_id = c.id
            ORDER BY a.created_at DESC
        `);
        
        const appsData = {
            generated_at: new Date().toISOString(),
            total_applications: appsResult.rows.length,
            applications: appsResult.rows
        };
        
        const appsUrl = await saveDataset('applications.json', appsData);
        if (appsUrl) {
            console.log(`   ✅ ${appsResult.rows.length} solicitudes guardadas`);
            console.log(`   📁 ${appsUrl}\n`);
        }

        // 4. Statistics Dataset
        console.log('4. Generando statistics.json...');
        const statsResult = await db.query(`
            SELECT 
                (SELECT COUNT(*) FROM users WHERE role = 'adoptante') as total_adoptantes,
                (SELECT COUNT(*) FROM users WHERE role = 'rescatista') as total_rescatistas,
                (SELECT COUNT(*) FROM cats WHERE adoption_status = 'en_adopcion') as gatos_disponibles,
                (SELECT COUNT(*) FROM cats WHERE adoption_status = 'adoptado') as gatos_adoptados,
                (SELECT COUNT(*) FROM adoption_applications WHERE status = 'pending') as solicitudes_pendientes,
                (SELECT COUNT(*) FROM adoption_applications WHERE status = 'approved') as solicitudes_aprobadas
        `);
        
        const statsData = {
            generated_at: new Date().toISOString(),
            statistics: statsResult.rows[0]
        };
        
        const statsUrl = await saveDataset('statistics.json', statsData);
        if (statsUrl) {
            console.log(`   ✅ Estadísticas generadas`);
            console.log(`   📁 ${statsUrl}\n`);
        }

        console.log('='.repeat(60));
        console.log('✅ Todos los datasets generados correctamente');
        console.log('='.repeat(60));
        console.log('\n📁 Ve a Firebase Console → Storage → datasets/');
        console.log('   para ver los archivos JSON generados.\n');
        
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        process.exit(1);
    }
}

generateAllDatasets();
