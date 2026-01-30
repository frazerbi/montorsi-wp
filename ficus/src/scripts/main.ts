import '../styles/main.scss';
import SvgSpriteHandler from './utils/svgSpriteHandler';
import CarouselManager from './components/carouselManager';
import scrollHelper from './utils/scrollHelper';
import { initToggleNav } from './utils/toggleNav';
import {counterHandler} from './utils/counterHandler';
import {defaultThemeConfig} from './utils/themeConfig';
import HeroAnimator from './components/heroAnimator';


/**
 * Configurazione e stato dell'applicazione
 */
const AppState = {
  initialized: false,
  svgHandler: null as SvgSpriteHandler | null,
  config: defaultThemeConfig
};

/**
 * Inizializza tutti i componenti dell'app
 */
async function initializeComponents(): Promise<void> {
  if (AppState.initialized) return;

  try {
    AppState.svgHandler = new SvgSpriteHandler();
    AppState.svgHandler.init();

    scrollHelper.directionHandler();
    window.addEventListener('scroll', () => {
      scrollHelper.directionHandler();
  }, {passive: true});
    
    // Inizializza navigazione mobile
    initToggleNav();
    counterHandler();

    //
    const heroAnimator = new HeroAnimator();
    heroAnimator.init();



    // Inizializza i carousel
    const wp_carousel_horizontal = new CarouselManager('.is-style-h_carousel', {
      slidesPerView: 'auto',
      autoHeight: true,
    });
    const wp_carousel_horizontal_nodots = new CarouselManager('.is-style-h_carousel_nodots', {
      slidesPerView: 'auto',
      autoHeight: true,
      pagination: false,
    });

    const wp_carousel_vertical = new CarouselManager('.is-style-v_carousel', {
      slidesPerView: 1.2,
      breakpoints: {
        '@0.8': {
          slidesPerView: 1.8
        },
        '@1.2': {
          slidesPerView: 1.6
        },
        '@1.4': {
          slidesPerView: 1.8
        },
        '@1.6': {
          slidesPerView: 2.2
        }
      }
    });
    const wp_carousel_vertical_nodots = new CarouselManager('.is-style-v_carousel_nodots', {
      slidesPerView: 1.2,
      pagination: false,
      breakpoints: {
        '@0.8': {
          slidesPerView: 1.8
        },
        '@1.2': {
          slidesPerView: 1.6
        },
        '@1.4': {
          slidesPerView: 1.8
        },
        '@1.6': {
          slidesPerView: 2.2
        }
      }
    });
    wp_carousel_horizontal.init();
    wp_carousel_horizontal_nodots.init();
    wp_carousel_vertical.init();
    wp_carousel_vertical_nodots.init();
    
    AppState.initialized = true;
    console.log('✅ App inizializzata');
  } catch (error) {
    console.error('❌ Errore inizializzazione:', error);
    throw error;
  }
}

document.addEventListener('DOMContentLoaded', initializeComponents);

export { defaultThemeConfig as themeConfig };