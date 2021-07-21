/* eslint-disable @wordpress/no-unsafe-wp-apis */

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
	BlockControls,
	MediaReplaceFlow,
	__experimentalBlockAlignmentMatrixControl as BlockAlignmentMatrixControl,
	__experimentalBlockFullHeightAligmentControl as FullHeightAlignmentControl,
} from '@wordpress/block-editor';

/**
 * Upload selected media file/type.
 */
import attributesFromMedia from './attributes-from-media';

/**
 * The BlockToolbar component is used to render a toolbar that serves as a wrapper for number of options for each block.
 *
 * @see      https://github.com/WordPress/gutenberg/blob/trunk/packages/block-editor/src/components/block-toolbar/README.md
 * @param     {Object}    	 props 					Block meta-data properties.
 * @param     {Object}    	 props.attributes 		Block attributes.
 * @param     {Function}  	 props.setAttributes 	Update block attributes.
 * @return    {WPElement} 						    Toolbar element to render.
 */
export default function Controls( { attributes, setAttributes } ) {
	const { id, url, isFullHeight, contentPosition } = attributes;
	const onSelectMedia = attributesFromMedia( setAttributes );

	return (
		<>
			<BlockControls group="block">
				<BlockAlignmentMatrixControl
					label={ __( 'Change content position', 'sixa' ) }
					value={ contentPosition }
					onChange={ ( value ) => setAttributes( { contentPosition: value } ) }
				/>
				<FullHeightAlignmentControl isActive={ !! isFullHeight } onToggle={ () => setAttributes( { isFullHeight: ! isFullHeight } ) } />
			</BlockControls>
			<BlockControls group="other">
				<MediaReplaceFlow
					mediaId={ id }
					mediaURL={ url }
					accept={ 'image/*,video/*' }
					onSelect={ onSelectMedia }
					allowedTypes={ [ 'image', 'video' ] }
					name={ ! url ? __( 'Add Media', 'sixa' ) : __( 'Replace', 'sixa' ) }
				/>
			</BlockControls>
		</>
	);
}
