<?php
/**
 * Plugin Name:         Sixa - Container
 * Description:         Container block for WordPress editor.
 * Version:             0.2.0
 * Author:              sixa AG
 * License:             GPL-3.0-or-later
 * License URI:         https://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain:         sixa
 * Requires at least:   WordPress 5.6
 * Requires PHP:        7.2
 *
 * @package         	sixa
 */

namespace SixaContainerBlock;

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/block-editor/tutorials/block-tutorial/writing-your-first-block-type/
 */
function register_block() {
	register_block_type_from_metadata( __DIR__ );
}
add_action( 'init', __NAMESPACE__ . '\register_block' );