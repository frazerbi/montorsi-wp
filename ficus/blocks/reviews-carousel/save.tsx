const { useBlockProps, InnerBlocks } = wp.blockEditor;

import type { ReviewsCarouselBlockProps } from './types';

export default function Save({ attributes }: ReviewsCarouselBlockProps) {
    const blockProps = useBlockProps.save({
        className: 'reviews-carousel'
    });

    return (
        <div {...blockProps}>
            <InnerBlocks.Content />
        </div>
    );
}