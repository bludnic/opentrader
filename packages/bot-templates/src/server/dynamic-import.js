// Webpack replaces calls to `require()` from within a bundle. This module
// is not parsed by webpack and exports the real `require`
// NOTE: since the module is unparsed, do not use es6 exports
export default require;
