import { Swiper } from 'swiper';
import { Navigation, Pagination, A11y, Keyboard } from 'swiper/modules';
import carouselHelper from '../utils/carouselHelper';

// Tipo per la configurazione Swiper
interface SwiperConfig {
    loop?: boolean;
    initialSlide?: number;
    slidesPerView?: number | 'auto';
    spaceBetween?: number;
    speed?: number;
    a11y?: any;
    keyboard?: any;
    navigation?: any;
    pagination?: any;
    modules?: any[];
    [key: string]: any;
}

/**
 * Carousel Manager - Versione semplificata per frontend
 */
class CarouselManager {
    selector: string;
    configs: SwiperConfig;
    initialized = new WeakSet<HTMLElement>();

    getDefaultConfigs(): SwiperConfig {
        return {
            loop: true,
            initialSlide: 0,
            slidesPerView: 1,
            spaceBetween: 4,
            speed: 300,
            
            // Moduli necessari
            modules: [Navigation, Pagination, A11y, Keyboard],
            
            // Accessibilità
            a11y: {
                enabled: true,
            },
            
            // Navigazione da tastiera
            keyboard: {
                enabled: true,
                onlyInViewport: true,
            },
            
            // Navigazione con frecce
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
                disabledClass: 'swiper-button-disabled',
            },
            
            // Paginazione
            pagination: {
                el: '.swiper-pagination',
                type: 'bullets',
                clickable: true,
                bulletElement: 'li',
                bulletClass: 'swiper-pagination-bullet',
                bulletActiveClass: 'swiper-pagination-bullet-active'
            }
        };
    }
    
    constructor(selector: string = '.is-style-h_carousel', configs: SwiperConfig = {}) {
        this.selector = selector;
        this.configs = configs;
    }
    
    /**
     * Inizializza tutti i carousel presenti nel DOM
     */
    init(): void {
        const carousels = document.querySelectorAll(this.selector);
        
        carousels.forEach(carousel => {
            if (carousel instanceof HTMLElement) {
                this.initializeCarousel(carousel);
            }
        });
    }
    
    /**
     * Inizializza un singolo carousel
     */
    initializeCarousel(carouselElement: HTMLElement): void {
        // Evita doppia inizializzazione
        if (this.initialized.has(carouselElement)) {
            return;
        }
        
        try {
            const finalConfigs = {
                ...this.getDefaultConfigs(),
                ...this.configs
            };

            carouselHelper.setMarkup({
                $el: carouselElement,
                hasArrows: !!finalConfigs.navigation,
                hasBullets: !!finalConfigs.pagination,
            });

            const swiperInstance = new Swiper(carouselElement, finalConfigs);
            
            // Marca come inizializzato
            this.initialized.add(carouselElement);
            
        } catch (error) {
            console.error('CarouselManager: Failed to initialize carousel', error);
        }
    }
    
    /**
     * Prepara il markup WordPress per essere compatibile con carouselHelper
     */
    prepareWordPressMarkup(carouselElement: HTMLElement): void {
        // Se non c'è già un wrapper intermedio, crealo
        if (!carouselElement.querySelector('.carousel-wrapper')) {
            const wrapper = document.createElement('div');
            wrapper.classList.add('carousel-wrapper');
            
            // Sposta tutte le figure nel wrapper
            const figures = Array.from(carouselElement.children);
            figures.forEach(figure => {
                wrapper.appendChild(figure);
            });
            
            // Inserisci il wrapper nel contenitore principale
            carouselElement.appendChild(wrapper);
        }
    }
}

export default CarouselManager;