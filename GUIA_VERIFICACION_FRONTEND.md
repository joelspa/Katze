# Guía para Verificar la Información en el Frontend

## 🎯 Cambios Realizados

### Backend
1. ✅ Nuevo método `getAllTasks()` en `trackingService.js` - obtiene TODAS las tareas
2. ✅ Nuevo endpoint `GET /api/tracking/all` en `trackingRoutes.js` - accesible solo para admins
3. ✅ Nuevo controller `getAllTasks()` en `trackingController.js` - valida permisos de admin

### Frontend
1. ✅ Actualizado `fetchTrackingTasks()` en `AdminDashboard.tsx` - usa `/api/tracking/all`
2. ✅ Agregados logs detallados en consola para debugging
3. ✅ Corregido CSS para `.owner-name` en Dark Mode - texto ahora es blanco visible

## 📋 Pasos para Verificar

### 1. Iniciar el Backend
```powershell
cd backend
npm start
```
**Espera ver:** `Server running on http://localhost:3000`

### 2. Iniciar el Frontend (en otra terminal)
```powershell
cd frontend
npm run dev
```
**Espera ver:** `Local: http://localhost:5173/`

### 3. Abrir el Navegador
1. Ve a `http://localhost:5173`
2. Inicia sesión como **admin**:
   - Email: `admin@katze.com`
   - Password: `admin123`

### 4. Ir al Panel de Administración
1. Click en "Panel de Administración" en el navbar
2. Click en la pestaña "**Seguimiento**" (icono de calendario)

### 5. Verificar en la Consola del Navegador
Presiona `F12` para abrir DevTools y ve a la pestaña "Console"

**Deberías ver:**
```
=== TRACKING TASKS LOADED ===
Total tasks: 35
Sample task (first one): {id: 16, cat_name: "Nieve", applicant_name: "Adoptante Experiencia", ...}
Fields check: {
  cat_name: "Nieve"
  applicant_name: "Adoptante Experiencia"
  owner_name: "Rescatista Cuatro"
  task_type: "Seguimiento de Bienestar"
  status: "atrasada"
}
```

### 6. Verificar en la Tabla Visual
En la tabla de seguimiento deberías ver:

| Tipo | Gato | **Adoptante** | **Rescatista** | Fecha Límite | Estado |
|------|------|---------------|----------------|--------------|--------|
| 🏥 | Nieve | **Adoptante Experiencia** | **Rescatista Cuatro** | ... | Atrasada |
| 🏥 | Bolita | **Adoptante Activo** | **Rescatista Dos** | ... | Atrasada |
| ... | ... | ... | ... | ... | ... |

**Las columnas "Adoptante" y "Rescatista" deben mostrarse en texto BLANCO y ser legibles.**

## 🔍 Qué Verificar

### ✅ Checklist de Verificación

- [ ] Backend está corriendo (puerto 3000)
- [ ] Frontend está corriendo (puerto 5173)
- [ ] Sesión iniciada como admin
- [ ] En pestaña "Seguimiento"
- [ ] La tabla muestra **35 tareas** (no solo pendientes)
- [ ] Columna **"ADOPTANTE"** tiene nombres visibles en blanco
- [ ] Columna **"RESCATISTA"** tiene nombres visibles en blanco
- [ ] Al hacer click en una fila, el modal muestra:
  - ✅ "Información del Adoptante" → **Nombre** (visible)
  - ✅ "Rescatista Responsable" → **Nombre** (visible)

## 🐛 Si hay problemas

### Problema 1: No se ven nombres (columnas vacías)
**Solución:** Refresca la página (Ctrl + F5 o Cmd + Shift + R)

### Problema 2: Error 403 en consola
**Causa:** No tienes permisos de admin
**Solución:** Cierra sesión y vuelve a iniciar con `admin@katze.com`

### Problema 3: Solo se ven tareas pendientes
**Causa:** El endpoint antiguo todavía está en caché
**Solución:** 
1. Cierra el servidor de frontend (Ctrl + C)
2. Borra la caché: `npm run dev` de nuevo
3. Refresca el navegador con Ctrl + Shift + R

### Problema 4: Texto invisible (columnas negras)
**Causa:** CSS no se aplicó
**Solución:** El CSS ya está corregido, pero si persiste:
1. Inspecciona el elemento (click derecho → Inspeccionar)
2. Verifica que `.owner-name` tenga `color: var(--color-white)`

## 📊 Datos Esperados

La base de datos tiene **35 tareas de seguimiento** distribuidas así:

- **Completadas**: ~10 tareas
- **Pendientes**: ~15 tareas  
- **Atrasadas**: ~10 tareas

Gatos involucrados:
- Nieve, Bolita, Oliver, Peludo, Muffin, Simba, Shadow

## 🎨 Apariencia Esperada

### Modo Oscuro (Dark Mode)
- Fondo: Gris oscuro (`#1e293b`)
- Encabezados: Blanco (`#f8fafc`)
- **Adoptante**: Blanco **bold** (`#ffffff`)
- **Rescatista**: Blanco **bold** (`#ffffff`)
- Texto normal: Gris claro (`#cbd5e1`)

### Tabla debe lucir así:
```
┌─────────────────────────────────────────────────────────────────┐
│ Tipo de Tarea │ Gato  │ ADOPTANTE    │ RESCATISTA   │ ...     │
├─────────────────────────────────────────────────────────────────┤
│ 🏥 Bienestar  │ Nieve │ Adoptante... │ Rescatista...│ ...     │
│ 💉 Esteriliz. │ Simba │ Adoptante... │ Rescatista...│ ...     │
└─────────────────────────────────────────────────────────────────┘
```

## 🚀 Listo!

Una vez que sigas estos pasos, deberías ver **TODA** la información de adoptantes y rescatistas en el frontend, tanto en la tabla como en el modal de detalles.

**Si todo funciona correctamente, verás 35 tareas con todos los nombres visibles.**
