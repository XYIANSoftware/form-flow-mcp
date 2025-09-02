module.exports = {
	root: true,
	env: {
		node: true,
		es2022: true,
		jest: true,
	},
	extends: ['eslint:recommended', '@typescript-eslint/recommended'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2022,
		sourceType: 'module',
		project: './tsconfig.json',
	},
	plugins: ['@typescript-eslint'],
	rules: {
		// TypeScript specific rules
		'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
		'@typescript-eslint/no-explicit-any': 'warn',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-non-null-assertion': 'warn',
		'@typescript-eslint/prefer-const': 'error',
		'@typescript-eslint/no-var-requires': 'error',

		// General rules
		'no-console': 'off', // Allow console in MCP system
		'no-debugger': 'error',
		'no-duplicate-imports': 'error',
		'no-unused-expressions': 'error',
		'prefer-const': 'error',
		'no-var': 'error',

		// Code style
		indent: ['error', 2],
		quotes: ['error', 'single'],
		semi: ['error', 'always'],
		'comma-dangle': ['error', 'never'],
		'object-curly-spacing': ['error', 'always'],
		'array-bracket-spacing': ['error', 'never'],
		'space-before-function-paren': ['error', 'never'],
		'keyword-spacing': ['error', { before: true, after: true }],
		'space-infix-ops': 'error',
		'eol-last': 'error',
		'no-trailing-spaces': 'error',
		'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }],

		// Import rules
		'import/order': 'off', // Disable if not using eslint-plugin-import
		'import/no-unresolved': 'off', // Disable if not using eslint-plugin-import

		// Jest rules
		'jest/no-disabled-tests': 'warn',
		'jest/no-focused-tests': 'error',
		'jest/no-identical-title': 'error',
		'jest/prefer-to-have-length': 'warn',
		'jest/valid-expect': 'error',
	},
	ignorePatterns: ['dist/', 'node_modules/', 'coverage/', '*.js', '*.d.ts'],
	overrides: [
		{
			files: ['**/*.test.ts', '**/*.spec.ts'],
			env: {
				jest: true,
			},
			rules: {
				'@typescript-eslint/no-explicit-any': 'off',
				'no-console': 'off',
			},
		},
		{
			files: ['examples/**/*.ts'],
			rules: {
				'no-console': 'off',
				'@typescript-eslint/no-explicit-any': 'off',
			},
		},
	],
}
