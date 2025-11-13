// Configuración de Multer para subida de certificados
// Maneja la subida de archivos PDF e imágenes para certificados de seguimiento

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Crear directorio de certificados si no existe
const uploadDir = path.join(__dirname, '..', 'uploads', 'certificates');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de almacenamiento
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Formato: task-{taskId}-{timestamp}.{extension}
        const taskId = req.params.taskId || 'unknown';
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        cb(null, `task-${taskId}-${timestamp}${ext}`);
    }
});

// Validación de archivos
const fileFilter = (req, file, cb) => {
    // Tipos MIME permitidos
    const allowedMimeTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp'
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de archivo no permitido. Solo se aceptan PDF, JPG, PNG y WEBP'), false);
    }
};

// Configuración de Multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB máximo
    }
});

module.exports = upload;
