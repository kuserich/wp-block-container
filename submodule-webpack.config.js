/**
 * Standard JavaScript compile functionality for a block module (git submodule).
 * This webpack config is used in conjunction with custom 'wp-scripts build' || 'wp-scripts start' scripts by passing a --config argument.
 * The plugin below works in 'build' as well as 'start' with the watcher.
 * 
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/#provide-your-own-webpack-config
 */

const defaultConfig = require('./node_modules/@wordpress/scripts/config/webpack.config.js');
const exec = require('child_process').exec;
const { stdout, stderr } = require('process');

module.exports = {
	...defaultConfig,
	module: {
		...defaultConfig.module,
		rules: [...defaultConfig.module.rules],
	},
	optimization: {
		...defaultConfig.optimization,
		minimizer: [...defaultConfig.optimization.minimizer],
	},
	performance: {
		hints: false,
	},
	plugins: [
		...defaultConfig.plugins,
		{
			apply: (compiler) => {
				compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
					exec('../../prepare-blocks.sh', (err, stdout, stderr) => {
						if (stdout) process.stdout.write(stdout);
						if (stderr) process.stderr.write(stderr);
					});
				});
			},
		},
	],
};
