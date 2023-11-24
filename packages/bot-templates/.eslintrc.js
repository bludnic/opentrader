/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@opentrader/eslint-config/module.js"],
  rules: {
    // Bot templates usually use type correction `any -> SomeType`
    // ```ts
    // const result: SomeType = yield someEffect()
    // ```
    '@typescript-eslint/no-unsafe-assignment': "off"
  }
};
