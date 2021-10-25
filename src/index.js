/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see    https://developer.wordpress.org/block-editor/developers/block-api/#registering-a-block
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see    https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './style.scss';

/**
 * Internal dependencies
 */
import './extensions';
import deprecated from './deprecated';
import Edit from './Edit';
import Icon from './Icon';
import save from './save';
import transforms from './transforms';

/**
 * Every block starts by registering a new block type definition.
 *
 * @see    https://developer.wordpress.org/block-editor/developers/block-api/#registering-a-block
 */
registerBlockType( 'sixa/container', {
	/**
	 * @see    https://make.wordpress.org/core/2020/11/18/block-api-version-2/
	 */
	apiVersion: 2,

	/**
	 * @see    ./edit.js
	 */
	edit: Edit,

	/**
	 * @see    ./Icon.js
	 */
	icon: Icon,

	/**
	 * @see    ./save.js
	 */
	save,

	/**
	 * @see    ./transforms.js
	 */
	transforms,

	/**
	 * @see    ./deprecated.js
	 */
	deprecated,
} );
