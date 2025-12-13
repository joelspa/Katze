# 🔐 Guía de Seguridad - Variables de Entorno

## ⚠️ IMPORTANTE: Protección de Credenciales

Este proyecto utiliza variables de entorno para proteger información sensible. **NUNCA** hagas commit de archivos `.env` o credenciales al repositorio.

## 📁 Archivos Protegidos

Los siguientes archivos están en `.gitignore` y **NO** deben ser versionados:

- `.env` (backend y frontend)
- `.env.local`
- `.env.production`
- `backend/config/serviceAccountKey.json`

## 🚀 Configuración Inicial

### Backend

1. Copia el archivo de ejemplo:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Edita `.env` con tus credenciales reales:
   - Configura las credenciales de PostgreSQL
   - Agrega tu JWT_SECRET (usa un string aleatorio largo)
   - Agrega tu GEMINI_API_KEY desde [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Configura Firebase Project ID

3. Configura Firebase Admin SDK:
   - Ve a [Firebase Console](https://console.firebase.google.com/)
   - Project Settings → Service Accounts → Generate New Private Key
   - Guarda el archivo como `backend/config/serviceAccountKey.json`
   - **Este archivo NO debe subirse a Git**

### Frontend

1. Copia el archivo de ejemplo:
   ```bash
   cd frontend
   cp .env.example .env
   ```

2. Edita `.env` con tu configuración de Firebase:
   - Ve a [Firebase Console](https://console.firebase.google.com/)
   - Project Settings → General → Your apps
   - Copia las credenciales de configuración web

## 🔒 Variables de Entorno Sensibles

### Backend (`backend/.env`)
- `JWT_SECRET` - Token secreto para autenticación
- `DB_PASSWORD` - Contraseña de PostgreSQL
- `GEMINI_API_KEY` - API Key de Google Gemini
- `FIREBASE_SERVICE_ACCOUNT` - Credenciales de Firebase (producción)

### Frontend (`frontend/.env`)
- `VITE_FIREBASE_API_KEY` - API Key de Firebase
- `VITE_FIREBASE_APP_ID` - App ID de Firebase

## 🌐 Despliegue en Producción (Render)

Para producción en Render, configura las variables de entorno directamente en el dashboard:

1. Ve a tu servicio en Render
2. Environment → Environment Variables
3. Agrega todas las variables del archivo `.env`
4. Para Firebase Admin SDK, usa la variable `FIREBASE_SERVICE_ACCOUNT` con el JSON completo

## ✅ Verificación de Seguridad

Antes de hacer commit, verifica:

```bash
# Verifica que .env no esté siendo trackeado
git status

# Verifica que las credenciales no estén en el código
grep -r "AIzaSy" . --exclude-dir=node_modules --exclude-dir=.git
grep -r "BEGIN PRIVATE KEY" . --exclude-dir=node_modules --exclude-dir=.git
```

## 🆘 Si Expusiste Credenciales

Si accidentalmente subiste credenciales:

1. **Inmediatamente** revoca las credenciales expuestas:
   - Firebase: Regenera las claves en Firebase Console
   - Gemini: Revoca y genera nueva API Key
   - JWT: Cambia el JWT_SECRET (invalidará todas las sesiones)
   - Database: Cambia la contraseña de PostgreSQL

2. Limpia el historial de Git (si las credenciales están en commits antiguos):
   ```bash
   # Usa git-filter-repo o BFG Repo-Cleaner
   # Contacta a un administrador si no sabes cómo hacerlo
   ```

3. Actualiza todas las variables de entorno en producción

## 📚 Más Información

- [Seguridad en Firebase](https://firebase.google.com/docs/rules/basics)
- [Mejores prácticas de API Keys](https://cloud.google.com/docs/authentication/api-keys)
- [Variables de entorno en Vite](https://vitejs.dev/guide/env-and-mode.html)
