/* eslint-disable @wordpress/no-unsafe-wp-apis */

/**
 * Utility for libraries from the `Lodash`.
 */
import { get, set, isEqual, noop } from 'lodash';

/**
 * Utility for conditionally joining CSS class names together.
 */
import classnames from 'classnames';

/**
 * Utility helper methods specific for Sixa projects.
 */
import { blockClassName, isPositionCenter, dimRatioClassName, positionToClassName, backgroundImageStyle, focalPointStyle } from '@sixach/wp-block-utils';

/**
 * Data module to manage application state for both plugins and WordPress itself.
 * The data module is built upon and shares many of the same core principles of Redux.
 *
 * @see    https://github.com/WordPress/gutenberg/tree/HEAD/packages/data/README.md
 */
import { withSelect, useSelect } from '@wordpress/data';

/**
 * WordPress specific abstraction layer atop React.
 *
 * @see    https://github.com/WordPress/gutenberg/tree/HEAD/packages/element/README.md
 */
import { useState } from '@wordpress/element';

/**
 * EventManager for JavaScript.
 * Hooks are used to manage component state and lifecycle.
 *
 * @see    https://github.com/WordPress/gutenberg/blob/trunk/packages/hooks/README.md
 */
import { applyFilters, doAction } from '@wordpress/hooks';

/**
 * The compose package is a collection of handy Hooks and Higher Order Components (HOCs).
 * The compose function is an alias to `flowRight` from Lodash.
 *
 * @see    https://github.com/WordPress/gutenberg/blob/trunk/packages/compose/README.md
 */
import { compose, withInstanceId } from '@wordpress/compose';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
 */
import {
	useBlockProps,
	InnerBlocks,
	withColors,
	__experimentalUseGradient,
	__experimentalUseInnerBlocksProps as useInnerBlocksProps,
} from '@wordpress/block-editor';

/**
 * Utility helper methods/variables.
 */
import utils from './utils';

/**
 * Block Toolbar controls settings.
 */
import Controls from './controls';

/**
 * Inspector Controls sidebar settings.
 */
import Inspector from './inspector';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see 	  https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 * @param 	  {Object}       props    Block meta-data properties.
 * @return    {WPElement} 			  Element to render.
 */
function Edit( props ) {
	let positionValue = noop();
	const [ beforeContent, setBeforeContent ] = useState( null );
	const [ afterContent, setAfterContent ] = useState( null );
	const { clientId, getBlock, isSelected, attributes, textColor, overlayColor, useGradient, isImageBackground, isVideoBackground } = props;
	const { url, width, hasParallax, isRepeated, isFullHeight, dimRatio, focalPoint, contentPosition, backgroundSize, minHeight } = attributes;
	const { gradientClass, gradientValue } = useGradient;
	const textColorClass = get( textColor, 'class' );
	const overlayColorClass = get( overlayColor, 'class' );
	const isDimRatio = isEqual( dimRatio, 0 );
	const backgroundSizeSelection = backgroundSize?.selection;
	const styles = {
		...( isImageBackground ? backgroundImageStyle( url ) : {} ),
	};
	const { hasInnerBlocks } = useSelect( () => {
		const block = getBlock( clientId );

		return {
			hasInnerBlocks: !! ( block && block.innerBlocks.length ),
		};
	} );

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
		positionValue = focalPointStyle( focalPoint );
		if ( isImageBackground ) {
			set( styles, 'backgroundPosition', positionValue );
		}
	}

	if ( 'custom' === backgroundSizeSelection ) {
		set( styles, 'backgroundSize', `${ backgroundSize?.width } ${ backgroundSize?.height }` );
	}

	if ( minHeight ) {
		set( styles, 'minHeight', `${ minHeight }px` );
	}

	// To render the block element wrapper for the block’s `Edit` implementation.
	const blockProps = useBlockProps( {
		className: classnames( dimRatioClassName( dimRatio ), positionToClassName( contentPosition ), {
			'has-parallax': hasParallax,
			'is-repeated': isRepeated,
			'is-full-height': isFullHeight,
			'has-text-color': textColorClass,
			'has-background': overlayColorClass,
			'has-background-dim': !! url && ! isDimRatio,
			'has-background-gradient': gradientValue,
			'has-custom-content-position': ! isPositionCenter( contentPosition ),
			[ `has-background-size-${ backgroundSizeSelection }` ]: backgroundSizeSelection,
			[ textColorClass ]: textColorClass,
			[ overlayColorClass ]: overlayColorClass,
			[ gradientClass ]: ! url && gradientClass,
		} ),
		style: { ...styles },
	} );
	const className = blockClassName( get( blockProps, 'className' ) );
	const innerBlocksProps = useInnerBlocksProps(
		{
			className: `${ className }__content`,
			style: { maxWidth: width ? `${ width }px` : noop() },
		},
		{
			templateLock: false,
			renderAppender: ! hasInnerBlocks && InnerBlocks.ButtonBlockAppender,
		}
	);

	doAction( 'sixa.containerBeforeContent', attributes, className, setBeforeContent );
	doAction( 'sixa.containerAfterContent', attributes, className, setAfterContent );

	return (
		<>
			<div { ...blockProps }>
				{ applyFilters( 'sixa.containerBeforeContent', beforeContent, attributes ) }
				{ url && gradientValue && ! isEqual( dimRatio, 0 ) && (
					<span
						aria-hidden="true"
						style={ { background: gradientValue } }
						className={ classnames( `${ className }__gradient-background`, gradientClass ) }
					/>
				) }
				{ isVideoBackground && (
					<video loop muted autoPlay src={ url } style={ { objectPosition: positionValue } } className={ `${ className }__video-background` } />
				) }
				<div { ...innerBlocksProps } />
				{ applyFilters( 'sixa.containerAfterContent', afterContent, attributes ) }
			</div>
			{ isSelected && (
				<>
					<Controls { ...props } utils={ utils } />
					<Inspector { ...props } utils={ utils } />
				</>
			) }
		</>
	);
}

export default compose( [
	withInstanceId,
	withColors( { textColor: 'color' }, { overlayColor: 'background-color' } ),
	withSelect( ( select, { attributes } ) => {
		const { getBlock } = select( 'core/block-editor' );
		const { backgroundType } = attributes;

		return {
			getBlock,
			useGradient: __experimentalUseGradient(),
			isImageBackground: isEqual( backgroundType, 'image' ),
			isVideoBackground: isEqual( backgroundType, 'video' ),
		};
	} ),
] )( Edit );
