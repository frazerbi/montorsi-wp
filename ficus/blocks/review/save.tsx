const { useBlockProps } = wp.blockEditor;

import type { ReviewBlockProps } from './types';

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="reviewcard-stars" role="img" aria-label={`${rating} su 5 stelle`}>
            {[1, 2, 3, 4, 5].map(i => (
                <span 
                    key={i}
                    className={`star ${i <= rating ? 'filled' : 'empty'}`}
                    aria-hidden="true"
                >
                    ★
                </span>
            ))}
        </div>
    );
}

export default function Save({ attributes }: ReviewBlockProps) {
    const { avatar, reviewerName, reviewText, rating } = attributes;
    const blockProps = useBlockProps.save({
        className: 'reviewcard'
    });

    if (!reviewerName && !reviewText) {
        return null;
    }

    return (
        <div {...blockProps}>
            <div className="reviewcard-header">
                {avatar.url && (
                    <figure className="reviewcard-avatar">
                        <img 
                            src={avatar.url} 
                            alt={avatar.alt || reviewerName || 'Reviewer avatar'}
                        />
                    </figure>
                )}
                <div className="reviewcard-meta">
                    {reviewerName && <h4 className="reviewcard-name">{reviewerName}</h4>}
                    <StarRating rating={rating} />
                </div>
            </div>
            {reviewText && <p className="reviewcard-text">{reviewText}</p>}
        </div>
    );
}