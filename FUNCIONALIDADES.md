# FUNCIONALIDADES DE KATZE
## Explicación técnica simplificada de cada característica

---

## 1. REGISTRO Y LOGIN DE USUARIOS

**¿Qué hace?** Permite crear cuentas y acceder a la plataforma.

**Flujo:**
1. Usuario ingresa email, contraseña y datos personales
2. Backend hashea la contraseña con **bcrypt** (encriptación)
3. Se guarda en **PostgreSQL** (base de datos)
4. Al hacer login, se genera un **JWT Token** (llave de acceso)
5. Frontend guarda el token y lo envía en cada petición

**Tecnologías:**
- `bcrypt` → Encriptar contraseñas
- `JWT` → Tokens de autenticación
- `PostgreSQL` → Almacenar usuarios

---

## 2. PUBLICAR GATOS

**¿Qué hace?** Rescatistas suben fotos y datos de gatos para adopción.

**Flujo:**
1. Rescatista llena formulario con nombre, edad, fotos, historia, etc.
2. Fotos se suben a **Firebase Storage** (almacenamiento en la nube)
3. Backend guarda URLs de las fotos en **PostgreSQL**
4. Gato queda en estado "pendiente" esperando aprobación del admin
5. Se dispara **Webhook a Make.com** (automatización) con los datos del gato
6. Se actualizan **CSVs en Firebase Storage** automáticamente

**Tecnologías:**
- `Firebase Storage` → Guardar imágenes
- `PostgreSQL` → Guardar datos del gato
- `Make.com Webhook` → Notificación externa
- `csvDatasetService` → Generar archivos CSV

**Diagrama:**
```
Usuario → [Formulario] → Firebase Storage (fotos)
                      ↓
                 PostgreSQL (datos)
                      ↓
                 Webhook → Make.com
                      ↓
                 Actualizar CSV
```

---

## 3. APROBAR/RECHAZAR GATOS (Admin)

**¿Qué hace?** El admin revisa y aprueba publicaciones de gatos.

**Flujo:**
1. Admin ve lista de gatos pendientes
2. Hace clic en "Aprobar" o "Rechazar"
3. Backend actualiza el campo `approval_status` en **PostgreSQL**
4. Si se aprueba, el gato aparece en el catálogo público
5. Se actualizan automáticamente los **CSVs en Firebase Storage**

**Tecnologías:**
- `PostgreSQL` → Cambiar estado del gato
- `csvDatasetService` → Regenerar CSV de gatos

---

## 4. SOLICITAR ADOPCIÓN

**¿Qué hace?** Usuarios envían formularios para adoptar un gato.

**Flujo:**
1. Adoptante llena formulario extenso (trabajo, espacio, experiencia, etc.)
2. Backend guarda la solicitud con estado "procesando"
3. **Worker en background** toma solicitudes pendientes cada 30 segundos
4. Worker envía datos a **Google Gemini 1.5 Flash** (IA de Google)
5. Gemini evalúa la solicitud y devuelve:
   - Score 0-100 (compatibilidad)
   - Feedback detallado (razones)
   - Flags de advertencia (si hay problemas)
6. Si score < 40 → "Rechazada automáticamente"
7. Si score ≥ 40 → "Revisión pendiente" (espera admin)
8. Se actualizan los **CSVs en Firebase Storage**

**Tecnologías:**
- `Google Gemini API` → IA para evaluar solicitudes
- `Worker background` → Procesar automáticamente
- `PostgreSQL` → Guardar solicitudes y evaluaciones
- `csvDatasetService` → Generar CSV de solicitudes

**Diagrama:**
```
Adoptante → [Formulario] → PostgreSQL (estado: procesando)
                                ↓
                           Worker detecta
                                ↓
                        Google Gemini IA
                                ↓
                    Evalúa (score + feedback)
                                ↓
                    Actualiza estado en PostgreSQL
                                ↓
                          Actualizar CSV
```

---

## 5. MODERACIÓN AUTOMÁTICA CON IA

**¿Qué hace?** Detecta contenido inapropiado en publicaciones de gatos.

**Flujo:**
1. Cuando rescatista publica un gato, descripción va a **Google Gemini**
2. Gemini analiza el texto buscando:
   - Contenido violento, sexual, inapropiado
   - Spam o estafas
   - Información peligrosa
3. Si Gemini marca como "peligroso" → Gato rechazado automáticamente
4. Si es "seguro" → Continúa a revisión del admin

**Tecnologías:**
- `Google Gemini API` → Moderación de contenido
- `geminiService` → Enviar textos a la IA

---

## 6. GENERAR DATASETS CSV

**¿Qué hace?** Crea archivos CSV con todos los datos del sistema.

**Flujo:**
1. Cada vez que se crea/modifica/elimina algo (usuario, gato, solicitud, tarea)
2. Se llama a `csvDatasetService.updateXXXDataset()`
3. Backend hace query SQL a **PostgreSQL** para obtener datos actualizados
4. Convierte datos a formato CSV (texto separado por comas)
5. Obtiene **Access Token** de Firebase Admin SDK
6. Sube CSV a **Firebase Storage** usando **Google Cloud Storage REST API**
7. Hace el archivo público (cualquiera puede descargarlo)

**Tecnologías:**
- `PostgreSQL` → Leer datos
- `Firebase Admin SDK` → Autenticación
- `Google Cloud Storage REST API` → Subir archivos
- `axios` → Hacer peticiones HTTP

**Archivos generados:**
- `users.csv` → Todos los usuarios
- `cats.csv` → Todos los gatos
- `adoption_applications.csv` → Todas las solicitudes
- `tracking_tasks.csv` → Todas las tareas de seguimiento

**Diagrama detallado:**
```
Evento (crear gato) → csvDatasetService.updateCatsDataset()
                              ↓
                    Query SQL a PostgreSQL
                              ↓
                    Obtener datos actualizados
                              ↓
                    Convertir a formato CSV
                              ↓
                    Obtener Access Token (Firebase Admin)
                              ↓
                    POST a Google Cloud Storage REST API
                              ↓
                    Archivo subido a Firebase Storage
                              ↓
                    Hacer archivo público
```

---

## 7. DESCARGAR DATASETS

**¿Qué hace?** Admin descarga CSVs siempre actualizados.

**Flujo:**
1. Admin hace clic en "Descargar CSV"
2. Frontend llama a `/api/admin/datasets/regenerate`
3. Backend regenera **TODOS** los CSVs (no solo el solicitado)
4. Espera 2 segundos para que Firebase termine de subir
5. Descarga archivo con timestamp `?t=1234567890` para evitar cache
6. Admin recibe CSV con datos actuales

**Tecnologías:**
- `Endpoint /datasets/regenerate` → Regenerar archivos
- `Timestamp query param` → Evitar cache del navegador

---

## 8. TAREAS DE SEGUIMIENTO POST-ADOPCIÓN

**¿Qué hace?** Crea tareas automáticas cuando se aprueba una adopción.

**Flujo:**
1. Admin aprueba una solicitud de adopción
2. Backend cambia estado a "aprobada"
3. Se llama a `trackingService.createTrackingTasksForApplication()`
4. Se crean **automáticamente** 3 tareas:
   - "Primera visita veterinaria" (15 días)
   - "Verificar adaptación" (30 días)
   - "Llamada de seguimiento" (60 días)
5. Si el gato no está esterilizado, se crea tarea adicional:
   - "Esterilización pendiente" (90 días)
6. Se guardan en **PostgreSQL** con fechas calculadas
7. Se actualizan los **CSVs**

**Tecnologías:**
- `PostgreSQL` → Guardar tareas
- `trackingService` → Crear tareas automáticamente
- `csvDatasetService` → Actualizar CSV de tareas

---

## 9. PLATAFORMA EDUCATIVA

**¿Qué hace?** Admins publican artículos sobre cuidado de gatos.

**Flujo:**
1. Admin crea post con título, contenido, categoría e imagen
2. Imagen se sube a **Firebase Storage**
3. Post se guarda en **PostgreSQL**
4. Aparece en la sección "Educación" del frontend
5. Usuarios pueden leer sin necesidad de login

**Tecnologías:**
- `Firebase Storage` → Imágenes de posts
- `PostgreSQL` → Contenido de posts

---

## 10. WEBHOOK A MAKE.COM

**¿Qué hace?** Notifica a sistemas externos cuando se publica un gato.

**Flujo:**
1. Rescatista publica gato y admin lo aprueba
2. Backend hace POST a URL de Make.com con datos del gato:
   ```json
   {
     "cat_id": 15,
     "cat_name": "Luna",
     "owner_name": "Ana García",
     "owner_email": "ana@katze.com",
     "photos": ["url1", "url2"]
   }
   ```
3. Make.com puede automatizar:
   - Enviar email
   - Publicar en redes sociales
   - Notificar en Slack/Discord
   - Cualquier integración

**Tecnologías:**
- `axios` → Enviar petición HTTP POST
- `Make.com` → Plataforma de automatización

---

## 11. GESTIÓN DE USUARIOS (Admin)

**¿Qué hace?** Admin controla usuarios y sus roles.

**Operaciones disponibles:**

### Crear Usuario
- Admin llena formulario con email, contraseña, nombre, rol
- Backend hashea contraseña con **bcrypt**
- Guarda en **PostgreSQL**
- Actualiza CSVs

### Cambiar Rol
- Admin selecciona usuario y nuevo rol (adoptante, rescatista, admin)
- Backend valida que admin no cambie su propio rol
- Actualiza en **PostgreSQL**
- Actualiza CSVs

### Eliminar Usuario
- Admin confirma eliminación
- Backend valida que admin no se elimine a sí mismo
- Elimina usuario de **PostgreSQL** (se eliminan en cascada sus gatos y solicitudes)
- Actualiza CSVs

**Tecnologías:**
- `PostgreSQL` → CRUD de usuarios
- `bcrypt` → Hashear contraseñas

---

## 12. ESTADÍSTICAS DEL DASHBOARD

**¿Qué hace?** Muestra métricas del sistema en tiempo real.

**Flujo:**
1. Frontend solicita estadísticas a `/api/admin/dashboard/stats`
2. Backend hace múltiples queries SQL a **PostgreSQL**:
   - Contar gatos por estado
   - Contar solicitudes por estado
   - Contar usuarios por rol
   - Contar tareas pendientes/atrasadas
3. Backend agrupa y procesa datos
4. Devuelve JSON con totales
5. Frontend muestra gráficos y números

**Tecnologías:**
- `PostgreSQL queries` → Contar registros
- `SQL agregaciones` → SUM, COUNT, GROUP BY

---

## ARQUITECTURA GENERAL

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                        │
│  - TypeScript + Vite                                           │
│  - Axios para peticiones HTTP                                  │
│  - Firebase SDK para subir imágenes                            │
│  - Deployed en Render                                          │
└─────────────────────────────────────────────────────────────────┘
                                ↓ HTTP (JWT Token)
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND (Node.js)                       │
│  - Express.js para API REST                                    │
│  - JWT para autenticación                                      │
│  - Middlewares: auth, admin, moderation                        │
│  - Deployed en Render                                          │
└─────────────────────────────────────────────────────────────────┘
          ↓                    ↓                    ↓
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   PostgreSQL     │  │ Firebase Storage │  │  Google Gemini   │
│   (Render)       │  │   (Google)       │  │      (IA)        │
│                  │  │                  │  │                  │
│ - Usuarios       │  │ - Fotos gatos    │  │ - Evaluar        │
│ - Gatos          │  │ - Imgs posts     │  │   solicitudes    │
│ - Solicitudes    │  │ - CSVs datasets  │  │ - Moderar        │
│ - Tareas         │  │                  │  │   contenido      │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

---

## FLUJOS DE DATOS IMPORTANTES

### Flujo de Autenticación
```
Login → Backend verifica bcrypt → Genera JWT → Frontend guarda token
     → Cada petición incluye: Authorization: Bearer <token>
```

### Flujo de Subida de Fotos
```
Usuario selecciona foto → Firebase SDK sube → Devuelve URL pública
     → Backend guarda URL en PostgreSQL
```

### Flujo de Evaluación IA
```
Solicitud creada → Worker background (30s) → Google Gemini evalúa
     → Actualiza score/feedback en PostgreSQL
```

### Flujo de CSV
```
CRUD operation → Llama updateXXXDataset() → Query PostgreSQL
     → Genera CSV → Sube a Firebase Storage vía REST API
```

---

## VARIABLES DE ENTORNO CLAVE

```env
# Base de datos
DATABASE_URL=postgresql://user:pass@host/db

# Autenticación
JWT_SECRET=clave_secreta_para_tokens

# Google Gemini (IA)
GEMINI_API_KEY=AIzaSy...

# Firebase (Storage)
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
```

---

## RESUMEN DE SERVICIOS EXTERNOS

| Servicio | Para qué se usa |
|----------|----------------|
| **Render** | Hosting de frontend + backend + PostgreSQL |
| **Firebase Storage** | Guardar fotos de gatos, posts educativos y CSVs |
| **Google Gemini** | IA para evaluar solicitudes y moderar contenido |
| **Make.com** | Automatizaciones cuando se publica un gato |

---

## SEGURIDAD IMPLEMENTADA

1. **Contraseñas hasheadas** con bcrypt (nunca se guardan en texto plano)
2. **JWT Tokens** con expiración para autenticación
3. **Middlewares** que verifican roles antes de ejecutar acciones
4. **Validación de entrada** en todos los endpoints
5. **CORS** configurado para solo permitir orígenes conocidos
6. **Firebase Admin SDK** para subir CSVs (no expone credenciales al frontend)
7. **Moderación automática** con IA antes de aprobar publicaciones

---

*Este documento explica el funcionamiento técnico de Katze de forma simplificada. Cada funcionalidad combina múltiples tecnologías trabajando en conjunto para ofrecer una experiencia completa.*
