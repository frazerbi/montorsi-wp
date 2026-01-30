console.log('DEBUG: Professionals Grid index.ts caricato');

// Usa le API globali di WordPress
const { registerBlockType } = wp.blocks;

import Edit from './edit';
import Save from './save';
import metadata from './block.json';

// Definisci i tipi per il metadata
interface BlockMetadata {
    name: string;
    [key: string]: any;
}

console.log('DEBUG: Grid metadata caricato:', metadata);

// Attendi che WordPress sia pronto
if (typeof wp !== 'undefined' && wp.domReady) {
    wp.domReady(() => {
        console.log('DEBUG: Grid wp.domReady chiamato');
        
        try {
            const result = registerBlockType((metadata as BlockMetadata).name, {
                ...(metadata as any),
                edit: Edit,
                save: Save,
            });
            
            console.log('DEBUG: Grid risultato registerBlockType:', result);
            console.log('✅ Professionals Grid registrato:', metadata.name);
            
        } catch (error) {
            console.error('❌ Errore registrazione Grid:', error);
        }
    });
} else {
    console.error('Professionals Grid: WordPress APIs not available');
}