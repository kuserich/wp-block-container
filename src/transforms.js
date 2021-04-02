/**
 * Utility for libraries from the `Lodash`.
 */
import { gt, map, get, noop, isEqual, reduce, indexOf } from 'lodash';

/**
 * Utility helper methods specific for Sixa projects.
 */
import { blockName } from '@sixa/wp-block-utils';

/**
 * Given a block object, returns a copy of the block object.
 *
 * @see https://github.com/WordPress/gutenberg/tree/HEAD/packages/blocks/README.md
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
				if ( isEqual( 1, blocks.length ) && isEqual( blockName( 'container' ), blocks[ 0 ].name ) ) {
					return;
				}

				const alignments = [ 'wide', 'full' ];
				const widestAlignment = reduce(
					blocks,
					( accumulator, block ) => {
						const { align } = get( block, 'attributes' );
						return gt( indexOf( alignments, align ), indexOf( alignments, accumulator ) ) ? align : accumulator;
					},
					noop()
				);
				const wrapInnerBlocks = map( blocks, ( block ) =>
					createBlock( get( block, 'name' ), get( block, 'attributes' ), get( block, 'innerBlocks' ) )
				);

				return createBlock(
					blockName( 'container' ),
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
