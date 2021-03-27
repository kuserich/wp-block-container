/**
 * These controls will be shown in the `Block Toolbar` area.
 */

/**
 * External dependencies
 */
import attributesFromMedia from './attributes-from-media';
import { IMAGE_TYPE, VIDEO_TYPE } from '@sixa/wp-block-utils';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { BlockControls, MediaReplaceFlow, __experimentalBlockAlignmentMatrixToolbar: BlockAlignmentMatrixToolbar } = wp.blockEditor;
const ALLOWED_MEDIA_TYPES = [ IMAGE_TYPE, VIDEO_TYPE ];

export default function Controls( { attributes, setAttributes } ) {
	const { id, url, contentPosition } = attributes,
		onSelectMedia = attributesFromMedia( setAttributes );

	return (
		<>
			<BlockControls>
				<BlockAlignmentMatrixToolbar
					label={ __( 'Change content position', 'sixa' ) }
					value={ contentPosition }
					onChange={ ( value ) =>
						setAttributes( {
							contentPosition: value,
						} )
					}
				/>
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
