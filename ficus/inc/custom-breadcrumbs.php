<?php
namespace Ficus;
/**
 * Genera dati breadcrumb per Twig
 * 
 * @return array Array di breadcrumbs per il template Twig
 */

function get_breadcrumbs() {
    $breadcrumbs = [];
    $position = 1;
    
    // Home
    $breadcrumbs[] = [
        'title' => 'Home',
        'url' => home_url('/'),
        'position' => $position++,
        'is_current' => is_front_page()
    ];
    
    // Se siamo nella home, restituisci solo quella
    if (is_front_page()) {
        return $breadcrumbs;
    }
    
    global $post;
    
    if (is_singular('post')) {
        // Post singolo
        $categories = get_the_category();
        if (!empty($categories)) {
            $category = $categories[0];
            $breadcrumbs[] = [
                'title' => $category->name,
                'url' => get_category_link($category->term_id),
                'position' => $position++,
                'is_current' => false
            ];
        }
        
        // Aggiungi il post corrente
        $breadcrumbs[] = [
            'title' => get_the_title(),
            'url' => null,
            'position' => $position++,
            'is_current' => true
        ];
    } elseif (is_page()) {
        // Pagina
        if ($post->post_parent) {
            // Pagina con genitore
            $parent_ids = [];
            $parent_id = $post->post_parent;
            
            while ($parent_id) {
                $parent_ids[] = $parent_id;
                $parent_post = get_post($parent_id);
                $parent_id = $parent_post->post_parent;
            }
            
            // Ordina gli antenati in ordine gerarchico
            $parent_ids = array_reverse($parent_ids);
            
            foreach ($parent_ids as $id) {
                $breadcrumbs[] = [
                    'title' => get_the_title($id),
                    'url' => get_permalink($id),
                    'position' => $position++,
                    'is_current' => false
                ];
            }
        }
        
        // Aggiungi pagina corrente
        $breadcrumbs[] = [
            'title' => get_the_title(),
            'url' => null,
            'position' => $position++,
            'is_current' => true
        ];
    } elseif (is_category()) {
        // Categoria
        $breadcrumbs[] = [
            'title' => single_cat_title('', false),
            'url' => null,
            'position' => $position++,
            'is_current' => true
        ];
    } elseif (is_tag()) {
        // Tag
        $breadcrumbs[] = [
            'title' => 'Tag: ' . single_tag_title('', false),
            'url' => null,
            'position' => $position++,
            'is_current' => true
        ];
    } elseif (is_search()) {
        // Pagina di ricerca
        $breadcrumbs[] = [
            'title' => 'Risultati ricerca: "' . get_search_query() . '"',
            'url' => null,
            'position' => $position++,
            'is_current' => true
        ];
    } elseif (is_author()) {
        // Pagina dell'autore
        $breadcrumbs[] = [
            'title' => 'Autore: ' . get_the_author(),
            'url' => null,
            'position' => $position++,
            'is_current' => true
        ];
    } elseif (is_archive()) {
        // Archivi
        if (is_post_type_archive()) {
            $post_type = get_post_type_object(get_post_type());
            $breadcrumbs[] = [
                'title' => $post_type->labels->name,
                'url' => null,
                'position' => $position++,
                'is_current' => true
            ];
        } elseif (is_day()) {
            // Archivio giornaliero
            $breadcrumbs[] = [
                'title' => get_the_time('Y'),
                'url' => get_year_link(get_the_time('Y')),
                'position' => $position++,
                'is_current' => false
            ];
            
            $breadcrumbs[] = [
                'title' => get_the_time('F'),
                'url' => get_month_link(get_the_time('Y'), get_the_time('m')),
                'position' => $position++,
                'is_current' => false
            ];
            
            $breadcrumbs[] = [
                'title' => get_the_time('d'),
                'url' => null,
                'position' => $position++,
                'is_current' => true
            ];
        } elseif (is_month()) {
            // Archivio mensile
            $breadcrumbs[] = [
                'title' => get_the_time('Y'),
                'url' => get_year_link(get_the_time('Y')),
                'position' => $position++,
                'is_current' => false
            ];
            
            $breadcrumbs[] = [
                'title' => get_the_time('F'),
                'url' => null,
                'position' => $position++,
                'is_current' => true
            ];
        } elseif (is_year()) {
            // Archivio annuale
            $breadcrumbs[] = [
                'title' => get_the_time('Y'),
                'url' => null,
                'position' => $position++,
                'is_current' => true
            ];
        }
    } elseif (is_404()) {
        // Pagina 404
        $breadcrumbs[] = [
            'title' => 'Pagina non trovata',
            'url' => null,
            'position' => $position++,
            'is_current' => true
        ];
    }
    
    return $breadcrumbs;
}