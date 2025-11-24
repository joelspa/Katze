# Arquitectura del Backend - Katze

Backend diseñado con arquitectura en capas y principios SOLID para facilitar mantenimiento y escalabilidad.

## Estructura de Carpetas

```
backend/
├── config/              # Configuración centralizada
│   └── config.js       # Variables de entorno y constantes
│
├── controllers/         # Capa de presentación (HTTP)
│   ├── applicationController.js  # Solicitudes de adopción
│   ├── authController.js        # Autenticación
│   ├── catController.js         # Gestión de gatos
│   ├── educationController.js   # Charlas educativas
│   ├── statisticsController.js  # Métricas y estadísticas
│   ├── trackingController.js    # Seguimiento post-adopción
│   └── userController.js        # Gestión de usuarios
│
├── services/            # Capa de lógica de negocio
│   ├── applicationService.js
│   ├── authService.js
│   ├── catService.js
│   ├── educationService.js
│   ├── statisticsService.js     # Cálculo de métricas
│   ├── trackingService.js
│   └── userService.js
│
├── routes/              # Definición de endpoints
│   ├── index.js                 # Router principal (exporta todas)
│   ├── adminRoutes.js           # Rutas de administración
│   ├── applicationRoutes.js     # Solicitudes de adopción
│   ├── authRoutes.js            # Login y registro
│   ├── catRoutes.js             # CRUD de gatos
│   ├── educationRoutes.js       # Charlas educativas
│   ├── statisticsRoutes.js      # Métricas del sistema
│   ├── trackingRoutes.js        # Seguimiento post-adopción
│   └── userRoutes.js            # Perfil y gestión de usuarios
│
├── middleware/          # Middlewares personalizados
│   ├── authMiddleware.js        # Verificación de JWT
│   ├── adminMiddleware.js       # Permisos de admin
│   └── moderationMiddleware.js  # Moderación de contenido
│
├── utils/               # Utilidades compartidas
│   ├── errorHandler.js  # Manejo centralizado de errores
│   └── validator.js     # Validaciones de datos
│
└── db.js               # Configuración de PostgreSQL
```

## Flujo de Datos

```
Request → Router → Middleware → Controller → Service → Database
                                    ↓
                                Validator
                                    ↓
                             ErrorHandler → Response
```

### Explicación:
1. **Request**: Cliente hace petición HTTP
2. **Router**: Identifica la ruta y método
3. **Middleware**: Verifica autenticación y permisos
4. **Controller**: Recibe datos, valida y llama al servicio
5. **Service**: Ejecuta lógica de negocio y consultas DB
6. **Database**: PostgreSQL almacena/recupera datos
7. **Response**: Se envía respuesta formateada al cliente

## Responsabilidades por Capa

### Controllers (Controladores)
- Reciben peticiones HTTP
- Extraen datos del request (body, params, query)
- Validan formato de datos
- Llaman a los servicios correspondientes
- Formatean respuestas HTTP
- **NO contienen lógica de negocio**

### Services (Servicios)
- Contienen toda la lógica de negocio
- Interactúan directamente con la base de datos
- Procesan y transforman datos
- Ejecutan cálculos y validaciones complejas
- **NO conocen HTTP ni requests/responses**

### Middleware
- Interceptan requests antes de llegar al controller
- Verifican autenticación (JWT)
- Validan permisos de usuario
- Registran logs de actividad

### Utils (Utilidades)
- **ErrorHandler**: Genera respuestas HTTP estandarizadas
- **Validator**: Valida tipos de datos y formatos
- Funciones reutilizables en todo el proyecto

## Sistema de Autenticación

- JWT (JSON Web Tokens) para sesiones
- Bcrypt para hash de contraseñas
- Middleware `authMiddleware.js` verifica tokens
- Roles: `adoptante`, `rescatista`, `admin`

## Base de Datos

### Tablas Principales
- **users**: Usuarios del sistema
- **cats**: Gatos disponibles para adopción
- **applications**: Solicitudes de adopción
- **tracking_tasks**: Tareas de seguimiento post-adopción
- **education_talks**: Charlas educativas

### Vistas
- **v_tracking_tasks_details**: Combina datos de tareas con info de gatos y adoptantes

### Triggers
- **update_tracking_tasks_on_sterilization**: Crea tarea de bienestar al marcar gato esterilizado

## Flujo de Adopción

1. **Rescatista publica gato** → Estado: "en_adopcion"
2. **Adoptante envía solicitud** → Estado: "pendiente"
3. **Rescatista aprueba solicitud**:
   - Gato pasa a "adoptado"
   - Se crean tareas de seguimiento automáticas:
     - **Bienestar**: 2 meses después (solo si ya está esterilizado)
     - **Esterilización**: 4 meses después (solo si está pendiente)
4. **Rescatista completa tareas** con notas y certificados

## Configuración (config.js)

Centraliza todas las constantes del sistema:
- Estados de gatos y solicitudes
- Roles de usuario
- Períodos de seguimiento
- Configuración de base de datos

## Manejo de Errores

Todas las respuestas pasan por `ErrorHandler`:
- `success()`: 200 - Operación exitosa
- `created()`: 201 - Recurso creado
- `badRequest()`: 400 - Datos inválidos
- `unauthorized()`: 401 - No autenticado
- `forbidden()`: 403 - Sin permisos
- `notFound()`: 404 - No encontrado
- `serverError()`: 500 - Error interno

## Convenciones de Código

- Comentarios en español
- Nombres descriptivos en español para variables de negocio
- Nombres técnicos en inglés (req, res, middleware)
- Logs con formato: `[nombreFuncion] Mensaje descriptivo`
- Sin emojis en console.log

## Ventajas de Esta Arquitectura

1. **Mantenible**: Código organizado y fácil de encontrar
2. **Testeable**: Cada capa se puede probar independientemente
3. **Escalable**: Fácil agregar nuevas funcionalidades
4. **Reutilizable**: Services pueden usarse desde múltiples controllers
5. **Legible**: Separación clara de responsabilidades

- Servicios reutilizables en diferentes controladores
- Validadores y utilidades compartidas

### ✅ **Separación de Responsabilidades**
- Cada archivo tiene un propósito claro
- Fácil identificar dónde hacer cambios

## 🔧 Configuración

Todas las configuraciones están centralizadas en `config/config.js`:
- Puerto del servidor
- Configuración de JWT
- Configuración de base de datos
- Constantes de la aplicación

## 📝 Ejemplos de Uso

### Agregar una nueva funcionalidad

1. **Crear el servicio** (`services/newService.js`)
2. **Crear el controlador** (`controllers/newController.js`)
3. **Crear las rutas** (`routes/newRoutes.js`)
4. **Registrar en** `routes/index.js` e `index.js`

### Agregar una validación

Agregar método estático en `utils/validator.js`:
```javascript
static validateNewData(data) {
    const errors = [];
    // Lógica de validación
    return { isValid: errors.length === 0, errors };
}
```

## 🛡️ Manejo de Errores

Todas las respuestas HTTP usan `ErrorHandler`:
- `ErrorHandler.success()` - 200
- `ErrorHandler.created()` - 201
- `ErrorHandler.badRequest()` - 400
- `ErrorHandler.unauthorized()` - 401
- `ErrorHandler.forbidden()` - 403
- `ErrorHandler.notFound()` - 404
- `ErrorHandler.serverError()` - 500

## 🔐 Seguridad

- JWT para autenticación
- Middlewares de autorización por rol
- Validación de datos en todas las entradas
- Contraseñas hasheadas con bcrypt
- Moderación automática de contenido

## 📊 Base de Datos

Conexión configurada en `db.js` usando Pool de PostgreSQL.
Todas las consultas pasan por servicios, nunca directamente desde controladores.

---

**Arquitectura diseñada siguiendo las mejores prácticas de desarrollo backend**
