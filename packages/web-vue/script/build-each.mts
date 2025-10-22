import { resolve, relative, join, dirname } from 'path'
import { build, defineConfig, type Plugin } from 'vite'
import viteSvgLoader from '../plugin/svg-loader.ts'
import Vue from '@vitejs/plugin-vue'
import VueMacros from 'vue-macros/vite'
import VueJsx from '@vitejs/plugin-vue-jsx'
import { promises as fs } from 'node:fs'
import { isArray } from 'parsnip-kit'

const __dirname = process.cwd()

const onDemandImport: Plugin = {
	name: 'on-demand-import',
	enforce: 'pre',
	transform(code, id) {
		if (id.endsWith('less') || id.endsWith('css')) {
			return code.replace(
				/@import\s+(?:\/\*[\s\S]*?\*\/\s*)*(?:url\(\s*(['"]?)([\s\S]*?)\1\s*\)|(['"])([\s\S]*?)\3)\s*(?:\/\*[\s\S]*?\*\/\s*)*((?:[\s\S](?!;))*?);/g,
				''
			)
		}
	}
}

const basePlugins = [Vue(), VueJsx(), VueMacros(), viteSvgLoader(), onDemandImport]
const target = ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14']
async function buildLib() {
	await build(
		defineConfig({
			plugins: basePlugins,
			build: {
				emptyOutDir: false,
				target,
				cssMinify: false,
				lib: {
					entry: resolve(__dirname, 'lib/index.ts'),
					formats: ['es']
				},
				outDir: 'es',
				minify: false,
				rollupOptions: {
					external: ['vue', '@floating-ui/dom'],
					preserveEntrySignatures: 'allow-extension',
					output: {
						exports: 'named',
						globals: { vue: 'Vue' },
						entryFileNames: 'entry.js',
						chunkFileNames: '[name].js',
						inlineDynamicImports: false,
						assetFileNames: (assetInfo) => {
							if (assetInfo.name?.endsWith('.css')) {
								return assetInfo.name
							}
							return 'assets/[name][extname]'
						},
						advancedChunks: {
							includeDependenciesRecursively: false,
							groups: [
								{
									name(id) {
										if (id && id.includes('node_modules')) return 'vendor'
										if (
											id.endsWith('.ts') ||
											id.endsWith('.tsx') ||
											id.endsWith('.vue') ||
											id.endsWith('.less') ||
											id.endsWith('.css')
										) {
											const rel = relative(resolve(process.cwd(), 'lib'), id)
											const base = rel.split('?')[0]
											const name = base.split('.')[0]
											return name
										}
									}
								}
							]
						}
					}
				},
				cssCodeSplit: true
			}
		})
	)
}

async function buildIcons() {
	await build(
		defineConfig({
			plugins: basePlugins,
			build: {
				emptyOutDir: false,
				target,
				cssMinify: false,
				lib: {
					entry: resolve(__dirname, 'lib/icons/icon-hn.ts'),
					name: 'icon-hn',
					fileName: 'icon-hn',
					formats: ['es']
				},
				outDir: 'es/icons',
				minify: false,
				rollupOptions: {
					external: ['vue'],
					output: {
						exports: 'named',
						globals: { vue: 'Vue' }
					}
				},
				cssCodeSplit: true
			}
		})
	)
	await build(
		defineConfig({
			plugins: basePlugins,
			build: {
				emptyOutDir: false,
				target,
				cssMinify: false,
				lib: {
					entry: resolve(__dirname, 'lib/icons/icon-pa.ts'),
					name: 'icon-pa',
					fileName: 'icon-pa',
					formats: ['es']
				},
				outDir: 'es/icons',
				minify: false,
				rollupOptions: {
					external: ['vue'],
					output: {
						exports: 'named',
						globals: { vue: 'Vue' }
					}
				},
				cssCodeSplit: true
			}
		})
	)
}

async function* walk(dir: string): AsyncGenerator<string> {
	for await (const dirent of await fs.opendir(dir)) {
		const entry = join(dir, dirent.name)
		if (dirent.isDirectory()) yield* walk(entry)
		if (dirent.isFile() && dirent.name.endsWith('.d.ts')) yield entry
	}
}

async function copyDtsFiles() {
	const srcRoot = resolve(__dirname, 'lib')
	const destRoot = resolve(__dirname, 'es')

	for await (let src of walk(srcRoot)) {
		src = src.replaceAll('\\', '/')
		if (src.includes('lib/icons')) continue
		if (src.includes('/test/')) continue
		if (src.includes('/share/util/test')) continue
		let code = await fs.readFile(src, 'utf-8')
		code = code.replace(/\.vue(?=['"]|$)/g, '.ts')
		const rel = relative(srcRoot, src)
		const dest = join(destRoot, rel).replace('.vue.d.ts', '.d.ts')
		await fs.mkdir(dirname(dest), { recursive: true })
		await fs.writeFile(dest, code)
		console.log(`copied: ${rel}`)
	}
}

const esDir = join(__dirname, 'es')

async function exists(f: string) {
	try {
		await fs.access(f)
		return true
	} catch {
		return false
	}
}

async function prependImport(filePath: string, importPath: string) {
	const content = await fs.readFile(filePath, 'utf8')
	if (content.includes(importPath)) return
	await fs.writeFile(filePath, `${importPath}\n${content}`)
}

async function handleJsCss(
	sub: string,
	jsFile: string,
	cssContent: string,
	cssFileName?: string
) {
	const jsPath = join(sub, jsFile)
	const cssPath = join(sub, cssFileName || 'css.js')
	const shouldHandle = await exists(jsPath)
	if (!shouldHandle) return
	await prependImport(jsPath, `import './${cssFileName || 'css.js'}'`)
	await fs.writeFile(cssPath, cssContent)
}

async function handleCssImports() {
	const configs: Record<
		string,
		| { js: string; css: string; cssFileName?: string }
		| { js: string; css: string; cssFileName?: string }[]
	> = {
		icons: [
			{
				js: 'icon-hn.js',
				css: `import '../index.css'\nimport './icon-hn.css'\n`,
				cssFileName: 'css-hn.js'
			},
			{
				js: 'icon-pa.js',
				css: `import '../index.css'\nimport './icon-pa.css'\n`,
				cssFileName: 'css-pa.js'
			}
		]
	}

	for await (const dirent of await fs.opendir(esDir)) {
		if (!dirent.isDirectory()) continue
		const sub = join(esDir, dirent.name)
		const config = configs[dirent.name]

		if (config) {
			if (isArray(config)) {
				for (const item of config) {
					await handleJsCss(sub, item.js, item.css, item.cssFileName)
				}
			} else {
				await handleJsCss(sub, config.js, config.css, config.cssFileName)
			}
		} else {
			const jsFile = 'index.js'
			let cssContent = `import '../index.css'\nimport './index.css'\n`
			if (!(await exists(join(sub, 'index.css')))) {
				cssContent = `import '../index.css'\n`
			}
			if (dirent.name !== 'share') {
				await handleJsCss(sub, jsFile, cssContent)
			}
		}
	}
}

async function main() {
	await buildLib()
	await buildIcons()
	await copyDtsFiles()
	await handleCssImports()
}

main().catch(console.error)
