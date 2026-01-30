<?php
namespace Ficus;

/**
 * Disabilita completamente i commenti nel sito
 */
class DisableComments {
    
    /**
     * Inizializza la classe
     */
    public static function init() {
        // Chiudi i commenti
        add_filter('comments_open', '__return_false', 20, 2);
        add_filter('pings_open', '__return_false', 20, 2);
        
        // Nascondi i commenti esistenti
        add_filter('comments_array', '__return_empty_array', 10, 2);
        
        // Hooks per l'admin
        add_action('admin_menu', [self::class, 'removeAdminMenu']);
        add_action('admin_bar_menu', [self::class, 'removeAdminBar'], 999);
        add_action('admin_init', [self::class, 'removeMetaboxes']);
        add_action('admin_init', [self::class, 'redirectCommentsPage']);
        
        // Rimuovi supporto commenti
        add_action('init', [self::class, 'removePostTypeSupport']);
        
        // Rimuovi widget
        add_action('widgets_init', [self::class, 'removeWidget'], 1);
        
        // Rimuovi stili
        add_action('wp_enqueue_scripts', [self::class, 'removeStyles'], 100);
    }
    
    /**
     * Rimuove la pagina commenti dal menu admin
     */
    public static function removeAdminMenu() {
        remove_menu_page('edit-comments.php');
    }
    
    /**
     * Rimuove i commenti dalla admin bar
     */
    public static function removeAdminBar($wp_admin_bar) {
        $wp_admin_bar->remove_menu('comments');
    }
    
    /**
     * Rimuove le metabox dei commenti dall'editor
     */
    public static function removeMetaboxes() {
        $post_types = get_post_types();
        foreach ($post_types as $post_type) {
            remove_meta_box('commentstatusdiv', $post_type, 'normal');
            remove_meta_box('commentsdiv', $post_type, 'normal');
            remove_meta_box('trackbacksdiv', $post_type, 'normal');
        }
    }
    
    /**
     * Reindirizza dalla pagina commenti
     */
    public static function redirectCommentsPage() {
        global $pagenow;
        if ($pagenow === 'edit-comments.php') {
            wp_redirect(admin_url());
            exit;
        }
    }
    
    /**
     * Rimuove il supporto per i commenti da tutti i post types
     */
    public static function removePostTypeSupport() {
        $post_types = get_post_types();
        foreach ($post_types as $post_type) {
            if (post_type_supports($post_type, 'comments')) {
                remove_post_type_support($post_type, 'comments');
                remove_post_type_support($post_type, 'trackbacks');
            }
        }
    }
    
    /**
     * Rimuove il widget commenti
     */
    public static function removeWidget() {
        unregister_widget('WP_Widget_Recent_Comments');
    }
    
    /**
     * Rimuove gli stili dei commenti
     */
    public static function removeStyles() {
        wp_dequeue_style('wp-block-library-theme');
    }
}

// Inizializza
DisableComments::init();