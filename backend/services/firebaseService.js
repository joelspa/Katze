// Firebase Admin service for storing application records in Firestore
// Stores adoption applications in spreadsheet format for auditing

const admin = require('firebase-admin');
const config = require('../config/config');

class FirebaseService {
    constructor() {
        try {
            if (!admin.apps.length) {
                // Intentar usar FIREBASE_SERVICE_ACCOUNT en producción (Render)
                // o el archivo serviceAccountKey.json en desarrollo
                let credential;
                
                if (process.env.FIREBASE_SERVICE_ACCOUNT) {
                    // Producción: usar la variable de entorno JSON
                    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
                    credential = admin.credential.cert(serviceAccount);
                } else {
                    // Desarrollo: usar el archivo local
                    credential = admin.credential.applicationDefault();
                }
                
                admin.initializeApp({
                    credential: credential,
                    projectId: process.env.FIREBASE_PROJECT_ID || 'katze-app'
                });
            }
            
            this.db = admin.firestore();
            this.applicationsCollection = this.db.collection('adoption_applications');
            
        } catch (error) {
            this.db = null;
        }
    }

    /**
     * Saves complete adoption application to Firestore
     * @param {Object} applicationData - Complete application data
     * @returns {Promise<string>} Firestore document ID
     */
    async saveApplicationRecord(applicationData) {
        try {
            if (!this.db) {
                return null;
            }

            const record = {
                application_id: applicationData.application_id,
                created_at: admin.firestore.FieldValue.serverTimestamp(),
                submission_date: applicationData.submission_date || new Date().toISOString(),
                
                // INFORMACIÓN DEL GATO
                cat_id: applicationData.cat_id,
                cat_name: applicationData.cat_name || null,
                cat_breed: applicationData.cat_breed || null,
                cat_age: applicationData.cat_age || null,
                cat_gender: applicationData.cat_gender || null,
                cat_activity_level: applicationData.cat_activity_level || null,
                cat_needs_nets: applicationData.cat_needs_nets || false,
                cat_sterilized: applicationData.cat_sterilized || false,
                cat_special_needs: applicationData.cat_special_needs || null,
                
                // INFORMACIÓN DEL ADOPTANTE
                applicant_id: applicationData.applicant_id,
                applicant_name: applicationData.applicant_name || null,
                applicant_email: applicationData.applicant_email || null,
                applicant_phone: applicationData.applicant_phone || null,
                
                // DATOS DE LA SOLICITUD
                home_type: applicationData.home_type || null, // "casa" o "apartamento"
                living_space_size: applicationData.living_space_size || null,
                has_nets: applicationData.has_nets || false,
                has_other_pets: applicationData.has_other_pets || false,
                other_pets_details: applicationData.other_pets_details || null,
                has_children: applicationData.has_children || false,
                children_ages: applicationData.children_ages || null,
                
                // EXPERIENCIA Y COMPROMISO
                pet_experience: applicationData.pet_experience || null,
                sterilization_view: applicationData.sterilization_view || null,
                time_availability: applicationData.time_availability || null,
                financial_capacity: applicationData.financial_capacity || null,
                emergency_plan: applicationData.emergency_plan || null,
                
                // RESPUESTAS ADICIONALES
                motivation: applicationData.motivation || null,
                additional_notes: applicationData.additional_notes || null,
                
                // EVALUACIÓN DE IA
                ai_decision: applicationData.ai_evaluation?.decision || null,
                ai_score: applicationData.ai_evaluation?.score || null,
                ai_auto_reject_reason: applicationData.ai_evaluation?.auto_reject_reason || null,
                ai_risk_analysis: applicationData.ai_evaluation?.risk_analysis || null,
                
                // ESTADO DE LA APLICACIÓN
                status: applicationData.status || 'pending', // pending, approved, rejected, withdrawn
                
                // METADATA
                rescuer_id: applicationData.rescuer_id || null,
                rescuer_notes: applicationData.rescuer_notes || null,
                processed_date: applicationData.processed_date || null,
                processed_by: applicationData.processed_by || null,
                
                // AUDITORÍA
                updated_at: admin.firestore.FieldValue.serverTimestamp(),
                version: 1
            };

            const docRef = await this.applicationsCollection.add(record);
            
            return docRef.id;

        } catch (error) {
            return null;
        }
    }

    /**
     * Updates existing application status
     * @param {string} applicationId - PostgreSQL application ID
     * @param {Object} updates - Fields to update
     * @returns {Promise<boolean>} Success status
     */
    async updateApplicationStatus(applicationId, updates) {
        try {
            if (!this.db) {
                return false;
            }

            const snapshot = await this.applicationsCollection
                .where('application_id', '==', applicationId)
                .limit(1)
                .get();

            if (snapshot.empty) {
                return false;
            }

            const docRef = snapshot.docs[0].ref;
            
            await docRef.update({
                ...updates,
                updated_at: admin.firestore.FieldValue.serverTimestamp()
            });

            return true;

        } catch (error) {
            return false;
        }
    }

    /**
     * Gets all applications with optional filters
     * @param {Object} filters - Optional filters
     * @param {number} limit - Result limit (default: 100)
     * @returns {Promise<Array>} Applications array
     */
    async getApplications(filters = {}, limit = 100) {
        try {
            if (!this.db) {
                return [];
            }

            let query = this.applicationsCollection.orderBy('created_at', 'desc').limit(limit);

            for (const [key, value] of Object.entries(filters)) {
                query = query.where(key, '==', value);
            }

            const snapshot = await query.get();
            
            const applications = [];
            snapshot.forEach(doc => {
                applications.push({
                    firestore_id: doc.id,
                    ...doc.data()
                });
            });

            return applications;

        } catch (error) {
            return [];
        }
    }

    /**
     * Exports applications to CSV format
     * @param {Object} filters - Optional filters
     * @returns {Promise<string>} CSV string
     */
    async exportToCSV(filters = {}) {
        try {
            const applications = await this.getApplications(filters, 10000);
            
            if (applications.length === 0) {
                return '';
            }

            // Headers del CSV (todas las columnas)
            const headers = Object.keys(applications[0]).filter(key => key !== 'firestore_id');
            let csv = headers.join(',') + '\n';

            // Datos
            applications.forEach(app => {
                const row = headers.map(header => {
                    const value = app[header];
                    // Escapar comillas y manejar valores nulos
                    if (value === null || value === undefined) {
                        return '';
                    }
                    const stringValue = String(value).replace(/"/g, '""');
                    return `"${stringValue}"`;
                });
                csv += row.join(',') + '\n';
            });

            return csv;

        } catch (error) {
            return '';
        }
    }

    /**
     * Gets application statistics
     * @returns {Promise<Object>} Aggregated statistics
     */
    async getStatistics() {
        try {
            if (!this.db) {
                return null;
            }

            const snapshot = await this.applicationsCollection.get();
            
            const stats = {
                total: snapshot.size,
                by_status: {},
                by_ai_decision: {},
                by_home_type: {},
                average_ai_score: 0
            };

            let totalScore = 0;
            let scoreCount = 0;

            snapshot.forEach(doc => {
                const data = doc.data();
                
                stats.by_status[data.status] = (stats.by_status[data.status] || 0) + 1;
                
                if (data.ai_decision) {
                    stats.by_ai_decision[data.ai_decision] = (stats.by_ai_decision[data.ai_decision] || 0) + 1;
                }
                
                if (data.home_type) {
                    stats.by_home_type[data.home_type] = (stats.by_home_type[data.home_type] || 0) + 1;
                }
                
                if (data.ai_score !== null && data.ai_score !== undefined) {
                    totalScore += data.ai_score;
                    scoreCount++;
                }
            });

            stats.average_ai_score = scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0;

            return stats;

        } catch (error) {
            return null;
        }
    }
}

module.exports = new FirebaseService();
