// CSV Dataset Service for Firebase Storage
// Automatically saves datasets as CSV files to Firebase Storage
// Updates on every new record: cats, applications, tracking tasks

const admin = require('firebase-admin');
const db = require('../db');
const axios = require('axios');

class CSVDatasetService {
    constructor() {
        try {
            console.log('[CSV] Inicializando CSV Dataset Service...');
            console.log('[CSV] Firebase apps count:', admin.apps.length);
            
            // Initialize Firebase Admin if not already initialized
            if (admin.apps.length === 0) {
                console.log('[CSV] Inicializando Firebase Admin...');
                
                try {
                    // Intentar cargar desde archivo local primero
                    let credential;
                    
                    try {
                        const serviceAccount = require('../serviceAccountKey.json');
                        console.log('[CSV] Usando serviceAccountKey.json local');
                        credential = admin.credential.cert(serviceAccount);
                    } catch (fileError) {
                        // Si no existe el archivo, intentar con variable de entorno
                        console.log('[CSV] serviceAccountKey.json no encontrado, intentando GOOGLE_APPLICATION_CREDENTIALS...');
                        
                        if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
                            console.log('[CSV] Usando GOOGLE_APPLICATION_CREDENTIALS de variable de entorno');
                            credential = admin.credential.applicationDefault();
                        } else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
                            console.log('[CSV] Usando FIREBASE_SERVICE_ACCOUNT de variable de entorno');
                            const serviceAccountFromEnv = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
                            credential = admin.credential.cert(serviceAccountFromEnv);
                        } else {
                            throw new Error('No se encontró credencial de Firebase (ni archivo ni variables de entorno)');
                        }
                    }
                    
                    admin.initializeApp({
                        credential: credential,
                        storageBucket: 'katze-app.firebasestorage.app'
                    });
                    console.log('[CSV SUCCESS] Firebase Admin inicializado correctamente');
                } catch (initError) {
                    console.error('[CSV ERROR] Error inicializando Firebase:', initError.message);
                    throw initError;
                }
            } else {
                console.log('[CSV] Firebase Admin ya está inicializado');
            }
            
            // Obtener Storage y Bucket con mejor manejo de errores
            this.storage = admin.storage();
            
            // Verificar que storage esté disponible
            if (!this.storage) {
                throw new Error('Storage no pudo ser inicializado');
            }
            
            // Obtener bucket con nombre explícito
            const bucketName = 'katze-app.firebasestorage.app';
            this.bucket = this.storage.bucket(bucketName);
            
            // Verificar que bucket esté correctamente inicializado
            if (!this.bucket || !this.bucket.name) {
                throw new Error('Bucket no pudo ser inicializado correctamente');
            }
            
            console.log('[CSV SUCCESS] Storage y Bucket obtenidos correctamente');
            console.log('[CSV] Bucket name:', this.bucket.name);
            
        } catch (error) {
            console.error('[CSV ERROR] CSV Dataset Service initialization failed:', error.message);
            console.error('[CSV ERROR] Error completo:', error);
            this.storage = null;
            this.bucket = null;
        }
    }

    /**
     * Check if Firebase Storage is available
     */
    isAvailable() {
        return this.storage !== null && this.bucket !== null;
    }

    /**
     * Convert array of objects to CSV format
     * @param {Array} data - Array of objects
     * @returns {string} CSV string
     */
    _arrayToCSV(data) {
        if (!data || data.length === 0) {
            return '';
        }

        // Get headers from first object
        const headers = Object.keys(data[0]);
        
        // Escape CSV field (handle commas, quotes, newlines)
        const escapeField = (field) => {
            if (field === null || field === undefined) return '';
            
            const str = String(field);
            
            // If field contains comma, quote, or newline, wrap in quotes and escape internal quotes
            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                return `"${str.replace(/"/g, '""')}"`;
            }
            
            return str;
        };

        // Build CSV
        const headerRow = headers.map(h => escapeField(h)).join(',');
        const dataRows = data.map(row => 
            headers.map(header => escapeField(row[header])).join(',')
        );

        return [headerRow, ...dataRows].join('\n');
    }

    /**
     * Upload CSV to Firebase Storage usando API REST
     * @param {string} filename - Name of CSV file
     * @param {string} csvContent - CSV content as string
     * @returns {Promise<string|null>} Public URL or null
     */
    async _uploadCSV(filename, csvContent) {
        try {
            console.log(`[CSV] Intentando subir ${filename}...`);
            
            if (!this.isAvailable()) {
                console.log('[CSV WARNING] Firebase Storage not available, skipping CSV upload');
                console.log('[CSV WARNING] storage:', this.storage !== null, 'bucket:', this.bucket !== null);
                return null;
            }

            const filepath = `datasets/${filename}`;
            const csvSize = Buffer.byteLength(csvContent, 'utf8');

            console.log(`[CSV] Subiendo ${filename} (${csvSize} bytes) usando API REST...`);

            // Obtener access token de la app de Firebase ya inicializada
            const app = admin.app();
            const accessToken = await app.options.credential.getAccessToken();
            
            if (!accessToken || !accessToken.access_token) {
                throw new Error('No se pudo obtener access token de Firebase Admin');
            }

            console.log(`[CSV] Access token obtenido correctamente`);

            // Subir usando Google Cloud Storage REST API
            const uploadUrl = `https://storage.googleapis.com/upload/storage/v1/b/${this.bucket.name}/o?uploadType=media&name=${encodeURIComponent(filepath)}`;
            
            const response = await axios.post(uploadUrl, csvContent, {
                headers: {
                    'Authorization': `Bearer ${accessToken.access_token}`,
                    'Content-Type': 'text/csv; charset=utf-8',
                },
            });

            console.log(`[CSV SUCCESS] Archivo subido vía REST API`);

            // Hacer el archivo público usando la REST API
            const makePublicUrl = `https://storage.googleapis.com/storage/v1/b/${this.bucket.name}/o/${encodeURIComponent(filepath)}/acl`;
            
            await axios.post(makePublicUrl, {
                entity: 'allUsers',
                role: 'READER'
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken.access_token}`,
                    'Content-Type': 'application/json',
                },
            }).catch(err => {
                console.log(`[CSV WARNING] No se pudo hacer público (puede que ya lo sea):`, err.message);
            });

            const publicUrl = `https://storage.googleapis.com/${this.bucket.name}/${filepath}`;
            console.log(`[CSV SUCCESS] CSV uploaded: ${filename} (${csvSize} bytes)`);
            console.log(`[CSV] Download URL: ${publicUrl}`);
            return publicUrl;

        } catch (error) {
            console.error(`[CSV ERROR] Failed to upload CSV ${filename}:`, error.message);
            console.error(`[CSV ERROR] Error code:`, error.code);
            
            if (error.response) {
                console.error(`[CSV ERROR] Response status:`, error.response.status);
                console.error(`[CSV ERROR] Response data:`, JSON.stringify(error.response.data));
            }
            
            console.error(`[CSV ERROR] Bucket name:`, this.bucket?.name || 'undefined');
            
            return null;
        }
    }

    /**
     * Update cats dataset (CSV)
     * Triggered on: createCat, updateCat, deleteCat, changeApprovalStatus
     */
    async updateCatsDataset() {
        try {
            console.log('[CSV] Iniciando actualización de cats.csv...');
            
            const result = await db.query(`
                SELECT 
                    c.id,
                    c.name,
                    c.age,
                    c.breed,
                    c.description,
                    c.health_status,
                    c.sterilization_status,
                    c.living_space_requirement,
                    c.adoption_status,
                    c.approval_status,
                    c.story,
                    c.created_at,
                    u.full_name as owner_name,
                    u.email as owner_email,
                    u.role as owner_role
                FROM cats c
                LEFT JOIN users u ON c.owner_id = u.id
                ORDER BY c.created_at DESC
            `);

            console.log(`[CSV] Obtenidos ${result.rows.length} gatos de la base de datos`);

            const cats = result.rows.map(cat => ({
                id: cat.id,
                name: cat.name,
                age: cat.age,
                breed: cat.breed || 'Mestizo',
                description: cat.description,
                health_status: cat.health_status,
                sterilization_status: cat.sterilization_status,
                living_space_requirement: cat.living_space_requirement,
                adoption_status: cat.adoption_status,
                approval_status: cat.approval_status,
                story: cat.story || '',
                created_at: cat.created_at,
                owner_name: cat.owner_name,
                owner_email: cat.owner_email,
                owner_role: cat.owner_role
            }));

            const csvContent = this._arrayToCSV(cats);
            console.log(`[CSV] CSV generado con ${csvContent.split('\n').length - 1} registros`);
            
            const url = await this._uploadCSV('cats.csv', csvContent);
            
            if (url) {
                console.log(`[CSV SUCCESS] cats.csv actualizado correctamente: ${url}`);
            } else {
                console.log('[CSV WARNING] cats.csv no se pudo subir (Firebase no disponible)');
            }
            
            return url;

        } catch (error) {
            console.error('[CSV ERROR] Failed to update cats CSV:', error.message);
            console.error('[CSV ERROR] Stack:', error.stack);
            return null;
        }
    }

    /**
     * Update adoption applications dataset (CSV)
     * Triggered on: createApplication, updateApplicationStatus, AI evaluation
     */
    async updateApplicationsDataset() {
        try {
            const result = await db.query(`
                SELECT 
                    a.id,
                    a.created_at,
                    a.status,
                    c.id as cat_id,
                    c.name as cat_name,
                    c.breed as cat_breed,
                    c.age as cat_age,
                    u.id as applicant_id,
                    u.full_name as applicant_name,
                    u.email as applicant_email,
                    u.phone as applicant_phone,
                    a.form_responses,
                    a.ai_score,
                    a.ai_feedback,
                    a.ai_flags,
                    a.ai_evaluated_at,
                    a.ai_error,
                    owner.full_name as rescuer_name,
                    owner.email as rescuer_email
                FROM adoption_applications a
                JOIN cats c ON a.cat_id = c.id
                JOIN users u ON a.applicant_id = u.id
                LEFT JOIN users owner ON c.owner_id = owner.id
                ORDER BY a.created_at DESC
            `);

            const applications = result.rows.map(app => {
                // Parse form_responses JSON
                const formData = app.form_responses || {};
                
                return {
                    id: app.id,
                    created_at: app.created_at,
                    status: app.status,
                    cat_id: app.cat_id,
                    cat_name: app.cat_name,
                    cat_breed: app.cat_breed || 'Mestizo',
                    cat_age: app.cat_age,
                    applicant_id: app.applicant_id,
                    applicant_name: app.applicant_name,
                    applicant_email: app.applicant_email,
                    applicant_phone: app.applicant_phone || '',
                    home_type: formData.home_type || '',
                    living_space_size: formData.living_space_size || '',
                    has_nets: formData.has_nets || false,
                    has_other_pets: formData.has_other_pets || false,
                    other_pets_details: formData.other_pets_details || '',
                    has_children: formData.has_children || false,
                    children_ages: formData.children_ages || '',
                    pet_experience: formData.pet_experience || '',
                    sterilization_agreement: formData.sterilization_agreement || '',
                    time_availability: formData.time_availability || '',
                    financial_capacity: formData.financial_capacity || '',
                    motivation: formData.motivation || '',
                    emergency_plan: formData.emergency_plan || '',
                    ai_score: app.ai_score || '',
                    ai_feedback: app.ai_feedback || '',
                    ai_flags: Array.isArray(app.ai_flags) ? app.ai_flags.join('; ') : '',
                    ai_evaluated_at: app.ai_evaluated_at || '',
                    ai_error: app.ai_error || '',
                    rescuer_name: app.rescuer_name,
                    rescuer_email: app.rescuer_email
                };
            });

            const csvContent = this._arrayToCSV(applications);
            return await this._uploadCSV('adoption_applications.csv', csvContent);

        } catch (error) {
            console.error('[CSV ERROR] Failed to update applications CSV:', error.message);
            return null;
        }
    }

    /**
     * Update users dataset (CSV)
     * Triggered on: createUser, updateUserRole, register
     */
    async updateUsersDataset() {
        try {
            const result = await db.query(`
                SELECT 
                    id,
                    full_name,
                    email,
                    phone,
                    role,
                    created_at
                FROM users
                ORDER BY created_at DESC
            `);

            const users = result.rows.map(user => ({
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                phone: user.phone || '',
                role: user.role,
                created_at: user.created_at
            }));

            const csvContent = this._arrayToCSV(users);
            return await this._uploadCSV('users.csv', csvContent);

        } catch (error) {
            console.error('[CSV ERROR] Failed to update users CSV:', error.message);
            return null;
        }
    }

    /**
     * Update tracking tasks dataset (CSV)
     * Triggered on: createTrackingTask, completeTask, updateTaskStatus
     */
    async updateTrackingDataset() {
        try {
            const result = await db.query(`
                SELECT 
                    t.id,
                    t.task_type,
                    t.due_date,
                    t.status,
                    t.updated_at,
                    t.notes,
                    t.certificate_url,
                    t.created_at,
                    a.id as application_id,
                    c.id as cat_id,
                    c.name as cat_name,
                    adopter.full_name as adopter_name,
                    adopter.email as adopter_email,
                    adopter.phone as adopter_phone,
                    rescuer.full_name as rescuer_name,
                    rescuer.email as rescuer_email
                FROM tracking_tasks t
                JOIN adoption_applications a ON t.application_id = a.id
                JOIN cats c ON a.cat_id = c.id
                JOIN users adopter ON a.applicant_id = adopter.id
                LEFT JOIN users rescuer ON c.owner_id = rescuer.id
                ORDER BY t.created_at DESC
            `);

            const tasks = result.rows.map(task => ({
                id: task.id,
                task_type: task.task_type,
                due_date: task.due_date,
                status: task.status,
                updated_at: task.updated_at || '',
                notes: task.notes || '',
                certificate_url: task.certificate_url || '',
                created_at: task.created_at,
                application_id: task.application_id,
                cat_id: task.cat_id,
                cat_name: task.cat_name,
                adopter_name: task.adopter_name,
                adopter_email: task.adopter_email,
                adopter_phone: task.adopter_phone || '',
                rescuer_name: task.rescuer_name,
                rescuer_email: task.rescuer_email,
                days_overdue: task.status === 'pendiente' && new Date(task.due_date) < new Date() 
                    ? Math.floor((new Date() - new Date(task.due_date)) / (1000 * 60 * 60 * 24))
                    : 0
            }));

            const csvContent = this._arrayToCSV(tasks);
            return await this._uploadCSV('tracking_tasks.csv', csvContent);

        } catch (error) {
            console.error('[CSV ERROR] Failed to update tracking CSV:', error.message);
            return null;
        }
    }

    /**
     * Update all datasets at once
     * Useful for manual refresh or system initialization
     */
    async updateAllDatasets() {
        console.log('🔄 Updating all CSV datasets...');
        
        const results = await Promise.allSettled([
            this.updateUsersDataset(),
            this.updateCatsDataset(),
            this.updateApplicationsDataset(),
            this.updateTrackingDataset()
        ]);

        const success = results.filter(r => r.status === 'fulfilled').length;
        console.log(`[CSV SUCCESS] Updated ${success}/4 CSV datasets`);

        return results;
    }
}

module.exports = new CSVDatasetService();
