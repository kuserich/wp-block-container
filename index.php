<?php
/**
 * Container Block.
 *
 * @wordpress-plugin
 * Plugin Name:          Sixa - Container
 * Description:          Container block for WordPress editor.
 * Version:              1.0.0
 * Requires at least:    5.7
 * Requires PHP:         7.2
 * Author:               sixa AG
 * License:              GPL v3 or later
 * License URI:          https://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain:          sixa
 *
 * @package             sixa
 */

use Sixa_Blocks\Container;

// Composer autoload is needed in this package even if
// it doesn't use any libraries to autoload the classes
// from this package.
require __DIR__ . '/vendor/autoload.php';

Container::init();
