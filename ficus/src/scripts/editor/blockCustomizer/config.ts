import type { BlockCustomizationConfig } from './types';

/* Per un elenco completo dei blocchi */
/* 
console.table(
    wp.blocks.getBlockTypes().map(block => ({
        name: block.name,
        title: block.title,
        category: block.category
    }))
);
*/

// Funzioni di verifica predefinite
export const BLOCK_READY_CHECKS = {
    'core/button': () => {
        const styles = wp.data?.select('core/blocks')?.getBlockStyles('core/button');
        return !!(styles && styles.length > 0);
    },
    'core/image': () => {
        const styles = wp.data?.select('core/blocks')?.getBlockStyles('core/image');
        return !!(styles && styles.length > 0);
    },
    'core/gallery': () => {
        return !!(wp.blocks && wp.data?.select('core/blocks'));
    },
    'core/columns': () => {
        return !!(wp.blocks && wp.data?.select('core/blocks') && wp.blocks.getBlockVariations);
    },
    'core/groups': () => {
        return !!(wp.blocks && wp.data?.select('core/blocks'));
    },
    'core/list': () => {
        return !!(wp.blocks && wp.data?.select('core/blocks'));
    },
    'core/heading': () => {
        return !!(wp.blocks && wp.data?.select('core/blocks'));
    },
    'default': () => {
        return !!(wp.blocks && wp.data?.select('core/blocks'));
    }
};

export const BLOCK_CONFIGURATIONS: BlockCustomizationConfig[] = [
    // Bottoni
    {
        blockName: 'core/button',
        stylesToRemove: ['fill', 'outline'],
        stylesToAdd: [
            { name: 'fill', label: 'Fill', isDefault: true },
            { name: 'outline', label: 'Outline' },
            { name: 'arrowed', label: 'Arrowed' },
        ],
        debug: true,
        isReady: BLOCK_READY_CHECKS['core/button']
    },
    // Gruppi
    {
        blockName: 'core/group',
        stylesToAdd: [
            { name: 'default', label: 'Default', isDefault: true },
            { name: 'mid_blue', label: 'Azzurro scuro' },
            { name: 'light_blue', label: 'Azzurro chiaro' },
            { name: 'outlined_gray', label: 'Grigio bordato' },
        ],
        debug: true,
        isReady: BLOCK_READY_CHECKS['core/button']
    },
    // Colonne
    {
        blockName: 'core/columns',
        variationsToRemove: [
            'one-column-full',
            'two-columns-one-third-two-thirds',
            'two-columns-two-thirds-one-third',
            'three-columns-wider-center'
        ],
        stylesToAdd: [
            { name: 'base', label: 'Base', isDefault: true },
            { name: 'sidebar', label: 'Sidebar Sinistra (2 + 5)' },
        ],
        debug: true,
        isReady: BLOCK_READY_CHECKS['core/columns'],
        afterCustomize: async function() {
            // Hook tardivo per le colonne
            setTimeout(() => {
                this.variationsToRemove?.forEach(variationName => {
                    try {
                        wp.blocks.unregisterBlockVariation('core/columns', variationName);
                        console.log(`🔄 Rimossa variazione (delayed): ${variationName}`);
                    } catch (e) {
                        console.log(`ℹ️ Non rimossa (delayed) ${variationName}:`, e);
                    }
                });
            }, 100);
        }
    },

    // Immagini
    {
        blockName: 'core/image',
        stylesToRemove: ['rounded'],
        stylesToAdd: [
            { name: 'default', label: 'Default', isDefault: true }
        ],
        debug: true,
        isReady: BLOCK_READY_CHECKS['core/image']
    },

    // Gallery
    {
        blockName: 'core/gallery',
        stylesToAdd: [
            { name: 'grid', label: 'Grid Layout', isDefault: true },
            { name: 'h_carousel', label: 'Horizontal ratio Carousel' },
            { name: 'h_carousel_nodots', label: 'Horizontal ratio Carousel - only arrows' },
            { name: 'v_carousel', label: 'Vertical ratio Carousel' },
            { name: 'v_carousel_nodots', label: 'Vertical ratio Carousel - only arrows' },
        ],
        debug: true,
        isReady: BLOCK_READY_CHECKS['core/gallery']
    },
    // list
    {
        blockName: 'core/list',
        stylesToAdd: [
            { name: 'default', label: 'Default', isDefault: true },
            { name: 'square', label: 'Square' },
        ],
        debug: true,
        isReady: BLOCK_READY_CHECKS['core/list']
    },
    {
    blockName: 'core/heading',
        stylesToAdd: [
            { name: 'default', label: 'Default', isDefault: true },
            { name: 'squared', label: 'Squared' }
        ],
        debug: true,
        isReady: BLOCK_READY_CHECKS['default']
    }
];