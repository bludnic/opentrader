/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@opentrader/eslint-config/module.js"],
  rules: {
    // repo uses alternative enum declaration with const/type (see `src/common/enums/*`)
    "no-redeclare": "off",
  },
};
