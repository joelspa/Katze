-- Migración: Agregar columnas de evaluación automática con IA
-- Fecha: 2025-12-06
-- Descripción: Agrega columnas para almacenar resultados de evaluación automática
--              de solicitudes usando Google Gemini AI

ALTER TABLE adoption_applications
ADD COLUMN IF NOT EXISTS ai_decision VARCHAR(20) CHECK (ai_decision IN ('REJECT', 'REVIEW', 'APPROVE')),
ADD COLUMN IF NOT EXISTS ai_score INTEGER CHECK (ai_score >= 0 AND ai_score <= 100),
ADD COLUMN IF NOT EXISTS ai_auto_reject_reason TEXT,
ADD COLUMN IF NOT EXISTS ai_risk_analysis JSONB,
ADD COLUMN IF NOT EXISTS ai_evaluated_at TIMESTAMP;

-- Comentarios para documentación
COMMENT ON COLUMN adoption_applications.ai_decision IS 'Decisión automática de la IA: REJECT (rechazo automático), REVIEW (revisión humana), APPROVE (candidato aprobado)';
COMMENT ON COLUMN adoption_applications.ai_score IS 'Puntuación de compatibilidad 0-100 calculada por IA';
COMMENT ON COLUMN adoption_applications.ai_auto_reject_reason IS 'Razón específica del rechazo automático (solo si ai_decision = REJECT)';
COMMENT ON COLUMN adoption_applications.ai_risk_analysis IS 'Análisis detallado de riesgos identificados por la IA';
COMMENT ON COLUMN adoption_applications.ai_evaluated_at IS 'Timestamp de cuándo se realizó la evaluación automática';
