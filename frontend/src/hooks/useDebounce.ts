// Hook personalizado para debouncing
// Reduce el número de llamadas a funciones costosas (búsquedas, API calls)

import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number = 500): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // Establecer un timeout para actualizar el valor después del delay
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Limpiar el timeout si el valor cambia antes de que termine el delay
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}
