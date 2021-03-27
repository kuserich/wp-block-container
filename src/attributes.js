/**
 * Define structured data of this block.
 */

/**
 * External dependencies
 */
import { spacingProperties } from '@sixa/wp-block-utils';

const attributes = {
	url: {
		type: 'string',
	},
	id: {
		type: 'number',
	},
	width: {
		type: 'number',
	},
	hasParallax: {
		type: 'boolean',
		default: false,
	},
	isRepeated: {
		type: 'boolean',
		default: false,
	},
	dimRatio: {
		type: 'number',
		default: 50,
	},
	focalPoint: {
		type: 'object',
	},
	contentPosition: {
		type: 'string',
	},
	margin: {
		type: 'object',
		default: spacingProperties,
	},
	padding: {
		type: 'object',
		default: spacingProperties,
	},
	backgroundType: {
		type: 'string',
		default: 'image',
	},
	textColor: {
		type: 'string',
	},
	customTextColor: {
		type: 'string',
	},
	overlayColor: {
		type: 'string',
	},
	customOverlayColor: {
		type: 'string',
	},
	gradient: {
		type: 'string',
	},
	customGradient: {
		type: 'string',
	},
};

export default attributes;
