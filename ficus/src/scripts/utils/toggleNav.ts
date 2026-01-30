interface ToggleNavConfig {
  toggleSelector?: string;
  navSelector?: string;
  animationDuration?: number;
}

interface ToggleNavElements {
  toggle: HTMLElement;
  nav: HTMLElement;
}

/**
 * Inizializza il toggle per la navigazione mobile
 * @param config - Configurazione opzionale per selettori e durata animazione
 */
export const initToggleNav = (config: ToggleNavConfig = {}): void => {
  const {
    toggleSelector = '.siteheader-toggle',
    navSelector = '.siteheader-nav',
    animationDuration = 350
  } = config;

  const elements = getElements(toggleSelector, navSelector);
  if (!elements) return;

  const { toggle, nav } = elements;
  
  // Rimuovi eventuali listener precedenti per evitare duplicati
  toggle.removeEventListener('click', handleToggleClick);
  
  // Crea la funzione handler con closure per accedere ai parametri
  function handleToggleClick(e: Event): void {
    e.preventDefault();
    const isExpanded = toggle.getAttribute("aria-expanded") === "true";
    
    if (isExpanded) {
      closeNav(toggle, nav, animationDuration);
    } else {
      openNav(toggle, nav);
    }
  }
  
  toggle.addEventListener('click', handleToggleClick);
};

/**
 * Ottieni gli elementi DOM necessari
 */
function getElements(toggleSelector: string, navSelector: string): ToggleNavElements | null {
  const toggle = document.querySelector(toggleSelector) as HTMLElement;
  const nav = document.querySelector(navSelector) as HTMLElement;
  
  if (!toggle || !nav) {
    console.warn('ToggleNav: Elementi non trovati nel DOM', {
      toggle: !!toggle,
      nav: !!nav
    });
    return null;
  }
  
  return { toggle, nav };
}

/**
 * Apri la navigazione mobile
 */
function openNav(toggle: HTMLElement, nav: HTMLElement): void {
  nav.style.display = "flex";
  setTimeout(() => {
    toggle.setAttribute("aria-expanded", "true");
  }, 100);
  
  // Previeni scroll del body
  document.body.style.overflow = "hidden";
  document.documentElement.style.overflow = "hidden";
}

/**
 * Chiudi la navigazione mobile
 */
function closeNav(toggle: HTMLElement, nav: HTMLElement, duration: number): void {
  toggle.setAttribute("aria-expanded", "false");
  
  setTimeout(() => {
    nav.style.display = "none";
    // Ripristina scroll del body
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  }, duration);
}

/**
 * Utility per chiudere forzatamente la nav (es. al resize della finestra)
 */
export const forceCloseNav = (): void => {
  const toggle = document.querySelector('.siteheader-toggle') as HTMLElement;
  const nav = document.querySelector('.siteheader-nav') as HTMLElement;
  
  if (toggle && nav) {
    closeNav(toggle, nav, 0);
  }
};