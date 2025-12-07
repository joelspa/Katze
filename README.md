# Katze 🐱 - Plataforma de Adopción de Gatos

Sistema web completo para gestionar adopciones de gatos, con seguimiento post-adopción y contenido educativo.

---

## 🚀 Inicio Rápido

### Requisitos Previos
- Node.js 18+
- PostgreSQL 14+
- Firebase Account (para Storage de imágenes y datasets)

### 1. Instalación y Configuración

```bash
# 1. Instalar todas las dependencias y configurar la base de datos
npm run setup

# Esto ejecuta automáticamente:
# - npm install (dependencias root)
# - npm install en backend y frontend
# - npm run migrate (crea tablas)
# - npm run seed (datos de prueba)
```

### 2. Configurar Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/project/katze-app/settings/serviceaccounts/adminsdk)
2. Haz clic en **"Generar nueva clave privada"**
3. Guarda el archivo como `backend/serviceAccountKey.json`
4. Agrega a `backend/.env`:
   ```env
   GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json
   ```

### 3. Ejecutar el Proyecto

```bash
# Ejecutar backend y frontend simultáneamente
npm run dev

# O ejecutar por separado:
# Backend (puerto 5000)
npm run dev:back

# Frontend (puerto 5174)
npm run dev:front
```

---

## Características Principales

- **Publicación de Gatos**: Rescatistas publican gatos disponibles para adopción
- **Solicitudes de Adopción**: Adoptantes envían solicitudes con formulario personalizado
- **Seguimiento Post-Adopción**: Tareas automáticas para verificar bienestar y esterilización
- **Contenido Educativo**: Charlas y recursos sobre cuidado felino
- **Panel de Administración**: Control total del sistema
- **Estadísticas**: Métricas de adopciones y seguimiento

## Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Ejecutar backend + frontend
npm run dev:back     # Solo backend
npm run dev:front    # Solo frontend

# Base de datos
npm run migrate      # Ejecutar migraciones
npm run seed         # Poblar datos de prueba
npm run setup        # Instalación completa + migración + seed

# Producción
npm run start:back   # Iniciar backend
npm run start:front  # Iniciar frontend
```

## Estructura del Proyecto

```
Katze/
├── backend/              # API REST con Node.js + Express
│   ├── controllers/      # Manejo de peticiones HTTP
│   ├── services/         # Lógica de negocio
│   ├── routes/           # Definición de endpoints
│   ├── middleware/       # Autenticación y validación
│   └── config/           # Configuración
│
└── frontend/             # React + TypeScript + Vite
    ├── pages/            # Páginas principales
    ├── components/       # Componentes reutilizables
    └── context/          # Contexto de autenticación
```

## Roles de Usuario

- **Adoptante**: Busca y solicita adoptar gatos
- **Rescatista**: Publica gatos y gestiona solicitudes
- **Administrador**: Control total del sistema

## Configuración de Variables de Entorno

Crea un archivo `backend/.env` con las siguientes variables:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=katze_db
DB_USER=tu_usuario
DB_PASSWORD=tu_password
JWT_SECRET=tu_secreto_jwt
PORT=3000
```

En el frontend crea `.env`:

```env
VITE_API_URL=http://localhost:3000
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_STORAGE_BUCKET=tu_bucket
```

## Documentación Adicional

- [Arquitectura del Sistema](backend/ARCHITECTURE.md)
- [Rutas de la API](API_ROUTES.md)

## Base de Datos

El proyecto incluye:
- **Schema SQL**: Tablas principales (users, cats, applications, tracking_tasks, education_talks)
- **Seed**: Ejecuta `npm run seed` en backend para datos de prueba
- **Credenciales de prueba**:
  - Admin: admin@test.com / password123
  - Rescatista: rescatista@test.com / password123
  - Adoptante: adoptante@test.com / password123

## Scripts Disponibles

### Backend
- `npm start` - Inicia servidor en producción
- `npm run dev` - Inicia con nodemon (desarrollo)
- `npm run seed` - Siembra base de datos con datos de prueba

### Frontend
- `npm run dev` - Inicia servidor de desarrollo (Vite)
- `npm run build` - Compila para producción
- `npm run preview` - Vista previa del build

