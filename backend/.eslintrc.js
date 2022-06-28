module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  overrides: [
    {
      files: './src/**/*.ts',
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'eslint-config-prettier',
        'plugin:@typescript-eslint/strict',
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.json'],
      },
      plugins: ['@typescript-eslint'],
      rules: {
        /* Logic Errors */
        // Enforces use of Promise.all
        'no-await-in-loop': 'error',
        'no-constant-binary-expression': 'error',
        'no-constructor-return': 'error',
        'no-duplicate-imports': 'warn',
        'no-self-compare': 'warn',
        'no-template-curly-in-string': 'warn',
        'no-unreachable-loop': 'warn',
        'no-unused-private-class-members': 'error',
        'require-atomic-updates': 'warn',
        'no-unsafe-member-access': 'off',
        'no-unsafe-assignment': 'off',
        /* Suggestions */
        camelcase: 'warn',
        'dot-notation': 'warn',
        eqeqeq: 'warn',
        'guard-for-in': 'warn',
        'no-array-constructor': 'warn',
        'no-caller': 'error',
        'no-else-return': 'warn',
        'no-eval': 'error',
        'no-extra-bind': 'warn',
        'no-implicit-coercion': 'warn',
        'no-implied-eval': 'error',
        'no-invalid-this': 'error',
        'no-lonely-if': 'warn',
        'no-new': 'error',
        'no-new-object': 'error',
        'no-new-wrappers': 'error',
        'no-return-await': 'warn',
        'no-script-url': 'error',
        'no-throw-literal': 'error',
        'no-unneeded-ternary': 'warn',
        'no-unused-expressions': 'warn',
        'no-useless-call': 'warn',
        'no-useless-rename': 'warn',
        'no-useless-return': 'warn',
        'no-var': 'error',
        'prefer-const': 'warn',
        'prefer-destructuring': 'warn',
        'prefer-object-spread': 'warn',
        'prefer-regex-literals': 'warn',
        'prefer-rest-params': 'warn',
        'prefer-spread': 'warn',
        'require-await': 'error',
        /* TypeScript */
        // These are very useful in the context of writing code for the browser.
        '@typescript-eslint/no-non-null-assertion': 'off',
        // Allow unused vars starting with '_'
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': [
          'warn',
          { argsIgnorePattern: '^_', destructuredArrayIgnorePattern: '^_' },
        ],
        '@typescript-eslint/member-ordering': 'warn',
        '@typescript-eslint/no-confusing-void-expression': 'warn',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
      },
    },
  ],
};
