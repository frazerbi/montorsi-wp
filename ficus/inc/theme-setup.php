<?php
namespace Ficus;
require_once __DIR__ . '/menu-walker.php';

/**
 * Gestione del setup del tema
 */
class ThemeSetup {
    /**
     * Inizializza la classe
     */
    public static function init() {
        // Hooks per il setup
        add_action('after_setup_theme', [self::class, 'setupThemeSupport']);
        add_action('init', [self::class, 'setupMenus']);
        add_action('after_setup_theme', [self::class, 'cleanHead']);
		add_action('widgets_init', [self::class, 'setupWidgets']);
        
        add_filter('wp_nav_menu_args', [self::class, 'modify_nav_menu_args']);
    }

    /**
     * Configura il supporto per le funzionalità di WordPress
     */
    public static function setupThemeSupport() {
        // Add default posts and comments RSS feed links to head
        add_theme_support('automatic-feed-links');

        // Let WordPress manage the document title
        add_theme_support('title-tag');

        // Enable support for Post Thumbnails
        add_theme_support('post-thumbnails');

        // Switch default core markup to output valid HTML5
        add_theme_support('html5', [
            'search-form',
            'comment-form',
            'comment-list',
            'gallery',
            'caption',
            'style',
            'script',
        ]);
        
        // Logo personalizzato
        add_theme_support('custom-logo', array(
            'height'      => 400,
            'width'       => 400,
            'flex-height' => true,
            'flex-width'  => true,
        ));
    }

    /**
     * Registra i menu del tema
     */
    public static function setupMenus() {
        register_nav_menus(
            array(
                'header-menu' => __('Menu Header', 'ficus'),
                'footer-menu' => __('Menu Footer', 'ficus')
            )
        );
    }

    public static function modify_nav_menu_args($args) {
        if($args['theme_location'] == 'header-menu') {
            $args['container'] = false; // Rimuove il container div
            $args['walker'] = new CheckboxMenuWalker(); // Usa il custom walker
        }
        return $args;
    }

	/**
 * Registra le aree widget
 */
	public static function setupWidgets() {
		register_sidebar([
			'name'          => __('Footer Primario', 'ficus'),
			'id'            => 'footer-primary',
			'description'   => __('Area widget principale del footer con logo e testo', 'ficus'),
			'before_widget' => '<div class="footer-widget">',
			'after_widget'  => '</div>',
			'before_title'  => '<h3 class="widget-title">',
			'after_title'   => '</h3>',
		]);

		register_sidebar([
			'name'          => __('Footer Secondario', 'ficus'),
			'id'            => 'footer-secondary',
			'description'   => __('Area widget secondaria del footer', 'ficus'),
			'before_widget' => '<div class="footer-widget">',
			'after_widget'  => '</div>',
			'before_title'  => '<h3 class="widget-title">',
			'after_title'   => '</h3>',
		]);

		register_sidebar([
			'name'          => __('Footer Credits', 'ficus'),
			'id'            => 'footer-credits',
			'description'   => __('Area widget per credits e riferimenti legali', 'ficus'),
			'before_widget' => '<div class="footer-widget">',
			'after_widget'  => '</div>',
			'before_title'  => '<h3 class="widget-title">',
			'after_title'   => '</h3>',
		]);
		}

    /**
     * Pulizia dell'header
     */
    public static function cleanHead() {
        // Remove emoji support
        remove_action('wp_head', 'print_emoji_detection_script', 7);
        remove_action('wp_print_styles', 'print_emoji_styles');
    
        // Remove WordPress version
        remove_action('wp_head', 'wp_generator');
    
        // Remove RSD link
        remove_action('wp_head', 'rsd_link');
    
        // Remove REST API links
        remove_action('wp_head', 'rest_output_link_wp_head');
    
        // Remove oEmbed
        remove_action('wp_head', 'wp_oembed_add_host_js');
    
        // Remove Gutenberg styles if not using blocks
        remove_action('wp_body_open', 'wp_global_styles_render_svg_filters');
    }
}

// Inizializza la classe
ThemeSetup::init();