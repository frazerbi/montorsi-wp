<?php
/**
 * Theme Functions
 * 
 * @package Ficus
 */
if (
    (defined('WP_ENV') && WP_ENV === 'development') ||
    (isset($_GET['err']) && $_GET['err'] === '1')
) {
    ini_set('display_errors', '1');
    ini_set('display_startup_errors', '1');
    error_reporting(E_ALL);

    if (!defined('WP_DEBUG')) {
        define('WP_DEBUG', true);
    }
    if (!defined('WP_DEBUG_DISPLAY')) {
        define('WP_DEBUG_DISPLAY', true);
    }
    if (!defined('WP_DEBUG_LOG')) {
        define('WP_DEBUG_LOG', true);
    }
}


if (!defined('WP_ENV')) {
    if (strpos($_SERVER['HTTP_HOST'], 'localhost') !== false || 
        strpos($_SERVER['HTTP_HOST'], '.local') !== false ||
        strpos($_SERVER['HTTP_HOST'], '.test') !== false) {
        define('WP_ENV', 'development');
    } else if (strpos($_SERVER['HTTP_HOST'], 'staging') !== false || 
               strpos($_SERVER['HTTP_HOST'], '.dev') !== false) {
        define('WP_ENV', 'staging');
    } else {
        define('WP_ENV', 'production');
    }
}

// Autoloader e configurazione base
require_once __DIR__ . '/vendor/autoload.php';

// Componenti del tema
// Inclusione dei componenti del tema
require_once __DIR__ . '/inc/translations.php';  // Gestione traduzioni
require_once __DIR__ . '/inc/custom-breadcrumbs.php';    // Gestione dei breadcrumbs
require_once __DIR__ . '/inc/templates.php';    // Gestione template Twig
require_once __DIR__ . '/inc/theme-setup.php';  // Setup del tema
require_once __DIR__ . '/inc/vite-integration.php';  // Integrazione con Vite
require_once __DIR__ . '/inc/shortcodes/index.php'; // Shortcodes del tema
require_once __DIR__ . '/inc/disable-comments.php'; // Disabilitazione commenti
require_once __DIR__ . '/blocks/index.php'; // custom wp blocks