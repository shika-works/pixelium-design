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
			files: '**/*.{js,mjs,cjs,jsx}',
			options: {
				plugins: ['@prettier/plugin-oxc'],
				parser: 'oxc'
			}
		},
		{
			files: '**/*.{ts,mts,cts,tsx}',
			options: {
				plugins: ['@prettier/plugin-oxc'],
				parser: 'oxc-ts'
			}
		}
	]
}
