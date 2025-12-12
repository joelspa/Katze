// Dataset service for Firebase Storage
// Saves JSON files with platform data to 'datasets/' folder
// Auto-updates on changes to users, applications, cats, etc.

const admin = require('firebase-admin');
const { db } = require('../config/db');

class DatasetService {
    constructor() {
        try {
            console.log('[DATASET] Inicializando Dataset Service (JSON)...');
            console.log('[DATASET] Firebase apps count:', admin.apps.length);
            
            if (admin.apps.length === 0) {
                console.log('[DATASET] Firebase no está inicializado, inicializando...');
                
                try {
                    let credential;
                    
                    // Prioridad 1: Variable de entorno FIREBASE_SERVICE_ACCOUNT
                    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
                        console.log('[DATASET] Usando FIREBASE_SERVICE_ACCOUNT de variable de entorno');
                        const serviceAccountFromEnv = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
                        credential = admin.credential.cert(serviceAccountFromEnv);
                    }
                    // Prioridad 2: Variable de entorno GOOGLE_APPLICATION_CREDENTIALS
                    else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
                        console.log('[DATASET] Usando GOOGLE_APPLICATION_CREDENTIALS de variable de entorno');
                        try {
                            const fs = require('fs');
                            const serviceAccount = JSON.parse(fs.readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS, 'utf8'));
                            credential = admin.credential.cert(serviceAccount);
                        } catch (err) {
                            console.error('[DATASET ERROR] No se pudo leer archivo de GOOGLE_APPLICATION_CREDENTIALS:', err.message);
                            throw err;
                        }
                    }
                    // Prioridad 3: Archivo local (solo para desarrollo)
                    else {
                        try {
                            const serviceAccount = require('../config/serviceAccountKey.json');
                            console.log('[DATASET] Usando serviceAccountKey.json local (desarrollo)');
                            credential = admin.credential.cert(serviceAccount);
                        } catch (fileError) {
                            throw new Error('No se encontró credencial de Firebase. Configure FIREBASE_SERVICE_ACCOUNT en variables de entorno.');
                        }
                    }
                    
                    admin.initializeApp({
                        credential: credential,
                        storageBucket: 'katze-app.firebasestorage.app'
                    });
                    console.log('[DATASET SUCCESS] Firebase Admin inicializado correctamente');
                } catch (initError) {
                    console.error('[DATASET ERROR] Error inicializando Firebase:', initError.message);
                    throw initError;
                }
            } else {
                console.log('[DATASET] Firebase Admin ya está inicializado');
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
            
            console.log('[DATASET SUCCESS] Storage y Bucket obtenidos correctamente');
            console.log('[DATASET] Bucket name:', this.bucket.name);
            
        } catch (error) {
            console.error('[DATASET ERROR] Dataset Service initialization failed:', error.message);
            console.error('[DATASET ERROR] Error completo:', error);
            this.storage = null;
            this.bucket = null;
        }
    }

    /**
     * Checks if service is available
     */
    isAvailable() {
        return this.storage !== null && this.bucket !== null;
    }

    /**
     * Saves dataset to Firebase Storage in 'datasets/' folder
     * @param {string} filename - File name
     * @param {Object|Array} data - Data to save as JSON
     * @returns {Promise<string>} Public URL of file
     */
    async saveDataset(filename, data) {
        try {
            if (!this.isAvailable()) {
                return null;
            }

            const filepath = `datasets/${filename}`;
            const file = this.bucket.file(filepath);

            // Convertir a JSON con formato legible
            const jsonContent = JSON.stringify(data, null, 2);

            // Subir archivo con metadata
            await file.save(jsonContent, {
                metadata: {
                    contentType: 'application/json',
                    metadata: {
                        lastUpdated: new Date().toISOString(),
                        recordCount: Array.isArray(data) ? data.length : Object.keys(data).length
                    }
                },
                public: false // Privado por defecto (cambiar a true si necesitas acceso público)
            });

            const publicUrl = `https://storage.googleapis.com/${this.bucket.name}/${filepath}`;
            return publicUrl;

        } catch (error) {
            return null;
        }
    }

    /**
     * Updates complete users dataset
     * @returns {Promise<string>} Updated file URL
     */
    async updateUsersDataset() {
        try {
            const result = await db.query(`
                SELECT 
                    id,
                    name,
                    email,
                    role,
                    created_at,
                    updated_at
                FROM users
                ORDER BY created_at DESC
            `);

            const users = result.rows.map(user => ({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                created_at: user.created_at,
                updated_at: user.updated_at
            }));

            const metadata = {
                generated_at: new Date().toISOString(),
                total_users: users.length,
                by_role: this._countByField(users, 'role')
            };

            const dataset = {
                metadata,
                data: users
            };

            return await this.saveDataset('users.json', dataset);

        } catch (error) {
            return null;
        }
    }

    /**
     * Updates complete adoption applications dataset
     * @returns {Promise<string>} Updated file URL
     */
    async updateApplicationsDataset() {
        try {
            const result = await db.query(`
                SELECT 
                    a.id,
                    a.applicant_id,
                    a.cat_id,
                    a.form_responses,
                    a.status,
                    a.rejection_reason,
                    a.created_at,
                    a.updated_at,
                    
                    -- Información del gato
                    c.name as cat_name,
                    c.breed as cat_breed,
                    c.age as cat_age,
                    c.gender as cat_gender,
                    c.adoption_status as cat_adoption_status,
                    c.living_space_requirement as cat_living_space,
                    c.sterilization_status as cat_sterilization,
                    
                    -- Información del adoptante
                    u.name as applicant_name,
                    u.email as applicant_email,
                    u.role as applicant_role,
                    
                    -- Evaluación de IA
                    ai.decision as ai_decision,
                    ai.score as ai_score,
                    ai.auto_reject_reason as ai_auto_reject_reason,
                    ai.risk_analysis as ai_risk_analysis,
                    ai.evaluated_at as ai_evaluated_at
                    
                FROM adoption_applications a
                LEFT JOIN cats c ON a.cat_id = c.id
                LEFT JOIN users u ON a.applicant_id = u.id
                LEFT JOIN ai_evaluations ai ON a.id = ai.application_id
                ORDER BY a.created_at DESC
            `);

            const applications = result.rows.map(app => ({
                // Información básica de la aplicación
                id: app.id,
                status: app.status,
                rejection_reason: app.rejection_reason,
                created_at: app.created_at,
                updated_at: app.updated_at,
                
                // Datos del gato
                cat: {
                    id: app.cat_id,
                    name: app.cat_name,
                    breed: app.cat_breed,
                    age: app.cat_age,
                    gender: app.cat_gender,
                    adoption_status: app.cat_adoption_status,
                    living_space_requirement: app.cat_living_space,
                    sterilization_status: app.cat_sterilization
                },
                
                // Datos del adoptante
                applicant: {
                    id: app.applicant_id,
                    name: app.applicant_name,
                    email: app.applicant_email,
                    role: app.applicant_role
                },
                
                // Respuestas del formulario
                form_responses: app.form_responses,
                
                // Evaluación de IA
                ai_evaluation: app.ai_decision ? {
                    decision: app.ai_decision,
                    score: app.ai_score,
                    auto_reject_reason: app.ai_auto_reject_reason,
                    risk_analysis: app.ai_risk_analysis,
                    evaluated_at: app.ai_evaluated_at
                } : null
            }));

            const metadata = {
                generated_at: new Date().toISOString(),
                total_applications: applications.length,
                by_status: this._countByField(applications, 'status'),
                by_ai_decision: this._countByNestedField(applications, 'ai_evaluation.decision'),
                average_ai_score: this._calculateAverage(applications, 'ai_evaluation.score')
            };

            const dataset = {
                metadata,
                data: applications
            };

            return await this.saveDataset('applications.json', dataset);

        } catch (error) {
            return null;
        }
    }

    /**
     * Updates complete cats dataset
     * @returns {Promise<string>} Updated file URL
     */
    async updateCatsDataset() {
        try {
            const result = await db.query(`
                SELECT 
                    c.id,
                    c.name,
                    c.breed,
                    c.age,
                    c.gender,
                    c.description,
                    c.image_url,
                    c.adoption_status,
                    c.living_space_requirement,
                    c.sterilization_status,
                    c.special_needs,
                    c.created_at,
                    c.updated_at,
                    
                    -- Información del rescatista
                    c.rescuer_id,
                    u.name as rescuer_name,
                    u.email as rescuer_email
                    
                FROM cats c
                LEFT JOIN users u ON c.rescuer_id = u.id
                ORDER BY c.created_at DESC
            `);

            const cats = result.rows.map(cat => ({
                id: cat.id,
                name: cat.name,
                breed: cat.breed,
                age: cat.age,
                gender: cat.gender,
                description: cat.description,
                image_url: cat.image_url,
                adoption_status: cat.adoption_status,
                living_space_requirement: cat.living_space_requirement,
                sterilization_status: cat.sterilization_status,
                special_needs: cat.special_needs,
                created_at: cat.created_at,
                updated_at: cat.updated_at,
                
                // Información del rescatista
                rescuer: {
                    id: cat.rescuer_id,
                    name: cat.rescuer_name,
                    email: cat.rescuer_email
                }
            }));

            const metadata = {
                generated_at: new Date().toISOString(),
                total_cats: cats.length,
                by_status: this._countByField(cats, 'adoption_status'),
                by_age: this._countByField(cats, 'age'),
                by_gender: this._countByField(cats, 'gender')
            };

            const dataset = {
                metadata,
                data: cats
            };

            return await this.saveDataset('cats.json', dataset);

        } catch (error) {
            return null;
        }
    }

    /**
     * Updates AI evaluations dataset
     * @returns {Promise<string>} Updated file URL
     */
    async updateEvaluationsDataset() {
        try {
            const result = await db.query(`
                SELECT 
                    ai.id,
                    ai.application_id,
                    ai.decision,
                    ai.score,
                    ai.auto_reject_reason,
                    ai.risk_analysis,
                    ai.evaluated_at,
                    
                    -- Información de la aplicación
                    a.status as application_status,
                    a.cat_id,
                    a.applicant_id,
                    
                    -- Respuestas del formulario para análisis
                    a.form_responses
                    
                FROM ai_evaluations ai
                LEFT JOIN adoption_applications a ON ai.application_id = a.id
                ORDER BY ai.evaluated_at DESC
            `);

            const evaluations = result.rows.map(evaluation => ({
                id: evaluation.id,
                application_id: evaluation.application_id,
                decision: evaluation.decision,
                score: evaluation.score,
                auto_reject_reason: evaluation.auto_reject_reason,
                risk_analysis: evaluation.risk_analysis,
                evaluated_at: evaluation.evaluated_at,
                
                // Contexto de la aplicación
                application_status: evaluation.application_status,
                cat_id: evaluation.cat_id,
                applicant_id: evaluation.applicant_id,
                
                // Datos del formulario para análisis ML
                form_responses: evaluation.form_responses
            }));

            const metadata = {
                generated_at: new Date().toISOString(),
                total_evaluations: evaluations.length,
                by_decision: this._countByField(evaluations, 'decision'),
                average_score: this._calculateAverage(evaluations, 'score'),
                score_distribution: {
                    low: evaluations.filter(e => e.score < 40).length,
                    medium: evaluations.filter(e => e.score >= 40 && e.score < 70).length,
                    high: evaluations.filter(e => e.score >= 70).length
                }
            };

            const dataset = {
                metadata,
                data: evaluations
            };

            return await this.saveDataset('evaluations.json', dataset);

        } catch (error) {
            return null;
        }
    }

    /**
     * Updates all datasets at once
     * @returns {Promise<Object>} URLs of all updated datasets
     */
    async updateAllDatasets() {
        try {
            const results = await Promise.all([
                this.updateUsersDataset(),
                this.updateApplicationsDataset(),
                this.updateCatsDataset(),
                this.updateEvaluationsDataset()
            ]);

            const [usersUrl, applicationsUrl, catsUrl, evaluationsUrl] = results;

            return {
                users: usersUrl,
                applications: applicationsUrl,
                cats: catsUrl,
                evaluations: evaluationsUrl,
                updated_at: new Date().toISOString()
            };

        } catch (error) {
            return null;
        }
    }

    /**
     * Downloads dataset from Firebase Storage
     * @param {string} filename - File name
     * @returns {Promise<Object>} Dataset data
     */
    async downloadDataset(filename) {
        try {
            if (!this.isAvailable()) {
                return null;
            }

            const filepath = `datasets/${filename}`;
            const file = this.bucket.file(filepath);

            const [exists] = await file.exists();
            if (!exists) {
                return null;
            }

            const [contents] = await file.download();
            const data = JSON.parse(contents.toString());

            return data;

        } catch (error) {
            return null;
        }
    }

    /**
     * Lists all datasets in 'datasets/' folder
     * @returns {Promise<Array>} List of files with metadata
     */
    async listDatasets() {
        try {
            if (!this.isAvailable()) {
                return [];
            }

            const [files] = await this.bucket.getFiles({ prefix: 'datasets/' });

            const datasets = files.map(file => ({
                name: file.name.replace('datasets/', ''),
                size: file.metadata.size,
                updated: file.metadata.updated,
                contentType: file.metadata.contentType
            }));

            return datasets;

        } catch (error) {
            return [];
        }
    }

    /**
     * Counts records by field
     * @private
     */
    _countByField(array, field) {
        const counts = {};
        array.forEach(item => {
            const value = item[field] || 'unknown';
            counts[value] = (counts[value] || 0) + 1;
        });
        return counts;
    }

    /**
     * Counts records by nested field
     * @private
     */
    _countByNestedField(array, fieldPath) {
        const counts = {};
        array.forEach(item => {
            const value = this._getNestedValue(item, fieldPath) || 'unknown';
            counts[value] = (counts[value] || 0) + 1;
        });
        return counts;
    }

    /**
     * Calculates average of numeric field
     * @private
     */
    _calculateAverage(array, field) {
        const values = array
            .map(item => {
                const val = field.includes('.') 
                    ? this._getNestedValue(item, field)
                    : item[field];
                return val;
            })
            .filter(v => v !== null && v !== undefined && !isNaN(v));

        if (values.length === 0) return 0;
        const sum = values.reduce((acc, val) => acc + val, 0);
        return Math.round((sum / values.length) * 100) / 100;
    }

    /**
     * Gets nested field value
     * @private
     */
    _getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    }
}

module.exports = new DatasetService();
