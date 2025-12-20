# 🔒 CHECKLIST DE SEGURIDAD - KATZE

## ✅ Archivos Protegidos en .gitignore

### Backend
- ✅ `.env` - Variables de entorno del servidor
- ✅ `config/serviceAccountKey.json` - Credenciales de Firebase Admin

### Frontend  
- ✅ `.env` - Variables de entorno del cliente

---

## 📝 INFORMACIÓN SENSIBLE QUE DEBES ACTUALIZAR

### 🔧 Backend (.env)

#### 1. Base de Datos PostgreSQL
```env
DB_USER=katze_88u4_user
DB_HOST=dpg-d4qderruibrs73djklg0-a.oregon-postgres.render.com
DB_NAME=katze_88u4
DB_PASSWORD=KBijdmcP5FMvrxoZ5EXp1X2jDlVBXd8t
DB_PORT=5432
```
**ACCIÓN**: Estas son tus credenciales de Render - ✅ YA EN .ENV

#### 2. JWT Secret
```env
JWT_SECRET=MI_PALABRA_SECRETA_PARA_KATZE
```
**ACCIÓN**: Cambiar por una clave más segura en producción (min 32 caracteres aleatorios)

#### 3. Gemini API Key
```env
GEMINI_API_KEY=AIzaSyAb--S9vFLMQcSwNqLYKwcZfL5N8Xx-Xxs
```
**ACCIÓN**: Verificar que sea tu clave personal - ✅ YA EN .ENV

#### 4. Make.com Webhook (NUEVO)
```env
MAKE_WEBHOOK_URL=https://hook.us2.make.com/xmldtachada9xritidmmf6nl6gdgmefa
```
**ACCIÓN**: ✅ AGREGADO AL .ENV - Ya no está hardcodeado en el código

---

### 🎨 Frontend (.env)

#### 1. Firebase Configuration
```env
VITE_FIREBASE_API_KEY=AIzaSyCLQKRTdZ6cSC0juOaY5zjwDhP9d-Cc5wQ
VITE_FIREBASE_AUTH_DOMAIN=katze-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=katze-app
VITE_FIREBASE_STORAGE_BUCKET=katze-app.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=847252170771
VITE_FIREBASE_APP_ID=1:847252170771:web:3276c8dc8973d5f00df7e6
VITE_FIREBASE_MEASUREMENT_ID=G-9YF5MVQ1KP
```
**ACCIÓN**: ✅ YA EN .ENV - Estas son tus credenciales de Firebase

#### 2. Redes Sociales (NUEVO - DEBES CONFIGURAR)
```env
# 🚨 ACTUALIZAR CON TUS URLs REALES
VITE_INSTAGRAM_URL=https://www.instagram.com/tu_pagina_katze
VITE_FACEBOOK_URL=https://www.facebook.com/tu_pagina_katze
VITE_WHATSAPP_URL=https://wa.me/521234567890

# Mensajes predeterminados
VITE_WHATSAPP_ADOPT_TEXT=Hola,%20me%20interesa%20adoptar%20un%20gato
VITE_WHATSAPP_VOLUNTEER_TEXT=Hola,%20quiero%20ser%20voluntario
```

**ACCIÓN REQUERIDA**: 
1. Reemplaza `tu_pagina_katze` con el nombre real de tus páginas
2. Reemplaza `521234567890` con tu número de WhatsApp con código de país
   - Formato: https://wa.me/52XXXXXXXXXX (sin espacios ni guiones)
   - Ejemplo México: https://wa.me/525512345678

---

## 🎯 URLs QUE DEBES ACTUALIZAR AHORA

### 1. Instagram
Busca tu página de Instagram y copia la URL completa:
```
Ejemplo: https://www.instagram.com/adopta_gatitos_mx/
```

### 2. Facebook
Busca tu página de Facebook y copia la URL completa:
```
Ejemplo: https://www.facebook.com/adoptagatitos
```

### 3. WhatsApp
Tu número debe incluir el código de país SIN el símbolo +:
```
❌ Incorrecto: https://wa.me/+52-55-1234-5678
✅ Correcto: https://wa.me/525512345678

México: 52 + número a 10 dígitos
USA: 1 + número a 10 dígitos
España: 34 + número a 9 dígitos
```

---

## 🛡️ VERIFICACIÓN FINAL

Ejecuta estos comandos para asegurarte que nada sensible esté en el repositorio:

```bash
# Ver qué archivos están siendo rastreados por git
git status

# Ver qué archivos están siendo ignorados
git check-ignore -v .env backend/.env frontend/.env backend/config/serviceAccountKey.json

# Verificar que .env NO aparezca en git
git ls-files | grep -E "\.env$|serviceAccountKey"
```

**Si aparece algún archivo .env o serviceAccountKey en git:**
```bash
# REMOVER INMEDIATAMENTE del historial
git rm --cached backend/.env
git rm --cached frontend/.env
git rm --cached backend/config/serviceAccountKey.json
git commit -m "Remove sensitive files from git history"
```

---

## 📋 CHECKLIST DE DEPLOY

Antes de hacer deploy a producción:

- [ ] Cambiar `JWT_SECRET` por una clave más fuerte
- [ ] Verificar que `MAKE_WEBHOOK_URL` sea la correcta
- [ ] Actualizar URLs de redes sociales con las reales
- [ ] Verificar que todos los archivos `.env` estén en `.gitignore`
- [ ] Confirmar que `serviceAccountKey.json` NO esté en git
- [ ] Actualizar `VITE_API_URL` al dominio de producción (Render)
- [ ] Probar que los links de redes sociales funcionen

---

## ⚠️ NUNCA COMPARTAS

- ❌ Archivos `.env`
- ❌ `serviceAccountKey.json`
- ❌ Contraseñas de base de datos
- ❌ API Keys de servicios
- ❌ Webhooks de Make.com
- ❌ JWT Secrets

---

## ✅ PUEDES COMPARTIR

- ✅ Archivos `.env.example` (SIN valores reales)
- ✅ Código fuente (sin credenciales)
- ✅ Documentación
- ✅ Screenshots
