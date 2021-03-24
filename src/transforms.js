/**
 * API that allows this block to be transformed from and to other block(s).
 */

/**
 * External dependencies
 */
import { gt, map, get, noop, reduce, indexOf } from 'lodash-es';
import { blockName } from "@sixa/wp-block-utils";

/**
 * WordPress dependencies
 */
const { createBlock } = wp.blocks;

/**
 * Constants
 */
const BLOCK_NAME = blockName( 'container' );

const transforms = {
	from: [
		{
			type: 'block',
			isMultiBlock: true,
			blocks: [ '*' ],
			__experimentalConvert( blocks ) {
				const alignments = [ 'wide', 'full' ],
					widestAlignment = reduce(
						blocks,
						( accumulator, block ) => {
							const { align } = get( block, 'attributes' );
							return gt( indexOf( alignments, align ), indexOf( alignments, accumulator ) )
								? align
								: accumulator;
						},
						noop()
					);

				const wrapInnerBlocks = map( blocks, ( block ) =>
					createBlock( get( block, 'name' ), get( block, 'attributes' ), get( block, 'innerBlocks' ) )
				);

				return createBlock(
					BLOCK_NAME,
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
