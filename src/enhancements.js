/**
 * Utility for libraries from the `Lodash`.
 */
import { union } from 'lodash';

/**
 * EventManager for JavaScript.
 * Hooks are used to manage component state and lifecycle.
 *
 * @see    https://github.com/WordPress/gutenberg/blob/trunk/packages/hooks/README.md
 */
import { addFilter } from '@wordpress/hooks';

/**
 * Add `Spacing Settings` module support for this block.
 *
 * @see 	  https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 * @param 	  {Array}    allowedBlocks    List of blocks that are adding supporting for this module.
 * @return    {Array} 		              Updated list of allowed blocks.
 */
function allowBlock( allowedBlocks ) {
	return union( allowedBlocks, [ 'sixa/container' ] );
}
addFilter( 'sixa.extensionSpacingAllowedBlocks', 'sixa/addSpacingSupport', allowBlock );
addFilter( 'sixa.extensionEmbedBackgroundVideoAllowedBlocks', 'sixa/addEmbedBackgroundVideoSupport', allowBlock );
