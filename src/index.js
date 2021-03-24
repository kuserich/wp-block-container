/**
 * Define meta-data for registering block type.
 */

/**
 * Internal dependencies & components
 */
import { get } from 'lodash-es';
import edit from './edit';
import save from './save';
import attributes from './attributes';
import transforms from './transforms';
import { icons } from "@sixa/wp-block-utils";

/**
 * WordPress dependencies
 */
const { __, _x } = wp.i18n;

/**
 * Block meta-data
 */
const name = 'container';
const title = __( 'Container', 'sixa-extras' );
const category = 'design';
const icon = get( icons, 'box' );

/**
 * Block settings
 */
const settings = {
	title,
	description: __( 'Wrap several blocks in a parent wrapper and do more styling as well.', 'sixa-extras' ),
	keywords: [
		'sixa-extras',
		_x( 'section', 'block keyword', 'sixa-extras' ),
		_x( 'group', 'block keyword', 'sixa-extras' ),
		_x( 'wrapper', 'block keyword', 'sixa-extras' ),
	],
	supports: {
		anchor: true,
		html: false,
		align: [ 'wide', 'full' ],
	},
	attributes,
	transforms,
	edit,
	save,
};

export { name, title, category, icon, settings };
