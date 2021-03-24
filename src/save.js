/**
 * Defines the way in which the different attributes should be combined into the final markup.
 */

import { isEqual, noop, set } from 'lodash-es';
import classnames from 'classnames';
import { IMAGE_TYPE, VIDEO_TYPE} from "@sixa/wp-block-utils";
import { isPositionCenter, positionToClassName } from "@sixa/wp-block-utils";
import { blockClassName } from "@sixa/wp-block-utils";
import {
	normalizeDimRatio,
	normalizeFocalPointPosition,
	normalizeBackgroundUrl,
	normalizeSpacingStyles
} from "@sixa/wp-block-utils";

/**
 * Constants
 */
const BLOCK_CLASSNAME = blockClassName( 'container' );

/**
 * WordPress dependencies
 */
const { useBlockProps, InnerBlocks, getColorClassName, __experimentalGetGradientClass } = wp.blockEditor;

const save = ( { attributes } ) => {
	let positionValue = noop;
	const {
			width,
			backgroundType,
			gradient,
			customGradient,
			textColor,
			customTextColor,
			overlayColor,
			customOverlayColor,
			dimRatio,
			focalPoint,
			contentPosition,
			isRepeated,
			hasParallax,
			url,
			padding,
			margin,
		} = attributes,
		textColorClass = getColorClassName( 'color', textColor ),
		overlayColorClass = getColorClassName( 'background-color', overlayColor ),
		gradientClass = __experimentalGetGradientClass( gradient ),
		isImageBackground = isEqual( backgroundType, IMAGE_TYPE ),
		isVideoBackground = isEqual( backgroundType, VIDEO_TYPE ),
		styles = {
			...normalizeSpacingStyles( margin, 'margin' ),
			...normalizeSpacingStyles( padding, 'padding' ),
			...( isImageBackground ? normalizeBackgroundUrl( url ) : {} ),
		},
		videoStyles = {};

	if ( ! textColorClass ) {
		set( styles, 'color', customTextColor );
	}

	if ( ! overlayColorClass ) {
		set( styles, 'backgroundColor', customOverlayColor );
	}

	if ( customGradient && ! url ) {
		set( styles, 'background', customGradient );
	}

	if ( focalPoint ) {
		positionValue = normalizeFocalPointPosition( focalPoint );

		if ( isImageBackground && ! hasParallax ) {
			set( styles, 'backgroundPosition', positionValue );
		}

		if ( isVideoBackground ) {
			set( videoStyles, 'objectPosition', positionValue );
		}
	}

	return (
		<div
			{ ...useBlockProps.save( {
				className: classnames( normalizeDimRatio( dimRatio ), positionToClassName( contentPosition ), {
					'has-parallax': hasParallax,
					'is-repeated': isRepeated,
					'has-background-dim': !! url && ! isEqual( dimRatio, 0 ),
					'has-background-gradient': gradient || customGradient,
					'has-custom-content-position': ! isPositionCenter( contentPosition ),
					[ textColorClass ]: textColorClass,
					[ overlayColorClass ]: overlayColorClass,
					[ gradientClass ]: ! url && gradientClass,
				} ),
				style: { ...styles },
			} ) }
		>
			{ url && ( gradient || customGradient ) && ! isEqual( dimRatio, 0 ) && (
				<span
					aria-hidden="true"
					className={ classnames( `${ BLOCK_CLASSNAME }__gradient-background`, gradientClass ) }
					style={ customGradient ? { background: customGradient } : noop }
				/>
			) }
			{ isVideoBackground && url && (
				<video
					className={ `${ BLOCK_CLASSNAME }__video-background` }
					autoPlay
					muted
					loop
					playsInline
					src={ url }
					style={ { ...videoStyles } }
				/>
			) }
			<div
				className={ `${ BLOCK_CLASSNAME }__content` }
				style={ { maxWidth: width ? `${ parseFloat( width ) }px` : noop() } }
			>
				<InnerBlocks.Content />
			</div>
		</div>
	);
};

export default save;
