# API Routes - Katze

Guía rápida de todos los endpoints de la API.

## Autenticación

```
POST /api/auth/register
POST /api/auth/login
```

## Gatos

```
GET    /api/cats
GET    /api/cats/:id
POST   /api/cats
PUT    /api/cats/:id
DELETE /api/cats/:id
```

## Solicitudes de Adopción

```
POST /api/applications/apply/:id
GET  /api/applications/received
PUT  /api/applications/:id/status
```

## Seguimiento Post-Adopción

```
GET  /api/tracking/tasks
PUT  /api/tracking/tasks/:id/complete
POST /api/tracking/tasks/:id/wellness
```

## Educación

```
GET  /api/education/talks
GET  /api/education/talks/:id
POST /api/education/talks
PUT  /api/education/talks/:id
POST /api/education/talks/:id/register
```

## Estadísticas

```
GET /api/statistics/general
GET /api/statistics/adoption-trends
```

## Usuarios

```
GET /api/users/profile
PUT /api/users/profile
GET /api/users
GET /api/users/:id
PUT /api/users/:id/role
```
