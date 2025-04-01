import * as path from 'path'
import { fileURLToPath } from 'url'

import { fixupPluginRules } from '@eslint/compat'
import { FlatCompat } from '@eslint/eslintrc'

import eslintJs from '@eslint/js'
import { globalIgnores } from 'eslint/config'
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
  eslintJs.configs.recommended,
  ...eslintTs.configs.recommended,
  globalIgnores(['**/node_modules', '**/dist']),
  ...compat.extends('plugin:import/typescript'),

  {
    plugins: {
      react: eslintReact,
      prettier: eslintPluginPrettier,
      import: legacyPlugin('eslint-plugin-import', 'import'),
    },
  },

  {
    rules: {
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/consistent-type-assertions': 2,
      'jsx-a11y/anchor-is-valid': 'off',
      curly: ['error', 'all'],
      'no-irregular-whitespace': ['error', { skipTemplates: true, skipStrings: true }],
      'no-console': ['error', { allow: ['info', 'error', 'warn'] }],
      'import/order': [
        'error',
        {
          alphabetize: { order: 'asc', caseInsensitive: false },
          distinctGroup: true,
          named: false,
          warnOnUnassignedImports: false,
        },
      ],
      //   'sort-imports': [
      //     'error',
      //     {
      //       ignoreCase: false,
      //       ignoreDeclarationSort: false,
      //       ignoreMemberSort: false,
      //       memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
      //       allowSeparatedGroups: false,
      //     },
      //   ],
    },
  },
)
