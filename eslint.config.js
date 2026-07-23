import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'
import globals from 'globals'

export default tseslint.config(
  // Ignore build output, deps, and generated files
  {
    ignores: ['dist/**', 'node_modules/**', '.vercel/**', '_site/**'],
  },

  // Base JS recommended
  js.configs.recommended,

  // TypeScript API (Node, ESM) — type-aware linting
  {
    files: ['api/**/*.ts'],
    extends: [...tseslint.configs.recommended],
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
      globals: { ...globals.node },
    },
    plugins: { prettier },
    rules: {
      'prettier/prettier': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },

  // Browser-side Lit components (plain JS)
  {
    files: ['public/js/**/*.js'],
    languageOptions: { globals: { ...globals.browser } },
    plugins: { prettier },
    rules: { 'prettier/prettier': 'warn' },
  },

  // Node build/config scripts
  {
    files: ['*.js', 'generate-sitemap.js', 'eleventy.config.js'],
    languageOptions: { globals: { ...globals.node } },
    plugins: { prettier },
    rules: { 'prettier/prettier': 'warn' },
  },

  // Turn off rules that conflict with Prettier — MUST be last
  prettierConfig,
)
