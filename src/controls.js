/**
 * External dependencies
 */
import { attributesFromMedia } from './attributes-from-media';
import { IMAGE_TYPE, VIDEO_TYPE } from '@sixa/wp-block-utils';

/**
 * WordPress dependencies
 */
const { BlockControls, MediaReplaceFlow } = wp.blockEditor;
const ALLOWED_MEDIA_TYPES = [ IMAGE_TYPE, VIDEO_TYPE ];

export default function Controls( { attributes, setAttributes } ) {
	const { id, url } = attributes,
		onSelectMedia = attributesFromMedia( setAttributes );

	return (
		<>
			<BlockControls>
				<MediaReplaceFlow
					mediaId={ id }
					mediaURL={ url }
					allowedTypes={ ALLOWED_MEDIA_TYPES }
					accept="image/*,video/*"
					onSelect={ onSelectMedia }
				/>
			</BlockControls>
		</>
	);
}
