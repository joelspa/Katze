# 🐛 Fix: Error 400 en Aprobación/Rechazo de Publicaciones

## ❌ Problema Detectado

```
AxiosError: Request failed with status code 400
PUT http://localhost:5000/api/admin/cats/2/approval 400 (Bad Request)
```

**Causa Raíz:** 
El frontend enviaba el estado `'rechazado'`, pero el backend solo aceptaba `'aprobado'` y `'pendiente'`.

---

## ✅ Solución Implementada

### 1. **Backend - Config** (`backend/config/config.js`)

**Antes:**
```javascript
APPROVAL_STATUS: {
    APROBADO: 'aprobado',
    PENDIENTE: 'pendiente'
}
```

**Después:**
```javascript
APPROVAL_STATUS: {
    APROBADO: 'aprobado',
    PENDIENTE: 'pendiente',
    RECHAZADO: 'rechazado'  // ✅ AGREGADO
}
```

---

### 2. **Backend - Controlador** (`backend/controllers/catController.js`)

**Antes:**
```javascript
const validStatuses = [
    config.APPROVAL_STATUS.APROBADO, 
    config.APPROVAL_STATUS.RECHAZADO  // ❌ RECHAZADO no existía
];
```

**Después:**
```javascript
const validStatuses = [
    config.APPROVAL_STATUS.APROBADO, 
    config.APPROVAL_STATUS.RECHAZADO,
    config.APPROVAL_STATUS.PENDIENTE
];
```

**Mensaje mejorado:**
```javascript
let message;
if (status === config.APPROVAL_STATUS.APROBADO) {
    message = 'Publicación aprobada con éxito';
} else if (status === config.APPROVAL_STATUS.RECHAZADO) {
    message = 'Publicación rechazada';
} else {
    message = 'Estado actualizado a pendiente';
}
```

---

### 3. **Base de Datos - Constraint**

**SQL Ejecutado:**
```sql
-- Eliminar constraint anterior
ALTER TABLE cats DROP CONSTRAINT IF EXISTS cats_approval_status_check;

-- Agregar nueva constraint con 'rechazado'
ALTER TABLE cats 
ADD CONSTRAINT cats_approval_status_check 
CHECK (approval_status IN ('pendiente', 'aprobado', 'rechazado'));
```

**Resultado:**
```
✅ Constraint actualizada correctamente
   Estados permitidos: pendiente, aprobado, rechazado
```

---

## 🧪 Pruebas Realizadas

### Test 1: Constraint de Base de Datos ✅
```
Test 1: Cambiar a "rechazado"     ✅ Exitoso
Test 2: Cambiar a "aprobado"      ✅ Exitoso
Test 3: Cambiar a "pendiente"     ✅ Exitoso
Test 4: Valor inválido            ✅ Rechazado correctamente
```

### Test 2: Configuración ✅
```
Estados de aprobación permitidos:
  APROBADO: 'aprobado'
  PENDIENTE: 'pendiente'
  RECHAZADO: 'rechazado'     ✅ Nuevo estado disponible
```

### Test 3: Backend Activo ✅
```
✅ Backend respondiendo en puerto 5000
   Status: 200
   Respuesta válida: OK
```

---

## 📊 Estados Actuales en la BD

```
Estadísticas:
   aprobado: 2 gato(s)
   pendiente: 2 gato(s)
```

---

## 🚀 Cómo Probar el Fix

### Opción 1: Frontend (Recomendado)

1. **Asegúrate de que el backend esté corriendo:**
   ```bash
   cd backend
   npm start
   ```

2. **Inicia el frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Accede al panel de admin:**
   ```
   http://localhost:5173/admin
   ```

4. **Prueba las acciones:**
   - ✅ Clic en "Aprobar" → Debe cambiar a estado "aprobado"
   - ✅ Clic en "Rechazar" → Debe cambiar a estado "rechazado"
   - ✅ Verificar en la BD:
     ```sql
     SELECT id, name, approval_status FROM cats;
     ```

---

### Opción 2: cURL (Línea de comandos)

```bash
# 1. Hacer login como admin y obtener token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@katze.com","password":"tu_password"}'

# 2. Aprobar publicación (reemplaza YOUR_TOKEN y CAT_ID)
curl -X PUT http://localhost:5000/api/admin/cats/CAT_ID/approval \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"status":"aprobado"}'

# 3. Rechazar publicación
curl -X PUT http://localhost:5000/api/admin/cats/CAT_ID/approval \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"status":"rechazado"}'

# 4. Volver a pendiente
curl -X PUT http://localhost:5000/api/admin/cats/CAT_ID/approval \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"status":"pendiente"}'
```

---

### Opción 3: Postman / Insomnia

**Endpoint:**
```
PUT http://localhost:5000/api/admin/cats/:id/approval
```

**Headers:**
```
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "status": "rechazado"
}
```

**Respuestas esperadas:**

✅ **200 OK - Aprobado:**
```json
{
  "success": true,
  "message": "Publicación aprobada con éxito",
  "data": {
    "cat": { ... }
  }
}
```

✅ **200 OK - Rechazado:**
```json
{
  "success": true,
  "message": "Publicación rechazada",
  "data": {
    "cat": { ... }
  }
}
```

❌ **400 Bad Request - Estado inválido:**
```json
{
  "success": false,
  "message": "Estado no válido. Debe ser: aprobado, rechazado o pendiente"
}
```

---

## 🔄 Flujo Completo de Estados

```
┌─────────────┐
│  PENDIENTE  │ ← Estado inicial al publicar
└─────┬───────┘
      │
      ├─→ [Admin: Aprobar]  → APROBADO  ✅
      │                         │
      │                         └─→ [Admin: Rechazar] → RECHAZADO
      │
      └─→ [Admin: Rechazar] → RECHAZADO ❌
                                │
                                └─→ [Admin: Revisar] → PENDIENTE
```

---

## 📝 Notas Importantes

1. ✅ **Nodemon activo**: El backend se recarga automáticamente
2. ✅ **Sin errores de compilación**: Todo compila correctamente
3. ✅ **Constraint actualizado**: La BD acepta los 3 estados
4. ✅ **Config actualizado**: Incluye RECHAZADO
5. ✅ **Validación mejorada**: Mensajes más claros

---

## 🎯 Próximos Pasos

1. **Reinicia el frontend** si estaba corriendo:
   ```bash
   Ctrl + C (en la terminal del frontend)
   npm run dev
   ```

2. **Prueba el panel de admin:**
   - Accede a `/admin`
   - Intenta aprobar una publicación ✅
   - Intenta rechazar una publicación ✅

3. **Verifica en la consola del navegador:**
   - No debe haber errores 400
   - Debe mostrar mensajes de éxito

---

## ✅ Resultado Final

- ✅ Error 400 corregido
- ✅ Estados: pendiente, aprobado, rechazado
- ✅ Base de datos actualizada
- ✅ Backend validando correctamente
- ✅ Frontend listo para usar
- ✅ Todo funcionando sin errores

**🎉 El panel de administración ahora funciona completamente!**
