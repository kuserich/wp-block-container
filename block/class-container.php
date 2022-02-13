<?php
/**
 * Block class file.
 *
 * @link          https://sixa.ch
 * @author        sixa AG <info@sixa.ch>
 *
 * @since         1.2.0
 * @package       Sixa_Blocks
 * @subpackage    Sixa_Blocks\Container
 */

namespace Sixa_Blocks;

defined( 'ABSPATH' ) || exit; // Exit if accessed directly.

if ( ! class_exists( Container::class ) ) :

	/**
	 * Block Class Container
	 */
	final class Container extends Block {

		/**
		 * Base directory of classes and templates for this extension.
		 * Used to import templates.
		 *
		 * @since    1.0.0
		 * @var      string
		 */
		public const BASE_DIR = __DIR__;

		/**
		 * Block specific CSS class name.
		 *
		 * @since    1.0.0
		 * @var      string
		 */
		public const CLASSNAME = 'wp-block-sixa-container';

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
				plugin_dir_path( self::BASE_DIR ),
				array(
					'render_callback' => array( self::class, 'render' ),
				)
			);
		}

		/**
		 * Modifies the `sixa/container` block output.
		 *
		 * @since     1.0.0
		 * @param     array  $attributes    The block attributes.
		 * @param     string $content       The block content.
		 * @return    null|string
		 */
		public static function render( array $attributes = array(), string $content ): ?string {
			libxml_use_internal_errors( true );
			$dom = new \DOMDocument();
			$dom->loadHTML( mb_convert_encoding( $content, 'HTML-ENTITIES', 'UTF-8' ), LIBXML_HTML_NODEFDTD | LIBXML_HTML_NOIMPLIED );
			$xpath = new \DomXPath( $dom );
			$node  = $xpath->query( "//div[contains(@class, '" . self::CLASSNAME . "')]" );

			if ( $node && $node->length ) {
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
				$content = $dom->saveHTML( $dom->documentElement ); // phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
			}

			/**
			 * Allow third-party resources to extend the block content.
			 */
			do_action( 'sixa_container_block_render_content', $attributes );

			return apply_filters( 'sixa_container_block_content', $content, $attributes );
		}

	}

endif;
