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
 * Data module to manage application state for both plugins and WordPress itself.
 * The data module is built upon and shares many of the same core principles of Redux.
 *
 * @see https://github.com/WordPress/gutenberg/tree/HEAD/packages/data/README.md
 */
import { withSelect, useSelect } from '@wordpress/data';

/**
 * The compose package is a collection of handy Hooks and Higher Order Components (HOCs).
 * The compose function is an alias to `flowRight` from Lodash.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/packages/compose/README.md
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
 * Constants.
 */
const CLASSNAME = blockClassName( 'container' );

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see 	https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 * @param 	{Object}  props 	Block meta-data properties.
 * @return 	{WPElement} 		Element to render.
 */
function Edit( props ) {
	let positionValue = noop();
	const {
		clientId,
		getBlock,
		isSelected,
		attributes,
		textColor,
		overlayColor,
		useGradient,
		isImageBackground,
		isVideoBackground,
	} = props;
	const { url, width, hasParallax, isRepeated, isFullHeight, dimRatio, focalPoint, contentPosition, backgroundSize } = attributes;
	const { gradientClass, gradientValue } = useGradient;
	const textColorClass = get( textColor, 'class' );
	const overlayColorClass = get( overlayColor, 'class' );
	const isDimRatio = isEqual( dimRatio, 0 );
	const styles = {
		...( isImageBackground ? normalizeBackgroundUrl( url ) : {} ),
	};
	const { hasInnerBlocks } = useSelect( () => {
		const block = getBlock( clientId );

		return {
			hasInnerBlocks: !! ( block && block.innerBlocks.length ),
		};
	} );
	const innerBlocksProps = useInnerBlocksProps(
		{
			className: `${ CLASSNAME }__content`,
			style: { maxWidth: width ? `${ parseFloat( width ) }px` : noop() },
		},
		{
			templateLock: false,
			renderAppender: ! hasInnerBlocks && InnerBlocks.ButtonBlockAppender,
		}
	);

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

	if ( backgroundSize.selection !== 'auto' ) {
		set( styles, 'backgroundSize', normalizeBackgroundSizeStyle( backgroundSize ) );
	}

	return (
		<>
			<div
				{ ...useBlockProps( {
					className: classnames( normalizeDimRatio( dimRatio ), positionToClassName( contentPosition ), {
						'has-parallax': hasParallax,
						'is-repeated': isRepeated,
						'is-full-height': isFullHeight,
						'has-background-dim': !! url && ! isDimRatio,
						'has-background-gradient': gradientValue,
						'has-custom-content-position': ! isPositionCenter( contentPosition ),
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
						style={ { background: gradientValue } }
						className={ classnames( `${ CLASSNAME }__gradient-background`, gradientClass ) }
					/>
				) }
				{ isVideoBackground && (
					<video
						loop
						muted
						autoPlay
						src={ url }
						style={ { objectPosition: positionValue } }
						className={ `${ CLASSNAME }__video-background` }
					/>
				) }
				<div { ...innerBlocksProps } />
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
	withSelect( ( select, { overlayColor, attributes } ) => {
		const { getBlock } = select( 'core/block-editor' );
		const { url, backgroundType } = attributes;

		return {
			getBlock,
			useGradient: __experimentalUseGradient(),
			isImageBackground: isEqual( backgroundType, IMAGE_TYPE ),
			isVideoBackground: isEqual( backgroundType, VIDEO_TYPE ),
			hasBackground: !! ( url || get( overlayColor, 'color' ) ),
		};
	} ),
] )( Edit );
