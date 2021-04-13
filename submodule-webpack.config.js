/**
 * Standard JavaScript compile functionality for a block module (git submodule).
 * This webpack config is used in conjunction with custom 'wp-scripts build' || 'wp-scripts start' scripts by passing a --config argument.
 * The plugin below works in 'build' as well as 'start' with the watcher.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/#provide-your-own-webpack-config
 */

const defaultConfig = require( './node_modules/@wordpress/scripts/config/webpack.config.js' );
const childProc = require( 'child_process' );

module.exports = {
	...defaultConfig,
	plugins: [
		...defaultConfig.plugins,
		{
			apply: ( compiler ) => {
				compiler.hooks.afterEmit.tap( 'AfterEmitPlugin', () => {
					childProc.exec( '../../prepare-blocks.sh', ( stdout, stderr ) => {
						if ( stdout ) process.stdout.write( stdout );
						if ( stderr ) process.stderr.write( stderr );
					});
				});
			},
		},
	],
};
