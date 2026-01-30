export interface BlockStyle {
    name: string;
    label: string;
    isDefault?: boolean;
}
export interface BlockCustomizationConfig {
    blockName: string;
    stylesToRemove?: string[];
    stylesToAdd: BlockStyle[];
    variationsToRemove?: string[]; 
    debug?: boolean;
    isReady?: () => boolean;
    beforeCustomize?: () => void | Promise<void>;
    afterCustomize?: () => void | Promise<void>;
}