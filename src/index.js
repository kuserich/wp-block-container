// import './public.css';
// import './editor.css';

/**
 * Internal dependencies & components
 */
import get from 'lodash-es/get';
import attributes from './attributes';
import edit from './edit';
import save from './save';
import { icons } from '@sixa/wp-block-utils';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

/**
 * Meta-data for registering block type
 */
const name = 'container';
const title = __( 'Container', 'sixa-wp-blocks' );
const category = 'design';
const icon = get( icons, 'box' );

/**
 * Block settings
 */
const settings = {
	title,
	description: __(
		'Wrap several blocks in a parent wrapper and do more styling as well.',
		'snusclub-extras'
	),
	keywords: [
		'sixa-wp-blocks',
		__( 'section', 'sixa-wp-blocks' ),
		__( 'group', 'sixa-wp-blocks' ),
		__( 'wrapper', 'sixa-wp-blocks' ),
	],
	styles: [
		{
			name: 'card',
			label: __( 'Card', 'sixa-wp-blocks' ),
		},
	],
	supports: {
		anchor: true,
		html: false,
		align: [ 'wide', 'full' ],
	},
	attributes,
	edit,
	save,
};

export { name, title, category, icon, settings };
