// Modal para mostrar noticia completa
import React, { useEffect } from 'react';
import './NewsModal.css';

interface EducationalPost {
    id: number;
    title: string;
    content: string;
    author_name: string;
    created_at: string;
    image_url?: string;
}

interface NewsModalProps {
    isOpen: boolean;
    onClose: () => void;
    post: EducationalPost | null;
    categoryName?: string;
    categoryIcon?: React.ReactNode;
}

const NewsModal: React.FC<NewsModalProps> = ({ 
    isOpen, 
    onClose, 
    post,
    categoryName = 'Blog',
    categoryIcon
}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen || !post) return null;

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="news-modal-overlay" onClick={handleOverlayClick}>
            <div className="news-modal-content">
                {/* Close Button */}
                <button className="news-modal-close" onClick={onClose} aria-label="Cerrar">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Header Image */}
                {post.image_url && (
                    <div className="news-modal-header-image">
                        <img 
                            src={post.image_url} 
                            alt={post.title}
                        />
                        <div className="image-overlay"></div>
                        
                        {/* Category Badge */}
                        <div className="news-modal-category">
                            {categoryIcon}
                            <span>{categoryName}</span>
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="news-modal-body">
                    <h1 className="news-modal-title">{post.title}</h1>
                    
                    {/* Meta Info */}
                    <div className="news-modal-meta">
                        <div className="meta-item">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                            </svg>
                            <span>{post.author_name}</span>
                        </div>
                        <span className="meta-separator">•</span>
                        <div className="meta-item">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
                            </svg>
                            <span>{formatDate(post.created_at)}</span>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="news-modal-divider"></div>

                    {/* Article Content */}
                    <div className="news-modal-content-text">
                        {post.content.split('\n').map((paragraph, index) => (
                            paragraph.trim() && <p key={index}>{paragraph}</p>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsModal;
