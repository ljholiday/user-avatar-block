<?php
/**
 * Plugin Name: User Avatar Block
 * Plugin URI: https://your-website.com/user-avatar-block
 * Description: Display logged-in user's avatar with customizable dropdown menu - no build process required!
 * Version: 1.0.1
 * Author: Your Name
 * Author URI: https://your-website.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: user-avatar-block
 * Requires at least: 5.8
 * Tested up to: 6.4
 * Requires PHP: 7.4
 * Network: false
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('USER_AVATAR_BLOCK_VERSION', '1.0.1');
define('USER_AVATAR_BLOCK_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('USER_AVATAR_BLOCK_PLUGIN_URL', plugin_dir_url(__FILE__));

class UserAvatarBlock {
    
    public function __construct() {
        add_action('init', array($this, 'register_block'));
        add_action('enqueue_block_editor_assets', array($this, 'enqueue_editor_assets'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_frontend_assets'));
    }
    
    public function register_block() {
        register_block_type('user-avatar-block/user-avatar', array(
            'attributes' => array(
                'avatarSize' => array(
                    'type' => 'number',
                    'default' => 48
                ),
                'showName' => array(
                    'type' => 'boolean',
                    'default' => true
                ),
                'showDropdown' => array(
                    'type' => 'boolean',
                    'default' => true
                ),
                'menuItems' => array(
                    'type' => 'array',
                    'default' => array(
                        array(
                            'id' => 'profile',
                            'label' => 'My Profile',
                            'url' => '/wp-admin/profile.php',
                            'icon' => 'admin-users',
                            'type' => 'link'
                        )
                    )
                ),
                'includeLogout' => array(
                    'type' => 'boolean',
                    'default' => true
                ),
                'loggedOutMessage' => array(
                    'type' => 'string',
                    'default' => 'Please log in to see your profile.'
                ),
                'alignment' => array(
                    'type' => 'string',
                    'default' => 'left'
                ),
                'customLoginUrl' => array(
                    'type' => 'string',
                    'default' => ''
                )
            ),
            'render_callback' => array($this, 'render_block'),
        ));
    }
    
    public function enqueue_editor_assets() {
        wp_enqueue_script(
            'user-avatar-block-editor',
            USER_AVATAR_BLOCK_PLUGIN_URL . 'assets/editor.js',
            array('wp-blocks', 'wp-element', 'wp-components', 'wp-block-editor', 'wp-data', 'wp-i18n'),
            USER_AVATAR_BLOCK_VERSION,
            true
        );
        
        wp_enqueue_style(
            'user-avatar-block-editor-style',
            USER_AVATAR_BLOCK_PLUGIN_URL . 'assets/editor.css',
            array(),
            USER_AVATAR_BLOCK_VERSION
        );
        
        // Localize script for translations
        wp_set_script_translations('user-avatar-block-editor', 'user-avatar-block');
    }
    
    public function enqueue_frontend_assets() {
        wp_enqueue_script(
            'user-avatar-block-frontend',
            USER_AVATAR_BLOCK_PLUGIN_URL . 'assets/frontend.js',
            array('jquery'),
            USER_AVATAR_BLOCK_VERSION,
            true
        );
        
        wp_enqueue_style(
            'user-avatar-block-style',
            USER_AVATAR_BLOCK_PLUGIN_URL . 'assets/style.css',
            array(),
            USER_AVATAR_BLOCK_VERSION
        );
    }
    
    public function render_block($attributes, $content) {
        // Don't show anything if user is not logged in
        if (!is_user_logged_in()) {
            $logged_out_message = !empty($attributes['loggedOutMessage']) ? $attributes['loggedOutMessage'] : 'Please log in to see your profile.';
            
            // Use custom login URL if provided, otherwise default WordPress login
            if (!empty($attributes['customLoginUrl'])) {
                $login_url = $attributes['customLoginUrl'];
            } else {
                $login_url = wp_login_url(get_permalink());
            }
            
            return '<div class="wp-block-user-avatar-block"><div class="user-avatar-block logged-out">' . 
                   '<span class="logged-out-message">' . esc_html($logged_out_message) . '</span>' .
                   '<a href="' . esc_url($login_url) . '" class="login-link">Log In</a>' .
                   '</div></div>';
        }
        
        $current_user = wp_get_current_user();
        $avatar_size = !empty($attributes['avatarSize']) ? intval($attributes['avatarSize']) : 48;
        $show_name = !empty($attributes['showName']);
        $show_dropdown = !empty($attributes['showDropdown']);
        $menu_items = !empty($attributes['menuItems']) ? $attributes['menuItems'] : array();
        $include_logout = !empty($attributes['includeLogout']);
        $alignment = !empty($attributes['alignment']) ? $attributes['alignment'] : 'left';
        
        $avatar_html = get_avatar($current_user->ID, $avatar_size, '', $current_user->display_name);
        
        $output = '<div class="wp-block-user-avatar-block align-' . esc_attr($alignment) . '">';
        $output .= '<div class="user-avatar-block">';
        $output .= '<div class="user-avatar-trigger" tabindex="0" role="button" aria-haspopup="true" aria-expanded="false">';
        $output .= '<div class="avatar-wrapper">' . $avatar_html . '</div>';
        
        if ($show_name) {
            $output .= '<span class="user-name">' . esc_html($current_user->display_name) . '</span>';
        }
        
        if ($show_dropdown && (!empty($menu_items) || $include_logout)) {
            $output .= '<span class="dropdown-arrow">▼</span>';
        }
        
        $output .= '</div>';
        
        // Build dropdown menu
        if ($show_dropdown && (!empty($menu_items) || $include_logout)) {
            $output .= '<div class="user-avatar-dropdown" role="menu">';
            $output .= '<ul class="dropdown-menu">';
            
            // Add custom menu items
            if (!empty($menu_items)) {
                foreach ($menu_items as $item) {
                    if (!empty($item['type']) && $item['type'] === 'separator') {
                        $output .= '<li class="menu-separator" role="separator"></li>';
                    } else {
                        $icon = !empty($item['icon']) ? '<span class="dashicons dashicons-' . esc_attr($item['icon']) . '"></span>' : '';
                        $label = !empty($item['label']) ? esc_html($item['label']) : 'Menu Item';
                        $url = !empty($item['url']) ? esc_url($item['url']) : '#';
                        
                        $output .= '<li class="menu-item" role="none">';
                        $output .= '<a href="' . $url . '" role="menuitem">';
                        $output .= $icon . $label;
                        $output .= '</a>';
                        $output .= '</li>';
                    }
                }
            }
            
            // Add logout if enabled
            if ($include_logout) {
                if (!empty($menu_items)) {
                    $output .= '<li class="menu-separator" role="separator"></li>';
                }
                $logout_url = wp_logout_url(home_url());
                $output .= '<li class="menu-item logout-item" role="none">';
                $output .= '<a href="' . esc_url($logout_url) . '" role="menuitem">';
                $output .= '<span class="dashicons dashicons-exit"></span>Logout';
                $output .= '</a>';
                $output .= '</li>';
            }
            
            $output .= '</ul>';
            $output .= '</div>';
        }
        
        $output .= '</div>';
        $output .= '</div>';
        
        return $output;
    }
}

// Initialize the plugin
new UserAvatarBlock();

// Add plugin activation hook
register_activation_hook(__FILE__, 'user_avatar_block_activate');
function user_avatar_block_activate() {
    // Flush rewrite rules to ensure block is registered
    flush_rewrite_rules();
}

// Add plugin deactivation hook
register_deactivation_hook(__FILE__, 'user_avatar_block_deactivate');
function user_avatar_block_deactivate() {
    flush_rewrite_rules();
}