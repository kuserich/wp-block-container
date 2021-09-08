/* eslint-disable @wordpress/no-unsafe-wp-apis */

/**
 * Utility for libraries from the `Lodash`.
 */
import { isEqual, set } from 'lodash';

/**
 * Utility for conditionally joining CSS class names together.
 */
import classnames from 'classnames';

/**
 * Utility helper methods specific for Sixa projects.
 */
import {
	blockClassName,
	backgroundImageStyle,
	dimRatioClassName,
	focalPointStyle,
	isNonEmptyArray,
	isPositionCenter,
	positionToClassName,
} from '@sixa/wp-block-utils';

/**
 * Data module to manage application state for both plugins and WordPress itself.
 * The data module is built upon and shares many of the same core principles of Redux.
 *
 * @see    https://developer.wordpress.org/block-editor/reference-guides/packages/packages-data/
 */
import { useSelect } from '@wordpress/data';

/**
 * WordPress specific abstraction layer atop React.
 *
 * @see    https://developer.wordpress.org/block-editor/reference-guides/packages/packages-element/
 */
import { useMemo, useState } from '@wordpress/element';

/**
 * EventManager for JavaScript.
 * Hooks are used to manage component state and lifecycle.
 *
 * @see    https://developer.wordpress.org/block-editor/reference-guides/packages/packages-hooks/
 */
import { doAction, applyFilters } from '@wordpress/hooks';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see    https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/
 */
import { useBlockProps, InnerBlocks, withColors, __experimentalUseGradient, __experimentalUseInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Block Toolbar controls settings.
 */
import Controls from './components/Controls';

/**
 * Inspector Controls sidebar settings.
 */
import Inspector from './components/Inspector';

/**
 * Helper constants.
 */
import Constants from './constants';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see 	  https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 * @param 	  {Object}         props    		        Block meta-data properties.
 * @param 	  {Object} 	       props.attributes         Block attributes.
 * @param 	  {string} 	       props.clientId           The block’s client id.
 * @param 	  {Object} 	       props.overlayColor       An object containing the overlay background-color class name and a hex value of it.
 * @param 	  {Function} 	   props.setAttributes      Update block attributes.
 * @param 	  {Function} 	   props.setOverlayColor    Function to update the overlay background-color.
 * @param 	  {Function} 	   props.setTextColor    	Function to update the text color.
 * @param 	  {Object} 	       props.textColor    	    An object containing the text-color class name and a hex value of it.
 * @return    {JSX.Element} 			  		        Element to render.
 */
function Edit( { attributes, clientId, overlayColor, setAttributes, setOverlayColor, setTextColor, textColor } ) {
	let positionValue;
	const {
		backgroundSize,
		backgroundType,
		contentPosition,
		dimRatio,
		focalPoint,
		hasParallax,
		isFullHeight,
		isRepeated,
		minHeight,
		title,
		url,
		width,
	} = attributes;
	const { gradientClass: overlayGradientClass, gradientValue: overlayGradientValue, setGradient: setOverlayGradient } = __experimentalUseGradient();
	const backgroundSizeSelection = backgroundSize?.selection;
	const isDimRatio = isEqual( dimRatio, 0 );
	const isImageBackground = isEqual( backgroundType, Constants.IMAGE_MEDIA_TYPE );
	const isVideoBackground = isEqual( backgroundType, Constants.VIDEO_MEDIA_TYPE );
	const styles = {
		...( isImageBackground ? backgroundImageStyle( url ) : {} ),
	};
	const [ beforeContent, setBeforeContent ] = useState( null );
	const [ afterContent, setAfterContent ] = useState( null );
	const { hasInnerBlocks } = useSelect(
		( select ) => {
			const { getBlocks } = select( 'core/block-editor' );

			return {
				hasInnerBlocks: isNonEmptyArray( getBlocks( clientId ) ),
			};
		},
		[ clientId ]
	);
	const { overlayColorClass, overlayColorValue, textColorClass, textColorValue } = useMemo(
		() => ( {
			overlayColorClass: overlayColor?.class,
			overlayColorValue: overlayColor?.color,
			textColorClass: textColor?.class,
			textColorValue: textColor?.color,
		} ),
		[ overlayColor, textColor ]
	);

	if ( ! overlayColorClass ) {
		set( styles, 'backgroundColor', overlayColorValue );
	}

	if ( ! textColorClass ) {
		set( styles, 'color', textColorValue );
	}

	if ( overlayGradientValue && ! url ) {
		set( styles, 'background', overlayGradientValue );
	}

	if ( focalPoint ) {
		positionValue = focalPointStyle( focalPoint );
		if ( isImageBackground ) {
			set( styles, 'backgroundPosition', positionValue );
		}
	}

	if ( isEqual( 'custom', backgroundSizeSelection ) ) {
		set( styles, 'backgroundSize', `${ backgroundSize?.width } ${ backgroundSize?.height }` );
	}

	if ( minHeight ) {
		set( styles, 'minHeight', `${ minHeight }px` );
	}

	// To render the block element wrapper for the block’s `Edit` implementation.
	const blockProps = useBlockProps( {
		className: classnames( dimRatioClassName( dimRatio ), positionToClassName( contentPosition ), {
			'is-repeated': isRepeated,
			'is-full-height': isFullHeight,
			'has-background': overlayColorClass,
			'has-background-dim': !! url && ! Boolean( isDimRatio ),
			'has-background-gradient': overlayGradientValue,
			[ `has-background-size-${ backgroundSizeSelection }` ]: backgroundSizeSelection,
			'has-custom-content-position': ! isPositionCenter( contentPosition ),
			'has-parallax': hasParallax,
			'has-text-color': textColorClass,
			[ textColorClass ]: textColorClass,
			[ overlayColorClass ]: overlayColorClass,
			[ overlayGradientClass ]: ! url && overlayGradientClass,
		} ),
		style: styles,
	} );
	const className = blockClassName( blockProps?.className );
	const innerBlocksProps = __experimentalUseInnerBlocksProps(
		{
			className: `${ className }__content`,
			style: { maxWidth: width ? `${ width }px` : undefined },
		},
		{
			renderAppender: ! hasInnerBlocks && InnerBlocks.ButtonBlockAppender,
			templateLock: false,
		}
	);

	doAction( 'sixa.containerBeforeContent', attributes, className, setBeforeContent );
	doAction( 'sixa.containerAfterContent', attributes, className, setAfterContent );

	return (
		<div { ...blockProps }>
			{ applyFilters( 'sixa.containerBeforeContent', beforeContent, attributes ) }
			{ title && <span className={ `${ className }__title` }>{ title }</span> }
			{ url && overlayGradientValue && ! isDimRatio && (
				<span
					aria-hidden
					className={ classnames( `${ className }__gradient-background`, overlayGradientClass ) }
					style={ { background: overlayGradientValue } }
				/>
			) }
			{ isVideoBackground && (
				<video loop muted autoPlay src={ url } style={ { objectPosition: positionValue } } className={ `${ className }__video-background` } />
			) }
			<div { ...innerBlocksProps } />
			{ applyFilters( 'sixa.containerAfterContent', afterContent, attributes ) }
			<Controls attributes={ attributes } setAttributes={ setAttributes } />
			<Inspector
				attributes={ attributes }
				overlayColor={ { overlayColorValue, setOverlayColor } }
				overlayGradient={ { overlayGradientValue, setOverlayGradient } }
				setAttributes={ setAttributes }
				textColor={ { textColorValue, setTextColor } }
			/>
		</div>
	);
}

export default withColors( { textColor: 'color' }, { overlayColor: 'background-color' } )( Edit );
