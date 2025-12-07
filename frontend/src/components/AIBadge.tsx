/**
 * Badge Component para mostrar flags de evaluación IA
 * Colores basados en el tipo de flag
 */

interface AIBadgeProps {
    flag: string;
}

export const AIBadge: React.FC<AIBadgeProps> = ({ flag }) => {
    const getColor = (flag: string): string => {
        const flagLower = flag.toLowerCase();
        
        // Badges Verdes (Positivos)
        if (flagLower.includes('casa segura') || 
            flagLower.includes('pro-esterilización') ||
            flagLower.includes('experiencia previa')) {
            return 'badge-green';
        }
        
        // Badges Amarillos (Neutros/Información)
        if (flagLower.includes('primer gato') ||
            flagLower.includes('sistema en mantenimiento')) {
            return 'badge-yellow';
        }
        
        // Badges Rojos (Alertas - no deberían aparecer en pending_review)
        if (flagLower.includes('riesgo') ||
            flagLower.includes('sin veterinario')) {
            return 'badge-red';
        }
        
        // Default gris
        return 'badge-gray';
    };

    return (
        <span className={`ai-badge ${getColor(flag)}`}>
            {flag}
        </span>
    );
};

/**
 * AI Score Badge Component
 * Muestra el puntaje con color según rango
 */

interface AIScoreBadgeProps {
    score: number;
}

export const AIScoreBadge: React.FC<AIScoreBadgeProps> = ({ score }) => {
    const getScoreColor = (score: number): string => {
        if (score >= 70) return 'score-high'; // Verde
        if (score >= 50) return 'score-medium'; // Amarillo
        return 'score-low'; // Rojo
    };

    return (
        <div className={`ai-score-badge ${getScoreColor(score)}`}>
            <span className="score-label">Score IA</span>
            <span className="score-value">{score}/100</span>
        </div>
    );
};
