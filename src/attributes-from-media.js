/**
 * Utility for libraries from the `Lodash`.
 */
import { isEqual, get, set, has, noop } from 'lodash';

/**
 * Utility helper methods specific for Sixa projects.
 */
import { IMAGE_TYPE, VIDEO_TYPE } from '@sixa/wp-block-utils';

/**
 * Blob utilities for WordPress.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/packages/blob/README.md
 */
import { isBlobURL, getBlobTypeByURL } from '@wordpress/blob';

/**
 * Upload and identify given/selected media-type.
 *
 * @param   {Function}  setAttributes 	    Update block attributes.
 */
const attributesFromMedia = ( setAttributes ) => {
	return ( media ) => {
		if ( ! media || ! get( media, 'url' ) ) {
			setAttributes( { url: noop(), id: noop() } );
			return;
		}

		if ( isBlobURL( get( media, 'url' ) ) ) {
			set( media, 'type', getBlobTypeByURL( get( media, 'url' ) ) );
		}

		let mediaType;
		// for media selections originated from a file upload.
		if ( has( media, 'media_type' ) ) {
			if ( isEqual( media.media_type, IMAGE_TYPE ) ) {
				mediaType = IMAGE_TYPE;
			} else {
				// only images and videos are accepted so if the media_type is not an image we can assume it is a video.
				// Videos contain the media type of 'file' in the object returned from the rest api.
				mediaType = VIDEO_TYPE;
			}
		} else {
			// for media selections originated from existing files in the media library.
			if ( ! isEqual( get( media, 'type' ), IMAGE_TYPE ) && ! isEqual( get( media, 'type' ), VIDEO_TYPE ) ) {
				return;
			}
			mediaType = get( media, 'type' );
		}

		setAttributes( {
			dimRatio: 50,
			url: get( media, 'url' ),
			id: get( media, 'id' ),
			backgroundType: mediaType,
			...( isEqual( mediaType, VIDEO_TYPE ) ? { focalPoint: noop(), hasParallax: noop() } : {} ),
		} );
	};
};

export default attributesFromMedia;