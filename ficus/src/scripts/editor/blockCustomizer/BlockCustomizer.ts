import type { BlockCustomizationConfig, BlockStyle } from './types';
import { BLOCK_READY_CHECKS } from './config';

class DynamicBlockCustomizer {
    private retryCount = 0;
    private maxRetries = 5;
    private retryDelay = 200;
    private config: BlockCustomizationConfig;

    constructor(config: BlockCustomizationConfig) {
        this.config = config;
    }

    async init(): Promise<void> {
        await this.waitForBlocksReady();
        await this.customizeBlock();
    }

    private waitForBlocksReady(): Promise<void> {
        return new Promise((resolve) => {
            const checkBlocks = () => {
                const isReady = this.config.isReady || BLOCK_READY_CHECKS['default'];
                
                if (isReady()) {
                    // this.log('✅ Blocks are ready');
                    resolve();
                } else if (this.retryCount < this.maxRetries) {
                    this.retryCount++;
                    // this.log(`⏳ Waiting for blocks... (${this.retryCount}/${this.maxRetries})`);
                    setTimeout(checkBlocks, this.retryDelay);
                } else {
                    // this.log('⚠️ Blocks not ready after max retries');
                    resolve();
                }
            };
            checkBlocks();
        });
    }

    private async customizeBlock(): Promise<void> {
        if (typeof wp.blocks === 'undefined') {
            // this.log('❌ wp.blocks not available');
            return;
        }

        if (this.config.beforeCustomize) {
            await this.config.beforeCustomize();
        }

        this.debugCurrentStyles('BEFORE');
        this.debugCurrentVariations('BEFORE');
    
        this.removeExistingStyles();
        this.removeExistingVariations();
        
        await this.delay(50);
        
        this.registerNewStyles();
        
        await this.delay(100);
        this.debugCurrentStyles('AFTER');
        this.debugCurrentVariations('AFTER');

        if (this.config.afterCustomize) {
            await this.config.afterCustomize();
        }
    }

    private removeExistingStyles(): void {
        if (!this.config.stylesToRemove?.length) return;

        this.config.stylesToRemove.forEach(styleName => {
            try {
                wp.blocks.unregisterBlockStyle(this.config.blockName, styleName);
                // this.log(`✅ Removed: ${styleName}`);
            } catch (e) {
                // this.log(`ℹ️ Could not remove ${styleName}:`, e);
            }
        });
    }
    private removeExistingVariations(): void {
    if (!this.config.variationsToRemove?.length) return;

    this.config.variationsToRemove.forEach(variationName => {
        try {
            wp.blocks.unregisterBlockVariation(this.config.blockName, variationName);
            // this.log(`✅ Removed variation: ${variationName}`);
        } catch (e) {
            // this.log(`ℹ️ Could not remove variation ${variationName}:`, e);
        }
    });
}

    private registerNewStyles(): void {
        this.config.stylesToAdd.forEach(style => {
            try {
                wp.blocks.registerBlockStyle(this.config.blockName, style);
                // this.log(`✅ Registered: ${style.name}`);
            } catch (e) {
                // this.log(`❌ Failed to register ${style.name}:`, e);
            }
        });
    }

    private debugCurrentStyles(label: string): void {
        if (!this.config.debug) return;

        try {
            const styles = wp.data.select('core/blocks').getBlockStyles(this.config.blockName);
            // this.log(`${label} ${this.config.blockName} styles:`, styles?.map(s => s.name) || 'none');
        } catch (e) {
            // this.log(`Could not get ${this.config.blockName} styles:`, e);
        }
    }
    
    private debugCurrentVariations(label: string): void {
    if (!this.config.debug) return;

    try {
        const variations = wp.data.select('core/blocks').getBlockVariations(this.config.blockName);
        // this.log(`${label} ${this.config.blockName} variations:`, variations?.map(v => v.name) || 'none');
    } catch (e) {
        // this.log(`Could not get ${this.config.blockName} variations:`, e);
    }
}

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private log(...args: any[]): void {
        if (this.config.debug) {
            console.log(`[${this.config.blockName}]`, ...args);
        }
    }
}

export default class BlockCustomizer {
    private customizers: DynamicBlockCustomizer[] = [];

    constructor(configurations: BlockCustomizationConfig[]) {
        if (typeof wp !== 'undefined' && typeof wp.domReady !== 'undefined') {
            wp.domReady(() => {
                this.initializeCustomizers(configurations);
            });
        } else {
            console.warn('WordPress API not available');
        }
    }

    private async initializeCustomizers(configurations: BlockCustomizationConfig[]): Promise<void> {
        console.log('🚀 Initializing block customizers...');
        
        this.customizers = configurations.map(config => new DynamicBlockCustomizer(config));

        const initPromises = this.customizers.map(customizer => 
            customizer.init().catch(error => 
                console.error('Customizer initialization failed:', error)
            )
        );

        await Promise.all(initPromises);
        
        console.log('✅ All block customizers initialized');
    }
}