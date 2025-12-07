# 🔥 Configuración de Firebase para Katze

## Configuración Rápida

### 1. Obtener Credenciales

1. Ve a [Firebase Console](https://console.firebase.google.com/project/katze-app/settings/serviceaccounts/adminsdk)
2. Haz clic en **"Generar nueva clave privada"**
3. Descarga el archivo JSON

### 2. Configurar en el Proyecto

1. **Copia el archivo** a `backend/` y renómbralo:
   ```
   backend/serviceAccountKey.json
   ```

2. **Agrega a `backend/.env`**:
   ```env
   GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json
   ```

3. **Verifica** que `serviceAccountKey.json` esté en `.gitignore`

## Uso de Firebase en el Proyecto

### Firestore Database
- **Colección**: `adoption_applications`
- **Propósito**: Backup de todas las solicitudes de adopción
- **Actualización**: Automática al crear/actualizar solicitudes

### Firebase Storage
- **Carpeta**: `datasets/`
- **Archivos**:
  - `users.json` - Usuarios registrados
  - `applications.json` - Solicitudes de adopción
  - `cats.json` - Gatos publicados
  - `statistics.json` - Estadísticas del sistema
- **Actualización**: Manual con `node generate-datasets.js`

## Generar Datasets Manualmente

```bash
cd backend
node generate-datasets.js
```

Este script exporta datos de PostgreSQL a Firebase Storage en formato JSON.

## Archivos Clave

- `services/firebaseService.js` - Maneja Firestore (solicitudes)
- `services/datasetService.js` - Maneja Storage (datasets)
- `generate-datasets.js` - Script para exportar datos a Firebase

## Problemas Comunes

### "Could not load the default credentials"
Verifica que `GOOGLE_APPLICATION_CREDENTIALS` esté configurado en `.env`

### "Permission denied" en Firestore/Storage
Ajusta las reglas en Firebase Console (modo test para desarrollo):

**Firestore Rules**:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /adoption_applications/{document=**} {
      allow read, write: if true;
    }
  }
}
```

**Storage Rules**:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /datasets/{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

### No se crean datasets después del seed
El seed solo puebla PostgreSQL. Para generar datasets ejecuta `node generate-datasets.js`
