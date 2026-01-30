<?php
namespace Ficus;

use Walker_Nav_Menu;

/**
 * Custom Nav Menu Walker per menu con checkbox toggle
 * Gestisce menu a 3 livelli con toggle CSS-only
 */
class CheckboxMenuWalker extends Walker_Nav_Menu {
    
    private $checkbox_counter = 0;
    private $current_item = null;
    
    /**
     * Inizio del sottomenu
     */
    public function start_lvl(&$output, $depth = 0, $args = null) {
        $indent = str_repeat("\t", $depth);
        $output .= "\n$indent<ul class=\"sub-menu\">\n";
        if ($depth == 0) {
            $close_label = __('Close');
            $output .= "\n$indent<li class=\"sub-menu-close\" aria-label=\"close menu\">";
            $output .= "\n$indent\t<label for=\"menu-toggle-" . $this->checkbox_counter . "\">$close_label</label>";
            $output .= "\n$indent</li>\n";
        }
    }

    /**
     * Fine del sottomenu
     */
    public function end_lvl(&$output, $depth = 0, $args = null) {
        $indent = str_repeat("\t", $depth);
        $output .= "$indent</ul>\n";
    }

    /**
     * Inizio elemento del menu
     */
    public function start_el(&$output, $item, $depth = 0, $args = null, $id = 0) {
        $this->current_item = $item;
        $indent = ($depth) ? str_repeat("\t", $depth) : '';
        
        // Classi CSS dell'elemento
        $classes = empty($item->classes) ? array() : (array) $item->classes;
        $classes[] = 'menu-item-' . $item->ID;
        
        // Verifica se ha figli
        $has_children = in_array('menu-item-has-children', $classes);
        
        // Aggiungi classe per il depth level
        $classes[] = 'menu-level-' . $depth;
        
        // Prepara le classi
        $class_names = join(' ', apply_filters('nav_menu_css_class', array_filter($classes), $item, $args));
        $class_names = $class_names ? ' class="' . esc_attr($class_names) . '"' : '';
        
        // ID dell'elemento
        $id = apply_filters('nav_menu_item_id', 'menu-item-' . $item->ID, $item, $args);
        $id = $id ? ' id="' . esc_attr($id) . '"' : '';
        
        // Output dell'elemento <li>
        $output .= $indent . '<li' . $id . $class_names . '>';
        
        // Prepara attributi
        $attributes = !empty($item->attr_title) ? ' title="' . esc_attr($item->attr_title) . '"' : '';
        $attributes .= !empty($item->target) ? ' target="' . esc_attr($item->target) . '"' : '';
        $attributes .= !empty($item->xfn) ? ' rel="' . esc_attr($item->xfn) . '"' : '';
        
        // Contenuto dell'elemento
        $item_output = $args->before ?? '';
        
        if ($has_children) {
            // Elemento con figli: usa checkbox + label
            $checkbox_id = 'menu-toggle-' . ++$this->checkbox_counter;
            
            // Checkbox nascosto PRIMA del label
            $item_output .= '<input type="checkbox" id="' . $checkbox_id . '" class="menu-toggle-input" checkbox>';
            
            // Label come toggle
            $item_output .= '<label for="' . $checkbox_id . '" class="menu-toggle-label">';
            $item_output .= ($args->link_before ?? '') . apply_filters('the_title', $item->title, $item->ID) . ($args->link_after ?? '');
            $item_output .= '<span class="menu-toggle-icon" aria-hidden="true"></span>';
            $item_output .= '</label>';
        } else {
            // Elemento foglia: link normale
            $attributes .= !empty($item->url) ? ' href="' . esc_attr($item->url) . '"' : '';
            
            $item_output .= '<a' . $attributes . '>';
            $item_output .= ($args->link_before ?? '') . apply_filters('the_title', $item->title, $item->ID) . ($args->link_after ?? '');
            $item_output .= '</a>';
        }
        
        $item_output .= $args->after ?? '';
        
        // Output finale
        $output .= apply_filters('walker_nav_menu_start_el', $item_output, $item, $depth, $args);
    }

    /**
     * Fine elemento del menu
     */
    public function end_el(&$output, $item, $depth = 0, $args = null) {
        $output .= "</li>\n";
    }
}