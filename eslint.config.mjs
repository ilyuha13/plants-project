import * as path from 'path'
import { fileURLToPath } from 'url'

import { fixupPluginRules } from '@eslint/compat'
import { FlatCompat } from '@eslint/eslintrc'
import eslintJs from '@eslint/js'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import eslintReact from 'eslint-plugin-react'
import eslintTs from 'typescript-eslint'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const compat = new FlatCompat({
  baseDirectory: dirname,
  recommendedConfig: eslintJs.configs.recommended,
})

function legacyPlugin(name, alias = name) {
  const plugin = compat.plugins(name)[0]?.plugins?.[alias]

  if (!plugin) {
    throw new Error(`Unable to resolve plugin ${name} and/or alias ${alias}`)
  }

  return fixupPluginRules(plugin)
}

export default eslintTs.config(
  // Base configs
  eslintJs.configs.recommended,
  ...eslintTs.configs.recommendedTypeChecked,
  ...eslintTs.configs.stylisticTypeChecked,

  // Global ignores
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/build/**',
      '**/.tmp/**',
      '**/scripts/**',
      '**/vitest.config.ts',
    ],
  },

  // TypeScript parser with Project Service (v8 feature)
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // Import plugin
  ...compat.extends('plugin:import/typescript'),

  // Plugins
  {
    plugins: {
      react: eslintReact,
      prettier: eslintPluginPrettier,
      import: legacyPlugin('eslint-plugin-import', 'import'),
    },
  },

  // Backend-specific rules
  {
    files: ['backend/**/*.ts'],
    rules: {
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      'no-console': 'error',
    },
  },

  // Webapp-specific rules
  {
    files: ['webapp/**/*.tsx', 'webapp/**/*.ts'],
    rules: {
      'react/react-in-jsx-scope': 'off', // React 19
      'react/prop-types': 'off', // TypeScript handles this
      'no-console': ['error', { allow: ['info', 'error', 'warn'] }],
    },
  },

  // Custom rules
  {
    rules: {
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/consistent-type-assertions': 'error',
      'jsx-a11y/anchor-is-valid': 'off',
      curly: ['error', 'all'],
      'no-irregular-whitespace': ['error', { skipTemplates: true, skipStrings: true }],

      'import/order': [
        'error',
        {
          alphabetize: { order: 'asc', caseInsensitive: false },
          distinctGroup: true,
          'newlines-between': 'always',
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling'],
            'index',
            'object',
            'type',
          ],
          named: false,
          warnOnUnassignedImports: false,
        },
      ],
    },
  },

  // Relax rules for config files
  {
    files: ['*.config.*', '*.mjs', '*.cjs'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },

  // Relax rules for tests and scripts
  {
    files: ['**/__tests__/**', '**/*.test.ts', '**/*.spec.ts', '**/scripts/**'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
    },
  },
)
