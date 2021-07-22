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

namespace SixaContainerBlock;

defined( 'ABSPATH' ) || exit;

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see       https://developer.wordpress.org/block-editor/tutorials/block-tutorial/writing-your-first-block-type/
 * @since     1.0.0
 * @return    void
 */
function register_block(): void {
	register_block_type_from_metadata(
		__DIR__,
		array(
			'render_callback' => __NAMESPACE__ . '\render_block',
		)
	);
}
add_action( 'init', __NAMESPACE__ . '\register_block' );

/**
 * Modifies the `sixa/container` block output.
 *
 * @since     1.0.0
 * @param     array  $attributes        The block attributes.
 * @param     string $content           The block content.
 * @return    string
 */
function render_block( array $attributes = array(), string $content ): string {
	libxml_use_internal_errors( true );
	$dom = new \DOMDocument();
	$dom->loadHTML( $content, LIBXML_HTML_NODEFDTD | LIBXML_HTML_NOIMPLIED );
	$xpath = new \DomXPath( $dom );
	$node  = $xpath->query( "//div[contains(@class, 'wp-block-sixa-container')]" );

	if ( $node ) {
		$before_content = apply_filters( 'sixa_container_block_before_content', __return_empty_string(), $attributes );
		$after_content  = apply_filters( 'sixa_container_block_after_content', __return_empty_string(), $attributes );

		if ( ! empty( $before_content ) ) {
			$before_content_fragment = $dom->createDocumentFragment();
			$before_content_fragment->appendXML( $before_content );
			$node->item( 0 )->insertBefore( $before_content_fragment, $node->item( 0 )->firstChild );
		}

		if ( ! empty( $after_content ) ) {
			$after_content_fragment = $dom->createDocumentFragment();
			$after_content_fragment->appendXML( $after_content );
			$node->item( 0 )->insertBefore( $after_content_fragment );
		}

		libxml_clear_errors();
		$content = $dom->saveHTML();
	}

	return $content;
}
