import './SkeletonCard.css';

const SkeletonCard = () => (
    <div className="skeleton-card" aria-hidden="true" aria-busy="true">
        <div className="skeleton-image" />
        <div className="skeleton-body">
            <div className="skeleton-line skeleton-title" />
            <div className="skeleton-line skeleton-meta" />
            <div className="skeleton-chips">
                <div className="skeleton-chip" />
                <div className="skeleton-chip skeleton-chip-sm" />
            </div>
            <div className="skeleton-btn" />
        </div>
    </div>
);

export default SkeletonCard;
