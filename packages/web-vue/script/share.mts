export const outputGlobal = {
	vue: 'Vue',
	'@floating-ui/dom': 'FloatingUI',
	overlayscrollbars: 'OverlayScrollbarsGlobal',
	'overlayscrollbars-vue': 'OverlayScrollbarsVue',
	'parsnip-kit': 'parsnip-kit',
	'vue-router': 'VueRouter',
	mitt: 'mitt'
}

export const target = ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14']

export const external = [
	'vue',
	'@floating-ui/dom',
	'overlayscrollbars',
	'overlayscrollbars-vue',
	'parsnip-kit',
	'vue-router',
	'mitt'
]

type CssConfig = Record<
	string,
	| { js: string; css: string; cssFileName?: string; cssFilePath?: string }
	| { js: string; css: string; cssFileName?: string; cssFilePath?: string }[]
>

export const cssConfigs: CssConfig = {
	dialog: {
		js: 'dialog.js',
		css: `import './index.css'\nimport '../index.css'\n`,
		cssFileName: 'css.js'
	},
	drawer: {
		js: 'drawer.js',
		css: `import './index.css'\nimport '../index.css'\n`,
		cssFileName: 'css.js'
	},
	icons: [
		{
			js: 'icon-hn.js',
			css: `import './icon-hn.css'\n`,
			cssFileName: 'css-hn.js'
		},
		{
			js: 'icon-pa.js',
			css: `import './icon-pa.css'\n`,
			cssFileName: 'css-pa.js'
		}
	],
	share: [
		{
			js: 'util/scroll.js',
			css: `import '../../public/overlayscrollbars.css'\n`,
			cssFileName: 'css-scroll.js',
			cssFilePath: 'util/css-scroll.js'
		}
	],
	'scroll-bar': [
		{
			js: 'use-scroll-bar.js',
			css: `import './index.css'\nimport '../index.css'\n`,
			cssFileName: 'css-hook.js'
		},
		{
			js: 'index.js',
			css: `import './index.css'\nimport '../index.css'\n`,
			cssFileName: 'css.js'
		}
	]
}
