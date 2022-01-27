/**
 * Helper React components specific for Sixa projects.
 */
import { BlockAlignmentMatrixControl, FullHeightAlignmentControl, MediaUploadToolbar } from '@sixa/wp-block-components';

/**
 * Helper React hooks specific for Sixa projects.
 */
import { useDidUpdate, useGetMediaType } from '@sixa/wp-react-hooks';

/**
 * This module allows you to create and use standalone block-editor element and components.
 *
 * @see    https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/
 */
import { BlockControls } from '@wordpress/block-editor';

/**
 * Internationalization utilities for client-side localization.
 *
 * @see    https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * Runtime type checking for React props and similar objects.
 */
import PropTypes from 'prop-types';

/**
 * Helper constants.
 */
import Constants from '../constants';

/**
 * The BlockToolbar component is used to render a toolbar that serves as a wrapper for number of options for each block.
 *
 * @see       https://github.com/WordPress/gutenberg/blob/trunk/packages/block-editor/src/components/block-toolbar/README.md
 * @param 	  {Object} 	       props 				  Block meta-data properties.
 * @param 	  {Object} 	       props.attributes 	  Block attributes.
 * @param     {Function}       props.setAttributes    Update block attributes.
 * @return    {JSX.Element} 						  Toolbar element to render.
 */
function Controls( { attributes, setAttributes } ) {
	const { contentPosition, id, isFullHeight, url } = attributes;
	const backgroundType = useGetMediaType( id );

	useDidUpdate( () => {
		setAttributes( { backgroundType } );
	}, [ backgroundType ] );

	return (
		<>
			<BlockControls group="block">
				<BlockAlignmentMatrixControl
					label={ __( 'Change content position', 'sixa-block-container' ) }
					onChange={ ( value ) => setAttributes( { contentPosition: value } ) }
					value={ contentPosition }
				/>
				<FullHeightAlignmentControl
					isActive={ Boolean( isFullHeight ) }
					onToggle={ () => setAttributes( { isFullHeight: ! isFullHeight, minHeight: undefined } ) }
				/>
			</BlockControls>
			<MediaUploadToolbar
				allowedTypes={ [ Constants.IMAGE_MEDIA_TYPE, Constants.VIDEO_MEDIA_TYPE ] }
				onChange={ ( value ) => setAttributes( { ...value } ) }
				shouldRender
				value={ { id, url } }
			/>
		</>
	);
}

Controls.propTypes = {
	attributes: PropTypes.object.isRequired,
	setAttributes: PropTypes.func.isRequired,
};

Controls.defaultProps = {
	attributes: {},
	setAttributes: () => {},
};

export default Controls;
