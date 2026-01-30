<?php
// inc/translations.php

namespace Ficus;

class Translations {
    private static $translations = null;

    /**
     * Ottiene tutte le traduzioni del tema
     */
    public static function getAll(): array {
        if (self::$translations === null) {
            self::$translations = [
                'general' => [
                    'read_more' => __('Read more', 'theme'),
                    'no_posts' => __('No posts found', 'theme'),
                    'search' => __('Search', 'theme'),
                    'close' => __('Close', 'theme'),
                ],
                'home' => [
                    'featured_posts' => __('Featured Posts', 'theme'),
                    'latest_posts' => __('Latest Posts', 'theme'),
                    'view_all' => __('View all posts', 'theme'),
                ],
                'archive' => [
                    'categories' => __('Categories', 'theme'),
                    'tags' => __('Tags', 'theme'),
                    'archives' => __('Archives', 'theme'),
                ],
                'post' => [
                    'posted_by' => __('Posted by', 'theme'),
                    'posted_on' => __('Posted on', 'theme'),
                    'comments' => __('Comments', 'theme'),
                ],
                'comments' => [
                    'reply' => __('Reply', 'theme'),
                    'submit' => __('Submit Comment', 'theme'),
                    'name' => __('Name', 'theme'),
                    'email' => __('Email', 'theme'),
                ],
                'footer' => [
                    'all_rights' => __('All rights reserved', 'theme'),
                    'quick_links' => __('Quick Links', 'theme'),
                    'follow_us' => __('Follow us', 'theme'),
                ]
            ];
        }

        return self::$translations;
    }

    /**
     * Ottiene una specifica sezione di traduzioni
     */
    public static function getSection(string $section): array {
        $translations = self::getAll();
        return $translations[$section] ?? [];
    }

    /**
     * Ottiene una specifica traduzione
     */
    public static function get(string $section, string $key): string {
        $translations = self::getAll();
        return $translations[$section][$key] ?? $key;
    }

    /**
     * Aggiunge le traduzioni al context di Twig
     */
    public static function addToContext(array &$context): void {
        $context['t'] = self::getAll();
    }
}