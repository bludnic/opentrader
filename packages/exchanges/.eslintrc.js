/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@opentrader/eslint-config/module.js"],
  rules: {
    // `ccxt` library uses lower-case constructors
    //
    // ```js
    // const exchange = pro.okx();
    // ```
    //
    // Disable it for current repo.
    "new-cap": "off",
  },
};
