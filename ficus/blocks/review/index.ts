const { registerBlockType } = wp.blocks;

import Edit from './edit';
import Save from './save';
import metadataRaw from './block.json?raw';
const metadata = JSON.parse(metadataRaw);

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
            console.log('✅ Review Block registrato:', metadata.name);
        } catch (error) {
            console.error('❌ Errore registrazione Review:', error);
        }
    });
}