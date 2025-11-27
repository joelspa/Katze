// Utilidades para optimización de imágenes
// Lazy loading y optimización de carga de imágenes

/**
 * Lazy loading observer para imágenes
 * Carga imágenes solo cuando están cerca del viewport
 */
export const createImageObserver = (callback: IntersectionObserverCallback) => {
    const options = {
        root: null,
        rootMargin: '50px', // Comienza a cargar 50px antes de entrar al viewport
        threshold: 0.01
    };
    
    return new IntersectionObserver(callback, options);
};

/**
 * Comprime una imagen antes de subirla
 * @param file - Archivo de imagen original
 * @param maxWidth - Ancho máximo
 * @param maxHeight - Alto máximo
 * @param quality - Calidad de compresión (0-1)
 */
export const compressImage = (
    file: File,
    maxWidth: number = 1200,
    maxHeight: number = 1200,
    quality: number = 0.8
): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                
                // Calcular nuevas dimensiones manteniendo aspect ratio
                if (width > height) {
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('No se pudo obtener el contexto del canvas'));
                    return;
                }
                
                ctx.drawImage(img, 0, 0, width, height);
                
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            resolve(blob);
                        } else {
                            reject(new Error('Error al comprimir la imagen'));
                        }
                    },
                    'image/jpeg',
                    quality
                );
            };
            
            img.onerror = () => reject(new Error('Error al cargar la imagen'));
            img.src = e.target?.result as string;
        };
        
        reader.onerror = () => reject(new Error('Error al leer el archivo'));
        reader.readAsDataURL(file);
    });
};

/**
 * Genera un placeholder blur data URL para lazy loading
 */
export const generatePlaceholder = (width: number = 10, height: number = 10): string => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
        ctx.fillStyle = '#e0e0e0';
        ctx.fillRect(0, 0, width, height);
    }
    
    return canvas.toDataURL();
};
