/**
 * User Avatar Block Frontend JavaScript - Ready to Install Version
 */
(function($) {
    'use strict';
    
    class UserAvatarBlock {
        constructor() {
            this.init();
        }
        
        init() {
            this.bindEvents();
            this.handleOutsideClick();
            this.handleKeyboardNavigation();
        }
        
        bindEvents() {
            $(document).on('click', '.user-avatar-trigger', this.toggleDropdown.bind(this));
            $(document).on('click', '.user-avatar-dropdown a', this.handleMenuClick.bind(this));
        }
        
        toggleDropdown(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const $trigger = $(e.currentTarget);
            const $block = $trigger.closest('.user-avatar-block');
            const $dropdown = $block.find('.user-avatar-dropdown');
            
            // Close other open dropdowns
            $('.user-avatar-block.open').not($block).removeClass('open');
            
            // Toggle current dropdown
            $block.toggleClass('open');
            
            // Focus management
            if ($block.hasClass('open')) {
                // Set focus to first menu item
                setTimeout(() => {
                    $dropdown.find('a:first').focus();
                }, 100);
            }
        }
        
        closeDropdown($block) {
            if ($block) {
                $block.removeClass('open');
            } else {
                $('.user-avatar-block.open').removeClass('open');
            }
        }
        
        handleMenuClick(e) {
            const $block = $(e.target).closest('.user-avatar-block');
            
            // Close dropdown after a short delay to allow navigation
            setTimeout(() => {
                this.closeDropdown($block);
            }, 150);
        }
        
        handleOutsideClick() {
            $(document).on('click', (e) => {
                if (!$(e.target).closest('.user-avatar-block').length) {
                    this.closeDropdown();
                }
            });
        }
        
        handleKeyboardNavigation() {
            $(document).on('keydown', '.user-avatar-block', (e) => {
                const $block = $(e.currentTarget);
                const $dropdown = $block.find('.user-avatar-dropdown');
                const $menuItems = $dropdown.find('a');
                
                switch(e.key) {
                    case 'Escape':
                        this.closeDropdown($block);
                        $block.find('.user-avatar-trigger').focus();
                        break;
                        
                    case 'ArrowDown':
                        e.preventDefault();
                        if ($block.hasClass('open')) {
                            const $focused = $dropdown.find('a:focus');
                            const currentIndex = $menuItems.index($focused);
                            const nextIndex = (currentIndex + 1) % $menuItems.length;
                            $menuItems.eq(nextIndex).focus();
                        } else {
                            $block.find('.user-avatar-trigger').click();
                        }
                        break;
                        
                    case 'ArrowUp':
                        e.preventDefault();
                        if ($block.hasClass('open')) {
                            const $focused = $dropdown.find('a:focus');
                            const currentIndex = $menuItems.index($focused);
                            const prevIndex = currentIndex <= 0 ? $menuItems.length - 1 : currentIndex - 1;
                            $menuItems.eq(prevIndex).focus();
                        }
                        break;
                        
                    case 'Enter':
                    case ' ':
                        if ($(e.target).hasClass('user-avatar-trigger') || $(e.target).closest('.user-avatar-trigger').length) {
                            e.preventDefault();
                            $(e.target).closest('.user-avatar-trigger').click();
                        }
                        break;
                }
            });
        }
    }
    
    // Initialize when DOM is ready
    $(document).ready(() => {
        new UserAvatarBlock();
    });
    
})(jQuery);