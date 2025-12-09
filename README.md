# Katze 🐱 - Plataforma de Adopción de Gatos

Sistema web completo para gestionar adopciones de gatos, con seguimiento post-adopción, evaluación por IA y contenido educativo.

---

## 🚀 Características Principales

- **Publicación de Gatos**: Rescatistas publican gatos disponibles para adopción.
- **Solicitudes de Adopción**: Adoptantes envían solicitudes con formulario personalizado.
- **Evaluación por IA**: Sistema automático que analiza solicitudes y detecta riesgos/oportunidades.
- **Seguimiento Post-Adopción**: Tareas automáticas para verificar bienestar y esterilización.
- **Contenido Educativo**: Charlas y recursos sobre cuidado felino.
- **Panel de Administración**: Control total del sistema, gestión de usuarios y métricas.
- **Estadísticas**: Métricas de adopciones y seguimiento en tiempo real.

---

## 🛠️ Tecnologías

- **Backend**: Node.js, Express, PostgreSQL.
- **Frontend**: React, TypeScript, Vite.
- **IA**: Google Gemini 1.5 Flash.
- **Almacenamiento**: Firebase Storage.
- **Base de Datos**: PostgreSQL (Render).

---

## 📦 Instalación y Configuración

### Requisitos Previos
- Node.js 18+
- PostgreSQL 14+
- Cuenta de Firebase (para imágenes)
- API Key de Google Gemini (para IA)

### 1. Configuración Inicial

```bash
# Instalar dependencias y configurar base de datos local
npm run setup
```

### 2. Variables de Entorno

Configura el archivo `backend/.env`:

```env
PORT=5000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=katze
DB_PASSWORD=root
JWT_SECRET=tu_secreto_jwt
GEMINI_API_KEY=tu_api_key_gemini
GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json
```

### 3. Ejecutar el Proyecto

```bash
# Ejecutar backend y frontend simultáneamente
npm run dev
```

---

## 🤖 Sistema de Evaluación por IA

El sistema utiliza **Google Gemini 1.5 Flash** para analizar las solicitudes de adopción en tiempo real.

- **Puntaje (0-100)**: Evalúa la idoneidad del candidato.
- **Banderas (Flags)**: Detecta riesgos (ej. "No acepta esterilización") o puntos positivos (ej. "Casa propia").
- **Acción Sugerida**: Recomienda "Revisión Manual" o "Rechazo Automático" (nunca aprueba automáticamente).

---

## 📊 Datasets CSV (Firebase Storage)

El sistema guarda automáticamente 4 archivos CSV en Firebase Storage cada vez que hay cambios:

- **users.csv**: Todos los usuarios registrados (actualizados al registrar/editar/cambiar rol)
- **cats.csv**: Todos los gatos publicados (actualizados al crear/editar/aprobar gatos)
- **adoption_applications.csv**: Todas las solicitudes de adopción (actualizadas al crear/evaluar/aprobar solicitudes)
- **tracking_tasks.csv**: Todas las tareas de seguimiento (actualizadas al crear/completar tareas)

**Ubicación**: Firebase Storage > `datasets/`

**Generar manualmente**:
```bash
# Backend
cd backend
npm run generate-csv

# O vía API (solo admins)
POST /api/admin/datasets/regenerate
```

---

## 📊 Panel de Administración

El panel administrativo permite:
- **Gestión de Usuarios**: Ver y cambiar roles (Adoptante, Rescatista, Admin).
- **Gestión de Solicitudes**: Aprobar o rechazar solicitudes con un clic.
- **Seguimiento**: Ver tareas de bienestar y esterilización pendientes/atrasadas.
- **Métricas**: Visualizar estadísticas de adopción.

---

## 🌍 Despliegue en Producción (Render)

Para ejecutar migraciones o seeds en la base de datos de producción (Render):

```bash
# Ejecutar migraciones en producción
node backend/run-migration.js

# Poblar base de datos con datos de demostración (¡Borra datos existentes!)
npm run seed:demo
```

---

## 🔗 API Endpoints Principales

### Autenticación
- `POST /api/auth/login`: Iniciar sesión
- `POST /api/auth/register`: Registrar usuario

### Gatos
- `GET /api/cats`: Listar gatos
- `POST /api/cats`: Publicar gato (Rescatista)

### Solicitudes
- `POST /api/cats/:id/apply`: Enviar solicitud
- `PUT /api/applications/:id/status`: Aprobar/Rechazar (Admin/Rescatista)

### Seguimiento
- `GET /api/tracking/all`: Ver todas las tareas (Admin)
- `POST /api/tracking/tasks/:id/complete`: Completar tarea

---

## 👥 Roles de Usuario

- **Adoptante**: Busca gatos, envía solicitudes.
- **Rescatista**: Publica gatos, revisa solicitudes recibidas.
- **Admin**: Acceso total al sistema, gestión de usuarios y contenido.

---

Desarrollado para el curso de Desarrollo de Aplicaciones Web - UDI 2025.

