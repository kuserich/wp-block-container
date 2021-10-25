/* eslint-disable @wordpress/no-unsafe-wp-apis */

/**
 * Utility for libraries from the `Lodash`.
 */
import isEqual from 'lodash/isEqual';

/**
 * Runtime type checking for React props and similar objects.
 */
import PropTypes from 'prop-types';

/**
 * Helper React components specific for Sixa projects.
 */
import { BackgroundSizeControl } from '@sixa/wp-block-components';

/**
 * Internationalization utilities for client-side localization.
 *
 * @see    https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * This module allows you to create and use standalone block-editor element and components.
 *
 * @see    https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/
 */
import { ContrastChecker, InspectorAdvancedControls, InspectorControls, __experimentalPanelColorGradientSettings } from '@wordpress/block-editor';

/**
 * This packages includes a library of generic WordPress components to be used for
 * creating common UI elements shared between screens and features of the WordPress dashboard.
 *
 * @see    https://developer.wordpress.org/block-editor/reference-guides/packages/packages-components/
 */
import {
	Button,
	FocalPointPicker,
	PanelBody,
	PanelRow,
	RangeControl,
	TextControl,
	ToggleControl,
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';

/**
 * Helper constants.
 */
import Constants from '../constants';

/**
 * Inspector Controls appear in the post settings sidebar when a block is being edited.
 *
 * @see 	  https://github.com/WordPress/gutenberg/blob/master/packages/block-editor/src/components/inspector-controls/README.md
 * @param 	  {Object} 	       props 				    Block meta-data properties.
 * @param 	  {Object} 	       props.attributes         Block attributes.
 * @param     {Object}  	   props.overlayColor 	    An object containing the hex overlay color and a function to update it.
 * @param     {Object}  	   props.overlayGradient    An object containing the gradient value and a function to update it.
 * @param     {Function}       props.setAttributes      Update block attributes.
 * @param     {Object}  	   props.textColor 	        An object containing the hex text color and a function to update it.
 * @return    {JSX.Element}     						Inspector element to render.
 */
function Inspector( { attributes, overlayColor, overlayGradient, setAttributes, textColor } ) {
	const { backgroundSize, backgroundType, dimRatio, focalPoint, hasParallax, isFullHeight, isRepeated, minHeight, title, url, width } = attributes;
	const { overlayColorValue, setOverlayColor } = overlayColor;
	const { textColorValue, setTextColor } = textColor;
	const { overlayGradientValue, setOverlayGradient } = overlayGradient;
	const isImageBackground = isEqual( backgroundType, Constants.IMAGE_MEDIA_TYPE );
	const isVideoBackground = isEqual( backgroundType, Constants.VIDEO_MEDIA_TYPE );
	const showFocalPointPicker = isVideoBackground || ( isImageBackground && ( ! hasParallax || isRepeated ) );

	return (
		<>
			<InspectorControls>
				<PanelBody initialOpen>
					<UnitControl
						label={ __( 'Width', 'sixa-block-container' ) }
						onChange={ ( value ) => setAttributes( { width: value } ) }
						value={ width }
						style={ { marginRight: '4%', width: '48%', display: 'inline-block' } }
					/>
					{ ! isFullHeight && (
						<UnitControl
							label={ __( 'Min. Height', 'sixa-block-container' ) }
							onChange={ ( value ) => setAttributes( { minHeight: value } ) }
							value={ minHeight }
							style={ { width: '48%', display: 'inline-block' } }
						/>
					) }
				</PanelBody>
				{ url && (
					<PanelBody title={ __( 'Media Settings', 'sixa-block-container' ) } initialOpen>
						{ isImageBackground && (
							<>
								<ToggleControl
									checked={ Boolean( hasParallax ) }
									label={ __( 'Fixed background', 'sixa-block-container' ) }
									onChange={ () =>
										setAttributes( {
											hasParallax: ! hasParallax,
											...( ! hasParallax ? { focalPoint: undefined } : {} ),
										} )
									}
								/>
								<ToggleControl
									checked={ Boolean( isRepeated ) }
									label={ __( 'Repeated background', 'sixa-block-container' ) }
									onChange={ () => setAttributes( { isRepeated: ! isRepeated } ) }
								/>
								<BackgroundSizeControl
									label={ __( 'Background Size', 'sixa-block-container' ) }
									value={ backgroundSize }
									onChange={ ( value ) => setAttributes( { backgroundSize: value } ) }
								/>
							</>
						) }
						{ showFocalPointPicker && (
							<FocalPointPicker
								label={ __( 'Focal point picker', 'sixa-block-container' ) }
								onChange={ ( value ) => setAttributes( { focalPoint: value } ) }
								url={ url }
								value={ focalPoint }
							/>
						) }
						<PanelRow>
							<Button
								className="block-library-cover__reset-button"
								isDestructive
								isSmall
								onClick={ () =>
									setAttributes( {
										backgroundType: undefined,
										backgroundSize: undefined,
										dimRatio: undefined,
										focalPoint: undefined,
										hasParallax: undefined,
										id: undefined,
										isRepeated: undefined,
										url: undefined,
									} )
								}
							>
								{ __( 'Clear Media', 'sixa-block-container' ) }
							</Button>
						</PanelRow>
					</PanelBody>
				) }
				<__experimentalPanelColorGradientSettings
					initialOpen={ false }
					settings={ [
						{
							colorValue: textColorValue,
							label: __( 'Text', 'sixa-block-container' ),
							onColorChange: setTextColor,
						},
						{
							colorValue: overlayColorValue,
							gradientValue: overlayGradientValue,
							label: __( 'Overlay', 'sixa-block-container' ),
							onColorChange: setOverlayColor,
							onGradientChange: setOverlayGradient,
						},
					] }
					title={ __( 'Color Settings', 'sixa-block-container' ) }
				>
					{ url && (
						<RangeControl
							allowReset
							label={ __( 'Opacity', 'sixa-block-container' ) }
							min={ 0 }
							max={ 100 }
							onChange={ ( value ) => setAttributes( { dimRatio: value } ) }
							resetFallbackValue={ 0 }
							step={ 10 }
							value={ dimRatio }
						/>
					) }
					<ContrastChecker
						{ ...{
							backgroundColor: overlayColor?.color,
							textColor: textColor?.color,
						} }
						isLargeText={ false }
					/>
				</__experimentalPanelColorGradientSettings>
			</InspectorControls>
			<InspectorAdvancedControls>
				<TextControl
					help={ __( 'Enter a title for this section to display on the left side of the container.', 'sixa-block-container' ) }
					label={ __( 'Title', 'sixa-block-container' ) }
					onChange={ ( value ) => setAttributes( { title: value } ) }
					value={ title }
				/>
			</InspectorAdvancedControls>
		</>
	);
}

Inspector.propTypes = {
	attributes: PropTypes.object.isRequired,
	overlayColor: PropTypes.exact( {
		overlayColorValue: PropTypes.string.isRequired,
		setOverlayColor: PropTypes.func.isRequired,
	} ),
	overlayGradient: PropTypes.exact( {
		overlayGradientValue: PropTypes.string.isRequired,
		setOverlayGradient: PropTypes.func.isRequired,
	} ),
	setAttributes: PropTypes.func.isRequired,
	textColor: PropTypes.exact( {
		textColorValue: PropTypes.string.isRequired,
		setTextColor: PropTypes.func.isRequired,
	} ),
};

Inspector.defaultProps = {
	attributes: {},
	overlayColor: {},
	overlayGradient: {},
	setAttributes: () => {},
	textColor: {},
};

export default Inspector;
