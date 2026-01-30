import '../styles/editor.scss'
import BlockCustomizer from './editor/blockCustomizer/index';
import { StyleInjector } from './editor/styleInjector';
import { ThemeConfig } from './utils/themeConfig';

//console.log('🚀 Editor Customizer caricato! Ora testiamo StyleInjector...');

/**
 * Classe principale per la gestione dell'editor
 */
class EditorManager {
    private config: ThemeConfig;
    private styleInjector: StyleInjector;
    private blockCustomizer: BlockCustomizer;
    private observer: MutationObserver;
    private isInitialized = false;
    private svgSpriteHandler: SvgSpriteHandler | null = null;

    constructor(config: ThemeConfig) {
        //console.log('EditorManager: Inizializzazione...');
        this.config = config;
        this.styleInjector = new StyleInjector();
        this.observer = new MutationObserver(this.handleDomMutations.bind(this));
    }

    /**
     * Inizializza tutti i componenti e gli event listeners
     */
    init(): void {
        if (this.isInitialized) {
            //console.log('EditorManager: Già inizializzato');
            return;
        }
        
        //console.log('EditorManager: Inizializzazione componenti...');
        
        this.blockCustomizer = new BlockCustomizer();
        this.initStyleInjection();
        this.initEventListeners();
        this.isInitialized = true;
        
        //console.log('✅ EditorManager inizializzato con successo');
    }

    /**
     * Configura l'iniezione di stili ottimizzata
     */
    private initStyleInjection(): void {
        //console.log('EditorManager: Inizializzazione style injection...');
        
        // Prima iniezione immediata
        this.styleInjector.injectStyles();
        
        // Avvia il monitoraggio automatico del StyleInjector
        //this.styleInjector.startMonitoring();
        
    }
  

    /**
     * Inizializza tutti gli event listeners
     */
    private initEventListeners(): void {
        //console.log('EditorManager: Setup event listeners...');
        
        // DOM ready listener
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                //console.log('EditorManager: DOMContentLoaded');
                this.setupMutationObserver();
            });
        } else {
            this.setupMutationObserver();
        }

        // Window load listener
        window.addEventListener('load', () => {
            //console.log('EditorManager: Window loaded');
            setTimeout(() => {
                this.styleInjector.injectStyles();
            }, 500);
        });

        // Listener per quando l'editor è pronto
        this.setupEditorReadyListener();
    }

    /**
     * Ascolta quando l'editor di blocchi è completamente caricato
     */
    private setupEditorReadyListener(): void {
        // Usa l'API di WordPress se disponibile
        if (typeof wp !== 'undefined' && wp.data && wp.data.subscribe) {
            //console.log('EditorManager: Setup WP data subscriber...');
            
            const unsubscribe = wp.data.subscribe(() => {
                const isEditorReady = wp.data.select('core/editor')?.isCleanNewPost !== undefined ||
                                    wp.data.select('core/block-editor')?.getBlocks !== undefined;
                
                if (isEditorReady) {
                    //console.log('✅ Editor WordPress pronto!');
                    setTimeout(() => {
                        this.styleInjector.injectStyles();
                    }, 100);
                    unsubscribe();
                }
            });
        } else {
            //console.log('⚠️ WP data API non disponibile');
        }
    }

    /**
     * Configura l'observer per le mutazioni del DOM
     */
    private setupMutationObserver(): void {
        //console.log('EditorManager: Setup MutationObserver...');
        
        this.observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false
        });
    }

    /**
     * Gestisce le mutazioni del DOM
     */
    private handleDomMutations(mutations: MutationRecord[]): void {
        let hasNewIframes = false;
        
        for (const mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const element = node as Element;
                        if (element.tagName === 'IFRAME' || element.querySelector('iframe')) {
                            hasNewIframes = true;
                            break;
                        }
                    }
                }
                if (hasNewIframes) break;
            }
        }
        
        if (hasNewIframes) {
            setTimeout(() => {
                this.styleInjector.injectStyles();
            }, 100);
        }
    }

    /**
     * Cleanup quando necessario
     */
    destroy(): void {
        if (this.observer) {
            this.observer.disconnect();
        }
        this.isInitialized = false;
    }
}

// Configurazione del tema
const config: ThemeConfig = {
    breakpoints: {
        mobile: 375,
        tablet: 768,
        desktop: 1024
    }
};

// Inizializzazione
const editorManager = new EditorManager(config);

// Avvia quando il DOM è pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => editorManager.init());
} else {
    editorManager.init();
}

// Export for use in other modules
export default config;