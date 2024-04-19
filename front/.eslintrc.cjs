module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'tailwind.config.js', 'src/components/ui'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'simple-import-sort', 'prettier'],
  rules: {
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    '@typescript-eslint/no-unused-vars': ['error'],
  },
};
