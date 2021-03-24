/**
 * Describes the structure of your block in the context of the editor.
 */

/**
 * External dependencies
 */
import { isEqual, noop, get, set } from 'lodash-es';
import classnames from 'classnames';
import Controls from './controls';
import Inspector from './inspector';
import { IMAGE_TYPE, VIDEO_TYPE } from '@sixa/wp-block-utils';
import { isPositionCenter, positionToClassName } from "@sixa/wp-block-utils";
import { blockClassName } from "@sixa/wp-block-utils";
import {
	normalizeDimRatio,
	normalizeFocalPointPosition,
	normalizeBackgroundUrl,
	normalizeSpacingStyles
} from "@sixa/wp-block-utils";

/**
 * WordPress dependencies
 */
const {
	InnerBlocks,
	withColors,
	useBlockProps,
	__experimentalUseGradient,
	__experimentalUseInnerBlocksProps: useInnerBlocksProps,
} = wp.blockEditor;
const { compose, withInstanceId } = wp.compose;
const { useSelect } = wp.data;

/**
 * Constants
 */
const BLOCK_CLASSNAME = blockClassName( 'container' );

const Edit = ( {
	clientId,
	attributes,
	isSelected,
	setAttributes,
	textColor,
	setTextColor,
	overlayColor,
	setOverlayColor,
} ) => {
	let positionValue = noop();
	const {
			align,
			width,
			url,
			hasParallax,
			isRepeated,
			dimRatio,
			focalPoint,
			contentPosition,
			backgroundType,
			margin,
			padding,
		} = attributes,
		{ gradientClass, setGradient, gradientValue } = __experimentalUseGradient(),
		isImageBackground = isEqual( backgroundType, IMAGE_TYPE ),
		isVideoBackground = isEqual( backgroundType, VIDEO_TYPE ),
		textColorClass = get( textColor, 'class' ),
		overlayColorClass = get( overlayColor, 'class' ),
		{ hasInnerBlocks } = useSelect( ( select ) => {
			const { getBlock } = select( 'core/block-editor' ),
				block = getBlock( clientId );

			return {
				hasInnerBlocks: !! ( block && block.innerBlocks.length ),
			};
		} ),
		innerBlocksProps = useInnerBlocksProps(
			{
				className: `${ BLOCK_CLASSNAME }__content`,
				style: { maxWidth: width ? `${ parseFloat( width ) }px` : noop() },
			},
			{
				templateLock: false,
				renderAppender: ! hasInnerBlocks && InnerBlocks.ButtonBlockAppender,
			}
		),
		styles = {
			...normalizeSpacingStyles( margin, 'margin' ),
			...normalizeSpacingStyles( padding, 'padding' ),
			...( isImageBackground ? normalizeBackgroundUrl( url ) : {} ),
		};

	if ( ! textColorClass ) {
		set( styles, 'color', get( textColor, 'color' ) );
	}

	if ( ! overlayColorClass ) {
		set( styles, 'backgroundColor', get( overlayColor, 'color' ) );
	}

	if ( gradientValue && ! url ) {
		set( styles, 'background', gradientValue );
	}

	if ( focalPoint ) {
		positionValue = normalizeFocalPointPosition( focalPoint );
		if ( isImageBackground ) {
			set( styles, 'backgroundPosition', positionValue );
		}
	}

	return (
		<>
			<div
				{ ...useBlockProps( {
					className: classnames( normalizeDimRatio( dimRatio ), positionToClassName( contentPosition ), {
						'has-parallax': hasParallax,
						'is-repeated': isRepeated,
						'has-background-dim': !! url && ! isEqual( dimRatio, 0 ),
						'has-background-gradient': gradientValue,
						'has-custom-content-position': ! isPositionCenter( contentPosition ),
						[ `align${ align }` ]: align,
						[ textColorClass ]: textColorClass,
						[ overlayColorClass ]: overlayColorClass,
						[ gradientClass ]: ! url && gradientClass,
					} ),
					style: { ...styles },
				} ) }
			>
				{ url && gradientValue && ! isEqual( dimRatio, 0 ) && (
					<span
						aria-hidden="true"
						className={ classnames( `${ BLOCK_CLASSNAME }__gradient-background`, gradientClass ) }
						style={ { background: gradientValue } }
					/>
				) }
				{ isVideoBackground && (
					<video
						autoPlay
						muted
						loop
						src={ url }
						style={ { objectPosition: positionValue } }
						className={ `${ BLOCK_CLASSNAME }__video-background` }
					/>
				) }
				<div { ...innerBlocksProps } />
			</div>
			{ isSelected && (
				<>
					<Controls attributes={ attributes } setAttributes={ setAttributes } />
					<Inspector
						attributes={ attributes }
						setAttributes={ setAttributes }
						colors={ {
							textColor,
							setTextColor,
							overlayColor,
							setOverlayColor,
							setGradient,
							gradientValue,
						} }
					/>
				</>
			) }
		</>
	);
};

export default compose( [
	withColors( { textColor: 'color' }, { overlayColor: 'background-color' } ),
	withInstanceId,
] )( Edit );
