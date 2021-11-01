/* eslint-disable @wordpress/no-unsafe-wp-apis */

/**
 * Utility for libraries from the `Lodash`.
 */
import { isEqual, get, set } from 'lodash';

/**
 * Utility for conditionally joining CSS class names together.
 */
import classnames from 'classnames';

/**
 * Utility helper methods specific for Sixa projects.
 */
import { blockClassName, backgroundImageStyle, dimRatioClassName, focalPointStyle, isPositionCenter, positionToClassName } from '@sixa/wp-block-utils';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see    https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
 */
import { useBlockProps, InnerBlocks, getColorClassName, __experimentalGetGradientClass } from '@wordpress/block-editor';

/**
 * Helper constants.
 */
import Constants from './constants';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see 	  https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#save
 * @param 	  {Object} 		   props               Block meta-data properties.
 * @param 	  {Object} 		   props.attributes    Block attributes.
 * @return    {JSX.Element} 					   Container element to render.
 */
function save( { attributes } ) {
	let positionValue;
	const {
		backgroundSize,
		backgroundType,
		customGradient: customOverlayGradient,
		customOverlayColor,
		contentPosition,
		customTextColor,
		dimRatio,
		focalPoint,
		gradient: overlayGradient,
		hasParallax,
		isFullHeight,
		isRepeated,
		minHeight,
		overlayColor,
		textColor,
		title,
		url,
		width,
	} = attributes;
	const backgroundSizeSelection = backgroundSize?.selection;
	const textColorClass = getColorClassName( 'color', textColor );
	const overlayColorClass = getColorClassName( 'background-color', overlayColor );
	const isDimRatio = isEqual( dimRatio, 0 );
	const overlayGradientClass = __experimentalGetGradientClass( overlayGradient );
	const isImageBackground = isEqual( backgroundType, Constants.IMAGE_MEDIA_TYPE );
	const isVideoBackground = isEqual( backgroundType, Constants.VIDEO_MEDIA_TYPE );
	const styles = {
		...( isImageBackground ? backgroundImageStyle( url ) : {} ),
	};
	const videoStyles = {};

	if ( ! overlayColorClass ) {
		set( styles, 'backgroundColor', customOverlayColor );
	}

	if ( ! textColorClass ) {
		set( styles, 'color', customTextColor );
	}

	if ( customOverlayGradient && ! url ) {
		set( styles, 'background', customOverlayGradient );
	}

	if ( focalPoint ) {
		positionValue = focalPointStyle( focalPoint );

		if ( isImageBackground ) {
			set( styles, 'backgroundPosition', positionValue );
		}

		if ( isVideoBackground ) {
			set( videoStyles, 'objectPosition', positionValue );
		}
	}

	if ( isEqual( 'custom', backgroundSizeSelection ) ) {
		set( styles, 'backgroundSize', `${ backgroundSize?.width } ${ backgroundSize?.height }` );
	}

	if ( minHeight ) {
		set( styles, 'minHeight', minHeight );
	}

	// Generated class names and styles for this block.
	const blockProps = useBlockProps.save( {
		className: classnames( dimRatioClassName( dimRatio ), positionToClassName( contentPosition ), {
			'is-repeated': isRepeated,
			'is-full-height': isFullHeight,
			'has-background': overlayColorClass,
			'has-background-dim': url && ! Boolean( isDimRatio ),
			'has-background-gradient': overlayGradient || customOverlayGradient,
			[ `has-background-size-${ backgroundSizeSelection }` ]: url && backgroundSizeSelection,
			'has-custom-content-position': ! isPositionCenter( contentPosition ),
			'has-parallax': hasParallax,
			'has-text-color': textColorClass,
			[ textColorClass ]: textColorClass,
			[ overlayColorClass ]: overlayColorClass,
			[ overlayGradientClass ]: ! url && overlayGradientClass,
		} ),
		style: { ...styles },
	} );
	const className = blockClassName( get( blockProps, 'className' ) );

	return (
		<div { ...blockProps }>
			{ title && <span className={ `${ className }__title` }>{ title }</span> }
			{ url && ( overlayGradient || customOverlayGradient ) && ! isDimRatio && (
				<span
					aria-hidden
					className={ classnames( `${ className }__gradient-background`, overlayGradientClass ) }
					style={ customOverlayGradient ? { background: customOverlayGradient } : undefined }
				/>
			) }
			{ isVideoBackground && url && (
				<video autoPlay className={ `${ className }__video-background` } loop muted playsInline src={ url } style={ { ...videoStyles } } />
			) }
			<div className={ `${ className }__content` } style={ { width: width ? `min(${ width }, 100%)` : undefined } }>
				<InnerBlocks.Content />
			</div>
		</div>
	);
}

export default save;
