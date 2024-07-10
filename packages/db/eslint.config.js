import EslintConfig from "@opentrader/eslint/module.js";

export default [
  ...EslintConfig,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
