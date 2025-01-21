import globals from 'globals';
import js from '@eslint/js';
import nodePlugin from 'eslint-plugin-node';
import nodeRecommended from 'eslint-plugin-node/lib/configs/recommended.js';


import promisePlugin from 'eslint-plugin-promise';

// For TypeScript:
import typescriptParser from '@typescript-eslint/parser';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';


export default [
    {
        ignores: ['node_modules', 'dist', 'scripts'],
    },
    {
        plugins: {
            node: nodePlugin
        },
        ...nodeRecommended
    },
    js.configs.recommended,
    {
        files: ['**/*.ts', '**/*.tsx'],
        plugins: {
            '@typescript-eslint': typescriptPlugin,
            promise: promisePlugin,
        },
        languageOptions: {
            globals: {
                ...globals.node,
                Atomics: 'readonly',
                SharedArrayBuffer: 'readonly',
                NodeJS: 'readonly',
            },
            parser: typescriptParser,
            parserOptions: {
                ecmaVersion: 2022,
                sourceType: 'module',
                project: './tsconfig.json',  // Point to your tsconfig
            },
        },

        rules: {
            indent: ['error', 4, { 'SwitchCase': 1 }],
            'linebreak-style': ['error', 'unix'],
            quotes: ['error', 'single'],
            semi: ['error', 'always'],
            'space-before-function-paren': ['error', {
                anonymous: 'always',
                named: 'never',
                asyncArrow: 'always',
            }],
            'no-console': 0,
            // TypeScript specific rules
            '@typescript-eslint/no-floating-promises': ['error', {
                ignoreVoid: true,
                ignoreIIFE: true,
            }],
            '@typescript-eslint/explicit-function-return-type': 'warn',
            '@typescript-eslint/no-explicit-any': 'warn',
            // '@typescript-eslint/no-unused-vars': 'warn',
            '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_', 'varsIgnorePattern': '^_' }],
            'no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],

            // Promise related rules
            'promise/catch-or-return': ['error', {
                allowThen: true,
                terminationMethod: ['catch', 'finally']
            }],
            'require-await': 'error',
            'promise/no-return-wrap': 'error',
            'promise/param-names': 'error',
            'promise/no-new-statics': 'error',
            'promise/valid-params': 'error',
            'promise/no-return-in-finally': 'error'
        },
    },
    {
        files: ['**/*.test.ts', '**/*.spec.ts', 'test/**/*.ts'],
        plugins: {
            promise: promisePlugin
        },
        rules: {
            'promise/catch-or-return': 'off',
            'require-await': 'off',
            '@typescript-eslint/no-explicit-any': 'off',  // Often needed in tests
            '@typescript-eslint/explicit-function-return-type': 'off'  // Less strict in tests
        }
    },
    {
        files: ['**/*.test.js', '**/*.spec.js', 'test/**/*.js'],
        plugins: {
            promise: promisePlugin
        },
        rules: {
            'no-unused-vars': 'off',
            'promise/catch-or-return': 'off',
            'require-await': 'off',
            // Nice additions for tests:
            'max-nested-callbacks': ['warn', 3],  // Helps keep test nesting sane
            'no-undefined': 'off',  // Tests often need to check undefined
            'max-len': 'off',  // Test descriptions can be long
        }
    },
    {
        files: ['**/*.js', '**/*.mjs'],
        ignores: ['**/*.test.js', '**/*.spec.js', 'test/**/*.js'],
        plugins: {
            promise: promisePlugin
        },
        rules: {
            // Your existing rules...

            // Additional useful rules:
            'no-console': ['warn', { allow: ['warn', 'error'] }], // Only allow console.warn/error
            'eqeqeq': ['error', 'always'], // Force === instead of ==
            'no-return-await': 'error', // Prevents redundant return await
            'no-throw-literal': 'error', // Only throw Error objects
            'prefer-const': 'warn', // Suggest const where possible
            'no-var': 'error', // No var keyword

            // For promises specifically:
            'promise/always-return': 'warn', // Ensure consistent returns in promises
            'promise/no-nesting': 'warn', // Avoid promise nesting
        }
    }
];