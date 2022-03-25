<?php
/**
 * Container Block.
 *
 * @wordpress-plugin
 * Plugin Name:          sixa - Container Block
 * Description:          Wrap several blocks in a parent wrapper and do more styling.
 * Version:              1.1.3
 * Requires at least:    5.7
 * Requires PHP:         7.4
 * Author:               sixa AG
 * Author URI:           https://sixa.com
 * License:              GPL v3 or later
 * License URI:          https://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain:          sixa-block-container
 *
 * @package              Sixa_Blocks
 */

defined( 'ABSPATH' ) || exit; // Exit if accessed directly.

/**
 * Include the namespace of this block.
 */
use Sixa_Blocks\Container;

/**
 * Composer autoload is needed in this package even if
 * it doesn't use any libraries to autoload the classes
 * from this package.
 *
 * @see    https://getcomposer.org/doc/01-basic-usage.md#autoloading
 */
require_once plugin_dir_path( __FILE__ ) . 'vendor/autoload.php';

/**
 * Initialize your block.
 *
 * Other than this function call, this file should not include any logic
 * and should merely be used as an entry point to use this package as
 * a WordPress plugin.
 */
Container::init();
