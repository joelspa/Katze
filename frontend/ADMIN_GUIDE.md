# Panel de Administración - Guía de Usuario

## 🎯 Descripción

Panel completo de administración para gestionar todas las publicaciones de gatos en la plataforma Katze.

---

## 🚀 Acceso

### Requisitos:
1. ✅ Tener una cuenta con rol `admin`
2. ✅ Estar autenticado (logged in)

### URL:
```
http://localhost:5174/admin
```

### Cómo obtener rol de admin:

Si necesitas convertir un usuario en admin, ejecuta en PostgreSQL:

```sql
UPDATE users 
SET role = 'admin' 
WHERE email = 'tu@email.com';
```

---

## 📊 Funcionalidades

### 1. **Resumen Estadístico**

Tarjetas superiores que muestran:
- **Total**: Todas las publicaciones
- **Pendientes**: Publicaciones esperando aprobación (amarillo)
- **Aprobados**: Publicaciones visibles públicamente (verde)
- **Rechazados**: Publicaciones rechazadas (rojo)

### 2. **Filtros Rápidos**

Botones para filtrar la vista:
- **Pendientes**: Solo publicaciones que necesitan revisión
- **Aprobados**: Solo publicaciones aprobadas
- **Rechazados**: Solo publicaciones rechazadas
- **Todos**: Muestra todas las publicaciones

### 3. **Tarjetas de Gatos**

Cada publicación muestra:
- ✅ Nombre del gato
- ✅ Badge de estado (pendiente/aprobado/rechazado)
- ✅ Foto del gato
- ✅ Descripción completa
- ✅ Edad, salud, esterilización
- ✅ Información del publicador (nombre y email)
- ✅ Fecha de publicación

### 4. **Acciones Disponibles**

#### **Para publicaciones pendientes:**
- ✅ **Aprobar**: Hace la publicación visible en el Home
- ✅ **Rechazar**: Marca como rechazada (no visible)

#### **Para todas las publicaciones:**
- ✅ **Editar**: Modifica nombre, descripción, edad, salud, esterilización
- ✅ **Eliminar**: Borra permanentemente (⚠️ acción irreversible)

---

## 🔄 Flujos de Trabajo

### Flujo 1: Revisar Publicación Pendiente

```
1. Acceder al panel → /admin
2. Ver publicaciones "Pendientes"
3. Revisar contenido (descripción, foto, datos)
4. Decisión:
   ├─ Si está bien → Clic "✓ Aprobar"
   ├─ Si tiene errores menores → Clic "✎ Editar" → Corregir → Guardar
   ├─ Si tiene contenido inapropiado → Clic "✎ Editar" → Limpiar → Aprobar
   └─ Si es spam o grave → Clic "🗑 Eliminar"
```

### Flujo 2: Editar Contenido Inapropiado

```
1. Detectar publicación con lenguaje inapropiado
2. Clic en "✎ Editar"
3. Modificar:
   - Nombre: Limpiar palabras ofensivas
   - Descripción: Reescribir de forma apropiada
   - Otros campos según necesidad
4. Clic "Guardar Cambios"
5. Luego aprobar la publicación
```

### Flujo 3: Aprobar Publicación

```
1. Revisar que el contenido cumple las políticas
2. Clic "✓ Aprobar"
3. Confirmar en el diálogo
4. ✅ La publicación ahora es visible en el Home
```

### Flujo 4: Rechazar Publicación

```
1. Identificar publicación que no cumple políticas
2. Clic "✗ Rechazar"
3. Confirmar en el diálogo
4. ✅ La publicación se marca como rechazada (no visible)
```

### Flujo 5: Eliminar Publicación

```
1. Identificar publicación a eliminar
2. Clic "🗑 Eliminar"
3. ⚠️ Confirmar acción irreversible
4. ✅ La publicación se borra permanentemente
```

---

## 🎨 Modal de Edición

### Campos Editables:

| Campo | Descripción | Tipo |
|-------|-------------|------|
| **Nombre** | Nombre del gato | Texto |
| **Descripción** | Historia y características | Texto largo |
| **Edad** | Edad aproximada | Texto |
| **Estado de salud** | Vacunas, desparasitación, etc. | Texto |
| **Esterilización** | pendiente / esterilizado / no_aplica | Dropdown |

### Botones:
- **Guardar Cambios**: Actualiza la publicación
- **Cancelar**: Cierra sin guardar

---

## 🔒 Seguridad

### Validaciones:
- ✅ Solo usuarios con rol `admin` pueden acceder
- ✅ Redirección automática si no es admin
- ✅ Token JWT verificado en cada petición
- ✅ Confirmaciones para acciones destructivas

### Permisos:
- ❌ **Adoptantes**: No pueden acceder
- ❌ **Rescatistas**: No pueden acceder
- ✅ **Admin**: Acceso completo

---

## 📝 Casos de Uso Comunes

### Caso 1: IA detectó lenguaje inapropiado

**Escenario:**
Rescatista publicó gato con descripción: "Este p*** gato es malísimo"

**Acción del Admin:**
1. Ir a "Pendientes"
2. Ver publicación marcada automáticamente
3. Clic "✎ Editar"
4. Cambiar descripción a: "Este gato tiene personalidad fuerte"
5. Guardar cambios
6. Clic "✓ Aprobar"

**Resultado:**
✅ Publicación visible con contenido apropiado

---

### Caso 2: Información errónea

**Escenario:**
Rescatista puso edad incorrecta

**Acción del Admin:**
1. Buscar publicación (puede estar aprobada o pendiente)
2. Clic "✎ Editar"
3. Corregir campo "Edad"
4. Guardar cambios
5. Si estaba pendiente, aprobar

**Resultado:**
✅ Información corregida

---

### Caso 3: Spam o publicación falsa

**Escenario:**
Publicación claramente es spam o fraude

**Acción del Admin:**
1. Identificar publicación
2. Clic "🗑 Eliminar"
3. Confirmar eliminación
4. ⚠️ Acción permanente

**Resultado:**
✅ Publicación eliminada del sistema

---

## 🧪 Testing del Panel

### Checklist de pruebas:

- [ ] **Login como admin**: Verificar acceso a `/admin`
- [ ] **Ver estadísticas**: Números correctos en tarjetas
- [ ] **Filtrar pendientes**: Solo ver pendientes
- [ ] **Filtrar aprobados**: Solo ver aprobados
- [ ] **Aprobar publicación**: Estado cambia correctamente
- [ ] **Rechazar publicación**: Estado cambia correctamente
- [ ] **Editar publicación**: Cambios se guardan
- [ ] **Eliminar publicación**: Publicación desaparece
- [ ] **Modal cierra**: Al hacer clic fuera
- [ ] **Imágenes cargan**: O muestran placeholder

---

## 🎯 Ejemplos Visuales

### Vista Principal:

```
┌─────────────────────────────────────────┐
│     Panel de Administración             │
├─────────┬─────────┬─────────┬──────────┤
│ Total   │ Pendien.│ Aprobad.│ Rechazad.│
│   15    │    3    │   10    │    2     │
└─────────┴─────────┴─────────┴──────────┘

[Pendientes (3)] [Aprobados (10)] [Rechazados (2)] [Todos (15)]

┌──────────────────────────────────────┐
│ Michi              [PENDIENTE]       │
│ [Foto]                               │
│ Descripción: Gato adorable...        │
│ Edad: 2 años | Salud: Saludable     │
│ Publicado por: Juan (juan@mail.com) │
│                                       │
│ [✓ Aprobar] [✗ Rechazar]             │
│ [✎ Editar] [🗑 Eliminar]             │
└──────────────────────────────────────┘
```

### Modal de Edición:

```
┌──────────────────────────────────┐
│  Editar Publicación         [×]  │
├──────────────────────────────────┤
│ Nombre:                          │
│ [Michi________________]          │
│                                  │
│ Descripción:                     │
│ [____________________]           │
│ [____________________]           │
│                                  │
│ Edad: [2 años_______]            │
│ Salud: [Saludable___]            │
│ Esterilización: [esterilizado ▼] │
│                                  │
│ [Guardar Cambios] [Cancelar]    │
└──────────────────────────────────┘
```

---

## 💡 Tips y Mejores Prácticas

### ✅ DO (Hacer):
- ✅ Revisar publicaciones pendientes diariamente
- ✅ Editar en lugar de rechazar cuando sea posible
- ✅ Mantener un tono respetuoso al editar
- ✅ Verificar fotos apropiadas
- ✅ Contactar al rescatista si hay dudas

### ❌ DON'T (No hacer):
- ❌ Eliminar sin revisar primero
- ❌ Aprobar contenido inapropiado
- ❌ Cambiar información factual sin verificar
- ❌ Ignorar publicaciones pendientes por mucho tiempo

---

## 🐛 Solución de Problemas

### Problema: "No se encontró el token de autenticación"
**Solución:** Cierra sesión y vuelve a iniciar sesión

### Problema: "Solo administradores pueden acceder"
**Solución:** Verifica que tu cuenta tiene rol `admin` en la base de datos

### Problema: No veo publicaciones
**Solución:** 
1. Verifica que hay publicaciones en la base de datos
2. Revisa la consola del navegador (F12) por errores
3. Verifica que el backend está corriendo

### Problema: Los cambios no se guardan
**Solución:**
1. Verifica la consola por errores
2. Asegúrate de tener permisos de admin
3. Verifica que el backend está corriendo

---

## 📊 Métricas Recomendadas

Como administrador, monitorea:
- 📈 **Publicaciones pendientes**: Mantener bajo 5
- 📈 **Tiempo de revisión**: Aprobar en < 24 horas
- 📈 **Tasa de aprobación**: > 80%
- 📈 **Publicaciones rechazadas**: < 10%

---

## ✨ Próximas Mejoras (Opcionales)

- [ ] Historial de cambios por admin
- [ ] Notificaciones al rescatista cuando se aprueba/rechaza
- [ ] Razón de rechazo obligatoria
- [ ] Búsqueda y filtros avanzados
- [ ] Exportar reportes

---

**✅ Panel de administración completamente funcional y listo para usar**
