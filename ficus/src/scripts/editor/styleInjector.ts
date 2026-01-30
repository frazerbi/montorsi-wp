/**
 * StyleInjector - Gestione intelligente CSS per editor WordPress
 * Auto-rileva modalità sviluppo/produzione e carica CSS appropriato
 */
export class StyleInjector {
    private isDevelopment: boolean;
    private cssUrl: string;

    constructor() {
        this.isDevelopment = this.isViteRunning();
        this.cssUrl = this.getCssUrl();
    }

    /**
     * Rileva se siamo in modalità sviluppo usando config da PHP
     */
    private isViteRunning(): boolean {
        // Usa configurazione passata da PHP
        // @ts-ignore
        if (typeof window.editorConfig !== 'undefined' && window.editorConfig.isDevelopment !== undefined) {
            // @ts-ignore
            return window.editorConfig.isDevelopment;
        }
        
        // Fallback: cerca script TypeScript nel DOM
        const moduleScript = document.querySelector('script[type="module"][src*=".ts"]');
        return moduleScript !== null;
    }

    /**
     * Ottiene URL corretto per il CSS
     */
    private getCssUrl(): string {
        if (this.isDevelopment) {
            const vitePort = this.getVitePort();
            return `http://localhost:${vitePort}/src/styles/editor.scss`;
        }
        return ''; // In produzione, CSS gestito da WordPress
    }

    /**
     * Ottiene porta Vite dalla configurazione
     */
    private getVitePort(): number {
        // @ts-ignore
        if (typeof window.editorConfig !== 'undefined' && window.editorConfig.vitePort) {
            // @ts-ignore
            return parseInt(window.editorConfig.vitePort);
        }
        
        // Fallback da script esistenti
        const viteScript = document.querySelector('script[src*="localhost:"]');
        if (viteScript) {
            const match = viteScript.getAttribute('src')?.match(/localhost:(\d+)/);
            if (match) {
                return parseInt(match[1]);
            }
        }
        
        return 5173; // Porta predefinita
    }

    /**
     * Inietta CSS in iframe specifico
     */
    private injectIntoFrame(frame: HTMLIFrameElement, index: number): boolean {
        try {
            if (!frame.contentDocument?.head) return false;
            
            const styleId = 'vite-editor-styles-' + index;
            
            // Evita duplicati
            if (frame.contentDocument.getElementById(styleId)) {
                return true;
            }
            
            // In produzione, assume CSS già presente
            if (!this.isDevelopment) {
                return true;
            }
            
            // In sviluppo, carica da Vite
            if (this.cssUrl) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = this.cssUrl;
                link.id = styleId;
                
                frame.contentDocument.head.appendChild(link);
            }
            
            return true;
        } catch (e) {
            console.error('StyleInjector: Errore iniezione CSS:', e);
            return false;
        }
    }

    /**
     * Inietta stili in tutti gli iframe dell'editor
     */
    public injectStyles(): boolean {
        // In produzione, non fare nulla (CSS gestito da WP)
        if (!this.isDevelopment) {
            return true;
        }
        
        const frames = document.querySelectorAll('iframe');
        let success = false;
        
        // Inietta in tutti gli iframe
        frames.forEach((frame, index) => {
            if (this.injectIntoFrame(frame as HTMLIFrameElement, index)) {
                success = true;
            }
        });
        
        // Cerca specificamente l'iframe dell'editor
        const editorFrame = document.querySelector('iframe[name="editor-canvas"]');
        if (editorFrame) {
            if (this.injectIntoFrame(editorFrame as HTMLIFrameElement, 999)) {
                success = true;
            }
        }
        
        return success;
    }

    /**
     * Ricarica stili (utile per debug)
     */
    public reloadStyles(): void {
        const frames = document.querySelectorAll('iframe');
        frames.forEach((frame, index) => {
            const styleId = 'vite-editor-styles-' + index;
            const existingStyle = frame.contentDocument?.getElementById(styleId);
            if (existingStyle) {
                existingStyle.remove();
            }
        });
        
        this.injectStyles();
    }
}