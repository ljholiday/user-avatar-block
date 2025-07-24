# User Avatar Block

A WordPress Gutenberg block that displays the logged-in user's avatar with a customizable dropdown menu. Perfect for member areas, user dashboards, and personalized website experiences.

## Features

- 🎭 **User Avatar Display** - Shows the current logged-in user's avatar
- 📱 **Responsive Design** - Mobile-friendly with adaptive layouts
- 🎨 **Customizable Menu** - Add custom menu items with icons and links
- ⌨️ **Keyboard Accessible** - Full ARIA compliance and keyboard navigation
- 🌙 **Dark Mode Support** - Automatic dark mode detection and styling
- 🎯 **No Build Process** - Ready to use, no compilation required
- ⚡ **Lightweight** - Minimal footprint with vanilla JavaScript

## Installation

1. Download or clone this repository
2. Upload the `user-avatar-block` folder to your `/wp-content/plugins/` directory
3. Activate the plugin through the 'Plugins' menu in WordPress
4. Add the "User Avatar" block to any post or page using the Gutenberg editor

## Usage

### Basic Setup
1. Open the Gutenberg editor
2. Add a new block and search for "User Avatar"
3. Configure the block settings in the inspector panel
4. Publish or update your page

### Block Settings

**Avatar Settings:**
- **Avatar Size** - Choose from 24px to 128px (adjustable in 4px increments)
- **Show Username** - Toggle to display/hide the user's display name
- **Show Dropdown Menu** - Enable/disable the dropdown functionality
- **Logged Out Message** - Custom message for non-logged-in users

**Menu Items:**
- **Add Menu Items** - Create custom links with labels, URLs, and Dashicons
- **Add Separators** - Visual dividers between menu sections
- **Include Logout Link** - Automatically add a logout option

**Alignment:**
- Left, Center, or Right alignment options
- Block-level alignment support

### Menu Item Configuration

Each menu item supports:
- **Label** - Display text for the menu item
- **URL** - Relative (`/my-account`) or absolute (`https://example.com`) links
- **Icon** - Choose from available Dashicons (user, settings, cart, etc.)
- **Type** - Link or separator

### Default Menu Items

The block comes with a default "My Profile" menu item that links to `/wp-admin/profile.php`. You can modify or remove this as needed.

## Styling

### CSS Classes

The block generates the following CSS structure:

```html
<div class="wp-block-user-avatar-block align-left">
  <div class="user-avatar-block">
    <div class="user-avatar-trigger">
      <div class="avatar-wrapper">
        <img src="..." alt="User Name">
      </div>
      <span class="user-name">User Name</span>
      <span class="dropdown-arrow">▼</span>
    </div>
    <div class="user-avatar-dropdown">
      <ul class="dropdown-menu">
        <li class="menu-item">
          <a href="/profile">
            <span class="dashicons dashicons-admin-users"></span>
            My Profile
          </a>
        </li>
        <li class="menu-separator"></li>
        <li class="menu-item logout-item">
          <a href="/wp-login.php?action=logout">
            <span class="dashicons dashicons-exit"></span>
            Logout
          </a>
        </li>
      </ul>
    </div>
  </div>
</div>
```

### Custom Styling

You can override the default styles by adding CSS to your theme:

```css
/* Customize avatar hover effect */
.user-avatar-trigger:hover .avatar-wrapper img {
  transform: scale(1.1);
  box-shadow: 0 0 0 3px rgba(0, 123, 170, 0.3);
}

/* Custom dropdown styling */
.user-avatar-dropdown {
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

/* Brand-specific colors */
.menu-item a:hover {
  background-color: #your-brand-color;
  color: white;
}
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Requirements

- WordPress 5.8+
- PHP 7.4+
- jQuery (included with WordPress)

## File Structure

```
user-avatar-block/
├── user-avatar-block.php    # Main plugin file
├── assets/
│   ├── editor.js           # Gutenberg editor functionality
│   ├── editor.css          # Editor-specific styles
│   ├── frontend.js         # Frontend dropdown behavior
│   └── style.css           # Frontend styles
├── installation_guide.md   # Installation instructions
└── README.md              # This file
```

## Development

### Local Development
1. Clone the repository into your WordPress plugins directory
2. Make changes to the source files
3. Test in the Gutenberg editor and frontend
4. No build process required - changes are immediate

### Debugging
Enable WordPress debug mode to see any PHP errors:
```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Security

This plugin follows WordPress security best practices:
- All output is properly escaped
- User capabilities are checked
- Nonces are used where appropriate
- No direct file access allowed

## License

GPL v2 or later - see the [WordPress Plugin License](https://www.gnu.org/licenses/gpl-2.0.html)

## Support

For support, please open an issue on GitHub or contact the plugin author.

## Changelog

### 1.0.0
- Initial release
- User avatar display with dropdown menu
- Customizable menu items and icons
- Responsive design and dark mode support
- Accessibility features and keyboard navigation