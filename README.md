# Container Block

The container WordPress Gutenberg block package.

The block includes a default stylesheet that can be imported in a project.

## Installation
Before installing from NPM, make sure to add the sixa enterprise registry and sign in with your NPM user.
```
npm i @sixa/wp-bock-container
```

or
```
npm i @sixa/wp-bock-container --save-dev
```
if you are using this library inside an extras plugin.

## Usage
After installing the package, the component and it's reference stylesheets can be included with:

```
import * as container from '@sixa/wp-bock-container';
import '@sixa/wp-bock-container/dist/editor.css';

export function registerBlocks() {
	forEach( [ container, spacer ], ( block ) => {
		if ( ! block ) {
			return;
		}

		const { name, category, icon, settings } = block;

		registerBlockType( `${ PREFIX }/${ name }`, {
			category,
			icon: {
				src: icon,
			},
			...settings,
		} );
	} );
}
```

---
## Setup Description
### Disclaimer
This section of the README file will be removed once we decided on the setup.

### Rollup.js VS Webpack
This uses the same setup as `@sixa/wp-block-utils` but with additional settings to process
the stylesheets as well as eslint and stylelint.
There are two very straighforward ways to include stylesheets for bundling/output. Both are described
below and the one I propose is currently configured. The other approach is "commented out".

### Build Process / Rollup Description
The project is built with

```
npm run build
```

which translates to

```
rollup -c
```

and

```
postcss --config ./postcss.config.js src/style -d dist
```

it's also possible to process the `.css` files inside rollup directly. However, for this we would
need to import and add all plugins. Because we have a considerable number of plugins and including
all of them would double the length of the rollup file, I *personally* find it easier and cleaner
if the PostCSS processing is a separate and isolated step.

An incomplete configuration is currently commented out. The configuration is missing the plugin imports
and instances but shows the general structure. From `rollup.config.js`:

see this section:
```
// postcss({
//     plugins: [
//
//     ],
//     include: '**/public.css',
//     extract: 'public.css',
// }),
// postcss({
//     plugins: [
//
//     ],
//     include: '**/editor.css',
//     extract: 'editor.css',
// })
```

notice that the plugins need to be defined for both `public.css` and `editor.css` because we intend
to publish two files so that they can be imported in the necessary places. Also note that `editor.css`
may or may not already import `public.css`. In my proposal, `public.css` is included in `editor.css`.
This is not required though and we should establish a convention / standard.

---

## Open Questions

### 1. How to deal with `PREFIX`?
The same question as in the utils, this time however, we also have `PREFIX` for the CSS code.

### 2. How to deal with (base) variables in PostCSS?
How do we best include / overwrite / propose variables in the styling, so that they can be easily
modified, extended, and overwritten in the extras plugin?
