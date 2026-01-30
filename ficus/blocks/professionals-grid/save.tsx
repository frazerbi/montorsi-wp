// Usa le API globali di WordPress
const { useBlockProps, InnerBlocks } = wp.blockEditor;

import type { ProfessionalsGridBlockProps } from './types';

export default function Save({ attributes }: ProfessionalsGridBlockProps) {
    const blockProps = useBlockProps.save({
        className: 'professionals-grid'
    });

    return (
        <div {...blockProps}>
            <InnerBlocks.Content />
        </div>
    );
}