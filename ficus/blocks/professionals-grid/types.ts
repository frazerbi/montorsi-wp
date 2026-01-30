export interface ProfessionalsGridAttributes {
    // Per ora nessun attributo specifico, ma prepariamo per il futuro
}

export interface ProfessionalsGridBlockProps {
    attributes: ProfessionalsGridAttributes;
    setAttributes: (attributes: Partial<ProfessionalsGridAttributes>) => void;
    isSelected: boolean;
    clientId: string;
}