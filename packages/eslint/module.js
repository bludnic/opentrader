import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config({
  files: ['src/**/*.ts'],
  plugins: {
    '@typescript-eslint': tseslint.plugin
  },
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      project: true,
      sourceType: 'module'
    }
  },
  extends: [eslint.configs.recommended, ...tseslint.configs.recommended],
  rules: {
    '@typescript-eslint/no-unsafe-argument': 'error',
    '@typescript-eslint/no-unsafe-assignment': 'error',
    '@typescript-eslint/no-unsafe-call': 'error',
    '@typescript-eslint/no-unsafe-member-access': 'error',
    '@typescript-eslint/no-unsafe-return': 'error'
  }
})
