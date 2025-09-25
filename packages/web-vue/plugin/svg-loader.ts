// Based on jpkleemans/vite-svg-loader (MIT, https://github.com/jpkleemans/vite-svg-loader)
import { readFile } from 'fs/promises'
import { compileScript, parse } from 'vue/compiler-sfc'
import { optimize as optimizeSvg } from 'svgo'
import type { Config } from 'svgo'
import ts from 'typescript'

export default function svgLoader(options: { svgoConfig?: Config; svgo?: boolean; defaultImport?: 'url' | 'raw' | 'component' } = {}) {
	const { svgoConfig, svgo, defaultImport } = options
	const svgRegex = /\.svg(\?(raw|component|skipsvgo))?$/

	return {
		name: 'svg-loader',
		enforce: 'pre' as const,

		async transform(_: string, id: string) {
			if (!svgRegex.test(id)) return

			const [path, query] = id.split('?', 2)
			const importType = query || defaultImport

			if (importType === 'url') return

			let svg
			try {
				svg = await readFile(id, 'utf-8')
			} catch (error) {
				console.warn(`[Svg-Loader] this svg cannot be transformed: ${id}`)
				console.warn(error)
				return
			}

			if (importType === 'raw') {
				return `export default ${JSON.stringify(svg)}`
			}

			if (svgo !== false && query !== 'skipsvgo') {
				svg = optimizeSvg(svg, { ...svgoConfig, path }).data
			}

			svg = svg.replace(/<style/g, '<component is="style"').replace(/<\/style/g, '</component')
			svg = svg.replace(/<svg/g, '<svg class="px-icon-hn" :style="{ color: props.color, fontSize: props.size + \'px\' }"')

			const vueSfc = `<template>\n${svg}\n</template>\n${await readFile('./lib/icons/icons.txt', 'utf-8')}`
			const descriptor = parse(vueSfc).descriptor
			const { content } = compileScript(descriptor, {
				id: JSON.stringify(id),
				inlineTemplate: true,
				isProd: true
			})
			const jsCode = ts.transpile(content, {
				module: ts.ModuleKind.ES2020,
				target: ts.ScriptTarget.ES2019
			})

			return jsCode
		}
	}
}
