/**
 * Servicio de IA para Evaluación de Solicitudes de Adopción
 * Utiliza Google Gemini 1.5 Flash para análisis automático
 * 
 * REGLA DE ORO: La IA NUNCA aprueba solicitudes.
 * Solo puede: AUTO_REJECT (peligro detectado) o MANUAL_REVIEW (viable, requiere humano)
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config/config');

class AIService {
    constructor() {
        if (!config.GEMINI_API_KEY) {
            console.warn('⚠️ GEMINI_API_KEY no configurada. Evaluaciones en modo fallback.');
            this.enabled = false;
        } else {
            this.genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
            this.model = this.genAI.getGenerativeModel({ 
                model: 'gemini-1.5-flash',
                generationConfig: {
                    temperature: 0.2, // Bajo para decisiones consistentes
                    topP: 0.95,
                    topK: 40,
                    maxOutputTokens: 512,
                    responseMimeType: 'application/json'
                }
            });
            this.enabled = true;
        }
    }

    /**
     * Analiza una solicitud de adopción y determina si debe ser rechazada o revisada
     * @param {Object} formData - Datos del formulario de adopción
     * @returns {Promise<Object>} Resultado de la evaluación
     */
    async analyzeApplication(formData) {
        // Si la API no está disponible, retornar evaluación por defecto
        if (!this.enabled) {
            return this._getFallbackEvaluation();
        }

        try {
            const systemPrompt = this._buildSystemPrompt();
            const userPrompt = this._buildUserPrompt(formData);

            const result = await this.model.generateContent([
                { text: systemPrompt },
                { text: userPrompt }
            ]);

            const response = result.response;
            const text = response.text();
            
            // Parsear respuesta JSON
            const evaluation = JSON.parse(text);
            
            // Validar estructura
            this._validateEvaluation(evaluation);
            
            return evaluation;

        } catch (error) {
            console.error('❌ Error en evaluación IA:', error.message);
            // En caso de error, retornar evaluación segura (requiere revisión humana)
            return this._getFallbackEvaluation();
        }
    }

    /**
     * Construye el prompt del sistema con las reglas de evaluación
     */
    _buildSystemPrompt() {
        return `Eres el oficial de seguridad de 'Katze', una aplicación de adopción responsable de gatos.

Tu misión es FILTRAR solicitudes peligrosas o no viables, protegiendo el bienestar de los gatos.

IMPORTANTE: NUNCA apruebas solicitudes. Solo puedes:
1. AUTO_REJECT: Rechazar automáticamente si hay peligro claro
2. MANUAL_REVIEW: Marcar para revisión humana si es viable

CRITERIOS ESTRICTOS DE EVALUACIÓN:

🚫 AUTO_REJECT (Rechazo Automático):

1. ESTERILIZACIÓN OBLIGATORIA:
   - Si el adoptante está "en contra" de esterilizar
   - Si menciona "criar", "tener gatitos", "vender crías"
   - Si responde "no sé", "ya veremos", "depende"
   → Razón: "Violación de política de esterilización obligatoria"

2. INDICIOS DE MALTRATO/PELIGRO:
   - Lenguaje violento o agresivo
   - Menciones de "vender", "regalar", "deshacerse"
   - Quiere el gato para "peleas", "cebo", "experimentos"
   - Acceso libre a la calle sin supervisión en zona urbana
   - Respuestas que sugieran negligencia
   → Razón: "Indicios de riesgo para el bienestar animal"

3. FALTA DE SEGURIDAD CRÍTICA:
   - Vive en piso alto SIN mallas de protección en ventanas/balcones
   - No tiene forma de asegurar espacios peligrosos
   → Razón: "Riesgo de caída o escape - falta de protección"

✅ MANUAL_REVIEW (Revisión Humana):
   - Tiene mallas de seguridad o casa segura
   - Acepta esterilización
   - Tiene acceso a veterinario
   - Respuestas coherentes y responsables
   - Cualquier caso con dudas menores

FLAGS (Etiquetas) que debes asignar:
- "Casa Segura": Si tiene mallas o vive en casa baja
- "Pro-Esterilización": Si acepta explícitamente esterilizar
- "Primer Gato": Si nunca ha tenido gatos
- "Experiencia Previa": Si ya tuvo gatos
- "Riesgo Venta": Si detectas intención comercial
- "Riesgo Negligencia": Si las respuestas son muy vagas o preocupantes
- "Sin Veterinario": Si no tiene acceso a atención veterinaria

SCORING (0-100):
- 0-40: Candidato inadecuado (AUTO_REJECT)
- 41-69: Candidato cuestionable (MANUAL_REVIEW con flags de alerta)
- 70-100: Candidato prometedor (MANUAL_REVIEW con flags positivos)

FORMATO DE RESPUESTA (JSON estricto):
{
  "action": "AUTO_REJECT" o "MANUAL_REVIEW",
  "score": número 0-100,
  "short_reason": "string de 1-2 oraciones explicando la decisión",
  "flags": ["array", "de", "strings"]
}

Sé objetivo, protector del gato y profesional.`;
    }

    /**
     * Construye el prompt del usuario con los datos del formulario
     */
    _buildUserPrompt(formData) {
        return `Evalúa esta solicitud de adopción:

DATOS DEL ADOPTANTE:
${JSON.stringify(formData, null, 2)}

Analiza cuidadosamente y responde SOLO con el JSON solicitado.`;
    }

    /**
     * Valida que la evaluación tenga la estructura correcta
     */
    _validateEvaluation(evaluation) {
        if (!evaluation.action || !['AUTO_REJECT', 'MANUAL_REVIEW'].includes(evaluation.action)) {
            throw new Error('Action inválida en evaluación');
        }

        if (typeof evaluation.score !== 'number' || evaluation.score < 0 || evaluation.score > 100) {
            throw new Error('Score inválido en evaluación');
        }

        if (!evaluation.short_reason || typeof evaluation.short_reason !== 'string') {
            throw new Error('short_reason inválida en evaluación');
        }

        if (!Array.isArray(evaluation.flags)) {
            throw new Error('flags debe ser un array');
        }
    }

    /**
     * Retorna una evaluación por defecto cuando la API falla
     */
    _getFallbackEvaluation() {
        return {
            action: 'MANUAL_REVIEW',
            score: 50,
            short_reason: 'Evaluación automática no disponible. Requiere revisión manual completa.',
            flags: ['Sistema en Mantenimiento']
        };
    }

    /**
     * Evalúa múltiples solicitudes en lote (con rate limiting)
     */
    async analyzeBatch(applications, delayMs = 1000) {
        const results = [];
        
        for (const app of applications) {
            try {
                const evaluation = await this.analyzeApplication(app.form_responses);
                results.push({
                    application_id: app.id,
                    ...evaluation,
                    error: null
                });

                // Delay para respetar rate limits de Gemini
                if (applications.length > 1) {
                    await new Promise(resolve => setTimeout(resolve, delayMs));
                }

            } catch (error) {
                results.push({
                    application_id: app.id,
                    ...this._getFallbackEvaluation(),
                    error: error.message
                });
            }
        }

        return results;
    }
}

module.exports = new AIService();
