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
import { icons, PREFIX, blockName } from '@sixa/wp-block-utils';

/**
 * WordPress dependencies
 */
const { __, _x } = wp.i18n;
const { registerBlockType } = wp.blocks;

/**
 * Block meta-data
 */
const name = 'container';
const title = __( 'Container', 'sixa' );
const category = 'design';
const icon = get( icons, 'box' );

/**
 * Block settings
 */
const settings = {
	title,
	description: __( 'Wrap several blocks in a parent wrapper and do more styling as well.', 'sixa' ),
	keywords: [
		'sixa',
		'sixa-block',
		'sixa-blocks',
		_x( 'section', 'block keyword', 'sixa' ),
		_x( 'group', 'block keyword', 'sixa' ),
		_x( 'wrapper', 'block keyword', 'sixa' ),
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

const registerBlock = () => {
	registerBlockType( blockName( name ), {
		category,
		icon: {
			src: icon,
		},
		...settings,
	} );
};

export { name, title, category, icon, settings, registerBlock, PREFIX };
