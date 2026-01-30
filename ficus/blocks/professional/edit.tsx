// Usa le API globali di WordPress invece degli import ES6
const { useBlockProps } = wp.blockEditor;
const { 
    PanelBody, 
    TextControl, 
    Button,
    Placeholder
} = wp.components;
const { InspectorControls, MediaUpload, MediaUploadCheck } = wp.blockEditor;
const { __ } = wp.i18n;

import type { ProfessionalBlockProps } from './types';

export default function Edit({ attributes, setAttributes }: ProfessionalBlockProps) {
    const { avatar, name, role, ctaText, ctaUrl } = attributes;
    const blockProps = useBlockProps({
        className: 'professional-block-editor'
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
        setAttributes({ avatar: {} });
    };

    const updateName = (value: string) => {
        if (value.length <= 50) {
            setAttributes({ name: value });
        }
    };

    const updateRole = (value: string) => {
        if (value.length <= 50) {
            setAttributes({ role: value });
        }
    };

    const updateCtaText = (value: string) => {
        setAttributes({ ctaText: value });
    };

    const updateCtaUrl = (value: string) => {
        setAttributes({ ctaUrl: value });
    };

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Professional Settings', 'ficus')} initialOpen={true}>
                    <div style={{ marginBottom: '16px' }}>
                        <strong>{__('Avatar Image', 'ficus')}</strong>
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
                                                        borderRadius: '4px',
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
                                                        {__('Replace', 'ficus')}
                                                    </Button>
                                                    <Button 
                                                        onClick={removeAvatar} 
                                                        variant="tertiary"
                                                        size="small"
                                                        isDestructive
                                                    >
                                                        {__('Remove', 'ficus')}
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <Button 
                                                onClick={open} 
                                                variant="secondary"
                                            >
                                                {__('Select Avatar', 'ficus')}
                                            </Button>
                                        )}
                                    </div>
                                )}
                            />
                        </MediaUploadCheck>
                    </div>

                    <TextControl
                        label={__('Name', 'ficus')}
                        value={name}
                        onChange={updateName}
                        placeholder={__('Enter professional name', 'ficus')}
                        help={`${name.length}/50 characters`}
                    />

                    <TextControl
                        label={__('Role', 'ficus')}
                        value={role}
                        onChange={updateRole}
                        placeholder={__('Enter professional role', 'ficus')}
                        help={`${role.length}/50 characters`}
                    />

                    <hr style={{ margin: '16px 0' }} />

                    <TextControl
                        label={__('CTA Text', 'ficus')}
                        value={ctaText}
                        onChange={updateCtaText}
                        placeholder={__('Learn more', 'ficus')}
                    />

                    <TextControl
                        label={__('CTA URL', 'ficus')}
                        value={ctaUrl}
                        onChange={updateCtaUrl}
                        placeholder={__('https://example.com', 'ficus')}
                        type="url"
                    />
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                {!avatar.url && !name && !role ? (
                    <Placeholder
                        icon="admin-users"
                        label={__('Professional Card', 'ficus')}
                        instructions={__('Configure your professional card in the sidebar settings.', 'ficus')}
                    />
                ) : (
                    <div className="professionalcard">
                        {avatar.url && (
                            <div className="professionalcard-avatar">
                                <img
                                    src={avatar.url}
                                    alt={avatar.alt}
                                />
                            </div>
                        )}

                        <div className="professionalcard-content">
                            {name && (
                                <h3>{name}</h3>
                            )}

                            {role && (
                                <p>{role}</p>
                            )}

                            {ctaText && (
                                <div className="professionalcard-cta">
                                    <span>{ctaText}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}