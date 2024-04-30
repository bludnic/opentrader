/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@opentrader/eslint-config/module.js"],
  rules: {
    "@typescript-eslint/unified-signatures": "off",
  },
};
