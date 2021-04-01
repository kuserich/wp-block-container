module.exports = {
	plugins: {
		'postcss-import': {},
		'postcss-selector-replace': {
			before: [ '[prefix]' ],
			after: [ 'sixa' ],
		},
		'postcss-nested-ancestors': {},
		'postcss-nested': {},
		'postcss-position': {},
		autoprefixer: { grid: true },
	},
};
