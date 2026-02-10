export interface ReviewsCarouselAttributes {}

export interface ReviewsCarouselBlockProps {
    attributes: ReviewsCarouselAttributes;
    setAttributes: (attributes: Partial<ReviewsCarouselAttributes>) => void;
    isSelected: boolean;
    clientId: string;
}