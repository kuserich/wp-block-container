module.exports = () => ( {
	plugins: [
		require( 'postcss-import' ),
		require( 'postcss-for' ),
		require( 'postcss-selector-replace' )( {
			before: [ '[prefix]' ],
			after: [ 'sixa' ],
		} ),
		require( 'postcss-nested' ),
		require( 'postcss-quantity-queries' ),
		require( 'postcss-size' ),
		require( 'postcss-flexbox' ),
		require( 'postcss-position' ),
		require( 'postcss-combine-duplicated-selectors' ),
		require( 'postcss-discard-empty' ),
		require( 'autoprefixer' )( { grid: true } ),
	],
} );
