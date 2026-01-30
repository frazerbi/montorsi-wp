console.log('DEBUG: Professional block index.ts caricato');

// Cambia questo import
// import { registerBlockType } from '@wordpress/blocks';
// Con questo:
const { registerBlockType } = wp.blocks;

import Edit from './edit';
import Save from './save';
import metadata from './block.json';

// Definisci i tipi per il metadata
interface BlockMetadata {
    name: string;
    [key: string]: any;
}

console.log('DEBUG: Metadata caricato:', metadata);

// Attendi che WordPress sia pronto
if (typeof wp !== 'undefined' && wp.domReady) {
    wp.domReady(() => {
        console.log('DEBUG: wp.domReady chiamato');
        console.log('DEBUG: registerBlockType disponibile:', typeof registerBlockType);
        
        try {
            const result = registerBlockType((metadata as BlockMetadata).name, {
                ...(metadata as any),
                edit: Edit,
                save: Save,
            });
            
            console.log('DEBUG: Risultato registerBlockType:', result);
            console.log('✅ Professional Block registrato:', metadata.name);
            
        } catch (error) {
            console.error('❌ Errore registrazione blocco:', error);
        }
    });
} else {
    console.error('Professional Block: WordPress APIs not available');
}