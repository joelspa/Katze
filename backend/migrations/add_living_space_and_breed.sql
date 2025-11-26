-- Migración: Agregar campos de raza y requisitos de espacio a la tabla cats
-- Fecha: 2025-11-25
-- Descripción: Agrega campos para permitir filtrar gatos por tipo de vivienda y mostrar la raza

-- Agregar columna para la raza del gato
ALTER TABLE cats 
ADD COLUMN IF NOT EXISTS breed VARCHAR(100) DEFAULT 'Mestizo';

-- Agregar columna para requisitos de espacio (casa_grande, departamento, cualquiera)
ALTER TABLE cats 
ADD COLUMN IF NOT EXISTS living_space_requirement VARCHAR(20) DEFAULT 'cualquiera' 
CHECK (living_space_requirement IN ('casa_grande', 'departamento', 'cualquiera'));

-- Comentarios para documentar las columnas
COMMENT ON COLUMN cats.breed IS 'Raza del gato (ej: Siamés, Persa, Mestizo, etc.)';
COMMENT ON COLUMN cats.living_space_requirement IS 'Tipo de vivienda requerida: casa_grande, departamento, o cualquiera';

-- Actualizar índice para mejorar consultas con filtros
CREATE INDEX IF NOT EXISTS idx_cats_living_space ON cats(living_space_requirement);
CREATE INDEX IF NOT EXISTS idx_cats_breed ON cats(breed);
