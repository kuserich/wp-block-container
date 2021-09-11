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
 * Internationalization utilities for client-side localization.
 *
 * @see    https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * Blob utilities for WordPress.
 *
 * @see    https://github.com/WordPress/gutenberg/blob/trunk/packages/blob/README.md
 */
import { isBlobURL, getBlobTypeByURL } from '@wordpress/blob';

/**
 * This module allows you to create and use standalone block-editor element and components.
 *
 * @see    https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/
 */
import { BlockControls, MediaReplaceFlow } from '@wordpress/block-editor';

/**
 * Helper React components specific for Sixa projects.
 */
import { BlockAlignmentMatrixControl, FullHeightAlignmentControl } from '@sixach/wp-block-components';

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
	const handleOnSelectMedia = ( media ) => {
		if ( ! media || ! media?.url ) {
			setAttributes( { id: undefined, url: undefined } );
			return;
		}

		if ( isBlobURL( media?.url ) ) {
			media.type = getBlobTypeByURL( media.url );
		}

		let mediaType;
		// for media selections originated from a file upload.
		if ( media?.media_type ) {
			if ( isEqual( media.media_type, Constants.IMAGE_MEDIA_TYPE ) ) {
				mediaType = Constants.IMAGE_MEDIA_TYPE;
			} else {
				// only images and videos are accepted so if the media_type is not an image we can assume it is a video.
				// Videos contain the media type of 'file' in the object returned from the rest api.
				mediaType = Constants.VIDEO_MEDIA_TYPE;
			}
		} else {
			// for media selections originated from existing files in the media library.
			if ( ! isEqual( media?.type, Constants.IMAGE_MEDIA_TYPE ) && ! isEqual( media?.type, Constants.VIDEO_MEDIA_TYPE ) ) {
				return;
			}
			mediaType = media?.type;
		}

		setAttributes( {
			backgroundType: mediaType,
			dimRatio: 50,
			id: media?.id,
			url: media?.url,
			...( isEqual( mediaType, Constants.VIDEO_MEDIA_TYPE ) ? { focalPoint: undefined, hasParallax: undefined } : {} ),
		} );
	};

	return (
		<>
			<BlockControls group="block">
				<BlockAlignmentMatrixControl
					label={ __( 'Change content position', 'sixa' ) }
					onChange={ ( value ) => setAttributes( { contentPosition: value } ) }
					value={ contentPosition }
				/>
				<FullHeightAlignmentControl
					isActive={ Boolean( isFullHeight ) }
					onToggle={ () => setAttributes( { isFullHeight: ! isFullHeight, minHeight: undefined } ) }
				/>
			</BlockControls>
			<BlockControls group="other">
				<MediaReplaceFlow
					allowedTypes={ [ Constants.IMAGE_MEDIA_TYPE, Constants.VIDEO_MEDIA_TYPE ] }
					mediaId={ id }
					mediaURL={ url }
					name={ ! url ? __( 'Add Media', 'sixa' ) : __( 'Replace', 'sixa' ) }
					onSelect={ handleOnSelectMedia }
				/>
			</BlockControls>
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
