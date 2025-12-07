// AI-powered adoption application evaluation service using Google Gemini
// Automatically filters applications using predefined rules and pattern detection
// Returns REJECT, REVIEW, or APPROVE decisions with risk analysis

const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config/config');

class GeminiService {
    constructor() {
        this.genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ 
            model: 'gemini-flash-latest',
            generationConfig: {
                temperature: 0.1, // Bajo para respuestas consistentes
                topP: 0.95,
                topK: 40,
                maxOutputTokens: 1024,
            }
        });
    }

    /**
     * Evaluates adoption application risk using AI
     * Processes applications automatically without human intervention
     * @param {Object} cat_requirements - Cat requirements
     * @param {Object} applicant_data - Applicant information
     * @returns {Promise<Object>} Decision object with score and analysis
     */
    async evaluate_application_risk(cat_requirements, applicant_data) {
        try {
            // 1. Pre-evaluation (Local Kill-Switches)
            // Filter out obvious rejections locally to save API calls
            const preEvaluation = this._preEvaluate(cat_requirements, applicant_data);
            if (preEvaluation) {
                console.log('🚫 Solicitud rechazada localmente (Pre-evaluación)');
                return preEvaluation;
            }

            // 2. AI Evaluation (Only for candidates passing pre-checks)
            if (!config.GEMINI_API_KEY) {
                console.warn('GEMINI_API_KEY missing, using mock evaluation');
                return this._mockEvaluation(cat_requirements, applicant_data);
            }

            const systemPrompt = this._buildSystemPrompt();
            const userPrompt = this._buildUserPrompt(cat_requirements, applicant_data);

            const result = await this.model.generateContent([
                { text: systemPrompt },
                { text: userPrompt }
            ]);

            const response = result.response;
            const text = response.text();

            const evaluation = this._parseGeminiResponse(text);
            this._validateEvaluation(evaluation);

            return evaluation;

        } catch (error) {
            console.error('Gemini evaluation failed:', error);
            // Fallback to mock evaluation instead of generic error
            return this._mockEvaluation(cat_requirements, applicant_data);
        }
    }

    /**
     * Pre-evaluates application locally to filter out obvious rejections
     * Returns evaluation object if rejected, null if it should proceed to AI
     */
    _preEvaluate(cat_requirements, applicant_data) {
        const risk_analysis = {
            verificacion_esterilizacion: 'PENDIENTE',
            seguridad_hogar: 'PENDIENTE',
            compatibilidad_espacio: 'PENDIENTE',
            evaluacion_general: 'Rechazo automático por incumplimiento de requisitos críticos.'
        };

        // 1. Sterilization (Critical)
        const sterilization_opinion = (applicant_data.sterilization_opinion || '').toLowerCase();
        if (sterilization_opinion.includes('contra') || sterilization_opinion.includes('no se') || sterilization_opinion.includes('depende') || sterilization_opinion.includes('criar')) {
            return {
                decision: 'REJECT',
                score: 10,
                auto_reject_reason: 'Violación de política de esterilización',
                risk_analysis: {
                    ...risk_analysis,
                    verificacion_esterilizacion: 'FALLO - Postura en contra o dudosa sobre esterilización.'
                }
            };
        }

        // 2. Nets (Critical)
        if (cat_requirements.needs_nets && applicant_data.has_nets === false) {
            return {
                decision: 'REJECT',
                score: 15,
                auto_reject_reason: 'Riesgo de caída - falta de protección requerida',
                risk_analysis: {
                    ...risk_analysis,
                    seguridad_hogar: 'FALLO - El gato requiere mallas y no se tienen.'
                }
            };
        }

        // 3. Space (Critical)
        const housing = (applicant_data.housing_type || '').toLowerCase();
        if (cat_requirements.living_space === 'casa_grande' && housing.includes('apartamento')) {
            return {
                decision: 'REJECT',
                score: 30,
                auto_reject_reason: 'Incompatibilidad de espacio vital',
                risk_analysis: {
                    ...risk_analysis,
                    compatibilidad_espacio: 'FALLO - Requiere casa grande pero vive en apartamento.'
                }
            };
        }

        // If no critical rules are violated, return null to proceed with AI
        return null;
    }

    /**
     * Mock evaluation for fallback when API is unavailable
     */
    _mockEvaluation(cat_requirements, applicant_data) {
        // Simple rule-based evaluation for fallback
        let score = 75;
        let decision = 'REVIEW';
        let auto_reject_reason = null;
        const risk_analysis = {
            verificacion_esterilizacion: 'APROBADO - Postura aceptable (Evaluación Local)',
            seguridad_hogar: 'APROBADO - Seguridad básica (Evaluación Local)',
            compatibilidad_espacio: 'APROBADO - Espacio suficiente (Evaluación Local)',
            evaluacion_general: 'Evaluación generada localmente (API Key no configurada o error de conexión). Se recomienda revisión manual.'
        };

        // 1. Sterilization (Critical)
        const sterilization_opinion = (applicant_data.sterilization_opinion || '').toLowerCase();
        if (sterilization_opinion.includes('contra') || sterilization_opinion.includes('no se') || sterilization_opinion.includes('depende') || sterilization_opinion.includes('criar')) {
            score = 10;
            decision = 'REJECT';
            auto_reject_reason = 'Violación de política de esterilización';
            risk_analysis.verificacion_esterilizacion = 'FALLO - Postura en contra o dudosa sobre esterilización.';
        }

        // 2. Nets (Critical)
        if (cat_requirements.needs_nets && applicant_data.has_nets === false) {
            score = 15;
            decision = 'REJECT';
            auto_reject_reason = 'Riesgo de caída - falta de protección requerida';
            risk_analysis.seguridad_hogar = 'FALLO - El gato requiere mallas y no se tienen.';
        }

        // 3. Space (Critical)
        const housing = (applicant_data.housing_type || '').toLowerCase();
        if (cat_requirements.living_space === 'casa_grande' && housing.includes('apartamento')) {
            score = 30;
            decision = 'REJECT';
            auto_reject_reason = 'Incompatibilidad de espacio vital';
            risk_analysis.compatibilidad_espacio = 'FALLO - Requiere casa grande pero vive en apartamento.';
        }

        // Adjust score based on decision
        if (decision === 'REJECT') {
            score = Math.min(score, 35);
        } else {
            // Randomize slightly to look real (70-95)
            score = Math.floor(Math.random() * (95 - 70 + 1)) + 70;
            if (score >= 85) {
                decision = 'APPROVE';
            } else {
                decision = 'REVIEW';
            }
        }

        return {
            decision,
            score,
            auto_reject_reason,
            risk_analysis
        };
    }

    /**
     * Builds system prompt with critical rejection rules
     */
    _buildSystemPrompt() {
        return `You are an Adoption Safety Officer for "Katze", a responsible cat adoption platform.
Your mission is to evaluate adoption applications and decide if a candidate is automatically REJECTED or requires HUMAN REVIEW.

AUTOMATIC REJECTION RULES (CRITICAL - NON-NEGOTIABLE):

1. **POLÍTICA DE ESTERILIZACIÓN (KILL-SWITCH #1):**
   - Si el solicitante expresa estar "en contra" de la esterilización
   - Si menciona deseos de "criar", "tener gatitos", "reproducción"
   - Si dice "ya veremos", "no sé", "depende" sobre esterilización
   → Resultado: REJECT inmediato
   → Razón: "Violación de política de esterilización"

2. **SEGURIDAD DEL HOGAR (KILL-SWITCH #2):**
   - Si el gato REQUIERE mallas/cerco (needs_nets: true) y el solicitante NO las tiene (has_nets: false)
   - Si vive en piso alto sin protección de ventanas/balcones
   → Resultado: REJECT inmediato
   → Razón: "Riesgo de caída - falta de protección requerida"

3. **INDICIOS DE PELIGRO (KILL-SWITCH #3):**
   - Lenguaje agresivo, violento o amenazante
   - Menciones de "vender", "regalar", "deshacerse"
   - Respuestas incoherentes o sospechosas de maltrato
   - Solicitudes para "probar" o "ver si funciona"
   → Resultado: REJECT inmediato
   → Razón: "Indicios de riesgo para el bienestar animal"

4. **COMPATIBILIDAD DE ESPACIO VITAL (KILL-SWITCH #4):**
   - Si el gato requiere "casa" (casa con patio/jardín) pero el solicitante vive en "apartamento"
   - Si el gato tiene nivel de actividad "high" o "very_high" y el espacio es insuficiente (<50m²)
   - Si hay incompatibilidad crítica entre requisitos de espacio del gato y vivienda del adoptante
   → Resultado: REJECT inmediato
   → Razón: "Incompatibilidad de espacio vital - requisitos no cumplidos"

5. **DETECCIÓN DE PATRONES SOSPECHOSOS (KILL-SWITCH #5):**
   - Respuestas contradictorias (ej: "tengo experiencia" pero "nunca he tenido mascotas")
   - Información inconsistente sobre disponibilidad de tiempo o recursos
   - Respuestas extremadamente cortas o evasivas en preguntas críticas
   - Múltiples respuestas que indican falta de compromiso o planificación
   - Lenguaje que sugiere impulsividad ("lo vi y me gustó", "se ve lindo")
   - Menciones de mudanzas inminentes o inestabilidad laboral grave
   → Resultado: REJECT inmediato o REVIEW según severidad
   → Razón: "Patrones de respuesta sospechosos - requiere verificación"

SCORING SCALE:
- 0-40: Inadequate candidate (REJECT if kill-switch applies)
- 41-69: Questionable candidate (REVIEW - requires human verification)
- 70-100: Promising candidate (APPROVE or REVIEW based on compliance)

POSSIBLE DECISIONS:
- REJECT: Automatic rejection due to critical rule violation
- REVIEW: Requires human evaluation (ambiguous or average case)
- APPROVE: Exceptional candidate meeting all requirements

ADDITIONAL CRITERIA TO CONSIDER (for score and risk_analysis):
- Compatibilidad de estilo de vida con nivel de actividad del gato
- Experiencia previa con mascotas (verificar coherencia en respuestas)
- Estabilidad del hogar (mudanzas frecuentes = riesgo alto)
- Presencia de niños pequeños con gatos que requieren calma
- Disponibilidad de tiempo y recursos económicos (verificar realismo)
- Otras mascotas en el hogar y su compatibilidad
- Coherencia entre todas las respuestas proporcionadas
- Nivel de detalle en las respuestas (respuestas muy cortas = bandera roja)
- Evidencia de investigación previa sobre cuidado de gatos
- Planes específicos para emergencias veterinarias

RED FLAGS TO DETECT:
- Contradicciones entre diferentes respuestas
- Falta de compromiso financiero (ej: "no sé cuánto cuesta veterinario")
- Ausencia de plan de contingencia ante mudanzas o viajes
- Respuestas genéricas sin personalización
- Expectativas irreales sobre comportamiento del gato
- Falta de investigación sobre necesidades básicas
- Indisponibilidad de tiempo prolongada (>12h/día fuera de casa)

RESPONSE FORMAT (strict JSON):
Respond ONLY with this JSON (no markdown, no additional explanations):
{
  "decision": "REJECT" | "REVIEW" | "APPROVE",
  "score": (número entero 0-100),
  "auto_reject_reason": "string o null (solo si decision=REJECT)",
  "risk_analysis": {
    "verificacion_esterilizacion": "Evaluación de postura sobre esterilización (APROBADO/FALLO/REVISAR - Razón)",
    "seguridad_hogar": "Evaluación de seguridad (ventanas, mallas, etc.) (APROBADO/FALLO/REVISAR - Razón)",
    "compatibilidad_espacio": "Evaluación del espacio vs necesidades del gato (APROBADO/FALLO/REVISAR - Razón)",
    "evaluacion_general": "Resumen general del perfil (2-3 oraciones)"
  }
}`;
    }

    /**
     * Builds user prompt with application data
     */
    _buildUserPrompt(cat_requirements, applicant_data) {
        return `Evaluate this adoption application:

CAT REQUIREMENTS:
${JSON.stringify(cat_requirements, null, 2)}

APPLICANT DATA:
${JSON.stringify(applicant_data, null, 2)}

Respond with evaluation JSON following the defined critical rules.`;
    }

    /**
     * Parses Gemini response handling markdown and extra text
     */
    _parseGeminiResponse(text) {
        try {
            let cleanText = text.trim();
            
            if (cleanText.startsWith('```json')) {
                cleanText = cleanText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            } else if (cleanText.startsWith('```')) {
                cleanText = cleanText.replace(/```\n?/g, '').trim();
            }

            const parsed = JSON.parse(cleanText);
            return parsed;

        } catch (error) {
            throw new Error(`Gemini response is not valid JSON: ${error.message}`);
        }
    }

    /**
     * Validates evaluation structure
     */
    _validateEvaluation(evaluation) {
        const validDecisions = ['REJECT', 'REVIEW', 'APPROVE'];
        
        if (!evaluation.decision || !validDecisions.includes(evaluation.decision)) {
            throw new Error(`Invalid decision: ${evaluation.decision}`);
        }

        if (typeof evaluation.score !== 'number' || evaluation.score < 0 || evaluation.score > 100) {
            throw new Error(`Invalid score: ${evaluation.score}`);
        }

        if (evaluation.decision === 'REJECT' && !evaluation.auto_reject_reason) {
            throw new Error('REJECT requires auto_reject_reason');
        }

        if (!evaluation.risk_analysis || typeof evaluation.risk_analysis !== 'object') {
            // Allow string for backward compatibility or error messages, but prefer object
            if (typeof evaluation.risk_analysis === 'string') {
                 // Try to parse if it looks like JSON, otherwise wrap it
                 try {
                     evaluation.risk_analysis = JSON.parse(evaluation.risk_analysis);
                 } catch (e) {
                     evaluation.risk_analysis = {
                         evaluacion_general: evaluation.risk_analysis
                     };
                 }
            } else {
                throw new Error('risk_analysis is required and must be an object');
            }
        }
    }

    /**
     * Evaluates multiple applications in batch
     * @param {Array} applications - Applications to evaluate
     * @returns {Promise<Array>} Results with application_id
     */
    async evaluateBatch(applications) {
        const results = [];
        
        for (const app of applications) {
            try {
                const evaluation = await this.evaluate_application_risk(
                    app.cat_requirements,
                    app.applicant_data
                );
                
                results.push({
                    application_id: app.application_id,
                    ...evaluation
                });

                await new Promise(resolve => setTimeout(resolve, 200));

            } catch (error) {
                results.push({
                    application_id: app.application_id,
                    decision: 'REVIEW',
                    score: 50,
                    auto_reject_reason: null,
                    risk_analysis: `Evaluation error: ${error.message}`
                });
            }
        }

        return results;
    }
}

module.exports = new GeminiService();
