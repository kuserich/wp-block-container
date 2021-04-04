/* eslint-disable @wordpress/no-unsafe-wp-apis */

/**
 * Utility for libraries from the `Lodash`.
 */
import { isEqual, noop, set } from 'lodash';

/**
 * Utility for conditionally joining CSS class names together.
 */
import classnames from 'classnames';

/**
 * Utility helper methods specific for Sixa projects.
 */
import {
	IMAGE_TYPE,
	VIDEO_TYPE,
	blockClassName,
	isPositionCenter,
	normalizeDimRatio,
	positionToClassName,
	normalizeBackgroundUrl,
	normalizeFocalPointPosition,
	normalizeBackgroundSizeStyle,
} from '@sixa/wp-block-utils';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
 */
import { useBlockProps, InnerBlocks, getColorClassName, __experimentalGetGradientClass } from '@wordpress/block-editor';

/**
 * Constants.
 */
const CLASSNAME = blockClassName( 'container' );

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see 	https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#save
 * @param   {Object}    props 				Block meta-data properties.
 * @param   {Object}  	props.attributes 	Block attributes.
 * @return 	{WPElement} 					Element to render.
 */
export default function save( { attributes } ) {
	let positionValue = noop;
	const {
		url,
		width,
		hasParallax,
		isRepeated,
		isFullHeight,
		dimRatio,
		focalPoint,
		contentPosition,
		backgroundType,
		textColor,
		customTextColor,
		overlayColor,
		customOverlayColor,
		gradient,
		customGradient,
		backgroundSize,
		backgroundWidth,
		backgroundHeight,
	} = attributes;
	const textColorClass = getColorClassName( 'color', textColor );
	const overlayColorClass = getColorClassName( 'background-color', overlayColor );
	const isDimRatio = isEqual( dimRatio, 0 );
	const gradientClass = __experimentalGetGradientClass( gradient );
	const isImageBackground = isEqual( backgroundType, IMAGE_TYPE );
	const isVideoBackground = isEqual( backgroundType, VIDEO_TYPE );
	const styles = {
		...( isImageBackground ? normalizeBackgroundUrl( url ) : {} ),
	};
	const videoStyles = {};

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

	if ( backgroundSize !== 'auto' ) {
		set( styles, 'backgroundSize', normalizeBackgroundSizeStyle( backgroundSize, backgroundWidth, backgroundHeight ) );
	}

	return (
		<div
			{ ...useBlockProps.save( {
				className: classnames( normalizeDimRatio( dimRatio ), positionToClassName( contentPosition ), {
					'has-parallax': hasParallax,
					'is-repeated': isRepeated,
					'is-full-height': isFullHeight,
					'has-background-dim': !! url && ! isDimRatio,
					'has-background-gradient': gradient || customGradient,
					'has-custom-content-position': ! isPositionCenter( contentPosition ),
					[ textColorClass ]: textColorClass,
					[ overlayColorClass ]: overlayColorClass,
					[ gradientClass ]: ! url && gradientClass,
				} ),
				style: { ...styles },
			} ) }
		>
			{ url && ( gradient || customGradient ) && ! isDimRatio && (
				<span
					aria-hidden="true"
					style={ customGradient ? { background: customGradient } : noop }
					className={ classnames( `${ CLASSNAME }__gradient-background`, gradientClass ) }
				/>
			) }
			{ isVideoBackground && url && (
				<video
					loop
					muted
					autoPlay
					playsInline
					src={ url }
					style={ { ...videoStyles } }
					className={ `${ CLASSNAME }__video-background` }
				/>
			) }
			<div className={ `${ CLASSNAME }__content` } style={ { maxWidth: width ? `${ parseFloat( width ) }px` : noop() } }>
				<InnerBlocks.Content />
			</div>
		</div>
	);
}
