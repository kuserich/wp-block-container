/* eslint-disable @wordpress/no-unsafe-wp-apis */

/**
 * Utility for libraries from the `Lodash`.
 */
import { isEqual, noop, get, set } from 'lodash';

/**
 * Utility for conditionally joining CSS class names together.
 */
import classnames from 'classnames';

/**
 * Utility helper methods specific for Sixa projects.
 */
import { blockClassName, isPositionCenter, dimRatioClassName, positionToClassName, backgroundImageStyle, focalPointStyle } from '@sixach/wp-block-utils';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see    https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
 */
import { useBlockProps, InnerBlocks, getColorClassName, __experimentalGetGradientClass } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see 	  https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#save
 * @param     {Object}    	 props 				 Block meta-data properties.
 * @param     {Object}  	 props.attributes    Block attributes.
 * @return    {WPElement} 						 Element to render.
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
		minHeight,
	} = attributes;
	const textColorClass = getColorClassName( 'color', textColor );
	const overlayColorClass = getColorClassName( 'background-color', overlayColor );
	const isDimRatio = isEqual( dimRatio, 0 );
	const backgroundSizeSelection = backgroundSize?.selection;
	const gradientClass = __experimentalGetGradientClass( gradient );
	const isImageBackground = isEqual( backgroundType, 'image' );
	const isVideoBackground = isEqual( backgroundType, 'video' );
	const styles = {
		...( isImageBackground ? backgroundImageStyle( url ) : {} ),
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
		positionValue = focalPointStyle( focalPoint );

		if ( isImageBackground && ! hasParallax ) {
			set( styles, 'backgroundPosition', positionValue );
		}

		if ( isVideoBackground ) {
			set( videoStyles, 'objectPosition', positionValue );
		}
	}

	if ( 'custom' === backgroundSizeSelection ) {
		set( styles, 'backgroundSize', `${ backgroundSize?.width } ${ backgroundSize?.height }` );
	}

	if ( minHeight ) {
		set( styles, 'minHeight', `${ minHeight }px` );
	}

	// Generated class names and styles for this block.
	const blockProps = useBlockProps.save( {
		className: classnames( dimRatioClassName( dimRatio ), positionToClassName( contentPosition ), {
			'has-parallax': hasParallax,
			'is-repeated': isRepeated,
			'is-full-height': isFullHeight,
			'has-text-color': textColorClass,
			'has-background': overlayColorClass,
			'has-background-dim': !! url && ! isDimRatio,
			'has-background-gradient': gradient || customGradient,
			'has-custom-content-position': ! isPositionCenter( contentPosition ),
			[ `has-background-size-${ backgroundSizeSelection }` ]: backgroundSizeSelection,
			[ textColorClass ]: textColorClass,
			[ overlayColorClass ]: overlayColorClass,
			[ gradientClass ]: ! url && gradientClass,
		} ),
		style: { ...styles },
	} );
	const className = blockClassName( get( blockProps, 'className' ) );

	return (
		<div { ...blockProps }>
			{ url && ( gradient || customGradient ) && ! isDimRatio && (
				<span
					aria-hidden="true"
					style={ customGradient ? { background: customGradient } : noop }
					className={ classnames( `${ className }__gradient-background`, gradientClass ) }
				/>
			) }
			{ isVideoBackground && url && (
				<video loop muted autoPlay playsInline src={ url } style={ { ...videoStyles } } className={ `${ className }__video-background` } />
			) }
			<div className={ `${ className }__content` } style={ { maxWidth: width ? `${ width }px` : noop() } }>
				<InnerBlocks.Content />
			</div>
		</div>
	);
}
