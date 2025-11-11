# Katze Backend - Arquitectura SOLID

Backend refactorizado aplicando principios SOLID para una plataforma de adopción de gatos.

## 📁 Estructura del Proyecto

```
backend/
├── config/                 # Configuración centralizada
│   └── config.js          # Variables de entorno y constantes
│
├── controllers/           # Controladores (capa de presentación)
│   ├── authController.js
│   ├── catController.js
│   ├── applicationController.js
│   ├── trackingController.js
│   └── educationController.js
│
├── services/              # Lógica de negocio (capa de servicio)
│   ├── authService.js
│   ├── catService.js
│   ├── applicationService.js
│   ├── trackingService.js
│   └── educationService.js
│
├── routes/                # Definición de rutas
│   ├── index.js
│   ├── authRoutes.js
│   ├── catRoutes.js
│   ├── applicationRoutes.js
│   ├── trackingRoutes.js
│   └── educationRoutes.js
│
├── middleware/            # Middlewares personalizados
│   ├── authMiddleware.js
│   ├── adminMiddleware.js
│   └── moderationMiddleware.js
│
├── utils/                 # Utilidades y helpers
│   ├── validator.js       # Validación de datos
│   └── errorHandler.js    # Manejo centralizado de errores
│
├── db.js                  # Configuración de base de datos
├── index.js               # Punto de entrada de la aplicación
└── package.json
```

## 🎯 Principios SOLID Aplicados

### 1. **Single Responsibility Principle (SRP)**
Cada clase/módulo tiene una única responsabilidad:
- **Controllers**: Solo manejan peticiones HTTP
- **Services**: Solo contienen lógica de negocio
- **Validators**: Solo validan datos
- **ErrorHandler**: Solo maneja respuestas de error

### 2. **Open/Closed Principle (OCP)**
El código está abierto a extensión pero cerrado a modificación:
- Los servicios pueden extenderse sin modificar controladores
- Nuevas validaciones se agregan sin cambiar el validador base

### 3. **Liskov Substitution Principle (LSP)**
Los servicios pueden ser reemplazados por implementaciones alternativas sin afectar el sistema.

### 4. **Interface Segregation Principle (ISP)**
Los controladores solo dependen de los métodos de servicio que necesitan.

### 5. **Dependency Inversion Principle (DIP)**
Los controladores dependen de servicios (abstracciones) no de implementaciones directas de base de datos.

## 🔄 Flujo de Datos

```
Request → Router → Middleware → Controller → Service → Database
                                     ↓
                                 Validator
                                     ↓
                              ErrorHandler → Response
```

## 📦 Capas de la Aplicación

### **Capa de Presentación (Controllers)**
- Recibe peticiones HTTP
- Valida datos de entrada
- Llama a servicios
- Formatea respuestas

### **Capa de Negocio (Services)**
- Contiene la lógica de negocio
- Interactúa con la base de datos
- Procesa y transforma datos
- Mantiene reglas de negocio

### **Capa de Utilidades**
- **Validator**: Validación de datos
- **ErrorHandler**: Respuestas HTTP estandarizadas
- **Config**: Configuración centralizada

## 🚀 Ventajas de esta Arquitectura

### ✅ **Mantenibilidad**
- Código organizado y fácil de navegar
- Cambios aislados en módulos específicos

### ✅ **Testabilidad**
- Servicios y controladores fáciles de testear
- Lógica de negocio aislada

### ✅ **Escalabilidad**
- Fácil agregar nuevas funcionalidades
- Estructura clara para equipos grandes

### ✅ **Reusabilidad**
- Servicios reutilizables en diferentes controladores
- Validadores y utilidades compartidas

### ✅ **Separación de Responsabilidades**
- Cada archivo tiene un propósito claro
- Fácil identificar dónde hacer cambios

## 🔧 Configuración

Todas las configuraciones están centralizadas en `config/config.js`:
- Puerto del servidor
- Configuración de JWT
- Configuración de base de datos
- Constantes de la aplicación

## 📝 Ejemplos de Uso

### Agregar una nueva funcionalidad

1. **Crear el servicio** (`services/newService.js`)
2. **Crear el controlador** (`controllers/newController.js`)
3. **Crear las rutas** (`routes/newRoutes.js`)
4. **Registrar en** `routes/index.js` e `index.js`

### Agregar una validación

Agregar método estático en `utils/validator.js`:
```javascript
static validateNewData(data) {
    const errors = [];
    // Lógica de validación
    return { isValid: errors.length === 0, errors };
}
```

## 🛡️ Manejo de Errores

Todas las respuestas HTTP usan `ErrorHandler`:
- `ErrorHandler.success()` - 200
- `ErrorHandler.created()` - 201
- `ErrorHandler.badRequest()` - 400
- `ErrorHandler.unauthorized()` - 401
- `ErrorHandler.forbidden()` - 403
- `ErrorHandler.notFound()` - 404
- `ErrorHandler.serverError()` - 500

## 🔐 Seguridad

- JWT para autenticación
- Middlewares de autorización por rol
- Validación de datos en todas las entradas
- Contraseñas hasheadas con bcrypt
- Moderación automática de contenido

## 📊 Base de Datos

Conexión configurada en `db.js` usando Pool de PostgreSQL.
Todas las consultas pasan por servicios, nunca directamente desde controladores.

---

**Arquitectura diseñada siguiendo las mejores prácticas de desarrollo backend**
