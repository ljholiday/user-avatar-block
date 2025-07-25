(function() {
    'use strict';
    
    const { registerBlockType } = wp.blocks;
    const { createElement: el, useState } = wp.element;
    const { InspectorControls, BlockControls, AlignmentToolbar, useBlockProps } = wp.blockEditor;
    const { PanelBody, RangeControl, ToggleControl, TextControl, Button, SelectControl } = wp.components;
    const { useSelect } = wp.data;
    const { __ } = wp.i18n;
    
    // Dashicons options
    const DASHICONS = [
        { label: 'User', value: 'admin-users' },
        { label: 'Dashboard', value: 'dashboard' },
        { label: 'Cart', value: 'cart' },
        { label: 'Heart', value: 'heart' },
        { label: 'Download', value: 'download' },
        { label: 'Edit', value: 'edit' },
        { label: 'Settings', value: 'admin-settings' },
        { label: 'Email', value: 'email-alt' },
        { label: 'Phone', value: 'phone' },
        { label: 'Location', value: 'location-alt' },
        { label: 'Star', value: 'star-filled' },
        { label: 'Calendar', value: 'calendar-alt' },
        { label: 'Clock', value: 'clock' },
        { label: 'Exit', value: 'exit' }
    ];
    
    // Block edit function
    function Edit(props) {
        const { attributes, setAttributes } = props;
        const {
            avatarSize = 48,
            showName = true,
            showDropdown = true,
            menuItems = [{ id: 'profile', label: 'My Profile', url: '/wp-admin/profile.php', icon: 'admin-users', type: 'link' }],
            includeLogout = true,
            loggedOutMessage = 'Please log in to see your profile.',
            alignment = 'left',
            customLoginUrl = ''
        } = attributes;

        const blockProps = useBlockProps({
            className: `align-${alignment}`
        });

        const currentUser = useSelect((select) => {
            return select('core').getCurrentUser();
        });

        const addMenuItem = () => {
            const newItem = {
                id: `item-${Date.now()}`,
                label: 'New Item',
                url: '',
                icon: 'admin-generic',
                type: 'link'
            };
            setAttributes({
                menuItems: [...menuItems, newItem]
            });
        };

        const updateMenuItem = (index, field, value) => {
            const updatedItems = [...menuItems];
            updatedItems[index] = {
                ...updatedItems[index],
                [field]: value
            };
            setAttributes({ menuItems: updatedItems });
        };

        const removeMenuItem = (index) => {
            const updatedItems = menuItems.filter((_, i) => i !== index);
            setAttributes({ menuItems: updatedItems });
        };

        const addSeparator = () => {
            const separator = {
                id: `separator-${Date.now()}`,
                type: 'separator'
            };
            setAttributes({
                menuItems: [...menuItems, separator]
            });
        };

        // Preview component
        const userAvatarPreview = () => {
            if (!currentUser) {
                return el('div', { className: 'user-avatar-block logged-out' }, loggedOutMessage);
            }

            return el('div', { className: 'user-avatar-block preview' },
                el('div', { className: 'user-avatar-trigger' },
                    el('div', { className: 'avatar-wrapper' },
                        el('img', {
                            src: currentUser.avatar_urls[avatarSize] || currentUser.avatar_urls[48] || currentUser.avatar_urls[96] || Object.values(currentUser.avatar_urls)[0],
                            alt: currentUser.name,
                            width: avatarSize,
                            height: avatarSize,
                            style: { borderRadius: '50%' }
                        })
                    ),
                    showName && el('span', { className: 'user-name' }, currentUser.name),
                    showDropdown && (menuItems.length > 0 || includeLogout) && 
                        el('span', { className: 'dropdown-arrow' }, '▼')
                ),
                showDropdown && el('div', { className: 'dropdown-preview' },
                    el('small', { style: { opacity: 0.7 } },
                        `Dropdown menu (${menuItems.length + (includeLogout ? 1 : 0)} items)`
                    )
                )
            );
        };

        // Inspector controls
        const inspectorControls = el(InspectorControls, {},
            el(PanelBody, { title: __('Avatar Settings'), initialOpen: true },
                el(RangeControl, {
                    label: __('Avatar Size'),
                    value: avatarSize,
                    onChange: (value) => setAttributes({ avatarSize: value }),
                    min: 24,
                    max: 128,
                    step: 4
                }),
                el(ToggleControl, {
                    label: __('Show Username'),
                    checked: showName,
                    onChange: (value) => setAttributes({ showName: value })
                }),
                el(ToggleControl, {
                    label: __('Show Dropdown Menu'),
                    checked: showDropdown,
                    onChange: (value) => setAttributes({ showDropdown: value })
                }),
                el(TextControl, {
                    label: __('Logged Out Message'),
                    value: loggedOutMessage,
                    onChange: (value) => setAttributes({ loggedOutMessage: value }),
                    help: __('Message shown to users who are not logged in')
                }),
                el(TextControl, {
                    label: __('Custom Login Page URL'),
                    value: customLoginUrl,
                    onChange: (value) => setAttributes({ customLoginUrl: value }),
                    help: __('Custom login page URL (leave blank to use WordPress default)')
                })
            ),
            showDropdown && el(PanelBody, { title: __('Dropdown Menu Items'), initialOpen: false },
                el('div', { style: { marginBottom: '16px' } },
                    menuItems.map((item, index) => {
                        if (item.type === 'separator') {
                            return el('div', { 
                                key: item.id, 
                                className: 'menu-item-control',
                                style: { 
                                    padding: '12px', 
                                    border: '1px solid #ddd', 
                                    borderRadius: '4px', 
                                    background: '#f8f9fa', 
                                    marginBottom: '12px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }
                            },
                                el('span', { style: { fontStyle: 'italic', opacity: 0.7 } }, __('Separator')),
                                el(Button, {
                                    isDestructive: true,
                                    size: 'small',
                                    onClick: () => removeMenuItem(index),
                                    style: { minWidth: 'auto' }
                                }, '×')
                            );
                        } else {
                            return el('div', { 
                                key: item.id, 
                                className: 'menu-item-control',
                                style: { 
                                    padding: '12px', 
                                    border: '1px solid #ddd', 
                                    borderRadius: '4px', 
                                    background: '#f8f9fa', 
                                    marginBottom: '12px'
                                }
                            },
                                el('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' } },
                                    el('strong', {}, `${__('Menu Item')} ${index + 1}`),
                                    el(Button, {
                                        isDestructive: true,
                                        size: 'small',
                                        onClick: () => removeMenuItem(index),
                                        style: { minWidth: 'auto' }
                                    }, '×')
                                ),
                                el(TextControl, {
                                    label: __('Label'),
                                    value: item.label || '',
                                    onChange: (value) => updateMenuItem(index, 'label', value)
                                }),
                                el(TextControl, {
                                    label: __('URL'),
                                    value: item.url || '',
                                    onChange: (value) => updateMenuItem(index, 'url', value),
                                    help: __('Can be relative (/my-account) or absolute (https://...)')
                                }),
                                el(SelectControl, {
                                    label: __('Icon'),
                                    value: item.icon || 'admin-generic',
                                    options: DASHICONS,
                                    onChange: (value) => updateMenuItem(index, 'icon', value)
                                })
                            );
                        }
                    })
                ),
                el('div', { style: { display: 'flex', gap: '8px', marginBottom: '16px' } },
                    el(Button, {
                        variant: 'secondary',
                        onClick: addMenuItem
                    }, __('+ Add Menu Item')),
                    el(Button, {
                        variant: 'tertiary',
                        onClick: addSeparator
                    }, __('Add Separator'))
                ),
                el(ToggleControl, {
                    label: __('Include Logout Link'),
                    checked: includeLogout,
                    onChange: (value) => setAttributes({ includeLogout: value }),
                    help: __('Automatically add logout link at bottom of menu')
                })
            )
        );

        // Block controls
        const blockControls = el(BlockControls, {},
            el(AlignmentToolbar, {
                value: alignment,
                onChange: (value) => setAttributes({ alignment: value })
            })
        );

        return el('div', blockProps,
            inspectorControls,
            blockControls,
            userAvatarPreview()
        );
    }

    // Register the block
    registerBlockType('user-avatar-block/user-avatar', {
        title: __('User Avatar'),
        description: __('Display logged-in user\'s avatar with customizable dropdown menu'),
        category: 'widgets',
        icon: 'admin-users',
        supports: {
            html: false,
            align: ['left', 'center', 'right'],
            color: {
                background: true,
                text: true,
                link: true
            },
            spacing: {
                margin: true,
                padding: true
            }
        },
        attributes: {
            avatarSize: {
                type: 'number',
                default: 48
            },
            showName: {
                type: 'boolean',
                default: true
            },
            showDropdown: {
                type: 'boolean',
                default: true
            },
            menuItems: {
                type: 'array',
                default: [{
                    id: 'profile',
                    label: 'My Profile',
                    url: '/wp-admin/profile.php',
                    icon: 'admin-users',
                    type: 'link'
                }]
            },
            includeLogout: {
                type: 'boolean',
                default: true
            },
            loggedOutMessage: {
                type: 'string',
                default: 'Please log in to see your profile.'
            },
            alignment: {
                type: 'string',
                default: 'left'
            },
            customLoginUrl: {
                type: 'string',
                default: ''
            }
        },
        edit: Edit,
        save: function() {
            // Server-side rendering, so return null
            return null;
        }
    });
})();