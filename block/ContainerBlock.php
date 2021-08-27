<?php

namespace Sixa;

class ContainerBlock {

	public static function init(): void {
		add_action( 'init', array( __CLASS__, 'register' ) );
	}

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
	 * @param     array  $attributes        The block attributes.
	 * @param     string $content           The block content.
	 * @return    string
	 */
	public static function render( array $attributes = array(), string $content ): string {
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

}
