/* eslint-disable @wordpress/no-unsafe-wp-apis */

/**
 * Helper React components specific for Sixa projects.
 */
import { BackgroundSizeControl } from '@sixach/wp-block-components';

/**
 * Utility for libraries from the `Lodash`.
 */
import { get, noop } from 'lodash';

/**
 * Retrieves the translation of text.
 *
 * @see    https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see    https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
 */
import {
	InspectorControls,
	InspectorAdvancedControls,
	ContrastChecker,
	__experimentalPanelColorGradientSettings as PanelColorGradientSettings,
} from '@wordpress/block-editor';

/**
 * This packages includes a library of generic WordPress components to be used for
 * creating common UI elements shared between screens and features of the WordPress dashboard.
 *
 * @see    https://developer.wordpress.org/block-editor/reference-guides/packages/packages-components/
 */
import { PanelBody, PanelRow, Button, ToggleControl, TextControl, RangeControl, FocalPointPicker } from '@wordpress/components';

/**
 * Inspector Controls appear in the post settings sidebar when a block is being edited.
 *
 * @see       https://github.com/WordPress/gutenberg/blob/master/packages/block-editor/src/components/inspector-controls/README.md
 * @param     {Object}    	 props 					    Block meta-data properties.
 * @param     {Object}    	 props.attributes 		    Block attributes.
 * @param     {Function}  	 props.setAttributes 	    Update block attributes.
 * @param     {Object}    	 props.textColor 	        Color hex code and CSS class name.
 * @param     {Function}  	 props.setTextColor 	    Update color value.
 * @param     {Object}    	 props.overlayColor 	    Overlay background-color hex code and CSS class name.
 * @param     {Function}  	 props.setOverlayColor 	    Update background-color value.
 * @param     {Function}  	 props.useGradient 	        Update, get background gradient color.
 * @param     {boolean}  	 props.isImageBackground 	Whether the background type is an image.
 * @param     {boolean}  	 props.isVideoBackground    Whether the background type is a video.
 * @param     {Object}  	 props.utils 			    Utility helper methods/variables.
 * @return    {WPElement}     						    Inspector element to render.
 */
export default function Inspector( {
	attributes,
	setAttributes,
	textColor,
	setTextColor,
	overlayColor,
	setOverlayColor,
	useGradient,
	isImageBackground,
	isVideoBackground,
	utils,
} ) {
	const thresholds = get( utils, 'thresholds' );
	const { url, width, hasParallax, isRepeated, dimRatio, focalPoint, backgroundSize, minHeight, title } = attributes;
	const { setGradient, gradientValue } = useGradient;
	const showFocalPointPicker = isVideoBackground || ( isImageBackground && ( ! hasParallax || isRepeated ) );

	return (
		<>
			<InspectorControls>
				<PanelBody initialOpen>
					<RangeControl
						allowReset
						value={ width }
						label={ __( 'Width', 'sixa' ) }
						help={ __( 'in pixels', 'sixa' ) }
						min={ get( thresholds, 'width.min' ) }
						max={ get( thresholds, 'width.max' ) }
						onChange={ ( value ) => setAttributes( { width: value } ) }
					/>
					<RangeControl
						allowReset
						value={ minHeight }
						label={ __( 'Min. Height', 'sixa' ) }
						help={ __( 'in pixels', 'sixa' ) }
						min={ get( thresholds, 'height.min' ) }
						max={ get( thresholds, 'height.max' ) }
						onChange={ ( value ) => setAttributes( { minHeight: value } ) }
					/>
				</PanelBody>
				{ !! url && (
					<PanelBody title={ __( 'Media Settings', 'sixa' ) } initialOpen>
						{ isImageBackground && (
							<>
								<ToggleControl
									label={ __( 'Fixed background', 'sixa' ) }
									checked={ hasParallax }
									onChange={ () =>
										setAttributes( {
											hasParallax: ! hasParallax,
											...( ! hasParallax ? { focalPoint: noop() } : {} ),
										} )
									}
								/>
								<ToggleControl
									label={ __( 'Repeated background', 'sixa' ) }
									checked={ isRepeated }
									onChange={ () => setAttributes( { isRepeated: ! isRepeated } ) }
								/>
								<BackgroundSizeControl
									label={ __( 'Background Size', 'sixa' ) }
									value={ backgroundSize }
									onChange={ ( value ) => setAttributes( { backgroundSize: value } ) }
								/>
							</>
						) }
						{ showFocalPointPicker && (
							<FocalPointPicker
								label={ __( 'Focal point picker', 'sixa' ) }
								url={ url }
								value={ focalPoint }
								onChange={ ( value ) => setAttributes( { focalPoint: value } ) }
							/>
						) }
						<PanelRow>
							<Button
								isSmall
								isDestructive
								className="components-button--reset-media"
								onClick={ () =>
									setAttributes( {
										url: noop(),
										id: noop(),
										backgroundType: noop(),
										backgroundSize: noop(),
										dimRatio: noop(),
										focalPoint: noop(),
										hasParallax: noop(),
										isRepeated: noop(),
									} )
								}
							>
								{ __( 'Clear Media', 'sixa' ) }
							</Button>
						</PanelRow>
					</PanelBody>
				) }
				<PanelColorGradientSettings
					title={ __( 'Color Settings', 'sixa' ) }
					initialOpen={ false }
					settings={ [
						{
							label: __( 'Text', 'sixa' ),
							colorValue: get( textColor, 'color' ),
							onColorChange: setTextColor,
						},
						{
							label: __( 'Overlay', 'sixa' ),
							colorValue: get( overlayColor, 'color' ),
							gradientValue,
							onColorChange: setOverlayColor,
							onGradientChange: setGradient,
						},
					] }
				>
					{ !! url && (
						<RangeControl
							allowReset
							required
							readonly
							label={ __( 'Opacity', 'sixa' ) }
							value={ dimRatio }
							resetFallbackValue={ get( thresholds, 'dim.min' ) }
							min={ get( thresholds, 'dim.min' ) }
							max={ get( thresholds, 'dim.max' ) }
							step={ get( thresholds, 'dim.step' ) }
							onChange={ ( value ) => setAttributes( { dimRatio: value } ) }
						/>
					) }
					<ContrastChecker
						{ ...{
							textColor: get( textColor, 'color' ),
							backgroundColor: get( overlayColor, 'color' ),
						} }
						isLargeText={ false }
					/>
				</PanelColorGradientSettings>
			</InspectorControls>
			<InspectorAdvancedControls>
				<TextControl
					label={ __( 'Container title', 'sixa' ) }
					help={ __( 'Enter a title for this section to display on the left side of the container.', 'sixa' ) }
					value={ title }
					onChange={ ( value ) => setAttributes( { title: value } ) }
				/>
			</InspectorAdvancedControls>
		</>
	);
}
