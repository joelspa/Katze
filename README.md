# Katze - Plataforma de Adopción de Gatos

Sistema web completo para gestionar adopciones de gatos con evaluación por inteligencia artificial, seguimiento post-adopción automatizado, y contenido educativo sobre cuidado felino.

---

## Tabla de Contenidos

1. [Documentación Complementaria](#documentación-complementaria)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Flujo de Adopción](#flujo-de-adopción)
4. [Sistema de Evaluación por IA](#sistema-de-evaluación-por-ia)
5. [Gestión de Usuarios y Roles](#gestión-de-usuarios-y-roles)
6. [Sistema de Seguimiento Post-Adopción](#sistema-de-seguimiento-post-adopción)
7. [Gestión de Datasets CSV](#gestión-de-datasets-csv)
8. [Panel de Administración](#panel-de-administración)
9. [Configuración y Despliegue](#configuración-y-despliegue)
10. [API Endpoints](#api-endpoints)
11. [Credenciales de Demostración](#credenciales-de-demostración)

---

## Documentación Complementaria

### Archivos de Referencia

- **[DEMO.md](DEMO.md)**: Guía rápida de prueba con credenciales y flujo de demostración paso a paso
- **[FUNCIONALIDADES.md](FUNCIONALIDADES.md)**: Explicación técnica detallada de cada funcionalidad del sistema
- **[DB.md](DB.md)**: Documentación completa de la base de datos (tablas, relaciones, índices, migraciones)
- **[DB.sql](DB.sql)**: Script PostgreSQL ejecutable para recrear la base de datos completa
- **[API_ROUTES.md](API_ROUTES.md)**: Documentación de todos los endpoints de la API REST

### Base de Datos

Para una comprensión detallada de la estructura de base de datos:

1. **Documentación**: Lee [DB.md](DB.md) para ver el diseño completo con diagramas ERD
2. **Script SQL**: Ejecuta [DB.sql](DB.sql) en PostgreSQL para crear toda la estructura
3. **Schema Base**: Revisa [backend/schema.sql](backend/schema.sql) para el schema inicial
4. **Migraciones**: Ver carpeta [backend/migrations/](backend/migrations/) para cambios incrementales

---

## Arquitectura del Sistema

### Stack Tecnológico

**Backend**: Node.js 18+ con Express como framework web  
**Base de Datos**: PostgreSQL 14+ con esquema relacional completo ([ver schema.sql](backend/schema.sql))  
**Frontend**: React 18 con TypeScript, Vite como bundler  
**IA**: Google Gemini 1.5 Flash para análisis de solicitudes  
**Almacenamiento**: Firebase Storage para imágenes de gatos y datasets CSV  
**Autenticación**: JWT con bcrypt para hash de contraseñas  

### Estructura de Directorios

```
backend/
  ├── controllers/       # Lógica de negocio por módulo
  ├── services/          # Servicios reutilizables (IA, Firebase, etc)
  ├── routes/            # Definición de endpoints REST
  ├── middleware/        # Autenticación y autorización
  └── config/            # Configuración de base de datos y servicios

frontend/
  ├── pages/             # Componentes de página
  ├── components/        # Componentes reutilizables
  ├── context/           # Context API (Auth, Theme)
  └── config/            # Configuración de API
```

---

## Flujo de Adopción

### 1. Publicación de Gatos

**Responsable**: Rescatista o Admin

**Proceso**:
1. Rescatista completa formulario con datos del gato (nombre, edad, raza, personalidad, necesidades especiales)
2. Sube 1-5 fotos a [Firebase Storage](backend/services/firebaseService.js#L29-L62)
3. El sistema crea registro en estado `pendiente_aprobacion` ([catController.js](backend/controllers/catController.js#L9-L82))
4. Admin revisa y aprueba, cambiando estado a `disponible` ([catController.js](backend/controllers/catController.js#L140-L175))
5. Gato aparece en catálogo público ([CatCarousel.tsx](frontend/src/components/CatCarousel.tsx))

**Estados del gato**: `pendiente_aprobacion`, `disponible`, `adoptado`, `rechazado`

### 2. Solicitud de Adopción

**Responsable**: Adoptante

**Proceso**:
1. Usuario navega catálogo y selecciona gato ([Catalog.tsx](frontend/src/pages/Catalog.tsx))
2. Completa formulario detallado ([AdoptionFormModal.tsx](frontend/src/components/AdoptionFormModal.tsx)):
   - Razón de adopción (100-300 palabras)
   - Tipo de vivienda (Casa, Departamento)
   - Experiencia con gatos (Sí/No)
   - Tiene otras mascotas (Sí/No)
   - Acepta esterilización (Sí/No)
   - Mensaje personalizado
3. Backend recibe solicitud y dispara evaluación de IA ([applicationController.js](backend/controllers/applicationController.js#L9-L117))
4. Resultado se almacena con estado inicial `revision_pendiente`

**Datos almacenados**: `form_responses` (JSONB), `ai_score`, `ai_flags`, `ai_recommendation`, `status`

### 3. Evaluación por IA

**Servicio**: Google Gemini 1.5 Flash ([aiService.js](backend/services/aiService.js))

**Flujo técnico**:
1. Sistema extrae datos de solicitud: `reason`, `message`, `housing_type`, `has_experience`, `has_other_pets`, `accepts_sterilization`
2. Construye prompt estructurado con criterios de evaluación ([aiService.js](backend/services/aiService.js#L65-L150)):
   - Calidad de la razón de adopción
   - Adecuación del espacio físico
   - Experiencia previa con gatos
   - Compatibilidad con mascotas existentes
   - Aceptación de esterilización obligatoria
   - Indicadores de riesgo (frases como "regalo para niños", "contenido Instagram")
3. Gemini responde con JSON estructurado:
   ```json
   {
     "score": 0-100,
     "flags": ["Casa propia", "Experiencia previa"],
     "recommendation": "manual_review" | "auto_reject"
   }
   ```
4. Sistema almacena resultados en columnas `ai_score`, `ai_flags` (array), `ai_recommendation`
5. Si `recommendation === "auto_reject"`, cambia status a `rechazada_automaticamente`

**Criterios de evaluación**:
- **90-100**: Candidato excepcional (experiencia, espacio, preparación)
- **70-89**: Candidato bueno con puntos a verificar
- **50-69**: Candidato regular, requiere revisión manual detallada
- **30-49**: Candidato con banderas rojas significativas
- **0-29**: Candidato crítico, rechazo automático recomendado

**Ver implementación completa**: [aiService.js líneas 38-200](backend/services/aiService.js#L38-L200)

### 4. Revisión Manual

**Responsable**: Admin o Rescatista dueño del gato

**Proceso**:
1. Usuario autorizado accede a panel de solicitudes ([AdminDashboard.tsx](frontend/src/pages/AdminDashboard.tsx))
2. Visualiza datos completos de solicitud en modal ([AdminDashboard.tsx líneas 1040-1180](frontend/src/pages/AdminDashboard.tsx#L1040-L1180)):
   - Datos del adoptante
   - Formulario completo (vivienda, experiencia, mascotas)
   - Puntaje de IA y flags detectadas
   - Recomendación de IA
3. Puede filtrar por estado: Pendientes, Aprobadas, Rechazadas ([AdminDashboard.tsx líneas 807-856](frontend/src/pages/AdminDashboard.tsx#L807-L856))
4. Toma decisión final:
   - **Aprobar**: Cambia estado a `aprobada`, crea tareas de seguimiento automáticas
   - **Rechazar**: Cambia estado a `rechazada` con nota opcional

**Ver lógica de aprobación**: [applicationController.js líneas 125-220](backend/controllers/applicationController.js#L125-L220)

### 5. Seguimiento Post-Adopción

Una vez aprobada la solicitud, el sistema genera automáticamente tareas de seguimiento.

**Ver sección completa**: [Sistema de Seguimiento Post-Adopción](#sistema-de-seguimiento-post-adopción)

---

## Sistema de Evaluación por IA

### Arquitectura del Servicio

**Archivo principal**: [aiService.js](backend/services/aiService.js)

El servicio utiliza el modelo `gemini-1.5-flash` de Google con las siguientes configuraciones:

```javascript
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    temperature: 0.1,           // Muy bajo para consistencia y velocidad
    topP: 0.8,
    topK: 20,
    maxOutputTokens: 300,       // Reducido para respuestas más rápidas
    responseMimeType: "application/json"  // Respuesta estructurada
  }
});
```

**Ver configuración**: [aiService.js líneas 18-28](backend/services/aiService.js#L18-L28)

### Prompt de Evaluación

El sistema construye un prompt detallado que incluye:

1. **Rol del sistema**: Evaluador experto en adopciones felinas
2. **Datos de entrada**:
   - Razón de adopción (texto largo)
   - Mensaje personalizado
   - Tipo de vivienda
   - Experiencia previa (booleano)
   - Otras mascotas (booleano)
   - Acepta esterilización (booleano)
3. **Criterios de evaluación**:
   - Sinceridad y profundidad de la razón
   - Idoneidad del espacio físico
   - Preparación y conocimiento
   - Red flags (motivaciones inadecuadas)
4. **Formato de salida esperado**: JSON con `score`, `flags`, `recommendation`

**Ver prompt completo**: [aiService.js líneas 65-150](backend/services/aiService.js#L65-L150)

### Flags Comunes Detectadas

**Positivas**:
- "Casa con jardín"
- "Experiencia previa confirmada"
- "Acepta esterilización"
- "Familia estable"
- "Trabajo remoto (disponibilidad)"
- "Veterinario de confianza establecido"

**Negativas (Red Flags)**:
- "Regalo para niños pequeños"
- "Contenido para redes sociales"
- "No acepta esterilización"
- "Espacio muy limitado"
- "Ausencias prolongadas"
- "Presupuesto insuficiente"
- "Depende de terceros"

### Recomendaciones del Sistema

1. **manual_review** (Revisión Manual): 
   - Usado en 90% de casos
   - Indica que humano debe tomar decisión final
   - Score puede ser alto o bajo, pero requiere verificación

2. **auto_reject** (Rechazo Automático):
   - Solo en casos críticos (score < 30)
   - Red flags graves detectadas
   - Sistema cambia status automáticamente a `rechazada_automaticamente`

**IMPORTANTE**: El sistema NUNCA aprueba automáticamente. Siempre requiere revisión humana para aprobaciones.

### Integración en el Flujo

**Llamada desde controller**:

```javascript
// applicationController.js
const evaluation = await aiService.analyzeApplication({
  reason: formResponses.reason,
  message: formResponses.message,
  housing_type: formResponses.housing_type,
  has_experience: formResponses.has_experience,
  has_other_pets: formResponses.has_other_pets,
  accepts_sterilization: formResponses.accepts_sterilization
});
```

**Almacenamiento de resultados**:

```sql
UPDATE adoption_applications SET
  ai_score = $1,
  ai_flags = $2,
  ai_recommendation = $3,
  status = CASE 
    WHEN $3 = 'auto_reject' THEN 'rechazada_automaticamente'
    ELSE 'revision_pendiente'
  END
WHERE id = $4
```

**Ver implementación completa**: [applicationController.js líneas 85-105](backend/controllers/applicationController.js#L85-L105)

### Manejo de Errores

Si la evaluación de IA falla (API caída, timeout, error de parsing):

1. Sistema registra error en logs
2. Asigna valores por defecto mediante `_getFallbackEvaluation()`
3. Solicitud se crea igualmente con estado `revision_pendiente`
4. Permite que humano evalúe manualmente

**Ver manejo de errores**: [aiService.js líneas 200-230](backend/services/aiService.js#L200-L230)

---

## Gestión de Usuarios y Roles

### Sistema de Roles

**Definición**: [schema.sql líneas 4-9](backend/schema.sql#L4-L9)

```sql
CREATE TYPE user_role AS ENUM ('adoptante', 'rescatista', 'admin');
```

#### Adoptante
- **Permisos**: Ver catálogo, enviar solicitudes, ver estado de sus solicitudes
- **Restricciones**: No puede publicar gatos ni ver solicitudes de otros
- **Interfaz**: [Catalog.tsx](frontend/src/pages/Catalog.tsx), [CatDetailPage.tsx](frontend/src/pages/CatDetailPage.tsx)

#### Rescatista
- **Permisos**: Publicar gatos, ver y gestionar solicitudes de sus gatos, crear tareas de seguimiento
- **Restricciones**: No puede cambiar roles, acceder a estadísticas globales, aprobar gatos de otros rescatistas
- **Interfaz**: [RescuerDashboard.tsx](frontend/src/pages/RescuerDashboard.tsx)
- **Middleware**: [moderationMiddleware.js](backend/middleware/moderationMiddleware.js)

#### Admin
- **Permisos**: Control total del sistema, cambio de roles, aprobación de todos los gatos y solicitudes, acceso a estadísticas globales, regeneración de datasets
- **Restricciones**: Ninguna
- **Interfaz**: [AdminDashboard.tsx](frontend/src/pages/AdminDashboard.tsx)
- **Middleware**: [adminMiddleware.js](backend/middleware/adminMiddleware.js)

### Autenticación

**Flujo de registro**:
1. Usuario completa formulario ([Register.tsx](frontend/src/pages/Register.tsx))
2. Backend valida datos ([authController.js](backend/controllers/authController.js#L69-L149))
3. Contraseña hasheada con bcrypt (10 rounds): [authService.js líneas 9-31](backend/services/authService.js#L9-L31)
4. Usuario creado con rol `adoptante` por defecto
5. Sistema genera dataset CSV actualizado automáticamente

**Flujo de login**:
1. Usuario envía credenciales
2. Backend verifica email y password con bcrypt.compare: [authService.js líneas 33-65](backend/services/authService.js#L33-L65)
3. Genera JWT con payload: `{ userId, email, role }`
4. Token válido por 7 días
5. Frontend almacena token en localStorage y Context API: [AuthContext.tsx](frontend/src/context/AuthContext.tsx)

**Protección de rutas**: [ProtectedRoute.tsx](frontend/src/components/ProtectedRoute.tsx)

### Cambio de Roles

**Responsable**: Solo Admin

**Proceso**:
1. Admin accede a sección "Gestión de Usuarios" ([AdminDashboard.tsx líneas 1200-1280](frontend/src/pages/AdminDashboard.tsx#L1200-L1280))
2. Visualiza tabla con todos los usuarios
3. Selecciona nuevo rol desde dropdown
4. Backend valida permisos con adminMiddleware: [adminMiddleware.js líneas 5-23](backend/middleware/adminMiddleware.js#L5-L23)
5. Actualiza rol en base de datos: [userController.js líneas 60-88](backend/controllers/userController.js#L60-L88)
6. Regenera dataset users.csv automáticamente

---

## Sistema de Seguimiento Post-Adopción

### Tareas Automáticas

Cuando una solicitud es aprobada, el sistema crea automáticamente tareas de seguimiento.

**Tipos de tareas**:
1. **bienestar**: Verificar adaptación del gato al nuevo hogar
2. **esterilizacion**: Confirmar cumplimiento de esterilización obligatoria

**Generación automática**: [trackingService.js líneas 8-75](backend/services/trackingService.js#L8-L75)

```javascript
// Ejemplo de tareas creadas
[
  { type: 'bienestar', due_date: '+3 days', description: 'Primera llamada de seguimiento' },
  { type: 'bienestar', due_date: '+7 days', description: 'Visita domiciliaria' },
  { type: 'esterilizacion', due_date: '+30 days', description: 'Verificar comprobante' }
]
```

### Estados de Tareas

- **pendiente**: Tarea programada, aún no vencida
- **atrasada**: Fecha de vencimiento pasada sin completar
- **completada**: Tarea finalizada con notas opcionales

**Cálculo automático de estado atrasado**: [trackingController.js líneas 15-48](backend/controllers/trackingController.js#L15-L48)

### Interfaz de Seguimiento

**Vista Admin**: Panel con todas las tareas del sistema
- Filtro por tipo (Bienestar / Esterilización)
- Filtro por estado (Pendiente / Atrasada / Completada)
- Contador de tareas atrasadas con alerta visual
- Botón "Marcar Completada" con modal para notas

**Ver implementación**: [AdminDashboard.tsx sección Seguimiento líneas 600-750](frontend/src/pages/AdminDashboard.tsx#L600-L750)

### Completar Tareas

**Proceso**:
1. Usuario hace clic en "Marcar Completada"
2. Modal solicita notas opcionales
3. Backend actualiza estado y timestamp: [trackingController.js líneas 84-125](backend/controllers/trackingController.js#L84-L125)
4. Regenera dataset tracking_tasks.csv automáticamente

---

## Gestión de Datasets CSV

### Sistema Automático

El sistema mantiene 4 archivos CSV sincronizados con la base de datos en tiempo real.

**Ubicación**: Firebase Storage bucket `datasets/`

**Archivos generados**:
1. **users.csv**: Todos los usuarios (id, nombre, email, rol, fecha_registro)
2. **cats.csv**: Todos los gatos (id, nombre, edad, raza, estado, rescatista_id, fecha_publicacion)
3. **adoption_applications.csv**: Todas las solicitudes (id, gato_id, adoptante_id, score_ia, flags, estado, fecha)
4. **tracking_tasks.csv**: Todas las tareas (id, application_id, tipo, estado, fecha_vencimiento, fecha_completado)

**Servicio de Generación**

**Archivo**: [csvDatasetService.js](backend/services/csvDatasetService.js)

**Funciones principales**:

```javascript
// Generar archivo CSV desde query SQL
async generateDataset(query, filename)

// Subir CSV a Firebase Storage
async uploadToFirebase(localPath, storagePath)

// Regenerar todos los datasets
async regenerateAllDatasets()
```

**Ver implementación**: [csvDatasetService.js](backend/services/csvDatasetService.js)

### Triggers Automáticos

Los datasets se regeneran automáticamente en los siguientes eventos:

**users.csv**:
- Nuevo usuario registrado
- Cambio de rol de usuario

**cats.csv**:
- Gato publicado
- Gato aprobado/rechazado
- Gato marcado como adoptado

**adoption_applications.csv**:
- Nueva solicitud enviada
- Solicitud aprobada/rechazada
- Score de IA actualizado

**tracking_tasks.csv**:
- Nueva tarea creada
- Tarea completada

**Implementación de triggers**: Cada controller llama a `csvDatasetService.generateDataset()` después de operaciones de escritura.

**Ejemplo en applicationController**:
```javascript
// Después de crear solicitud
await csvDatasetService.generateDataset(
  'SELECT * FROM adoption_applications',
  'adoption_applications.csv'
);
```

**Ver llamadas**: 
- [applicationController.js línea 112](backend/controllers/applicationController.js#L112)
- [catController.js línea 78](backend/controllers/catController.js#L78)
- [userController.js línea 85](backend/controllers/userController.js#L85)

### Regeneración Manual

**Vía API** (Solo Admin):
```bash
POST /api/admin/datasets/regenerate
Authorization: Bearer {jwt_token}
```

**Vía Script**:
```bash
cd backend
node generate-datasets.js
```

**Ver endpoint**: [adminRoutes.js](backend/routes/adminRoutes.js)

### Descarga de Datasets

Los administradores pueden descargar datasets individuales o todos a la vez desde el panel.

**Interfaz**: [AdminDashboard.tsx sección Datasets líneas 450-550](frontend/src/pages/AdminDashboard.tsx#L450-L550)

**Funcionalidad "Descargar Todo"**: Descarga secuencial con delay de 1 segundo entre archivos para evitar bloqueo del navegador.

**Ver implementación**: [AdminDashboard.tsx líneas 515-540](frontend/src/pages/AdminDashboard.tsx#L515-L540)

---

## Panel de Administración

### Estructura del Dashboard

**Archivo**: [AdminDashboard.tsx](frontend/src/pages/AdminDashboard.tsx)

**Secciones principales**:

1. **Resumen de Solicitudes** (líneas 807-840)
   - Contadores: Pendientes, Aprobadas, Rechazadas (manuales + automáticas)
   - Clickeable para filtrar vista
   - Estado activo con estilos visuales

2. **Gestión de Gatos** (líneas 300-420)
   - Tabla de gatos pendientes de aprobación
   - Botones: Aprobar / Rechazar
   - Modal de detalles con galería de imágenes

3. **Gestión de Solicitudes** (líneas 843-1180)
   - Tabla filtrable por estado
   - Columnas: Adoptante, Gato, Score IA, Estado, Acciones
   - Modal detallado con:
     - Datos del adoptante
     - Formulario completo (vivienda, experiencia, mascotas)
     - Evaluación de IA (score, flags, recomendación)
     - Botones: Aprobar / Rechazar

4. **Seguimiento Post-Adopción** (líneas 600-750)
   - Filtros: Tipo de tarea, Estado
   - Contador de tareas atrasadas
   - Tabla con fechas de vencimiento
   - Modal para completar con notas

5. **Gestión de Usuarios** (líneas 1200-1280)
   - Tabla de todos los usuarios
   - Cambio de rol inline
   - Búsqueda por email/nombre

6. **Datasets CSV** (líneas 450-550)
   - Cards individuales por dataset
   - Botón descarga individual
   - Botón "Descargar Todo"
   - Contador de registros

### Filtros y Estado

**Gestión de filtros con React State**:

```typescript
// Filtro de solicitudes por estado
const [applicationStatusFilter, setApplicationStatusFilter] = 
  useState<string | null>(null);

// Filtro dinámico
const filteredApplications = applications.filter(app => {
  if (!applicationStatusFilter) return true;
  if (applicationStatusFilter === 'rechazada') {
    return app.status === 'rechazada' || 
           app.status === 'rechazada_automaticamente';
  }
  return app.status === applicationStatusFilter;
});
```

**Ver implementación**: [AdminDashboard.tsx líneas 167-180, 843-856](frontend/src/pages/AdminDashboard.tsx#L167-L180)

### Estilos Visuales

**Archivo CSS**: [AdminDashboard.css](frontend/src/pages/AdminDashboard.css)

**Características**:
- Cards con hover effects
- Estado activo en filtros (borde azul, background gradient)
- Tablas responsivas con scroll horizontal
- Badges de estado con colores semánticos
- Modal overlay con backdrop blur

**Estilos de filtros activos**: [AdminDashboard.css líneas 88-96](frontend/src/pages/AdminDashboard.css#L88-L96)

---

## Configuración y Despliegue

### Requisitos del Sistema

- **Node.js**: 18.0.0 o superior
- **PostgreSQL**: 14.0 o superior
- **npm**: 8.0.0 o superior
- **Firebase Project**: Con Storage habilitado
- **Google Cloud Project**: Con Gemini API habilitada

### Variables de Entorno

**Backend** (`backend/.env`):
```env
# Servidor
PORT=5000
NODE_ENV=development

# Base de datos PostgreSQL
DB_USER=postgres
DB_HOST=localhost
DB_NAME=katze
DB_PASSWORD=root
DB_PORT=5432

# Producción (Render)
DATABASE_URL=postgresql://usuario:password@host:5432/database

# Autenticación
JWT_SECRET=clave_secreta_segura_minimo_32_caracteres

# Google Gemini AI
GEMINI_API_KEY=tu_api_key_de_google_cloud

# Firebase Storage
GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json
FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
```

**Obtener API Keys**:
- Gemini: [Google AI Studio](https://ai.google.dev/)
- Firebase: [Firebase Console](https://console.firebase.google.com/) → Project Settings → Service Accounts

### Instalación Local

```bash
# 1. Clonar repositorio
git clone https://github.com/joelspa/Katze.git
cd Katze

# 2. Instalar dependencias backend
cd backend
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# 4. Crear base de datos
createdb katze

# 5. Ejecutar schema (opción A: script completo)
psql -U postgres -d katze -f DB.sql

# O ejecutar schema (opción B: comandos individuales)
npm run init-db
npm run seed:demo

# 6. Iniciar backend
npm start

# 7. En otra terminal, configurar frontend
cd ../frontend
npm install

# 8. Iniciar frontend
npm run dev
```

**Acceso**: http://localhost:5173

### Despliegue en Producción

**Plataformas recomendadas**:
- **Backend**: Render, Railway, Heroku
- **Frontend**: Vercel, Netlify, Render
- **Base de Datos**: Render PostgreSQL, Supabase, Railway

**Configuración Render**:

1. **Backend (Web Service)**:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Variables de entorno: Agregar todas las del .env
   - Auto-Deploy: Activar desde rama `main`

2. **PostgreSQL (Managed Database)**:
   - Crear base de datos
   - Copiar `Internal Database URL` a `DATABASE_URL`
   - Ejecutar migraciones: `node backend/run-migration.js`
   - Seed inicial: `npm run seed:demo`

3. **Frontend (Static Site)**:
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/dist`
   - Variables de entorno: `VITE_API_URL=https://tu-backend.onrender.com`

**Ver script de migración**: [run-migration.js](backend/run-migration.js)

### Scripts Disponibles

**Raíz del proyecto**:
```bash
npm run dev              # Ejecutar backend + frontend simultáneamente
npm run setup            # Instalación completa (backend + frontend + db)
npm run seed:demo        # Poblar DB con datos de demostración
```

**Backend**:
```bash
npm start                # Iniciar servidor Express (puerto 5000)
node init-db.js          # Ejecutar schema.sql
node seed-database.js    # Poblar base de datos con datos de demostración
node generate-datasets.js # Regenerar todos los datasets CSV
node run-migration.js    # Ejecutar migraciones pendientes
```

**Base de Datos**:
```bash
# Crear base de datos completa desde script SQL
psql -U postgres -d katze -f DB.sql

# O ejecutar schema y migraciones por separado
psql -U postgres -d katze -f backend/schema.sql
psql -U postgres -d katze -f backend/migrations/add_living_space_and_breed.sql
psql -U postgres -d katze -f backend/migrations/add_ai_async_evaluation.sql
psql -U postgres -d katze -f backend/migrations/translate_status_to_spanish.sql
```

**Frontend**:
```bash
npm run dev              # Servidor de desarrollo Vite (puerto 5173)
npm run build            # Build para producción
npm run preview          # Preview del build
npm run lint             # Linter ESLint
```

---

## API Endpoints

### Autenticación

**POST** `/api/auth/register`  
Registrar nuevo usuario  
**Body**: `{ name, email, password, role? }`  
**Response**: `{ token, user: { id, name, email, role } }`  
**Código**: [authController.js líneas 69-149](backend/controllers/authController.js#L69-L149)

**POST** `/api/auth/login`  
Iniciar sesión  
**Body**: `{ email, password }`  
**Response**: `{ token, user: { id, name, email, role } }`  
**Código**: [authController.js líneas 9-67](backend/controllers/authController.js#L9-L67)

**GET** `/api/auth/me`  
Obtener usuario autenticado  
**Headers**: `Authorization: Bearer {token}`  
**Response**: `{ user: { id, name, email, role } }`  
**Código**: [authController.js líneas 151-175](backend/controllers/authController.js#L151-L175)

### Gatos

**GET** `/api/cats`  
Listar gatos disponibles (público)  
**Query**: `?status=disponible&page=1&limit=20`  
**Response**: `{ cats: [...], total, page, limit }`  
**Código**: [catController.js líneas 180-220](backend/controllers/catController.js#L180-L220)

**GET** `/api/cats/:id`  
Detalles de un gato  
**Response**: `{ cat: {...} }`  
**Código**: [catController.js líneas 222-250](backend/controllers/catController.js#L222-L250)

**POST** `/api/cats`  
Publicar nuevo gato (Rescatista/Admin)  
**Headers**: `Authorization: Bearer {token}`  
**Body**: FormData con `name, age, breed, images[]`  
**Response**: `{ cat: {...} }`  
**Código**: [catController.js líneas 9-82](backend/controllers/catController.js#L9-L82)

**PUT** `/api/cats/:id`  
Editar gato (Rescatista dueño/Admin)  
**Headers**: `Authorization: Bearer {token}`  
**Body**: `{ name?, age?, breed?, ... }`  
**Response**: `{ cat: {...} }`  
**Código**: [catController.js líneas 84-138](backend/controllers/catController.js#L84-L138)

**PUT** `/api/cats/:id/status`  
Aprobar/Rechazar gato (Admin)  
**Headers**: `Authorization: Bearer {token}`  
**Body**: `{ status: 'disponible' | 'rechazado' }`  
**Response**: `{ cat: {...} }`  
**Código**: [catController.js líneas 140-175](backend/controllers/catController.js#L140-L175)

### Solicitudes de Adopción

**POST** `/api/cats/:id/apply`  
Enviar solicitud de adopción (Adoptante)  
**Headers**: `Authorization: Bearer {token}`  
**Body**: 
```json
{
  "reason": "Texto largo explicando razón",
  "message": "Mensaje adicional",
  "housing_type": "Casa" | "Departamento",
  "has_experience": true | false,
  "has_other_pets": true | false,
  "accepts_sterilization": true | false
}
```
**Response**: `{ application: {...}, evaluation: {...} }`  
**Código**: [applicationController.js líneas 9-117](backend/controllers/applicationController.js#L9-L117)

**GET** `/api/applications/my-applications`  
Ver mis solicitudes (Adoptante)  
**Headers**: `Authorization: Bearer {token}`  
**Response**: `{ applications: [...] }`  
**Código**: [applicationController.js líneas 222-255](backend/controllers/applicationController.js#L222-L255)

**GET** `/api/applications/all`  
Ver todas las solicitudes (Admin)  
**Headers**: `Authorization: Bearer {token}`  
**Query**: `?status=revision_pendiente`  
**Response**: `{ applications: [...] }`  
**Código**: [applicationController.js líneas 257-295](backend/controllers/applicationController.js#L257-L295)

**PUT** `/api/applications/:id/status`  
Aprobar/Rechazar solicitud (Admin/Rescatista dueño)  
**Headers**: `Authorization: Bearer {token}`  
**Body**: `{ status: 'aprobada' | 'rechazada', notes? }`  
**Response**: `{ application: {...}, tasks?: [...] }`  
**Código**: [applicationController.js líneas 125-220](backend/controllers/applicationController.js#L125-L220)

### Seguimiento Post-Adopción

**GET** `/api/tracking/all`  
Ver todas las tareas (Admin)  
**Headers**: `Authorization: Bearer {token}`  
**Query**: `?type=bienestar&status=atrasada`  
**Response**: `{ tasks: [...] }`  
**Código**: [trackingController.js líneas 15-48](backend/controllers/trackingController.js#L15-L48)

**GET** `/api/tracking/my-tasks`  
Ver mis tareas (Rescatista de sus gatos adoptados)  
**Headers**: `Authorization: Bearer {token}`  
**Response**: `{ tasks: [...] }`  
**Código**: [trackingController.js líneas 50-82](backend/controllers/trackingController.js#L50-L82)

**POST** `/api/tracking/tasks/:id/complete`  
Marcar tarea completada  
**Headers**: `Authorization: Bearer {token}`  
**Body**: `{ notes?: "Texto opcional" }`  
**Response**: `{ task: {...} }`  
**Código**: [trackingController.js líneas 84-125](backend/controllers/trackingController.js#L84-L125)

### Usuarios

**GET** `/api/users`  
Listar todos los usuarios (Admin)  
**Headers**: `Authorization: Bearer {token}`  
**Response**: `{ users: [...] }`  
**Código**: [userController.js líneas 10-35](backend/controllers/userController.js#L10-L35)

**PUT** `/api/users/:id/role`  
Cambiar rol de usuario (Admin)  
**Headers**: `Authorization: Bearer {token}`  
**Body**: `{ role: 'adoptante' | 'rescatista' | 'admin' }`  
**Response**: `{ user: {...} }`  
**Código**: [userController.js líneas 60-88](backend/controllers/userController.js#L60-L88)

### Estadísticas

**GET** `/api/statistics/dashboard`  
Métricas del dashboard (Admin)  
**Headers**: `Authorization: Bearer {token}`  
**Response**: 
```json
{
  "totalCats": 50,
  "totalApplications": 120,
  "totalAdoptions": 35,
  "pendingTasks": 12,
  "applicationsByStatus": {...},
  "adoptionTrend": [...]
}
```
**Código**: [statisticsController.js líneas 10-95](backend/controllers/statisticsController.js#L10-L95)

### Contenido Educativo

**GET** `/api/education/posts`  
Listar posts educativos (Público)  
**Query**: `?category=cuidados_basicos`  
**Response**: `{ posts: [...] }`  
**Código**: [educationController.js líneas 10-45](backend/controllers/educationController.js#L10-L45)

**POST** `/api/education/posts`  
Crear post educativo (Admin)  
**Headers**: `Authorization: Bearer {token}`  
**Body**: `{ title, content, category, image_url? }`  
**Response**: `{ post: {...} }`  
**Código**: [educationController.js líneas 47-88](backend/controllers/educationController.js#L47-L88)

### Administración

**POST** `/api/admin/datasets/regenerate`  
Regenerar todos los datasets CSV (Admin)  
**Headers**: `Authorization: Bearer {token}`  
**Response**: `{ message: "Datasets regenerados", files: [...] }`  
**Código**: [adminRoutes.js líneas 40-55](backend/routes/adminRoutes.js#L40-L55)

---

## Credenciales de Demostración

**Contraseña universal para TODOS los usuarios: `123`**

Después de ejecutar `npm run seed:demo`, la base de datos incluye:

### Usuarios (11 totales)

#### Administrador (1)
| Email | Nombre | Rol |
|-------|--------|-----|
| admin@katze.com | María Rodríguez | admin |

**Permisos**: Control total del sistema

#### Rescatistas (3)
| Email | Nombre | Rol |
|-------|--------|-----|
| ana.garcia@katze.com | Ana García | rescatista |
| carlos.lopez@katze.com | Carlos López | rescatista |
| lucia.martinez@katze.com | Lucía Martínez | rescatista |

**Permisos**: Publicar gatos, gestionar solicitudes recibidas, ver seguimiento de sus adopciones

#### Adoptantes (7)
| Email | Nombre | Rol |
|-------|--------|-----|
| juan.perez@katze.com | Juan Pérez | adoptante |
| sofia.ramirez@katze.com | Sofía Ramírez | adoptante |
| miguel.torres@katze.com | Miguel Torres | adoptante |
| valentina.castro@katze.com | Valentina Castro | adoptante |
| diego.morales@katze.com | Diego Morales | adoptante |
| daniela.vega@katze.com | Daniela Vega | adoptante |
| andres.silva@katze.com | Andrés Silva | adoptante |

**Permisos**: Ver catálogo, solicitar adopciones, ver estado de solicitudes

### Datos Precargados

- **11 gatos**: 8 aprobados (con 3 fotos cada uno), 2 pendientes, 1 rechazado
- **10 solicitudes**: 3 aprobadas, 3 procesando, 1 en revisión, 3 rechazadas (2 por IA, 1 manual)
- **10 tareas de seguimiento**: Distribuidas entre completadas, pendientes y atrasadas
- **12 posts educativos**: Categorizados en cuidados básicos, salud, comportamiento y adopción responsable

**Para guía completa de prueba**: Ver [DEMO.md](DEMO.md)

---

## Documentación de Base de Datos

Para entender la estructura completa de la base de datos:

- **Documentación completa**: [DB.md](DB.md) - Tablas, relaciones, índices, vistas, funciones
- **Script ejecutable**: [DB.sql](DB.sql) - Crea toda la estructura desde cero
- **Diagrama ERD**: Disponible en [DB.md](DB.md#diagrama-de-relaciones-erd-simplificado)
- **Historial de migraciones**: Ver [DB.md](DB.md#historial-de-migraciones)

**Estructura resumida**:
- 5 tablas: users, cats, adoption_applications, tracking_tasks, educational_posts
- 1 vista: v_tracking_tasks_details
- 1 función: mark_overdue_tasks()
- 12 índices optimizados
- 4 migraciones aplicadas

---

Desarrollado para el curso de Desarrollo de Aplicaciones Web - Universidad del Istmo 2025.

