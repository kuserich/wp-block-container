/**
 * Standard JavaScript compile functionality for a block module (git submodule).
 * This webpack config is used in conjunction with custom 'wp-scripts build' || 'wp-scripts start' scripts by passing a --config argument.
 * If there is already a webpack.config.js file in the root folder - we use that as the default config, otherwise we use the one provided by wordpress.
 * The plugin below works in 'build' as well as 'start' with the watcher.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/#provide-your-own-webpack-config
 */

const fs = require('fs');
const defaultConfig = require(fs.existsSync('./webpack.config.js')
	? './webpack.config.js'
	: './node_modules/@wordpress/scripts/config/webpack.config.js');
const { spawn } = require('child_process');

module.exports = {
	...defaultConfig,
	plugins: [
		...defaultConfig.plugins,
		{
			apply: (compiler) => {
				compiler.hooks.afterEmit.tap('AfterEmitPlugin', () => {
					const child = spawn('bash', ['../../prepare-blocks.sh']);

					child.stdout.on('data', (data) => {
						process.stdout.write(`stdout:\n${data}`);
					});

					child.stderr.on('data', (data) => {
						process.stderr.write(`stderr:\n${data}`);
					});

					child.on('error', (error) => {
						process.stderr.write(`error: ${error}`);
					});

					child.on('close', (code) => {
						process.stdout.write(`child process exited with code ${code}`);
					});
				});
			},
		},
	],
};
