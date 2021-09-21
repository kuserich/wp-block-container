/**
 * Sixa icon library.
 */
import { container } from '@sixach/icon-library';

/**
 * This packages includes a library of generic WordPress components to be used for
 * creating common UI elements shared between screens and features of the WordPress dashboard.
 *
 * @see    https://developer.wordpress.org/block-editor/reference-guides/packages/packages-components/
 */
import { GenerateSvgPaths } from '@sixach/wp-block-components';

export default <GenerateSvgPaths paths={ container?.paths } withSvgWrapper />;
