// Usa le API globali di WordPress
const { useBlockProps, InnerBlocks } = wp.blockEditor;
const { __ } = wp.i18n;

import type { ProfessionalsGridBlockProps } from './types';

export default function Edit({ attributes, setAttributes }: ProfessionalsGridBlockProps) {
    const blockProps = useBlockProps({
        className: 'professionals-grid-editor'
    });

    // Template per i blocchi interni - forza il tipo Professional
    const INNER_BLOCKS_TEMPLATE = [
        ['ficus/professional'],
        ['ficus/professional'],
        ['ficus/professional']
    ];

    // Permette solo blocchi Professional
    const ALLOWED_BLOCKS = ['ficus/professional'];

    return (
        <div {...blockProps}>
            <div className="professionals-grid">
                <InnerBlocks
                    allowedBlocks={ALLOWED_BLOCKS}
                    template={INNER_BLOCKS_TEMPLATE}
                    templateInsertUpdatesSelection={false}
                    renderAppender={() => (
                        <InnerBlocks.ButtonBlockAppender />
                    )}
                />
            </div>
        </div>
    );
}