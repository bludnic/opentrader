module.exports = {
  // errors
  "import/no-default-export": "off",
  "@typescript-eslint/explicit-function-return-type": "off",
  "@typescript-eslint/no-unsafe-argument": "off",
  "@typescript-eslint/require-await": "off",
  "react-hooks/exhaustive-deps": 0,
  "@typescript-eslint/consistent-type-definitions": "off",
  "react/function-component-definition": "off",
  "unicorn/filename-case": "off",
  "no-duplicate-imports": "off",
  "no-nested-ternary": "off",
  "no-implicit-coercion": [
    "error",
    {
      allow: ["!!"],
    },
  ],
  "@typescript-eslint/no-non-null-assertion": "off",
  "@typescript-eslint/no-confusing-void-expression": "off",
  "@typescript-eslint/no-shadow": "off",
  "turbo/no-undeclared-env-vars": "off",
  "no-await-in-loop": "off",
  "@typescript-eslint/no-misused-promises": ["off"],
  "no-promise-executor-return": "off",
  "@typescript-eslint/no-extraneous-class": "off",
  "@typescript-eslint/naming-convention": "off",
  "@typescript-eslint/no-unnecessary-condition": "off",
  "@typescript-eslint/no-meaningless-void-operator": "off",
  camelcase: "off",
  "import/no-cycle": "off", // @todo investigate and enable the rule
  "@typescript-eslint/no-unsafe-assignment": "off", // false positives, probably a bug in the rule
  "@typescript-eslint/no-explicit-any": "off",

  // warnings
  "import/no-named-as-default-member": "off",
  "import/no-named-as-default": "off",
  "no-console": [
    "warn",
    {
      allow: ["warn", "error", "debug"],
    },
  ],
  "@typescript-eslint/no-unused-vars": "warn",
  "no-unused-vars": "warn",
};
