import * as prettierPluginOxc from '@prettier/plugin-oxc'

export default {
	printWidth: 96,
	tabWidth: 2,
	useTabs: true,
	semi: false,
	singleQuote: true,
	quoteProps: 'as-needed',
	jsxSingleQuote: false,
	trailingComma: 'none',
	bracketSpacing: true,
	jsxBracketSameLine: false,
	bracketSameLine: false,
	arrowParens: 'always',
	rangeStart: 0,
	rangeEnd: Infinity,
	requirePragma: false,
	insertPragma: false,
	proseWrap: 'preserve',
	htmlWhitespaceSensitivity: 'css',
	vueIndentScriptAndStyle: false,
	endOfLine: 'lf',
	overrides: [
		{
			files: ['**/*.{js,mjs,cjs,jsx}'],
			parser: 'oxc',
			plugins: [prettierPluginOxc]
		},
		{
			files: ['**/*.{ts,mts,cts,tsx}'],
			parser: 'oxc-ts',
			plugins: [prettierPluginOxc]
		}
	]
}