# KATZE - GUÍA DE DEMOSTRACIÓN
## Sistema Completo con Base de Datos Poblada

---

## CREDENCIALES DE ACCESO

**Contraseña universal para todos los usuarios: `123`**
**Dominio de correos: `@katze.com`**

### Administrador
- **Email:** admin@katze.com
- **Password:** 123
- **Nombre:** María Rodríguez

### Rescatistas
1. **Email:** ana.garcia@katze.com | **Nombre:** Ana García
2. **Email:** carlos.lopez@katze.com | **Nombre:** Carlos López  
3. **Email:** lucia.martinez@katze.com | **Nombre:** Lucía Martínez

### Adoptantes
1. **Email:** juan.perez@katze.com | **Nombre:** Juan Pérez
2. **Email:** sofia.ramirez@katze.com | **Nombre:** Sofía Ramírez
3. **Email:** miguel.torres@katze.com | **Nombre:** Miguel Torres
4. **Email:** valentina.castro@katze.com | **Nombre:** Valentina Castro
5. **Email:** diego.morales@katze.com | **Nombre:** Diego Morales
6. **Email:** daniela.vega@katze.com | **Nombre:** Daniela Vega
7. **Email:** andres.silva@katze.com | **Nombre:** Andrés Silva

---

## DATOS EN LA BASE DE DATOS

### Usuarios: 11 totales
- 1 Administrador
- 3 Rescatistas
- 7 Adoptantes

### Gatos: 11 totales con MÚLTIPLES IMÁGENES cada uno
**Aprobados (8):**
1. Luna - Cachorro mestizo (3 fotos)
2. Mishi - Joven siamés (3 fotos)
3. Pelusa - Adulta persa (3 fotos)
4. Tigre - Adulto bengalí (3 fotos)
5. Nieve - Senior angora (3 fotos)
6. Garfield - Adulto común europeo (3 fotos)
7. Shadow - Joven común europeo (3 fotos)
8. Canela - Cachorra mestiza (3 fotos)

**Pendientes de Aprobación (2):**
9. Manchas - Joven mestizo (2 fotos)
10. Peludo - Adulto maine coon (2 fotos)

**Rechazados (1):**
11. Tom - Adulto mestizo (1 foto)

### Solicitudes de Adopción: 10 totales
**Aprobadas (3):**
- Juan Pérez → Luna (Score: 85)
- Sofía Ramírez → Mishi (Score: 75)
- Miguel Torres → Pelusa (Score: 90)

**Procesando (3):**
- Diego Morales → Tigre
- Diego Morales → Nieve
- Daniela Vega → Garfield

**Revisión Pendiente (1):**
- Andrés Silva → Shadow (Score: 68)

**Rechazadas Automáticamente (2):**
- Diego Morales → Canela (Score: 25 - mensaje muy breve)
- Daniela Vega → Luna (Score: 30 - viaja mucho)

**Rechazadas Manualmente (1):**
- Diego Morales → Mishi (Score: 60 - espacio reducido)

### Tareas de Seguimiento: 10 totales
**Para Luna (Juan Pérez) - 3 tareas:**
- ✅ Primera visita veterinaria (Completada)
- ✅ Verificar adaptación (Completada)
- ⏳ Llamada de seguimiento (Pendiente)

**Para Mishi (Sofía Ramírez) - 3 tareas:**
- ✅ Chequeo veterinario (Completada)
- ⏳ Visita domiciliaria (Pendiente)
- ⏳ Seguimiento comportamiento (Pendiente)

**Para Pelusa (Miguel Torres) - 4 tareas:**
- ✅ Control veterinario (Completada)
- ✅ Primera visita (Completada)
- ⚠️ Evaluación familiar (Atrasada)
- ⏳ Seguimiento final (Pendiente)

### Posts Educativos: 12 totales
**Cuidados Básicos (3):**
- Guía Completa: Cómo Cuidar a tu Gato Recién Adoptado
- Nutrición Felina: Qué Debe Comer tu Gato
- Cómo Mantener la Higiene de tu Gato

**Salud (3):**
- Vacunas Esenciales para Gatos: Calendario Completo
- Señales de Alerta: Cuándo Llevar a tu Gato al Veterinario
- Parásitos en Gatos: Prevención y Tratamiento

**Comportamiento (3):**
- Entendiendo el Lenguaje Corporal Felino
- Cómo Solucionar Problemas de Comportamiento
- Juegos y Enriquecimiento para Gatos de Interior

**Adopción Responsable (3):**
- Antes de Adoptar: ¿Estás Listo para un Gato?
- Preparando tu Hogar para la Llegada de un Gato
- Adoptando un Gato Senior: Beneficios y Consideraciones

---

## FUNCIONALIDADES DEMOSTRABLES

### 1. Sistema de Autenticación
- ✅ Registro de usuarios (3 roles: admin, rescatista, adoptante)
- ✅ Login con JWT
- ✅ Rutas protegidas por rol

### 2. Gestión de Gatos (Rescatistas)
- ✅ Publicar gatos con múltiples imágenes
- ✅ Subida de fotos a Firebase Storage
- ✅ Estados: pendiente, aprobado, rechazado
- ✅ Información completa: edad, raza, salud, esterilización, historia, espacio requerido
- ✅ Webhook a Make.com cuando se publica un gato

### 3. Panel de Administración
- ✅ Aprobar/rechazar gatos publicados
- ✅ Ver solicitudes de adopción
- ✅ Ver todas las tareas de seguimiento
- ✅ Descargar datasets CSV (4 archivos)
- ✅ Ver estadísticas generales
- ✅ Aprobar/rechazar solicitudes manualmente

### 4. Sistema de Adopción
- ✅ Catálogo de gatos disponibles con carrusel de fotos
- ✅ Filtros por edad, raza, estado de salud
- ✅ Formulario de solicitud de adopción
- ✅ Evaluación automática con IA (Google Gemini)
- ✅ Score de compatibilidad 0-100
- ✅ Feedback detallado de la IA

### 5. Worker de Procesamiento en Background
- ✅ Procesa solicitudes "procesando" automáticamente
- ✅ Evaluación con Google Gemini 1.5 Flash
- ✅ Estados: procesando → revision_pendiente | rechazada_automaticamente
- ✅ Auto-start con el servidor

### 6. Sistema de Tracking Post-Adopción
- ✅ Tareas automáticas para adopciones aprobadas
- ✅ Tipos: bienestar, esterilización
- ✅ Estados: pendiente, completada, atrasada
- ✅ Notificaciones visuales

### 7. Plataforma Educativa
- ✅ Posts informativos por categorías
- ✅ 4 categorías: cuidados básicos, salud, comportamiento, adopción responsable
- ✅ Imágenes de alta calidad (Unsplash)
- ✅ Contenido relevante y útil

### 8. Generación de Datasets CSV
- ✅ 4 archivos CSV en Firebase Storage
- ✅ Actualización automática en cada operación CRUD
- ✅ Descarga directa desde panel de admin
- ✅ Públicamente accesibles

### 9. Integración Make.com
- ✅ Webhook disparado cuando rescatista publica gato
- ✅ Payload completo: datos del gato + rescatista
- ✅ Logs detallados de webhook dispatch

---

## FLUJO DE DEMOSTRACIÓN SUGERIDO

### Secuencia Recomendada (10 minutos):

1. **Rol Rescatista** (ana.garcia@katze.com / 123)
   - Publicación de gato con formulario completo
   - Carga de múltiples imágenes

2. **Rol Administrador** (admin@katze.com / 123)
   - Aprobación del gato publicado
   - Revisión del panel de solicitudes pendientes
   - Descarga de dataset CSV

3. **Rol Adoptante** (juan.perez@katze.com / 123)
   - Navegación en catálogo de gatos
   - Visualización de carrusel de fotos
   - Envío de solicitud de adopción

4. **Regreso a Administrador**
   - Visualización de solicitud en procesamiento
   - Análisis de evaluación de IA (score + feedback)
   - Aprobación manual de solicitud

5. **Sistema de Seguimiento**
   - Visualización de tareas generadas automáticamente
   - Marcado de tarea como completada
   - Identificación de tareas atrasadas

6. **Plataforma Educativa**
   - Navegación por categorías de contenido
   - Visualización de posts informativos

7. **Gestión de Datasets**
   - Descarga de CSV desde panel administrativo
   - Apertura en Excel/Google Sheets
   - Verificación de estructura de datos

---

## URLs DE PRODUCCIÓN

- **Frontend:** https://katze-nwc0.onrender.com
- **Backend API:** https://katze-nwc0.onrender.com/api
- **Base de Datos:** Render PostgreSQL
- **Storage:** Firebase Storage (katze-app.firebasestorage.app)
- **CSVs:** https://storage.googleapis.com/katze-app.firebasestorage.app/datasets/

---

## TECNOLOGÍAS UTILIZADAS

### Backend
- Node.js + Express
- PostgreSQL (Render)
- JWT Authentication
- Google Gemini 1.5 Flash (IA)
- Firebase Admin SDK (Storage)
- Bcrypt (Password hashing)
- CORS habilitado

### Frontend
- React + TypeScript
- Vite (Build tool)
- Axios (HTTP client)
- React Router (SPA routing)
- Firebase SDK (Image upload)
- CSS Modules (Styling)

### Infraestructura
- Hosting: Render (Frontend + Backend)
- Database: Render PostgreSQL
- Storage: Firebase Storage
- IA: Google Gemini API
- Webhooks: Make.com

---

## SCRIPTS DISPONIBLES

### Backend
```bash
npm start              # Iniciar servidor de producción
npm run dev            # Iniciar en modo desarrollo
npm run seed:production # Poblar BD de producción
npm run generate-csv   # Regenerar CSVs
npm run migrate        # Ejecutar migraciones
```

### Frontend
```bash
npm run dev            # Servidor de desarrollo
npm run build          # Build para producción
npm run preview        # Preview del build
```

---

## CARACTERÍSTICAS DEL SISTEMA DE DEMOSTRACIÓN

1. **Password universal:** `123` para todos los usuarios del sistema
2. **Dominio de correos:** Todos los usuarios utilizan el dominio `@katze.com`
3. **Recursos multimedia:** Imágenes de alta calidad provenientes de Unsplash
4. **Datos de prueba:** Información completa y realista (nombres, teléfonos, descripciones)
5. **Escenarios completos:** El sistema incluye todos los estados posibles de los flujos
6. **Evaluación por IA:** Google Gemini analiza solicitudes de forma automática
7. **Datasets actualizados:** Los archivos CSV se regeneran automáticamente tras cada operación
8. **Integración Make.com:** Webhook activado en cada publicación de gato

---

