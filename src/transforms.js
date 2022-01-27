/**
 * Utility for libraries from the `Lodash`.
 */
import { indexOf, gt, map, reduce } from 'lodash';

/**
 * Given a block object, returns a copy of the block object.
 *
 * @see    https://developer.wordpress.org/block-editor/reference-guides/packages/packages-blocks/
 */
import { createBlock } from '@wordpress/blocks';

/**
 * Helper constants.
 */
import Constants from './constants';

/**
 * Block Transforms is the API that allows a block to be transformed from and to other blocks, as well as from other entities.
 * Existing entities that work with this API include shortcodes, files, regular expressions, and raw DOM nodes.
 */
export default {
	from: [
		{
			type: 'block',
			blocks: [ 'core/image' ],
			transform: ( { align, anchor, caption, id, url } ) =>
				createBlock(
					'sixa/container',
					{
						align,
						anchor,
						backgroundType: Constants.IMAGE_MEDIA_TYPE,
						dimRatio: 50,
						id,
						url,
					},
					[
						createBlock( 'core/paragraph', {
							content: caption,
							fontSize: 'large',
						} ),
					]
				),
		},
		{
			type: 'block',
			blocks: [ 'core/video' ],
			transform: ( { align, anchor, caption, id, src } ) =>
				createBlock(
					'sixa/container',
					{
						align,
						anchor,
						backgroundType: Constants.VIDEO_MEDIA_TYPE,
						dimRatio: 50,
						id,
						url: src,
					},
					[
						createBlock( 'core/paragraph', {
							content: caption,
							fontSize: 'large',
						} ),
					]
				),
		},
		{
			type: 'block',
			blocks: [ 'core/cover' ],
			isMatch: ( { overlayColor, gradient, style } ) => {
				/*
				 * Make this transformation available only if the Cover has background
				 * or gradient set, because otherwise `Container` block displays a block-appender.
				 */
				return overlayColor || style?.color?.background || style?.color?.gradient || gradient;
			},
			transform: (
				{ align, anchor, contentPosition, dimRatio, focalPoint, gradient, hasParallax, id, isRepeated, overlayColor, style, url },
				innerBlocks
			) => {
				return createBlock(
					'sixa/container',
					{
						align,
						anchor,
						contentPosition,
						dimRatio,
						focalPoint,
						customGradient: style?.color?.gradient,
						customOverlayColor: style?.color?.background,
						gradient,
						hasParallax,
						id,
						isRepeated,
						overlayColor,
						url,
					},
					innerBlocks
				);
			},
		},
		{
			type: 'block',
			isMultiBlock: true,
			blocks: [ '*' ],
			__experimentalConvert( blocks ) {
				// Avoid transforming a single `sixa/container` Block
				if ( 1 === blocks.length && 'sixa/container' === blocks[ 0 ]?.name ) {
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
	to: [
		{
			type: 'block',
			blocks: [ 'core/image' ],
			isMatch: ( { backgroundType, customGradient, customOverlayColor, gradient, overlayColor, url } ) => {
				if ( url ) {
					// If a url exists the transform could happen if that URL represents an image background.
					return backgroundType === Constants.IMAGE_MEDIA_TYPE;
				}
				// If a url is not set the transform could happen if the block has no background color or gradient;
				return ! overlayColor && ! customOverlayColor && ! gradient && ! customGradient;
			},
			transform: ( { title, url, align, id, anchor } ) =>
				createBlock( 'core/image', {
					align,
					anchor,
					caption: title,
					id,
					url,
				} ),
		},
		{
			type: 'block',
			blocks: [ 'core/video' ],
			isMatch: ( { backgroundType, customGradient, customOverlayColor, gradient, overlayColor, url } ) => {
				if ( url ) {
					// If a url exists the transform could happen if that URL represents a video background.
					return backgroundType === Constants.VIDEO_MEDIA_TYPE;
				}
				// If a url is not set the transform could happen if the block has no background color or gradient;
				return ! overlayColor && ! customOverlayColor && ! gradient && ! customGradient;
			},
			transform: ( { title, url, align, id, anchor } ) =>
				createBlock( 'core/video', {
					align,
					anchor,
					caption: title,
					id,
					src: url,
				} ),
		},
	],
};
