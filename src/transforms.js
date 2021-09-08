/**
 * Utility for libraries from the `Lodash`.
 */
import { isEqual, indexOf, gt, map, reduce } from 'lodash';

/**
 * Given a block object, returns a copy of the block object.
 *
 * @see    https://github.com/WordPress/gutenberg/tree/HEAD/packages/blocks/README.md
 */
import { createBlock } from '@wordpress/blocks';

/**
 * Block Transforms is the API that allows a block to be transformed from and to other blocks, as well as from other entities.
 * Existing entities that work with this API include shortcodes, files, regular expressions, and raw DOM nodes.
 */
const transforms = {
	from: [
		{
			type: 'block',
			isMultiBlock: true,
			blocks: [ '*' ],
			__experimentalConvert( blocks ) {
				// Avoid transforming a single `sixa/container` Block
				if ( isEqual( 1, blocks.length ) && isEqual( 'sixa/container', blocks[ 0 ]?.name ) ) {
					return;
				}

				const alignments = [ 'wide', 'full' ];
				const widestAlignment = reduce(
					blocks,
					( accumulator, { attributes: { align } } ) =>
						gt( indexOf( alignments, align ), indexOf( alignments, accumulator ) ) ? align : accumulator,
					undefined
				);
				const wrapInnerBlocks = map( blocks, ( { attributes, innerBlocks, name } ) => createBlock( name, attributes, innerBlocks ) );

				return createBlock(
					'sixa/container',
					{
						align: widestAlignment,
					},
					wrapInnerBlocks
				);
			},
		},
	],
};

export default transforms;
