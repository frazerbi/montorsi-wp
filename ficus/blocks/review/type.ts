export interface MediaObject {
    id: number;
    url: string;
    alt: string;
    title?: string;
}

export interface ReviewAttributes {
    avatar: MediaObject;
    reviewerName: string;
    reviewText: string;
    rating: number;
}

export interface ReviewBlockProps {
    attributes: ReviewAttributes;
    setAttributes: (attributes: Partial<ReviewAttributes>) => void;
    isSelected: boolean;
    clientId: string;
}