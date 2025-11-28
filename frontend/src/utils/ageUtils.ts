// Utilidades para manejo de edades de gatos

/**
 * Formatea la edad del gato para mostrar de forma consistente
 * @param age - Edad en formato "X meses" o "X años"
 * @returns Edad formateada
 */
export const formatCatAge = (age: string): string => {
    if (!age) return 'Edad desconocida';
    
    // Normalizar formato
    const normalized = age.toLowerCase().trim();
    
    // Si ya está en formato correcto, retornar capitalizado
    if (normalized.match(/^\d+ (mes|meses|año|años)$/)) {
        return age.charAt(0).toUpperCase() + age.slice(1);
    }
    
    return age;
};

/**
 * Obtiene la categoría de edad del gato
 * @param age - Edad en formato "X meses" o "X años"
 * @returns Categoría: 'cachorro', 'joven', 'adulto', 'senior'
 */
export const getCatAgeCategory = (age: string): 'cachorro' | 'joven' | 'adulto' | 'senior' | 'desconocido' => {
    if (!age) return 'desconocido';
    
    const normalized = age.toLowerCase().trim();
    
    // Cachorros: 0-11 meses
    if (normalized.includes('mes') || normalized.includes('semana')) {
        return 'cachorro';
    }
    
    // Joven: 1 año
    if (normalized === '1 año') {
        return 'joven';
    }
    
    // Extraer número de años
    const yearsMatch = normalized.match(/^(\d+)\s*año/);
    if (yearsMatch) {
        const years = parseInt(yearsMatch[1]);
        
        if (years === 1) return 'joven';
        if (years >= 2 && years <= 7) return 'adulto';
        if (years >= 8) return 'senior';
    }
    
    return 'desconocido';
};

/**
 * Obtiene una descripción de la categoría de edad
 * @param age - Edad en formato "X meses" o "X años"
 * @returns Descripción de la categoría
 */
export const getAgeCategoryDescription = (age: string): string => {
    const category = getCatAgeCategory(age);
    
    const descriptionMap = {
        cachorro: 'Cachorro (0-11 meses)',
        joven: 'Joven (1 año)',
        adulto: 'Adulto (2-7 años)',
        senior: 'Senior (8+ años)',
        desconocido: 'Edad no especificada'
    };
    
    return descriptionMap[category];
};

/**
 * Convierte edad en meses a formato legible
 * @param months - Número de meses
 * @returns Formato "X meses" o "X años Y meses"
 */
export const formatMonthsToAge = (months: number): string => {
    if (months < 12) {
        return `${months} ${months === 1 ? 'mes' : 'meses'}`;
    }
    
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (remainingMonths === 0) {
        return `${years} ${years === 1 ? 'año' : 'años'}`;
    }
    
    return `${years} ${years === 1 ? 'año' : 'años'} y ${remainingMonths} ${remainingMonths === 1 ? 'mes' : 'meses'}`;
};
