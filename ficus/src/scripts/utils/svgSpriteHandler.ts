// SvgSpriteHandler.ts
// Gestore completo delle sprite SVG con importazione automatica

interface IconsMap {
	[key: string]: string;
  }
  
  class SvgSpriteHandler {
	private svgSprite: string | null = null;
	private svgSpriteElement: HTMLDivElement | null = null;
	private icons: IconsMap = {};
	
	constructor() {
	  // Importa automaticamente tutti i file SVG
	  this.importAllSvgIcons();
	}
	
	/**
	 * Importa automaticamente tutti i file SVG dalla directory icons
	 */
	private importAllSvgIcons(): void {
	  // Vite offre un metodo globale per importare più file
	  // https://vitejs.dev/guide/features.html#glob-import
	  const svgModules = import.meta.glob('@/icons/*.svg', { eager: true });
	  
	  // Elabora ogni modulo importato
	  for (const path in svgModules) {
		// Estrai il nome del file dal percorso (senza estensione)
		const fileName = path.split('/').pop()?.replace('.svg', '') || '';
		
		// Usa il contenuto SVG dal modulo
		const svgContent = svgModules[path].default;
		
		// Aggiungi alla mappa delle icone con prefisso 'icon-'
		this.icons[`icon-${fileName}`] = svgContent;
	  }
	}
	
	/**
	 * Inizializza e inietta la sprite SVG nel DOM
	 */
	public init(): void {
	  // Verifica se ci sono icone da processare
	  if (Object.keys(this.icons).length === 0) {
		console.warn('Nessuna icona SVG trovata nella directory');
		return;
	  }
	  
	  // Crea un div nascosto per contenere le icone
	  this.svgSpriteElement = document.createElement('div');
	  this.svgSpriteElement.id = 'svg-icons';
	  this.svgSpriteElement.style.display = 'none';
	  
	  // Componi l'HTML della sprite e le variabili CSS
	  let spriteHtml = '';
	  let cssVars = ':root {\n';
	  
	  // Processa ogni icona
	  for (const [id, svg] of Object.entries(this.icons)) {
		// Estrai il viewBox dall'SVG
		const viewBoxMatch = svg.match(/viewBox="([^"]+)"/);
		const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 24 24';
		
		// Estrai il contenuto interno dell'SVG
		const contentMatch = svg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
		const content = contentMatch ? contentMatch[1] : '';
		
		// Crea variabile CSS
		cssVars += `--${id}: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='${viewBox}'%3E${encodeURIComponent(content)}%3C/svg%3E");\n`;
		
		// Aggiungi come simbolo nella sprite
		spriteHtml += svg.replace('<svg', `<symbol id="${id}"`).replace('</svg>', '</symbol>');
	  }
	  
	  cssVars += '}';
	  
	  // Avvolgi tutti i simboli in un tag SVG
	  this.svgSprite = `<svg xmlns="http://www.w3.org/2000/svg" style="display: none">${spriteHtml}</svg>`;
	  
	  // Inietta nel DOM
	  if (this.svgSpriteElement) {
		this.svgSpriteElement.innerHTML = this.svgSprite;
		document.body.prepend(this.svgSpriteElement);
	  }
	  
	  // Aggiungi le variabili CSS
	  const styleElement = document.createElement('style');
	  styleElement.innerHTML = cssVars;
	  document.head.appendChild(styleElement);
	  
	  // Esponi helper globale
	  this.exposeGlobalHelper();
	  
	  console.log(`SvgSpriteHandler: ${Object.keys(this.icons).length} icone caricate con successo`);
	}
	
	/**
	 * Carica la sprite SVG da un file esterno
	 * @param url URL del file sprite SVG
	 * @returns Promise che risolve quando la sprite è stata caricata
	 */
	public async loadSpriteFromUrl(url: string): Promise<void> {
	  try {
		const response = await fetch(url);
		this.svgSprite = await response.text();
		
		// Crea l'elemento se non esiste
		if (!this.svgSpriteElement) {
		  this.svgSpriteElement = document.createElement('div');
		  this.svgSpriteElement.id = 'svg-icons';
		  this.svgSpriteElement.style.display = 'none';
		}
		
		// Inietta nel DOM
		this.svgSpriteElement.innerHTML = this.svgSprite;
		document.body.prepend(this.svgSpriteElement);
		
		// Estrai i simboli e crea variabili CSS
		this.createCssVariablesFromSprite();
		
		console.log(`SvgSpriteHandler: Sprite caricata da ${url}`);
	  } catch (error) {
		console.error('Errore nel caricamento della sprite SVG:', error);
	  }
	}
	
	/**
	 * Crea variabili CSS dai simboli nella sprite
	 */
	private createCssVariablesFromSprite(): void {
	  if (!this.svgSpriteElement) return;
	  
	  const symbols = this.svgSpriteElement.querySelectorAll('symbol');
	  let cssVars = ':root {\n';
	  
	  symbols.forEach(symbol => {
		const id = symbol.id;
		const viewBox = symbol.getAttribute('viewBox') || '0 0 24 24';
		const content = symbol.innerHTML;
		
		cssVars += `--${id}: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='${viewBox}'%3E${encodeURIComponent(content)}%3C/svg%3E");\n`;
	  });
	  
	  cssVars += '}';
	  
	  const styleElement = document.createElement('style');
	  styleElement.innerHTML = cssVars;
	  document.head.appendChild(styleElement);
	}
	
	/**
	 * Espone una funzione helper nell'oggetto window
	 */
	private exposeGlobalHelper(): void {
	  if (typeof window !== 'undefined') {
		(window as any).svgIcon = (iconName: string, className: string = ''): string => {
		  return `<svg class="icon ${className}"><use xlink:href="#icon-${iconName}"></use></svg>`;
		};
	  }
	}
	
	/**
	 * Crea HTML per un'icona SVG
	 * @param iconName Nome dell'icona senza il prefisso 'icon-'
	 * @param className Classi CSS aggiuntive
	 * @returns HTML per l'icona SVG
	 */
	public getIcon(iconName: string, className: string = ''): string {
	  return `<svg class="icon ${className}"><use xlink:href="#icon-${iconName}"></use></svg>`;
	}
	
	/**
	 * Restituisce un elenco di tutte le icone disponibili
	 * @returns Array di nomi di icone (senza il prefisso 'icon-')
	 */
	public getAvailableIcons(): string[] {
	  return Object.keys(this.icons).map(id => id.replace('icon-', ''));
	}
  }
  
  export default SvgSpriteHandler;