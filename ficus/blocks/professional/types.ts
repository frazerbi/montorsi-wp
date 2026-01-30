export interface MediaObject {
	id: number;
	url: string;
	alt: string;
	title?: string;
	sizes?: {
		[key: string]: {
			url: string;
			width: number;
			height: number;
		};
	};
}

export interface ProfessionalAttributes {
	avatar: MediaObject;
	name: string;
	role: string;
	ctaText: string;
	ctaUrl: string;
}

export interface ProfessionalBlockProps {
	attributes: ProfessionalAttributes;
	setAttributes: (attributes: Partial<ProfessionalAttributes>) => void;
	isSelected: boolean;
	clientId: string;
}