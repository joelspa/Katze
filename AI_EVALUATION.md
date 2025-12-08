# Sistema de Evaluación por IA de Solicitudes de Adopción

## Descripción General

El sistema de evaluación por IA analiza automáticamente cada solicitud de adopción para ayudar a los rescatistas a identificar candidatos prometedores y detectar posibles riesgos. La IA NUNCA aprueba solicitudes automáticamente; solo las clasifica y marca para revisión humana.

## Objetivo

Proteger el bienestar de los gatos mediante:
- Filtrado rápido de solicitudes problemáticas
- Identificación de banderas rojas (red flags)
- Destacar candidatos prometedores
- Ahorrar tiempo a los rescatistas en la revisión inicial

## Sistema de Puntaje (0-100)

### Puntaje Base: 50 puntos

Cada solicitud comienza con 50 puntos y se ajusta según los siguientes criterios:

### Factores que Aumentan el Puntaje

| Factor | Puntos | Descripción |
|--------|--------|-------------|
| Motivación genuina | +15 | Texto de motivación con palabras clave positivas |
| Acepta esterilización | +20 | Compromiso explícito de esterilizar al gato |
| Espacio suficiente | +10 | Indica tener espacio adecuado para el gato |
| Experiencia previa | +10 | Ha tenido gatos anteriormente |
| Disponibilidad de tiempo | +5 | Tiene tiempo para cuidar al gato |
| Vivienda tipo casa | +5 | Vive en casa (más seguro que apartamento) |

### Factores que Reducen el Puntaje

| Factor | Puntos | Descripción |
|--------|--------|-------------|
| No acepta esterilización | Máximo 20 | Rechaza la política obligatoria de esterilización |
| Intención comercial detectada | Máximo 15 | Menciona criar, vender, o usar con fines de lucro |
| Motivación vaga o superficial | -10 a -15 | Respuestas muy cortas o poco serias |

## Análisis de Texto de Motivación

El sistema analiza el campo "Por qué eres el hogar perfecto" buscando:

### Palabras Clave Positivas (cada una suma +3 puntos)

- amor, cuidar, familia, compañía, rescate
- hogar, responsable, cariño, adoptar
- seguro, protección, bienestar

### Palabras Clave Negativas (reducen score a 15 puntos máximo)

- criar, vender, regalar, crías
- negocio, dinero, comercio

### Ejemplos de Análisis

**Motivación Excelente (100 puntos):**
```
"Resido en una casa amplia y segura con jardín. Tengo experiencia 
cuidando mascotas y entiendo la responsabilidad. Busco brindar un 
hogar estable lleno de amor y cuidados veterinarios adecuados."

Resultado:
- Palabras positivas detectadas: casa, segura, cuidando, responsabilidad, 
  hogar, amor, cuidados
- Score: 50 (base) + 15 (motivación) + 20 (esterilización) + 10 (espacio) 
  + 10 (experiencia) + 5 (tiempo) + 5 (casa) = 115 → limitado a 100
- Banderas: Motivación Genuina, Pro-Esterilización, Experiencia Previa
```

**Motivación Problemática (20 puntos):**
```
"Quiero un gato porque se ven bonitos"

Resultado:
- Motivación superficial
- No acepta esterilización
- Score: 50 (base) - 30 (rechaza esterilización) = 20
- Banderas: Rechaza Esterilización, Primer Gato
```

## Banderas (Flags)

Las banderas son etiquetas que resumen características clave de la solicitud:

### Banderas Positivas

- **Pro-Esterilización**: Acepta comprometerse con la esterilización
- **Experiencia Previa**: Ha tenido gatos antes
- **Casa Segura**: Vivienda con medidas de seguridad adecuadas
- **Motivación Genuina**: Texto de motivación detallado y sincero
- **Espacio Adecuado**: Indica tener espacio suficiente

### Banderas de Alerta

- **Primer Gato**: Nunca ha tenido gatos (requiere más orientación)
- **Rechaza Esterilización**: No acepta la política obligatoria
- **Riesgo Venta**: Posible intención comercial detectada
- **Riesgo Negligencia**: Respuestas vagas o preocupantes

## Clasificación de Solicitudes

### Excelente (85-100 puntos)

- Candidato altamente prometedor
- Múltiples factores positivos
- Motivación genuina y detallada
- Acepta todas las condiciones
- **Acción**: Revisión prioritaria

### Bueno (70-84 puntos)

- Candidato viable
- Cumple criterios principales
- Puede tener áreas menores de mejora
- **Acción**: Revisión estándar

### Regular (50-69 puntos)

- Candidato con dudas
- Falta información o compromiso en áreas clave
- Requiere seguimiento adicional
- **Acción**: Revisión detallada y entrevista

### Problemático (20-49 puntos)

- Candidato con señales de alerta
- Posible riesgo para el bienestar del gato
- **Acción**: Revisión exhaustiva o rechazo

### Inaceptable (0-19 puntos)

- Rechaza esterilización obligatoria
- Intención comercial detectada
- Indicios claros de riesgo
- **Acción**: Rechazo recomendado

## Rendimiento del Sistema

### Tiempos de Evaluación

- **Con API de Gemini activa**: 2-4 segundos por solicitud
- **Modo fallback (sin API)**: Menos de 100ms (instantáneo)

### Procesamiento Automático

El sistema procesa solicitudes en lotes:
- Procesa 5 solicitudes cada 10 segundos
- Ejecuta automáticamente en segundo plano
- Sin intervención manual requerida

## Limitaciones y Consideraciones

1. **La IA no reemplaza el juicio humano**: El puntaje es una guía, no una decisión final
2. **Análisis de texto limitado**: Puede no captar contextos culturales o expresiones locales
3. **Requiere revisión manual**: Todas las solicitudes deben ser revisadas por un humano
4. **Falsos positivos/negativos**: El sistema puede equivocarse; siempre revise el contexto completo

## Uso del Sistema

### Para Rescatistas

1. El sistema evalúa automáticamente cada nueva solicitud
2. Revisa el puntaje y banderas en el panel de rescatista
3. Lee el análisis breve de la IA
4. Toma la decisión final basándote en:
   - Puntaje de IA
   - Banderas detectadas
   - Tu experiencia y criterio
   - Contexto específico del gato

### Para Administradores

El sistema funciona de manera automática. Configuración disponible en:
- `backend/services/aiService.js` - Lógica de evaluación
- `backend/workers/processApplicationQueue.js` - Procesamiento en lotes
- `backend/.env` - Configuración de API de Gemini (opcional)

## Casos de Uso Reales

### Caso 1: Candidato Ideal
```
Solicitud #52
Score: 100/100
Feedback: "Candidato con motivación clara y positiva, acepta 
          esterilización. Requiere revisión."
Banderas: Motivación Genuina, Pro-Esterilización, Espacio Adecuado, 
          Experiencia Previa, Casa

Decisión recomendada: Priorizar para entrevista
```

### Caso 2: Requiere Atención
```
Solicitud #50
Score: 90/100
Feedback: "Candidato con acepta esterilización, espacio suficiente. 
          Requiere revisión."
Banderas: Pro-Esterilización, Espacio Adecuado, Primer Gato

Decisión recomendada: Revisar y proporcionar orientación sobre cuidados
```

### Caso 3: Alto Riesgo
```
Solicitud #51
Score: 20/100
Feedback: "Alerta: no acepta esterilización obligatoria."
Banderas: Rechaza Esterilización, Primer Gato

Decisión recomendada: Rechazar o solicitar compromiso de esterilización
```

## Preguntas Frecuentes

**P: ¿La IA puede aprobar solicitudes automáticamente?**
R: No. La IA solo clasifica y marca. Todas las decisiones finales las toma un humano.

**P: ¿Qué pasa si la API de Gemini no está disponible?**
R: El sistema usa análisis fallback basado en reglas que funciona instantáneamente.

**P: ¿Puedo confiar 100% en el puntaje de la IA?**
R: No. El puntaje es una guía. Siempre revisa el contexto completo y usa tu criterio.

**P: ¿Cómo mejora el sistema con el tiempo?**
R: Actualmente el sistema usa reglas fijas. Futuras versiones podrían incluir aprendizaje automático.

**P: ¿Qué hago si creo que la IA se equivocó?**
R: Confía en tu juicio. El sistema está diseñado para asistir, no para decidir.

---

**Última actualización**: Diciembre 2025
**Versión del sistema**: 1.0
**Modelo de IA**: Google Gemini 1.5 Flash (con fallback de reglas)
