<?php
/**
 * Block class file. Contains all relevant functions
 * and features such as block registration and render callbacks.
 *
 * @link          https://sixa.ch
 * @author        sixa AG
 * @since         1.1.0
 *
 * @package       Sixa_Blocks
 * @subpackage    Sixa_Blocks\Container
 */

namespace Sixa_Blocks;

/**
 * Block Class Container.
 */
class Container {

	/**
	 * Initialize the block.
	 * Set up the WordPress hook to register the block.
	 *
	 * @since     1.0.0
	 * @return    void
	 */
	public static function init(): void {
		add_action( 'init', array( __CLASS__, 'register' ) );
	}

	/**
	 * Registers the block using the metadata loaded from the `block.json` file.
	 * Behind the scenes, it registers also all assets so they can be enqueued
	 * through the block editor in the corresponding context.
	 *
	 * @see       https://developer.wordpress.org/block-editor/tutorials/block-tutorial/writing-your-first-block-type/
	 * @since     1.0.0
	 * @return    void
	 */
	public static function register(): void {
		register_block_type_from_metadata(
			dirname( __DIR__ ),
			array(
				'render_callback' => array( __CLASS__, 'render' ),
			)
		);
	}

	/**
	 * Modifies the `sixa/container` block output.
	 *
	 * @since     1.0.0
	 * @param     array  $attributes    The block attributes.
	 * @param     string $content       The block content.
	 * @return    string
	 */
	public static function render( array $attributes = array(), string $content ): string {
		libxml_use_internal_errors( true );
		$dom = new \DOMDocument();
		$dom->loadHTML( mb_convert_encoding( $content, 'HTML-ENTITIES', 'UTF-8' ), LIBXML_HTML_NODEFDTD | LIBXML_HTML_NOIMPLIED );
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

}
