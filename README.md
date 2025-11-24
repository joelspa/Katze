# Katze - Plataforma de Adopción de Gatos

Sistema web completo para gestionar adopciones de gatos, con seguimiento post-adopción y contenido educativo.

## Características Principales

- **Publicación de Gatos**: Rescatistas publican gatos disponibles para adopción
- **Solicitudes de Adopción**: Adoptantes envían solicitudes con formulario personalizado
- **Seguimiento Post-Adopción**: Tareas automáticas para verificar bienestar y esterilización
- **Contenido Educativo**: Charlas y recursos sobre cuidado felino
- **Panel de Administración**: Control total del sistema
- **Estadísticas**: Métricas de adopciones y seguimiento

## Instalación Rápida

### Requisitos
- Node.js 18+
- PostgreSQL 14+
- Firebase Storage (para imágenes)

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
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

## Variables de Entorno

Crea un archivo `.env` en el backend:

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

