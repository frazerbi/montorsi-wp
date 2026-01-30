<?php
namespace Ficus;

use Twig\Loader\FilesystemLoader;
use Twig\Environment;

class Template {
    private static $twig = null;
    private static $context = [];

    /**
     * Bootstrap della classe
     */
    public static function boot() {
        // Inizializza al momento giusto nel ciclo di vita di WordPress
        add_action('after_setup_theme', [self::class, 'init']);
        add_filter('template_include', [self::class, 'renderTemplate']);
    }

    /**
     * Inizializza Twig
     */
    public static function init() {
        $loader = new FilesystemLoader([
            get_template_directory() . '/templates'
        ]);

        self::$twig = new Environment($loader, [
            //'cache' => WP_DEBUG ? false : get_template_directory() . '/cache/twig',
            'cache' => false,
            'auto_reload' => true,
            'debug' => WP_DEBUG,
        ]);

        self::addWpFunctions();
        self::addCustomFunctions();
    }

    private static function addWpFunctions() {
        $wp_functions = [
            'wp_head',
            'wp_footer',
            'body_class',
            'get_search_form',
            'get_sidebar',
            'get_header',
            'get_footer',
            'wp_title',
            'wp_nav_menu',
            'is_user_logged_in',
        ];

        foreach ($wp_functions as $function) {
            self::$twig->addFunction(
                new \Twig\TwigFunction($function, $function)
            );
        }

        // Aggiungi funzioni di traduzione
        $translation_functions = [
            '__',
            '_e',
            '_n',
            '_x',
            'esc_html__',
            'esc_html_e',
            'esc_attr__',
            'esc_attr_e'
        ];

        foreach ($translation_functions as $function) {
            self::$twig->addFunction(
                new \Twig\TwigFunction($function, function() use ($function) {
                    return call_user_func_array($function, func_get_args());
                })
            );
        }
         // Aggiungi anche la funzione translate come alias di __
        self::$twig->addFunction(
            new \Twig\TwigFunction('translate', function($text, $domain = 'default') {
                return __($text, $domain);
            })
        );

        // Aggiungi funzioni per i widget
        self::$twig->addFunction(
            new \Twig\TwigFunction('dynamic_sidebar', function($id) {
                ob_start();
                dynamic_sidebar($id);
                $widgets = ob_get_clean();
                return $widgets;
            }, ['is_safe' => ['html']])
        );

        self::$twig->addFunction(
            new \Twig\TwigFunction('is_active_sidebar', 'is_active_sidebar')
        );
    }

    private static function addCustomFunctions() {
        // Funzione per gli asset di Vite
        self::$twig->addFunction(
            new \Twig\TwigFunction('vite_asset', [ViteWP::class, 'assetUrl'])
        );

        // Funzione per il menu
        self::$twig->addFunction(
            new \Twig\TwigFunction('menu', function($location) {
                return wp_nav_menu([
                    'theme_location' => $location,
                    'echo' => false
                ]);
            }, ['is_safe' => ['html']])
        );
    }

    /**
     * Prepara il context base per tutti i template
     */
    private static function prepareContext() {
        global $post;
        
        $custom_logo_id = get_theme_mod('custom_logo');
        
        self::$context = [
            'site' => [
                'title' => get_bloginfo('name'),
                'description' => get_bloginfo('description'),
                'url' => home_url(),
                'theme_uri' => get_template_directory_uri(),
                'language_attributes' => get_language_attributes(),
                'charset' => get_bloginfo('charset'),
                'logo' => [
                    'id' => $custom_logo_id,
                    'url' => $custom_logo_id ? wp_get_attachment_image_url($custom_logo_id, 'full') : false,
                    'svg' => file_get_contents(get_template_directory() . '/assets/img/logo.svg'),
                    'alt' => get_bloginfo('name'),
                ]
            ],
            'is' => [
                'splash' => false, //!is_user_logged_in(), // RIATTIVA LA CACHE, l29, a fine sviluppo! e riattiva anche la cache dinamica di aruba
                'home' => is_home(),
                'front_page' => is_front_page(),
                'single' => is_single(),
                'archive' => is_archive(),
                'search' => is_search(),
                '404' => is_404(),
            ],
            'wp_classes' => get_body_class(),
            'sidebar' => [
                'footer_primary' => is_active_sidebar('footer-primary') ? 
                    self::$twig->getFunction('dynamic_sidebar')->getCallable()('footer-primary') : '',
                'footer_secondary' => is_active_sidebar('footer-secondary') ? 
                    self::$twig->getFunction('dynamic_sidebar')->getCallable()('footer-secondary') : '',
                'footer_credits' => is_active_sidebar('footer-credits') ? 
                    self::$twig->getFunction('dynamic_sidebar')->getCallable()('footer-credits') : '',
            ],
            'theme' => [
                'uri' => get_template_directory_uri(),
                'path' => get_template_directory(),
            ],
        ];

        // Gestione pagina statica front-page
        if (is_front_page()) {
            $front_page_id = get_option('page_on_front');
            $page = get_post($front_page_id);
            
            self::$context['page'] = [
                'title' => get_the_title($page),
                'content' => apply_filters('the_content', $page->post_content),
                'thumbnail' => get_the_post_thumbnail_url($page),
                'id' => $page->ID,
            ];
        }

        // Gestione post singolo o pagina
        if (is_singular()) {
            self::$context['post'] = [
                'title' => get_the_title($post),
                'content' => apply_filters('the_content', $post->post_content),
                'thumbnail' => get_the_post_thumbnail_url($post),
                'id' => $post->ID,
            ];
        }

        // Aggiungi le traduzioni
        Translations::addToContext(self::$context);

        return apply_filters('theme_context', self::$context);
    }

    /**
     * Gestisce il rendering del template
     */
    public static function renderTemplate($template) {
        if (self::$twig === null) {
            self::init();
        }

        $context = self::prepareContext();

        // Determina il template Twig da usare
        $twig_template = self::determineTemplate();
        // add custom classes
        $context['wp_classes'][] = 'twig-template-' . str_replace('.twig', '', $twig_template);

        if (WP_DEBUG) {
            error_log('WordPress Template: ' . $template);
            error_log('Twig Template Selected: ' . $twig_template);
            error_log('Page ID: ' . get_the_ID());
            error_log('Is Front Page: ' . (is_front_page() ? 'true' : 'false'));
            error_log('Context: ' . print_r(array_keys($context), true));
        }

        $context['breadcrumbs'] = get_breadcrumbs();

        echo self::$twig->render($twig_template, $context);
        return false; // Ferma l'elaborazione del template WordPress
    }

    /**
     * Determina quale template Twig utilizzare
     */
    private static function determineTemplate(): string {
        if (self::$context['is']['splash']) {
            return 'splash.twig';
        } else {
            if (is_404()) {
                return '404.twig';
            }
            if (is_search()) {
                return 'search.twig';
            }
            if (is_front_page()) {
                return 'front-page.twig';
            }
            if (is_home()) {
                return 'home.twig';
            }
            if (is_single()) {
                return 'single.twig';
            }
            if (is_page()) {
                return 'page.twig';
            }
            if (is_archive()) {
                return 'archive.twig';
            }
        }

        return 'index.twig';
    }
}

// Inizializza la classe
Template::boot();