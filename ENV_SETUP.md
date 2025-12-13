# 🔐 Configuración de Variables de Entorno

## ⚠️ IMPORTANTE - Lee esto primero

Las credenciales de Firebase y otras claves sensibles ahora están protegidas en archivos `.env` que **NO** se suben al repositorio.

## 📝 Cambios Realizados

### ✅ Archivos Actualizados

1. **Frontend** ([firebase.ts](frontend/src/firebase.ts))
   - Las credenciales de Firebase ahora se cargan desde variables de entorno
   - Usa `import.meta.env.VITE_FIREBASE_*` para acceder a las credenciales

2. **Backend** ([firebaseService.js](backend/services/firebaseService.js))
   - Ahora soporta tanto desarrollo local (usando `serviceAccountKey.json`) como producción (usando variable `FIREBASE_SERVICE_ACCOUNT`)
   - Lee el `FIREBASE_PROJECT_ID` desde variables de entorno

3. **Archivos de Configuración**
   - Archivos `.env.example` creados para backend y frontend como plantillas
   - `.gitignore` actualizado para ignorar archivos sensibles

### 🚫 Archivos Ignorados por Git

Los siguientes archivos **NO** se suben al repositorio:
- `.env` (backend y frontend)
- `backend/config/serviceAccountKey.json`

## 🚀 Cómo Configurar (Para Desarrolladores)

### 1. Backend

```bash
cd backend

# Copia el archivo de ejemplo
cp .env.example .env

# Edita .env con tus credenciales reales
# (Pide las credenciales al administrador del proyecto)
```

**Contenido del `.env` del backend:**
```env
PORT=5000
DB_USER=postgres
DB_PASSWORD=tu_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=katze
JWT_SECRET=tu_jwt_secret_seguro
GEMINI_API_KEY=tu_gemini_api_key
GOOGLE_APPLICATION_CREDENTIALS=./config/serviceAccountKey.json
FIREBASE_PROJECT_ID=katze-app
```

**Además, necesitas:**
- Obtener el archivo `serviceAccountKey.json` de Firebase Console
- Colocarlo en `backend/config/serviceAccountKey.json`
- **NO subir este archivo a Git**

### 2. Frontend

```bash
cd frontend

# Copia el archivo de ejemplo
cp .env.example .env

# Edita .env con las credenciales de Firebase
```

**Contenido del `.env` del frontend:**
```env
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=tu_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
VITE_FIREBASE_MEASUREMENT_ID=tu_measurement_id
```

## 🔑 Cómo Obtener las Credenciales

### Firebase (Frontend y Backend)

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona el proyecto "katze-app"
3. **Para Frontend:** Project Settings → General → Your apps → SDK setup and configuration
4. **Para Backend:** Project Settings → Service Accounts → Generate New Private Key

### Gemini API

1. Ve a [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Crea una nueva API Key
3. Cópiala en `GEMINI_API_KEY`

## 🌐 Despliegue en Producción

Para Render u otras plataformas de producción:

1. No uses archivos `.env`, configura las variables directamente en el dashboard
2. Para Firebase Admin SDK, usa la variable `FIREBASE_SERVICE_ACCOUNT` con el JSON completo
3. Asegúrate de configurar **todas** las variables necesarias

## ❌ Nunca Hagas Esto

- ❌ NO hagas commit de archivos `.env`
- ❌ NO hagas commit de `serviceAccountKey.json`
- ❌ NO escribas credenciales directamente en el código
- ❌ NO compartas credenciales por email o chat (usa un gestor de contraseñas)

## ✅ Verificación

Antes de hacer commit:

```bash
# Verifica que no estés subiendo archivos sensibles
git status

# Asegúrate de que .env no aparece en la lista
```

## 🆘 Ayuda

Si tienes problemas configurando las variables de entorno:

1. Revisa el archivo [SECURITY.md](SECURITY.md) para más detalles
2. Contacta al administrador del proyecto
3. Verifica que copiaste correctamente las credenciales

---

**Última actualización:** Diciembre 2025
