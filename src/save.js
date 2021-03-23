/**
 * External dependencies
 */
import { isEqual, noop, set } from 'lodash-es';
import classnames from 'classnames';
import {
	PREFIX,
	IMAGE_TYPE,
	VIDEO_TYPE,
	focalPointPosition,
	backgroundImageStyles,
	dimRatioToClassName,
	normalizeSpacingStyles
} from '@sixa/wp-block-utils';

/**
 * WordPress dependencies
 */
const { InnerBlocks, getColorClassName, __experimentalGetGradientClass } = wp.blockEditor;

const BLOCK_CLASSNAME = `wp-block-${ PREFIX }-container`;

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
			hasParallax,
			isRepeated,
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
			...( isImageBackground ? backgroundImageStyles( url ) : {} ),
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
		positionValue = focalPointPosition( focalPoint );

		if ( isImageBackground && ! hasParallax ) {
			set( styles, 'backgroundPosition', positionValue );
		}

		if ( isVideoBackground ) {
			set( videoStyles, 'objectPosition', positionValue );
		}
	}

	return (
		<div
			className={ classnames( dimRatioToClassName( dimRatio ), {
				'has-parallax': hasParallax,
				'is-repeated': isRepeated,
				'has-background-dim': !! url && ! isEqual( dimRatio, 0 ),
				'has-background-gradient': gradient || customGradient,
				[ textColorClass ]: textColorClass,
				[ overlayColorClass ]: overlayColorClass,
				[ gradientClass ]: ! url && gradientClass,
			} ) }
			style={ { ...styles } }
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
