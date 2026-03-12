import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import tailwind from 'eslint-plugin-tailwindcss';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      ...tailwind.configs['flat/recommended'],
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'tailwindcss/no-custom-classname': 'off',
      'no-restricted-syntax': [
        'warn',
        {
          selector:
            "JSXAttribute[name.name='className'] Literal[value=/\\b(bg|text|border|ring|outline|fill|stroke)-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-[0-9]+\\b/]",
          message:
            "Don't use primitive Tailwind colors (e.g. bg-gray-500). Use semantic tokens instead (e.g. bg-bg-primary, text-text-secondary).",
        },
        {
          selector:
            "JSXAttribute[name.name='className'] Literal[value=/rounded-\\[\\d+(\\.\\d+)?(px|rem)\\]/]",
          message:
            "Don't use arbitrary border radius (e.g. rounded-[0.475rem]). Use design tokens: rounded-md, rounded-lg, rounded-xl, or import RADIUS from @/lib/design-tokens.",
        },
        {
          selector:
            "JSXAttribute[name.name='className'] Literal[value=/p[trblyxm]-\\[\\d+(\\.\\d+)?rem\\]/]",
          message:
            "Don't use arbitrary padding (e.g. pt-[7rem]). Use design tokens: pt-28, or import LAYOUT from @/lib/design-tokens.",
        },
      ],
    },
  }
);
