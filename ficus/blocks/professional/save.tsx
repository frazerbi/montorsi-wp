// Usa le API globali di WordPress
const { useBlockProps } = wp.blockEditor;

import type { ProfessionalBlockProps } from './types';

export default function Save({ attributes }: ProfessionalBlockProps) {
    const { avatar, name, role, ctaText, ctaUrl } = attributes;
    const blockProps = useBlockProps.save({
        className: 'professionalcard'
    });

    // Non renderizza nulla se non ci sono dati essenziali
    if (!name && !role && !avatar.url) {
        return null;
    }

    return (
        <div {...blockProps}>
            {avatar.url && (
                <figure className="professionalcard-avatar">
                    <img 
                        src={avatar.url} 
                        alt={avatar.alt || name || 'Professional avatar'}
                    />
                </figure>
            )}
            
            <div className="professionalcard-content">
                {name && (
                    <h3 className="professionalcard-name">
                        {name}
                    </h3>
                )}
                
                {role && (
                    <p className="professionalcard-role">
                        {role}
                    </p>
                )}
                
                {ctaText && ctaUrl && (
                    <a 
                        href={ctaUrl}
                        className="professionalcard-cta"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {ctaText}
                    </a>
                )}
            </div>
        </div>
    );
}