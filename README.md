# Container Block

The container WordPress Gutenberg block package.

The block also includes a default stylesheet that can be imported in a project.

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
After installing the package, the component and it's reference stylesheets can
be imported from the package.
The packaged block exposes both a `PREFIX` variable and a `registerBlock` function.
You may use `PREFIX` and `name` from the packaged block to use in your own
registration function / loop or you may call `registerBlock` from the package
to rely on the packaged registration function.

```
import * as container from '@sixa/wp-bock-container';
import '@sixa/wp-bock-container/dist/editor.css';

export function registerBlocksFromPackages() {
	forEach( [ container ], ( block ) => {
		if ( ! block ) {
			return;
		}

		const { registerBlock } = block;
		registerBlock();
	} );
}
```

Similarly, the stylesheet used in the frontend is available as:
```
import '@sixa/wp-bock-container/dist/public.css';
```