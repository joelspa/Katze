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
            // Usar gemini-1.5-flash para velocidad óptima (2-3 segundos)
            this.model = this.genAI.getGenerativeModel({ 
                model: 'gemini-1.5-flash',
                generationConfig: {
                    temperature: 0.1, // Muy bajo para consistencia y velocidad
                    topP: 0.8,
                    topK: 20,
                    maxOutputTokens: 300, // Reducido para respuestas más rápidas
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
            return this._getFallbackEvaluation(formData);
        }

        try {
            const systemPrompt = this._buildSystemPrompt();
            const userPrompt = this._buildUserPrompt(formData);

            const result = await this.model.generateContent([
                { text: systemPrompt },
                { text: userPrompt }
            ]);

            const response = result.response;
            let text = response.text();
            
            // Extraer JSON si está envuelto en markdown o texto adicional
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                text = jsonMatch[0];
            }
            
            // Parsear respuesta JSON
            const evaluation = JSON.parse(text);
            
            // Normalizar a estructura interna en español
            const normalized = {
                action: evaluation.accion || evaluation.action,
                score: evaluation.puntaje || evaluation.score,
                short_reason: evaluation.razon_corta || evaluation.short_reason,
                flags: evaluation.banderas || evaluation.flags
            };
            
            // Validar estructura
            this._validateEvaluation(normalized);
            
            return normalized;

        } catch (error) {
            console.error('❌ Error en evaluación IA:', error.message);
            // En caso de error, retornar evaluación segura (requiere revisión humana)
            return this._getFallbackEvaluation(formData);
        }
    }

    /**
     * Construye el prompt del sistema con las reglas de evaluación
     */
    _buildSystemPrompt() {
        return `Eres evaluador de adopciones de gatos. Analiza RÁPIDAMENTE y devuelve JSON.

NUNCA apruebas. Solo: RECHAZAR_AUTO o REVISION_MANUAL

RECHAZAR_AUTO (0-40 puntos):
- No acepta esterilización
- Intención de criar/vender
- Lenguaje violento/negligente
- Riesgo evidente

REVISION_MANUAL (41-100):
- Acepta esterilización: +20 puntos
- Motivación genuina (LEE whyAdopt/reason): +15 puntos
- Espacio adecuado: +10 puntos
- Experiencia previa: +10 puntos
- Disponibilidad de tiempo: +5 puntos
- Vivienda segura: +5 puntos

ANALIZA EL TEXTO DE MOTIVACIÓN:
- ¿Menciona amor/cuidado genuino? → más puntos
- ¿Habla de compañía/familia? → más puntos
- ¿Es vago o poco serio? → menos puntos
- ¿Menciona crianza/venta? → RECHAZAR_AUTO

FLAGS: "Pro-Esterilización", "Experiencia Previa", "Primer Gato", "Casa Segura", "Motivación Genuina", "Riesgo Venta", "Riesgo Negligencia"

JSON:
{
  "accion": "RECHAZAR_AUTO" | "REVISION_MANUAL",
  "puntaje": 0-100,
  "razon_corta": "1 oración con razón principal y score",
  "banderas": ["strings"]
}`;
    }

    /**
     * Construye el prompt del usuario con los datos del formulario
     */
    _buildUserPrompt(formData) {
        // Extraer y resaltar campos clave
        const motivation = formData.whyAdopt || formData.reason || 'No proporcionado';
        const acceptsSterilization = formData.acceptsSterilization;
        const hasExperience = formData.hasExperience;
        const hasSpace = formData.hasSpace;
        const hasTime = formData.hasTime;
        const livingSpace = formData.livingSpace;

        return `SOLICITUD:

MOTIVACIÓN (LEE ESTO PRIMERO): "${motivation}"

Acepta esterilización: ${acceptsSterilization}
Experiencia con gatos: ${hasExperience}
Espacio suficiente: ${hasSpace}
Tiempo disponible: ${hasTime}
Vivienda: ${livingSpace}

Responde SOLO JSON.`;
    }

    /**
     * Valida que la evaluación tenga la estructura correcta
     */
    _validateEvaluation(evaluation) {
        if (!evaluation.action || !['RECHAZAR_AUTO', 'REVISION_MANUAL', 'AUTO_REJECT', 'MANUAL_REVIEW'].includes(evaluation.action)) {
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
     * Realiza análisis básico de los datos del formulario
     */
    _getFallbackEvaluation(formData = null) {
        let score = 50;
        let reason = 'Evaluación automática no disponible. Requiere revisión manual completa.';
        let flags = ['Sistema en Mantenimiento'];

        // Si tenemos datos del formulario, hacer análisis básico
        if (formData) {
            const analysis = this._basicAnalysis(formData);
            score = analysis.score;
            reason = analysis.reason;
            flags = analysis.flags;
        }

        return {
            action: 'REVISION_MANUAL',
            score,
            short_reason: reason,
            flags
        };
    }

    /**
     * Análisis básico de solicitud sin IA (fallback inteligente)
     */
    _basicAnalysis(formData) {
        let score = 50; // Base neutral
        const flags = [];
        const issues = [];
        const positives = [];

        // Analizar motivación escrita
        const motivation = (formData.whyAdopt || formData.reason || '').toLowerCase();
        if (motivation.length > 50) {
            // Verificar palabras clave positivas
            const positiveWords = ['amor', 'cuidar', 'familia', 'compañía', 'rescate', 'hogar', 'responsable', 'cariño', 'adoptar'];
            const negativeWords = ['criar', 'vender', 'regalar', 'crías', 'negocio', 'dinero'];
            
            let motivationScore = 0;
            positiveWords.forEach(word => {
                if (motivation.includes(word)) motivationScore += 3;
            });
            
            negativeWords.forEach(word => {
                if (motivation.includes(word)) {
                    score = 15;
                    issues.push('intención comercial detectada');
                    flags.push('Riesgo Venta');
                }
            });
            
            if (motivationScore > 6) {
                score += 15;
                flags.push('Motivación Genuina');
                positives.push('motivación clara y positiva');
            } else if (motivationScore > 0) {
                score += 8;
                positives.push('motivación presente');
            }
        }

        // Verificar esterilización (crítico)
        if (formData.acceptsSterilization === true) {
            score += 20;
            flags.push('Pro-Esterilización');
            positives.push('acepta esterilización');
        } else if (formData.acceptsSterilization === false) {
            score = 20;
            flags.push('Rechaza Esterilización');
            issues.push('no acepta esterilización obligatoria');
        }

        // Verificar espacio
        if (formData.hasSpace === true) {
            score += 10;
            flags.push('Espacio Adecuado');
            positives.push('espacio suficiente');
        }

        // Verificar tiempo
        if (formData.hasTime === true) {
            score += 5;
            positives.push('disponibilidad de tiempo');
        }

        // Experiencia previa
        if (formData.hasExperience === true) {
            score += 10;
            flags.push('Experiencia Previa');
            positives.push('experiencia con gatos');
        } else {
            flags.push('Primer Gato');
        }

        // Tipo de vivienda
        if (formData.livingSpace) {
            if (formData.livingSpace === 'casa') {
                flags.push('Casa');
                score += 5;
            } else if (formData.livingSpace === 'apartamento') {
                flags.push('Apartamento');
            }
        }

        // Construir razón basada en análisis
        let reason = '';
        if (issues.length > 0) {
            reason = `Alerta: ${issues.join(', ')}. Score ${score}/100.`;
        } else if (positives.length > 0) {
            const topPositives = positives.slice(0, 2).join(', ');
            reason = `Candidato con ${topPositives}. Score ${score}/100. Requiere revisión.`;
        } else {
            reason = `Información incompleta. Score ${score}/100. Revisión necesaria.`;
        }

        // Limitar score
        score = Math.max(0, Math.min(100, score));

        return { score, reason, flags };
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
