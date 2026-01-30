<?php
namespace Ficus;

/**
 * Gestisce l'integrazione con Vite per frontend e editor
 */
class ViteIntegration {
    private static $config;
    private static $is_vite_dev = null;

    public static function init() {
        $vite_port = getenv('VITE_PORT') ?: 5173;
        self::$config = [
            'dev_port' => $vite_port,
            'dev_url_browser' => 'http://localhost:' . $vite_port,
            'entries' => [
                'main' => 'src/scripts/main.ts',
                'editor' => 'src/scripts/editorCustomizer.ts',
                'professionalBlock'=> 'blocks/professional/index.ts',
                'professionalsGridBlock' => 'blocks/professionals-grid/index.ts',
            ]
        ];
    }

    /**
     * Rileva se Vite dev server è attivo (detection robusta)
     */
    private static function isViteDev(): bool {
        if (self::$is_vite_dev !== null) {
            return self::$is_vite_dev;
        }

        // Test connessione Vite
        $connection = @fsockopen("localhost", self::$config['dev_port'], $errno, $errstr, 0.5);
        if (is_resource($connection)) {
            fclose($connection);
            self::$is_vite_dev = true;
            return true;
        }

        // Fallback: se non c'è build e siamo in development, prova Vite
        if (!is_dir(get_template_directory() . '/dist') && 
            (defined('WP_ENV') && WP_ENV === 'development')) {
            self::$is_vite_dev = true;
            return true;
        }

        self::$is_vite_dev = false;
        return false;
    }

    /**
     * Ottiene il manifest di Vite
     */
    public static function getManifest(): array {
        static $manifest = null;
        if ($manifest === null) {
            $manifest_path = get_template_directory() . '/dist/manifest.json';
            $manifest = file_exists($manifest_path) 
                ? json_decode(file_get_contents($manifest_path), true) 
                : [];
        }
        return $manifest;
    }

    /**
     * Carica asset per una entry specifica
     */
    public static function enqueueEntry($entry_key, $handle, $deps = [], $in_footer = true) {
        if (!self::$config) {
            self::init();
        }

        $entry_file = self::$config['entries'][$entry_key] ?? null;
        if (!$entry_file) {
            return;
        }

        if (self::isViteDev()) {
            // Modalità sviluppo
            error_log('🎯 ViteIntegration: Modalità sviluppo per ' . $handle);
            wp_enqueue_script(
                $handle,
                self::$config['dev_url_browser'] . '/' . ltrim($entry_file, '/'),
                $deps,
                time(),
                $in_footer
            );
            
            add_filter('script_loader_tag', function($tag, $handle_check, $src) use ($handle) {
                if ($handle_check === $handle) {
                    return '<script type="module" src="' . esc_url($src) . '"></script>';
                }
                return $tag;
            }, 10, 3);

            // Passa configurazione al JS (usando editorConfig per compatibilità)
            wp_localize_script($handle, 'editorConfig', [
                'isDevelopment' => true,
                'vitePort' => self::$config['dev_port']
            ]);
            error_log('🎯 ViteIntegration: editorConfig impostato per ' . $handle . ' con porta ' . self::$config['dev_port']);
        } else {
            // Modalità produzione
            $manifest = self::getManifest();

            if (!empty($manifest[$entry_file])) {
                $entry_data = $manifest[$entry_file];

                // Carica JS
                if (!empty($entry_data['file'])) {
                    $js_path = get_template_directory() . '/dist/' . $entry_data['file'];
                    if (file_exists($js_path)) {
                        wp_enqueue_script(
                            $handle,
                            get_template_directory_uri() . '/dist/' . $entry_data['file'],
                            $deps,
                            filemtime($js_path),
                            $in_footer
                        );

                        // Per i blocchi, aggiungi type="module" per evitare conflitti di scope
                        if (strpos($entry_key, 'Block') !== false) {
                            add_filter('script_loader_tag', function($tag, $handle_check, $src) use ($handle) {
                                if ($handle_check === $handle) {
                                    return '<script type="module" src="' . esc_url($src) . '"></script>';
                                }
                                return $tag;
                            }, 10, 3);
                        }

                        wp_localize_script($handle, 'editorConfig', [
                            'isDevelopment' => false
                        ]);
                    }
                }
                
                // Carica CSS
                if (!empty($entry_data['css'])) {
                    foreach ($entry_data['css'] as $index => $css_file) {
                        $css_path = get_template_directory() . '/dist/' . $css_file;
                        if (file_exists($css_path)) {
                            wp_enqueue_style(
                                $handle . '-' . $index,
                                get_template_directory_uri() . '/dist/' . $css_file,
                                [],
                                filemtime($css_path)
                            );
                        }
                    }
                }
            } else {
                // Fallback: cerca file con pattern
                $dist_dir = get_template_directory() . '/dist';
                $pattern = str_replace(['src/scripts/', '.ts'], ['assets/', '*.js'], $entry_file);
                $js_files = glob($dist_dir . '/' . $pattern);
                
                if (!empty($js_files)) {
                    wp_enqueue_script(
                        $handle,
                        get_template_directory_uri() . '/dist/' . basename($js_files[0]),
                        $deps,
                        filemtime($js_files[0]),
                        $in_footer
                    );
                }
            }
        }
    }

    /**
     * Carica gli asset di Vite per il frontend
     */
    public static function enqueueAssets() {
        self::enqueueEntry('main', 'ficus');
    }

    /**
     * Carica gli asset per l'editor
     */
    public static function enqueueEditorAssets() {
        error_log('🎯 ViteIntegration: enqueueEditorAssets chiamato');

        // Carica i font di Google nell'editor
        wp_enqueue_style(
            'google-fonts',
            'https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;700&display=swap',
            [],
            null
        );

        self::enqueueEntry('editor', 'editor-scripts', ['wp-blocks']);
        self::enqueueEntry('professionalBlock', 'professional-block', ['wp-blocks', 'wp-element', 'wp-components']);
        self::enqueueEntry('professionalsGridBlock', 'professionals-grid-block', ['wp-blocks', 'wp-element', 'wp-components']);
    }
}

// Inizializzazione
add_action('wp_enqueue_scripts', [ViteIntegration::class, 'enqueueAssets']);
add_action('enqueue_block_editor_assets', [ViteIntegration::class, 'enqueueEditorAssets']);