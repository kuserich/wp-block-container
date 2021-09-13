/**
 * Utility for libraries from the `Lodash`.
 */
import union from 'lodash/union';

/**
 * A lightweight & efficient EventManager for JavaScript.
 * Hooks are used to manage component state and lifecycle.
 *
 * @see    https://developer.wordpress.org/block-editor/reference-guides/packages/packages-hooks/
 */
import { addFilter } from '@wordpress/hooks';

/**
 * Integration of container block with other extensions.
 *
 * @param 	  {Array}    allowedBlocks    List of blocks that are adding supporting for this module.
 * @return    {Array} 		              Updated list of allowed blocks.
 */
function addExtensionsSupport( allowedBlocks ) {
	return union( allowedBlocks, [ 'sixa/container' ] );
}
addFilter( 'sixa.extensionSpacingAllowedBlocks', 'sixa/addSpacingSupport', addExtensionsSupport );
addFilter( 'sixa.extensionEmbedBackgroundVideoAllowedBlocks', 'sixa/addEmbedBackgroundVideoSupport', addExtensionsSupport );
