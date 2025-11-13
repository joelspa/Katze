# 📋 Funcionalidades Faltantes para MVP - Prioridades

**Última actualización:** Noviembre 12, 2025  
**Estado:** 3 tareas completadas, 5 tareas pendientes

---

## ✅ COMPLETADO RECIENTEMENTE

### 1. ✅ Sección de Historias de Rescate
- **Frontend:** Página pública `/stories` con diseño responsive
- **Backend:** API completa con CRUD (storyController, storyService)
- **Admin:** Tab de "Historias de Rescate" en AdminDashboard
- **Funcionalidad:** Rescatistas y admins pueden crear/editar/eliminar historias

---

## 🎯 TAREAS PRIORITARIAS PENDIENTES

### Nivel 1 - CRÍTICO (Bloquean MVP mínimo viable)

#### 1. 🔴 Campo de Fecha para Charlas/Historias
**Problema Actual:** Al crear charlas educativas o historias, la fecha se asigna automáticamente con `CURRENT_TIMESTAMP`. No se puede programar eventos futuros o registrar eventos pasados con fecha específica.

**Solución:**
```sql
-- 1. Agregar columna event_date a las tablas
ALTER TABLE educational_posts ADD COLUMN event_date TIMESTAMP;
ALTER TABLE stories ADD COLUMN event_date TIMESTAMP;
```

**Frontend (AdminDashboard.tsx):**
```tsx
// Agregar input de fecha al formulario
<div className="form-group">
    <label htmlFor="eventDate">Fecha del evento (opcional)</label>
    <input
        id="eventDate"
        type="datetime-local"
        value={postForm.eventDate || ''}
        onChange={(e) => setPostForm({ ...postForm, eventDate: e.target.value })}
    />
    <small>Deja vacío para usar la fecha actual</small>
</div>
```

**Backend:**
- Modificar `educationController.createPost()` para aceptar `event_date`
- Modificar `storyController.createStory()` para aceptar `event_date`
- Si no se proporciona, usar `CURRENT_TIMESTAMP`

**Tiempo estimado:** 1-2 horas

---

#### 2. 🔴 Contacto Directo: Agregar Teléfono

**Problema Actual:** No hay forma de contacto directo entre adoptantes y rescatistas. La tabla `users` no tiene campo de teléfono.

**Solución:**
```sql
-- 1. Agregar campo phone a users
ALTER TABLE users ADD COLUMN phone VARCHAR(20);
```

**Frontend (Register.tsx):**
```tsx
<div className="form-group">
    <label>Teléfono de contacto</label>
    <input
        type="tel"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        placeholder="Ej: +569 1234 5678"
    />
    <small>Será visible solo cuando tengas solicitudes aprobadas</small>
</div>
```

**Frontend (RescuerDashboard.tsx):**
- Mostrar teléfono y email del adoptante en solicitudes recibidas
- Solo visible cuando la solicitud está "enviada" o "aprobada"

**Frontend (AdoptionFormModal.tsx o CatDetailPage):**
- Después de enviar solicitud, mostrar datos de contacto del rescatista
- Email y teléfono (si está disponible)

**Backend:**
- Modificar `authController.register()` para aceptar `phone`
- Modificar `applicationController.getReceivedApplications()` para incluir phone del adoptante
- Endpoint nuevo: `GET /api/cats/:id/owner-contact` (solo si el user tiene solicitud aprobada)

**Tiempo estimado:** 2-3 horas

---

#### 3. 🔴 Filtros de Búsqueda de Gatos

**Problema Actual:** En la página principal `/` no se puede filtrar por estado de esterilización, edad, o estado de adopción.

**Solución:**

**Frontend (Home.tsx):**
```tsx
const [filters, setFilters] = useState({
    sterilization: 'all', // all, esterilizado, pendiente, no_aplica
    age: 'all',           // all, cachorro, joven, adulto, senior
    adoption: 'all'       // all, en_adopcion, reservado, adoptado
});

// Agregar componente de filtros
<div className="filters-section">
    <h3>🔍 Filtrar Gatos</h3>
    
    <div className="filter-group">
        <label>Estado de Esterilización</label>
        <select value={filters.sterilization} onChange={handleSterilizationFilter}>
            <option value="all">Todos</option>
            <option value="esterilizado">✅ Esterilizado</option>
            <option value="pendiente">⏳ Pendiente</option>
            <option value="no_aplica">➖ No aplica</option>
        </select>
    </div>

    <div className="filter-group">
        <label>Edad</label>
        <select value={filters.age} onChange={handleAgeFilter}>
            <option value="all">Todas las edades</option>
            <option value="cachorro">🐱 Cachorro (0-6 meses)</option>
            <option value="joven">😺 Joven (6m-2 años)</option>
            <option value="adulto">😸 Adulto (2-7 años)</option>
            <option value="senior">🧓 Senior (7+ años)</option>
        </select>
    </div>

    <button onClick={applyFilters} className="btn-apply-filters">
        Aplicar Filtros
    </button>
</div>
```

**Backend (catController.getApprovedCats):**
```javascript
async getApprovedCats(req, res) {
    try {
        const { sterilization, age, adoption } = req.query;
        
        let query = `
            SELECT c.*, u.full_name as owner_name 
            FROM cats c
            LEFT JOIN users u ON c.owner_id = u.id
            WHERE c.approval_status = 'aprobado'
        `;
        
        const params = [];
        let paramIndex = 1;
        
        if (sterilization && sterilization !== 'all') {
            query += ` AND c.sterilization_status = $${paramIndex++}`;
            params.push(sterilization);
        }
        
        if (age && age !== 'all') {
            // Lógica para filtrar por rango de edad
            // Requiere calcular edad basándose en c.age
        }
        
        if (adoption && adoption !== 'all') {
            query += ` AND c.adoption_status = $${paramIndex++}`;
            params.push(adoption);
        }
        
        query += ` ORDER BY c.created_at DESC`;
        
        const result = await db.query(query, params);
        res.json({ success: true, data: { cats: result.rows } });
    } catch (error) {
        ErrorHandler.handleError(res, error, 'Error al obtener gatos filtrados');
    }
}
```

**Tiempo estimado:** 3-4 horas

---

### Nivel 2 - IMPORTANTE (Mejora significativa del MVP)

#### 4. 🟡 Estadísticas de Esterilización

**Descripción:** Dashboard administrativo con métricas sobre tasas de cumplimiento de esterilización post-adopción.

**Implementación:**

**Nueva página:** `frontend/src/pages/Statistics.tsx`

```tsx
const Statistics = () => {
    const [stats, setStats] = useState({
        totalAdoptions: 0,
        completedTasks: 0,
        sterilizedCats: 0,
        complianceRate: 0,
        overdueTasks: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            const response = await axios.get('http://localhost:5000/api/admin/statistics');
            setStats(response.data.data);
        };
        fetchStats();
    }, []);

    return (
        <div className="statistics-container">
            <h1>📊 Estadísticas de Esterilización</h1>
            
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Adopciones</h3>
                    <p className="stat-number">{stats.totalAdoptions}</p>
                </div>
                
                <div className="stat-card">
                    <h3>Gatos Esterilizados</h3>
                    <p className="stat-number">{stats.sterilizedCats}</p>
                </div>
                
                <div className="stat-card highlight">
                    <h3>Tasa de Cumplimiento</h3>
                    <p className="stat-number">{stats.complianceRate}%</p>
                </div>
                
                <div className="stat-card danger">
                    <h3>Tareas Atrasadas</h3>
                    <p className="stat-number">{stats.overdueTasks}</p>
                </div>
            </div>

            {/* Gráfico con Chart.js */}
            <div className="chart-section">
                <h3>Evolución Mensual</h3>
                <Line data={chartData} options={chartOptions} />
            </div>
        </div>
    );
};
```

**Backend:** Nuevo controlador `adminController.getStatistics()`

```javascript
async getStatistics(req, res) {
    try {
        // Total de adopciones aprobadas
        const adoptionsResult = await db.query(`
            SELECT COUNT(*) as total FROM adoption_applications 
            WHERE status = 'aprobada'
        `);
        
        // Tareas de esterilización completadas
        const completedTasksResult = await db.query(`
            SELECT COUNT(*) as total FROM tracking_tasks 
            WHERE task_type = 'Seguimiento de Esterilización' 
            AND status = 'completada'
        `);
        
        // Tareas atrasadas
        const overdueResult = await db.query(`
            SELECT COUNT(*) as total FROM tracking_tasks 
            WHERE status = 'atrasada'
        `);
        
        const totalAdoptions = parseInt(adoptionsResult.rows[0].total);
        const completedTasks = parseInt(completedTasksResult.rows[0].total);
        const overdueTasks = parseInt(overdueResult.rows[0].total);
        
        const complianceRate = totalAdoptions > 0 
            ? Math.round((completedTasks / totalAdoptions) * 100)
            : 0;
        
        res.json({
            success: true,
            data: {
                totalAdoptions,
                completedTasks,
                sterilizedCats: completedTasks,
                complianceRate,
                overdueTasks
            }
        });
    } catch (error) {
        ErrorHandler.handleError(res, error, 'Error al obtener estadísticas');
    }
}
```

**Dependencias necesarias:**
```bash
cd frontend
npm install chart.js react-chartjs-2
```

**Tiempo estimado:** 4-5 horas

---

#### 5. 🟡 Upload de Certificado de Esterilización

**Descripción:** Permitir a rescatistas subir el certificado veterinario cuando completan la tarea de esterilización.

**Implementación:**

**Backend: Configurar Multer**

```javascript
// backend/config/multer.js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/certificates/');
    },
    filename: (req, file, cb) => {
        const uniqueName = `cert_${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten imágenes (JPG, PNG) o PDF'));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

module.exports = upload;
```

**Backend: Endpoint**

```javascript
// trackingRoutes.js
const upload = require('../config/multer');

router.post(
    '/:taskId/upload-certificate',
    authMiddleware,
    upload.single('certificate'),
    trackingController.uploadCertificate
);

// trackingController.js
async uploadCertificate(req, res) {
    try {
        const { taskId } = req.params;
        const certificateUrl = `/uploads/certificates/${req.file.filename}`;
        
        await db.query(
            `UPDATE tracking_tasks 
             SET certificate_url = $1, status = 'completada' 
             WHERE id = $2`,
            [certificateUrl, taskId]
        );
        
        res.json({
            success: true,
            message: 'Certificado subido con éxito',
            data: { certificate_url: certificateUrl }
        });
    } catch (error) {
        ErrorHandler.handleError(res, error, 'Error al subir certificado');
    }
}
```

**Frontend (TrackingDashboard.tsx):**

```tsx
const handleUploadCertificate = async (taskId: number, file: File) => {
    const formData = new FormData();
    formData.append('certificate', file);
    
    try {
        await axios.post(
            `http://localhost:5000/api/tracking/${taskId}/upload-certificate`,
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        
        alert('✅ Certificado subido con éxito');
        fetchTasks(); // Recargar tareas
    } catch (error) {
        alert('❌ Error al subir certificado');
    }
};

// En el JSX de cada tarea
{task.task_type === 'Seguimiento de Esterilización' && task.status === 'pendiente' && (
    <div className="upload-section">
        <label className="btn-upload">
            📎 Subir Certificado
            <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) => {
                    if (e.target.files?.[0]) {
                        handleUploadCertificate(task.id, e.target.files[0]);
                    }
                }}
                style={{ display: 'none' }}
            />
        </label>
    </div>
)}
```

**SQL: Agregar columna**

```sql
ALTER TABLE tracking_tasks ADD COLUMN certificate_url VARCHAR(500);
```

**Dependencias necesarias:**
```bash
cd backend
npm install multer
```

**Configurar carpeta de uploads:**
```bash
mkdir -p backend/uploads/certificates
```

**Tiempo estimado:** 3-4 horas

---

## 📊 RESUMEN DE PRIORIDADES

| Tarea | Prioridad | Tiempo | Complejidad |
|-------|-----------|--------|-------------|
| Campo de fecha en charlas/historias | 🔴 CRÍTICO | 1-2h | ⭐ Fácil |
| Contacto directo (teléfono) | 🔴 CRÍTICO | 2-3h | ⭐⭐ Media |
| Filtros de búsqueda | 🔴 CRÍTICO | 3-4h | ⭐⭐ Media |
| Estadísticas | 🟡 IMPORTANTE | 4-5h | ⭐⭐⭐ Alta |
| Upload de certificado | 🟡 IMPORTANTE | 3-4h | ⭐⭐ Media |

**TOTAL ESTIMADO:** 13-18 horas para completar todas las funcionalidades del MVP

---

## 🚀 ORDEN RECOMENDADO DE IMPLEMENTACIÓN

1. **Campo de fecha** (más simple, 1-2h)
2. **Contacto directo** (crítico para comunicación, 2-3h)
3. **Filtros de búsqueda** (mejor UX, 3-4h)
4. **Upload de certificado** (completa flujo de seguimiento, 3-4h)
5. **Estadísticas** (para admin, menos urgente, 4-5h)

---

## ✅ CHECKLIST FINAL MVP

- [x] Publicación de gatos
- [x] Formulario de adopción
- [x] Sección de historias
- [ ] **Contacto directo**
- [x] Módulo educativo
- [x] Panel de administración
- [x] Sistema de seguimiento
- [ ] **Filtros de búsqueda**
- [ ] **Estadísticas**
- [ ] **Upload de certificados**

**Progreso actual: 7/11 (63%)**

---

**Próximo paso recomendado:** Implementar campo de fecha para charlas y eventos.
