const { registerBlockType } = wp.blocks;

import Edit from './edit';
import Save from './save';
import metadata from './block.json';

interface BlockMetadata {
    name: string;
    [key: string]: any;
}

if (typeof wp !== 'undefined' && wp.domReady) {
    wp.domReady(() => {
        try {
            registerBlockType((metadata as BlockMetadata).name, {
                ...(metadata as any),
                edit: Edit,
                save: Save,
            });
            console.log('✅ Reviews Carousel registrato:', metadata.name);
        } catch (error) {
            console.error('❌ Errore registrazione Reviews Carousel:', error);
        }
    });
}