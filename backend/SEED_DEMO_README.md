# 🎭 Seed de Demostración - Katze

## Descripción

Este seed genera datos realistas y completos para demostrar todas las funcionalidades de la plataforma Katze.

## Uso

### Opción 1: Ejecutar directamente
```bash
cd backend
node seed-demo.js
```

### Opción 2: Usar npm script
```bash
cd backend
npm run seed:demo
```

### Opción 3: Setup completo (migraciones + seed)
```bash
cd backend
npm run setup:demo
```

## Datos Generados

### 👥 Usuarios (36 total)
- **1 Administrador**
  - Email: `admin@katze.com`
  - Password: `admin123`
  
- **10 Rescatistas**
  - Emails: `rescatista1@katze.com` - `rescatista10@katze.com`
  - Password: `password123`
  
- **25 Adoptantes**
  - Emails: `adoptante1@katze.com` - `adoptante25@katze.com`
  - Password: `password123`

### 🐱 Gatos (45 total)
Distribución por estados:
- **Aprobados**: 38 gatos
  - Disponibles: 27
  - En proceso: 8
  - Adoptados: 10
- **Pendientes**: 5 gatos
- **Rechazados**: 2 gatos

Esterilización:
- Esterilizados: ~20
- Pendientes: ~12
- No aplica: ~13

**Nombres de ejemplo**: Luna, Simba, Michi, Tigre, Pelusa, Nieve, Shadow, Muffin, Cookie, Bella, Max, Oliver, Coco, Bolita, Peludo, Misty, etc.

### 📋 Solicitudes de Adopción (~95 total)
- **Aprobadas**: ~18 solicitudes
- **Pendientes**: ~37 solicitudes
- **Rechazadas**: ~40 solicitudes

Cada solicitud incluye:
- Respuestas del formulario (form_responses)
- Evaluación de IA (ai_score, ai_feedback, ai_flags)
- Datos del adoptante y gato

### 📅 Tareas de Seguimiento (~41 total)
Generadas automáticamente para solicitudes aprobadas:

**Seguimiento de Esterilización** (~4 tareas):
- Para gatos no esterilizados
- Incluye verificación de certificados
- Estados: completada, pendiente

**Seguimiento de Bienestar** (~37 tareas):
- Visitas de seguimiento post-adopción
- Intervalos de 3, 6, y 9 meses
- Estados: completada, pendiente, atrasada

### 📚 Posts Educativos (10 posts)
Contenido variado sobre:
- **Salud**: Primeros auxilios, desparasitación, vacunación
- **Esterilización**: Importancia y beneficios
- **Nutrición**: Guía básica de alimentación
- **Comportamiento**: Señales y comunicación felina
- **Adopción**: Preparación del hogar, jornadas
- **General**: Juegos y enriquecimiento

Tipos de contenido:
- Artículos
- Guías
- Eventos
- Talleres

## Características

### ✨ Datos Realistas
- Nombres de gatos variados y auténticos
- Historias de rescate convincentes
- Respuestas de adopción detalladas
- Evaluaciones de IA con scores y feedback
- Fechas distribuidas temporalmente

### 🎯 Casos de Uso Cubiertos
1. **Flujo completo de adopción**:
   - Gatos publicados por rescatistas
   - Múltiples solicitudes por gato
   - Aprobación/rechazo de solicitudes
   - Creación automática de tareas de seguimiento

2. **Sistema de tracking**:
   - Tareas de esterilización
   - Tareas de bienestar
   - Estados variados (pendiente, atrasada, completada)

3. **Evaluación con IA**:
   - Scores realistas (60-100)
   - Tags descriptivos
   - Feedback personalizado

4. **Contenido educativo**:
   - Artículos informativos
   - Eventos programados
   - Guías prácticas

### 📊 Ideal para Demo
- **Dashboard de Admin**: Visualiza estadísticas reales
- **Panel de Rescatista**: Múltiples gatos y solicitudes
- **Vista de Adoptante**: Solicitudes en diferentes estados
- **Sistema de Seguimiento**: Tareas variadas para gestionar
- **Blog Educativo**: Contenido rico y categorizado

## Notas Técnicas

### Limpieza de Datos
El seed **elimina todos los datos existentes** excepto el usuario admin original, incluyendo:
- Todos los usuarios (rescatistas y adoptantes)
- Todos los gatos
- Todas las solicitudes de adopción
- Todas las tareas de seguimiento
- Todos los posts educativos

⚠️ **ADVERTENCIA**: Solo ejecuta este seed en ambientes de desarrollo/testing.

### Relaciones de Datos
- Cada gato pertenece a un rescatista
- Gatos adoptados tienen solicitudes aprobadas
- Solicitudes aprobadas generan tareas de seguimiento
- Posts son creados por el primer rescatista

### Imágenes
- Gatos: Placekitten (URLs únicas por gato)
- Posts: Picsum Photos (imágenes placeholder)

## Troubleshooting

### Error: "no existe la columna X"
El schema de la base de datos puede haber cambiado. Ejecuta las migraciones primero:
```bash
npm run migrate
```

### Error: "viola la restricción check"
Los constraints de la BD no coinciden con el seed. Verifica que el schema esté actualizado.

### Sin tareas de seguimiento
Asegúrate de que hay solicitudes con estado `'aprobada'` (no `'aprobadas'`).

## Desarrollo

Para modificar los datos generados, edita `seed-demo.js`:
- **Línea 22-40**: Nombres de gatos
- **Línea 42-50**: Razas y colores
- **Línea 144-150**: Cantidad de gatos por estado
- **Línea 240-245**: Número de solicitudes por gato
- **Línea 446-545**: Contenido de posts educativos

## Scripts Relacionados

- `npm run seed`: Seed original (básico)
- `npm run seed:demo`: Este seed (completo)
- `npm run setup`: Migración + seed básico
- `npm run setup:demo`: Migración + seed demo
- `npm run migrate`: Solo migraciones

---

**Versión**: 1.0.0  
**Última actualización**: Diciembre 2025  
**Autor**: Equipo Katze
