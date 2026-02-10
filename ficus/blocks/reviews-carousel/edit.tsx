const { useBlockProps, InnerBlocks } = wp.blockEditor;
const { __ } = wp.i18n;

import type { ReviewsCarouselBlockProps } from './types';

export default function Edit({ attributes, setAttributes }: ReviewsCarouselBlockProps) {
    const blockProps = useBlockProps({
        className: 'reviews-carousel-editor'
    });

    const INNER_BLOCKS_TEMPLATE = [
        ['ficus/review'],
        ['ficus/review'],
        ['ficus/review']
    ];

    const ALLOWED_BLOCKS = ['ficus/review'];

    return (
        <div {...blockProps}>
            <div className="reviews-carousel">
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