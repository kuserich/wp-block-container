module.exports = {
	plugins: {
		'postcss-import': {},
		'postcss-for': {},
		'postcss-each': {},
		'postcss-selector-replace': {
			before: [ '[prefix]' ],
			after: [ 'sixa' ],
		},
		'postcss-nested-ancestors': {},
		'postcss-nested': {},
		'postcss-important-startstop': {},
		'postcss-calc': {},
		'postcss-size': {},
		'postcss-flexbox': {},
		'postcss-position': {},
		autoprefixer: { grid: true },
	},
};
