# API Routes - Katze

Guía rápida de todos los endpoints de la API.

## Autenticación

```
POST /api/auth/register    # Registrar nuevo usuario
POST /api/auth/login       # Iniciar sesión
```

## Gatos

```
GET    /api/cats           # Listar todos los gatos disponibles
GET    /api/cats/:id       # Obtener detalles de un gato específico
POST   /api/cats           # Publicar un nuevo gato (rescatista)
PUT    /api/cats/:id       # Actualizar información del gato
DELETE /api/cats/:id       # Eliminar publicación de gato
```

## Solicitudes de Adopción

```
POST /api/applications/apply/:id        # Solicitar adopción de un gato
GET  /api/applications/received         # Ver solicitudes recibidas (rescatista)
PUT  /api/applications/:id/status       # Aprobar/rechazar solicitud
```

## Seguimiento Post-Adopción

```
GET  /api/tracking/tasks                # Ver tareas de seguimiento pendientes
PUT  /api/tracking/tasks/:id/complete   # Marcar tarea como completada
POST /api/tracking/tasks/:id/wellness   # Registrar reporte de bienestar
```

## Educación

```
GET  /api/education/talks               # Listar todas las charlas educativas
GET  /api/education/talks/:id           # Obtener detalles de una charla
POST /api/education/talks               # Crear nueva charla (rescatista)
PUT  /api/education/talks/:id           # Actualizar información de charla
POST /api/education/talks/:id/register  # Registrarse a una charla
```

## Estadísticas

```
GET /api/statistics/general             # Estadísticas generales del sistema
GET /api/statistics/adoption-trends     # Tendencias de adopción
```

## Usuarios

```
GET /api/users/profile      # Ver perfil del usuario autenticado
PUT /api/users/profile      # Actualizar perfil propio
GET /api/users              # Listar todos los usuarios (admin)
GET /api/users/:id          # Obtener usuario específico (admin)
PUT /api/users/:id/role     # Cambiar rol de usuario (admin)
```
