import BlockCustomizer from './BlockCustomizer';
import { BLOCK_CONFIGURATIONS } from './config';

export default class WPBlockCustomizer extends BlockCustomizer {
    constructor(customConfigurations?: any[]) {
        super(customConfigurations || BLOCK_CONFIGURATIONS);
    }
}

export { BlockCustomizer as BaseBlockCustomizer };
export type { BlockCustomizationConfig, BlockStyle } from './types';