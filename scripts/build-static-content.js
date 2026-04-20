/*
 * Static fallback generation entrypoint.
 *
 * The site uses data/site-content.js as the source of truth and renders those
 * sections at runtime. This script runs the deterministic generators that keep
 * non-runtime artifacts in sync. It intentionally avoids introducing a package
 * manager workflow.
 */

require('./build-calendar');
require('./build-schema');

console.log('Static generated artifacts are up to date.');
