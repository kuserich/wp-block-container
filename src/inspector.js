/**
 * These controls will be shown in the `Settings Sidebar` region.
 */

/**
 * External dependencies
 */
import { get, pickBy, identity, isEqual, noop } from 'lodash-es';
import { IMAGE_TYPE, VIDEO_TYPE } from "@sixa/wp-block-utils";

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { InspectorControls, __experimentalPanelColorGradientSettings: PanelColorGradientSettings } = wp.blockEditor;
const {
	PanelBody,
	PanelRow,
	RangeControl,
	ToggleControl,
	FocalPointPicker,
	Button,
	__experimentalBoxControl: BoxControl,
} = wp.components;

/**
 * Constants
 */
const MIN_WIDTH = 100;
const MAX_WIDTH = 2000;
const STEP_OPACITY = 10;
const MIN_OPACITY = 0;
const MAX_OPACITY = 100;

export default function Inspector( { attributes, setAttributes, colors } ) {
	const { textColor, setTextColor, overlayColor, setOverlayColor, setGradient, gradientValue } = colors,
		{ width, url, dimRatio, hasParallax, isRepeated, focalPoint, backgroundType, margin, padding } = attributes,
		isImageBackground = isEqual( backgroundType, IMAGE_TYPE ),
		isVideoBackground = isEqual( backgroundType, VIDEO_TYPE ),
		showFocalPointPicker = isVideoBackground || ( isImageBackground && ( ! hasParallax || isRepeated ) );

	return (
		<>
			<InspectorControls>
				<PanelBody initialOpen={ true }>
					<RangeControl
						allowReset
						label={ __( 'Width', 'sixa-extras' ) }
						help={ __( 'in pixels', 'sixa-extras' ) }
						min={ MIN_WIDTH }
						max={ MAX_WIDTH }
						value={ width }
						onChange={ ( value ) =>
							setAttributes( {
								width: value,
							} )
						}
					/>
				</PanelBody>
				{ !! url && (
					<PanelBody title={ __( 'Media Settings', 'sixa-extras' ) } initialOpen={ true }>
						{ isImageBackground && (
							<>
								<ToggleControl
									label={ __( 'Fixed background', 'sixa-extras' ) }
									checked={ hasParallax }
									onChange={ () =>
										setAttributes( {
											hasParallax: ! hasParallax,
											...( ! hasParallax ? { focalPoint: noop() } : {} ),
										} )
									}
								/>
								<ToggleControl
									label={ __( 'Repeated background', 'sixa-extras' ) }
									checked={ isRepeated }
									onChange={ () =>
										setAttributes( {
											isRepeated: ! isRepeated,
										} )
									}
								/>
							</>
						) }
						{ showFocalPointPicker && (
							<FocalPointPicker
								label={ __( 'Focal point picker', 'sixa-extras' ) }
								url={ url }
								value={ focalPoint }
								onChange={ ( value ) =>
									setAttributes( {
										focalPoint: value,
									} )
								}
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
										dimRatio: noop(),
										focalPoint: noop(),
										hasParallax: noop(),
										isRepeated: noop(),
									} )
								}
							>
								{ __( 'Clear Media', 'sixa-extras' ) }
							</Button>
						</PanelRow>
					</PanelBody>
				) }
				<PanelBody title={ __( 'Margin Settings', 'sixa-extras' ) } initialOpen={ false }>
					<BoxControl
						values={ margin }
						inputProps={ { min: -999 } }
						onChange={ ( value ) =>
							setAttributes( {
								margin: pickBy( value, ( item ) => identity( item ) ),
							} )
						}
					/>
				</PanelBody>
				<PanelBody title={ __( 'Padding Settings', 'sixa-extras' ) } initialOpen={ false }>
					<BoxControl
						values={ padding }
						onChange={ ( value ) =>
							setAttributes( {
								padding: pickBy( value, ( item ) => identity( item ) ),
							} )
						}
					/>
				</PanelBody>
				<PanelColorGradientSettings
					title={ __( 'Color Settings', 'sixa-extras' ) }
					initialOpen={ false }
					settings={ [
						{
							label: __( 'Text', 'sixa-extras' ),
							colorValue: get( textColor, 'color' ),
							onColorChange: setTextColor,
						},
						{
							label: __( 'Overlay', 'sixa-extras' ),
							colorValue: get( overlayColor, 'color' ),
							gradientValue,
							onColorChange: setOverlayColor,
							onGradientChange: setGradient,
						},
					] }
				>
					{ !! url && (
						<RangeControl
							label={ __( 'Opacity', 'sixa-extras' ) }
							value={ dimRatio }
							onChange={ ( value ) =>
								setAttributes( {
									dimRatio: value,
								} )
							}
							step={ STEP_OPACITY }
							min={ MIN_OPACITY }
							max={ MAX_OPACITY }
							required
							readonly
						/>
					) }
				</PanelColorGradientSettings>
			</InspectorControls>
		</>
	);
}
