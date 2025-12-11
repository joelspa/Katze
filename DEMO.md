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

**Nota:** Se recomienda utilizar los escenarios de ejemplo que se encuentran más adelante para demostrar diferentes rangos de puntuación

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

## Escenarios de Prueba para Evaluación IA

### Escenario 1: Score Alto (85-95 puntos)

**Candidato ideal con alta compatibilidad:**

**Razón de adopción:**
```
Llevo dos años viviendo en mi casa propia con jardín amplio y busco un compañero felino. Tengo experiencia previa cuidando gatos, ya que crecí con tres gatos en casa de mis padres y aprendí sobre su alimentación, vacunas y comportamiento. Trabajo desde casa 4 días a la semana, lo que me permite dedicarle tiempo y atención. He preparado un espacio seguro con rascadores, juguetes y una zona tranquila para descansar. Cuento con un veterinario de confianza y presupuesto destinado para cuidados preventivos, alimentación de calidad y emergencias. Me comprometo a brindarle cuidados de por vida y cumplir con la esterilización si es necesario.
```

**Configuración del formulario:**
- Tipo de vivienda: **Casa**
- ¿Tienes experiencia con gatos?: **Sí**
- ¿Tienes otras mascotas?: **No** (o Sí, con explicación de convivencia)
- ¿Aceptas esterilización obligatoria?: **Sí**

**Mensaje adicional:**
```
Adjunto fotos del espacio que he preparado. Estoy emocionado de darle un hogar amoroso y seguro.
```

**Resultado esperado:** Score 85-95, recomendación "manual_review", flags positivas como "Casa Segura", "Experiencia Confirmada", "Pro-Esterilización"

---

### Escenario 2: Score Bajo (20-35 puntos)

**Candidato con múltiples factores de riesgo - rechazo automático:**

**Razón de adopción:**
```
Quiero un gato para mi hija de 4 años como regalo de cumpleaños. Sería lindo tener fotos para Instagram. Vivo en un departamento pequeño pero creo que estará bien. No tengo mucho tiempo pero mi hija lo cuidará. Lo de la esterilización lo vemos después.
```

**Configuración del formulario:**
- Tipo de vivienda: **Departamento**
- ¿Tienes experiencia con gatos?: **No**
- ¿Tienes otras mascotas?: **No**
- ¿Aceptas esterilización obligatoria?: **No**

**Mensaje adicional:**
```
Es para sorpresa, ojalá sea pronto.
```

**Resultado esperado:** Score 20-35, recomendación "auto_reject", flags negativas como "Regalo para Niños", "Contenido Redes Sociales", "No Acepta Esterilización", "Disponibilidad Limitada"

---

### Escenario 3: Score Medio (60-75 puntos)

**Candidato con potencial que requiere evaluación humana:**

**Razón de adopción:**
```
Me gustaría adoptar un gato porque siempre me han gustado. Vivo en un departamento con balcón. No he tenido gatos antes pero he investigado en internet sobre sus cuidados. Trabajo 8 horas al día fuera de casa pero los fines de semana estoy libre. Acepto la esterilización porque sé que es importante.
```

**Configuración del formulario:**
- Tipo de vivienda: **Departamento**
- ¿Tienes experiencia con gatos?: **No**
- ¿Tienes otras mascotas?: **No**
- ¿Aceptas esterilización obligatoria?: **Sí**

**Mensaje adicional:**
```
Me comprometo a aprender y darle buenos cuidados.
```

**Resultado esperado:** Score 60-75, recomendación "manual_review", flags mixtas, requiere que rescatista/admin evalúe caso por caso

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

