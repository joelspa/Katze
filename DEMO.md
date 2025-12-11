# KATZE - Guía de Prueba

Plataforma web para adopción responsable de gatos con evaluación inteligente y seguimiento post-adopción.

**URL:** https://katze-nwc0.onrender.com

---

## Inicio Rápido

### Credenciales de Acceso

**Contraseña universal para TODOS los usuarios: `123`**

#### Administrador (1 usuario)
| Email | Nombre | Contraseña |
|-------|--------|------------|
| admin@katze.com | María Rodríguez | 123 |

**Permisos:** Gestionar gatos, solicitudes, usuarios, seguimiento, datasets

---

#### Rescatistas (3 usuarios)
| Email | Nombre | Contraseña |
|-------|--------|------------|
| ana.garcia@katze.com | Ana García | 123 |
| carlos.lopez@katze.com | Carlos López | 123 |
| lucia.martinez@katze.com | Lucía Martínez | 123 |

**Permisos:** Publicar gatos, gestionar solicitudes recibidas, ver seguimiento de sus adopciones

---

#### Adoptantes (7 usuarios)
| Email | Nombre | Contraseña |
|-------|--------|------------|
| juan.perez@katze.com | Juan Pérez | 123 |
| sofia.ramirez@katze.com | Sofía Ramírez | 123 |
| miguel.torres@katze.com | Miguel Torres | 123 |
| valentina.castro@katze.com | Valentina Castro | 123 |
| diego.morales@katze.com | Diego Morales | 123 |
| daniela.vega@katze.com | Daniela Vega | 123 |
| andres.silva@katze.com | Andrés Silva | 123 |

**Permisos:** Ver catálogo, solicitar adopciones, ver estado de solicitudes

---

## Guía de Prueba en 5 Pasos

### Paso 1: Explorar como Visitante
1. Abre https://katze-nwc0.onrender.com
2. Navega por el catálogo de 8 gatos disponibles
3. Haz clic en cualquier gato para ver su historia completa con fotos
4. Explora la sección "Educación" con artículos sobre cuidado de gatos

### Paso 2: Adoptar un Gato
1. Inicia sesión como **juan.perez@katze.com** / `123`
2. Selecciona un gato que te guste
3. Haz clic en "Adoptar"
4. Completa el formulario (la IA evaluará tu compatibilidad automáticamente)
5. Espera unos segundos a que la IA analice tu solicitud y te dé un puntaje

### Paso 3: Publicar un Gato para Adopción
1. Cierra sesión y entra como **ana.garcia@katze.com** / `123`
2. Ve a "Mis Gatos" → "Publicar Nuevo Gato"
3. Llena el formulario con la información del gato
4. Sube 2-3 fotos
5. Publica y espera la aprobación del admin

### Paso 4: Gestionar como Administrador
1. Cierra sesión y entra como **admin@katze.com** / `123`
2. Ve al "Panel de Administración"
3. **Aprobar gatos:** Revisa y aprueba el gato que acabas de publicar
4. **Revisar solicitudes:** Ve las solicitudes de adopción con sus puntajes de IA
5. **Seguimiento:** Mira las tareas automáticas de seguimiento post-adopción
6. **Descargar datos:** Descarga los datasets CSV con toda la información

### Paso 5: Explorar Funciones Adicionales
- **Filtros:** Usa los filtros en el catálogo (edad, raza, espacio requerido)
- **Carrusel de fotos:** Cada gato tiene múltiples imágenes
- **Dashboard rescatista:** Ve tus gatos publicados y solicitudes recibidas
- **Sistema de seguimiento:** Marca tareas como completadas o ve tareas atrasadas

---

## Qué Hace Especial a Katze

### Evaluación Inteligente con IA
Cuando alguien solicita adoptar, Google Gemini analiza automáticamente:
- Experiencia con mascotas
- Espacio disponible en el hogar
- Compromiso con esterilización
- Disponibilidad de tiempo
- Responsabilidad financiera

Genera un **puntaje de compatibilidad (0-100)** y recomendaciones.

### Seguimiento Post-Adopción
Al aprobar una adopción, el sistema crea automáticamente:
- Tareas de seguimiento de bienestar (30 días)
- Tareas de verificación de esterilización (si aplica)
- Alertas de tareas atrasadas

### Generación de Datos
El sistema exporta automáticamente 4 datasets CSV:
- `cats.csv` - Todos los gatos publicados
- `applications.csv` - Solicitudes de adopción
- `tracking.csv` - Tareas de seguimiento
- `users.csv` - Usuarios registrados

---

## Datos de Demostración

### Resumen de la Base de Datos

La base de datos poblada incluye:
- **11 usuarios** (1 admin, 3 rescatistas, 7 adoptantes) - ver credenciales arriba
- **11 gatos** (8 aprobados, 2 pendientes, 1 rechazado)
- **10 solicitudes** de adopción en diferentes estados
- **10 tareas** de seguimiento (completadas, pendientes, atrasadas)
- **12 artículos** educativos sobre cuidado felino

### Detalle de Gatos (8 aprobados disponibles)

| Nombre | Edad | Raza | Rescatista | Fotos |
|--------|------|------|------------|-------|
| Luna | Cachorro | Mestizo | Ana García | 3 |
| Mishi | Joven | Siamés | Carlos López | 3 |
| Pelusa | Adulto | Persa | Lucía Martínez | 3 |
| Tigre | Adulto | Bengalí | Ana García | 3 |
| Nieve | Senior | Angora | Carlos López | 3 |
| Garfield | Adulto | Común Europeo | Lucía Martínez | 3 |
| Shadow | Joven | Común Europeo | Ana García | 3 |
| Canela | Cachorro | Mestizo | Carlos López | 3 |

**Pendientes de aprobación (2):** Manchas, Peludo  
**Rechazados (1):** Tom

### Solicitudes de Adopción Existentes

| Adoptante | Gato | Estado | Score IA |
|-----------|------|--------|----------|
| Juan Pérez | Luna | Aprobada | 85 |
| Sofía Ramírez | Mishi | Aprobada | 75 |
| Miguel Torres | Pelusa | Aprobada | 90 |
| Diego Morales | Tigre | Procesando | - |
| Diego Morales | Nieve | Procesando | - |
| Daniela Vega | Garfield | Procesando | - |
| Andrés Silva | Shadow | Revisión Pendiente | 68 |
| Diego Morales | Canela | Rechazada (IA) | 25 |
| Daniela Vega | Luna | Rechazada (IA) | 30 |
| Diego Morales | Mishi | Rechazada (Manual) | 60 |

---

## Flujos Principales

### Para Adoptantes
1. Registrarse → Explorar catálogo → Solicitar adopción → Esperar aprobación

### Para Rescatistas
1. Registrarse → Publicar gato → Esperar aprobación admin → Recibir solicitudes → Aprobar/rechazar

### Para Administradores
1. Revisar gatos pendientes → Aprobar/rechazar
2. Monitorear solicitudes con puntajes IA → Aprobar/rechazar
3. Ver seguimiento de adopciones → Marcar tareas
4. Descargar datos para análisis

---

## Tecnologías

- **Frontend:** React + TypeScript
- **Backend:** Node.js + Express
- **Base de Datos:** PostgreSQL
- **IA:** Google Gemini 1.5 Flash
- **Storage:** Firebase Storage
- **Hosting:** Render
- **Integración:** Make.com (webhooks)

---

## Ayuda

Si encuentras algún problema:
1. Verifica que uses la contraseña correcta: `123`
2. Asegúrate de usar los emails completos con `@katze.com`
3. Espera unos segundos después de enviar una solicitud (la IA tarda ~5 segundos)
4. Si el servidor está "dormido" (Render free tier), la primera carga puede tardar 30 segundos

---

**Desarrollado para demostrar un sistema completo de adopción con IA, seguimiento y gestión de datos.**

