const { useBlockProps } = wp.blockEditor;
const { 
    PanelBody, 
    TextControl,
    TextareaControl,
    RangeControl,
    Button,
    Placeholder
} = wp.components;
const { InspectorControls, MediaUpload, MediaUploadCheck } = wp.blockEditor;
const { __ } = wp.i18n;

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

export default function Edit({ attributes, setAttributes }: ReviewBlockProps) {
    const { avatar, reviewerName, reviewText, rating } = attributes;
    const blockProps = useBlockProps({
        className: 'review-block-editor'
    });

    const onSelectAvatar = (media: any) => {
        setAttributes({
            avatar: {
                id: media.id,
                url: media.url,
                alt: media.alt || '',
                title: media.title || ''
            }
        });
    };

    const removeAvatar = () => {
        setAttributes({ avatar: { id: 0, url: '', alt: '' } });
    };

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Review Settings', 'ficus')} initialOpen={true}>
                    <div style={{ marginBottom: '16px' }}>
                        <strong>{__('Avatar (Opzionale)', 'ficus')}</strong>
                        <MediaUploadCheck>
                            <MediaUpload
                                onSelect={onSelectAvatar}
                                allowedTypes={['image']}
                                value={avatar.id}
                                render={({ open }) => (
                                    <div>
                                        {avatar.url ? (
                                            <div>
                                                <img 
                                                    src={avatar.url} 
                                                    alt={avatar.alt}
                                                    style={{ 
                                                        width: '80px', 
                                                        height: '80px', 
                                                        objectFit: 'cover',
                                                        borderRadius: '50%',
                                                        marginBottom: '8px'
                                                    }}
                                                />
                                                <div>
                                                    <Button 
                                                        onClick={open} 
                                                        variant="secondary"
                                                        size="small"
                                                        style={{ marginRight: '8px' }}
                                                    >
                                                        {__('Sostituisci', 'ficus')}
                                                    </Button>
                                                    <Button 
                                                        onClick={removeAvatar} 
                                                        variant="tertiary"
                                                        size="small"
                                                        isDestructive
                                                    >
                                                        {__('Rimuovi', 'ficus')}
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <Button onClick={open} variant="secondary">
                                                {__('Seleziona Avatar', 'ficus')}
                                            </Button>
                                        )}
                                    </div>
                                )}
                            />
                        </MediaUploadCheck>
                    </div>

                    <TextControl
                        label={__('Nome Recensore', 'ficus')}
                        value={reviewerName}
                        onChange={(value: string) => {
                            if (value.length <= 100) setAttributes({ reviewerName: value });
                        }}
                        placeholder={__('Inserisci nome', 'ficus')}
                        help={`${reviewerName.length}/100`}
                    />

                    <TextareaControl
                        label={__('Testo Recensione', 'ficus')}
                        value={reviewText}
                        onChange={(value: string) => {
                            if (value.length <= 1500) setAttributes({ reviewText: value });
                        }}
                        placeholder={__('Inserisci recensione', 'ficus')}
                        help={`${reviewText.length}/1500`}
                        rows={4}
                    />

                    <RangeControl
                        label={__('Valutazione', 'ficus')}
                        value={rating}
                        onChange={(value: number | undefined) => {
                            if (value !== undefined) setAttributes({ rating: value });
                        }}
                        min={1}
                        max={5}
                        step={1}
                    />
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                {!reviewerName && !reviewText ? (
                    <Placeholder
                        icon="star-filled"
                        label={__('Review Card', 'ficus')}
                        instructions={__('Configura la recensione nel pannello laterale.', 'ficus')}
                    />
                ) : (
                    <div className="reviewcard">
                        <div className="reviewcard-header">
                            {avatar.url && (
                                <div className="reviewcard-avatar">
                                    <img src={avatar.url} alt={avatar.alt} />
                                </div>
                            )}
                            <div className="reviewcard-meta">
                                {reviewerName && <h4 className="reviewcard-name">{reviewerName}</h4>}
                                <StarRating rating={rating} />
                            </div>
                        </div>
                        {reviewText && <p className="reviewcard-text">{reviewText}</p>}
                    </div>
                )}
            </div>
        </>
    );
}